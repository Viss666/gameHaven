const express = require("express");
const cors = require("cors");
const model = require("./model");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Player = model.Player; // Correct import
const Event = model.Event;

var session = require("express-session");

const app = express();

const allowedOrigins = [
  "https://gamehavenstg.com", // live site
  "http://127.0.0.1:5500", // Local development (VS Code Live Server)
];

//middlewares
app.use(express.urlencoded({ extended: false }));

// app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin."));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: "super duper secret key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("Not allowed by CORS: " + origin), false);
      }
      return callback(null, true);
    },
    credentials: true, // if you need to allow credentials (cookies, auth headers, etc.)
  })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}...`);
});

app.get("/events", async function (request, response) {
  try {
    const events = await model.Event.find()
      .populate("playerList")
      .populate({
        path: "matches",
        populate: { path: "player1 player2", model: "Player" },
      });

    // console.log("All events (populated):", events);

    response.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

//get singular event
app.get("/events/:eventId", async function (request, response) {
  try {
    const event = await model.Event.findById(request.params.eventId)
      .populate("playerList") // ✅ Populate referenced players
      .populate({
        path: "matches",
        populate: { path: "player1 player2", model: "Player" }, // ✅ Populate player1 and player2 inside eventMatches
      });

    // console.log("** Fetched event:", event);

    if (!event) {
      return response.status(404).json({ message: "Event not found" });
    }

    response.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// Create an event
// Tested and functional
app.post("/events", async function (request, response) {
  console.log("Received request body:", request.body);

  try {
    let newEvent = new model.Event({
      eventTitle: request.body.eventTitle,
      eventGame: request.body.eventGame,
      eventType: request.body.eventType,
      eventDescription: request.body.eventDescription,
      eventOrganizer: request.body.eventOrganizer,
      organizerContactInfo: request.body.organizerContactInfo,
      eventDate: request.body.eventDate,
      eventDay: request.body.eventDay,
      eventTime: request.body.eventTime,
      playerList: request.body.playerList || [],
      matches: request.body.matches || [],
      isPublished: request.body.isPublished || false,
      maxPlayers: request.body.maxPlayers, // Add maxPlayers
      iconUrl: request.body.iconUrl, // Add iconUrl
    });

    let savedEvent = await newEvent.save();
    response.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    response.status(500).json({ error: error.message });
  }
});

// Delete an event
// Tested and functional
app.delete("/events/:eventId", async function (request, response) {
  try {
    const eventId = request.params.eventId;

    // 1. Find the event
    const event = await model.Event.findById(eventId).populate("playerList");

    if (!event) {
      return response.status(404).json({ message: "Event not found" });
    }

    // 2. Delete associated players
    for (const player of event.playerList) {
      await model.Player.findByIdAndDelete(player._id);
    }

    // 3. Delete the event
    await model.Event.findByIdAndDelete(eventId);

    response
      .status(200)
      .json({ message: "Event and associated players deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// app.js (or wherever your Express routes are)

app.put("/events/:eventId/give-bye", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({ error: "Player ID is required" });
    }

    const event = await model.Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Create a new Match for the bye
    const byeMatch = new model.Match({
      player1: playerId,
      player2: null, // or isBye: true
      isBye: true,
    });
    await byeMatch.save();

    // Update the Event's matches array
    event.matches.push(byeMatch._id);
    await event.save();

    res.json({ message: "Bye given successfully", match: byeMatch });
  } catch (error) {
    console.error("Error giving bye:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.put("/events/:eventId/add-player", async (req, res) => {
//   const eventId = req.params.eventId;
//   const { playerName, playerDiscordID } = req.body;

//   if (!playerName || !playerDiscordID) {
//     return res
//       .status(400)
//       .json({ error: "Player name and Discord ID are required." });
//   }

//   try {
//     const event = await model.Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ error: "Event not found" });
//     }

//     // Check if the player is already in the list
//     const existingPlayer = event.playerList.find(
//       (player) => player.playerDiscordID === playerDiscordID
//     );

//     if (existingPlayer) {
//       return res.status(400).json({ error: "Player is already checked in." });
//     }

//     // Add the player to the event
//     event.playerList.push({ playerName, playerDiscordID });
//     await event.save();

//     res.status(200).json({ message: "Player successfully checked in.", event });
//   } catch (error) {
//     console.error("Error adding player:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// app.put("/events/:eventId/add-player", async (req, res) => {
//   try {
//     const { playerName, playerDiscordID } = req.body;

//     // Check if player exists, or create new
//     let player = await Player.findOne({ playerDiscordID });
//     if (!player) {
//       player = await Player.create({ playerName, playerDiscordID });
//     }

//     // Update the event with player's ID
//     const event = await Event.findByIdAndUpdate(
//       req.params.eventId,
//       { $push: { playerList: player._id } }, // Store only ObjectId
//       { new: true }
//     );

//     res.json(event);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.put("/events/:eventId/add-player", async (req, res) => {
  try {
    const { playerName, playerDiscordID } = req.body;

    // console.log("Received request body:", req.body);

    // Check if player exists, or create new
    let player = await Player.findOne({ playerDiscordID });
    if (!player) {
      player = await Player.create({ playerName, playerDiscordID });
    }

    // Update the event with player's ID
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      { $push: { playerList: player._id } },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//remove player as admin
app.put("/events/:eventId/admin-remove-player", async (req, res) => {
  const eventId = req.params.eventId;
  const { playerId } = req.body;

  if (!playerId) {
    return res.status(400).json({ error: "PlayerID is required." });
  }

  try {
    const event = await model.Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const playerObjectId = new mongoose.Types.ObjectId(playerId);

    const playerIndex = event.playerList.findIndex((player) =>
      player._id.equals(playerObjectId)
    );

    if (playerIndex === -1) {
      return res.status(400).json({ error: "Player not found." });
    }

    event.playerList.splice(playerIndex, 1);
    await event.save();

    res.json({ message: "Player removed.", event });
  } catch (error) {
    console.error("Error removing player:", error);
    res.status(500).json({ error: "Server error." });
  }
});

// Remove a player from an event player side

app.delete("/events/:eventId/remove-player", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const playerId = req.body.playerId;

    if (!playerId) {
      return res.status(400).json({ error: "Player ID not provided" });
    }

    const event = await model.Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Convert playerId to ObjectId
    const playerObjectId = new mongoose.Types.ObjectId(playerId);

    // Find the index of the player's ObjectId in the event's playerList
    const playerIndex = event.playerList.findIndex((player) =>
      player.equals(playerObjectId)
    );

    if (playerIndex === -1) {
      return res
        .status(404)
        .json({ error: "Player not registered for this event" });
    }

    // Remove the player's ObjectId from the playerList
    event.playerList.splice(playerIndex, 1);
    await event.save();

    // Delete the player document
    await model.Player.findByIdAndDelete(playerId);

    res
      .status(200)
      .json({ message: "Player successfully removed from event and deleted" });
  } catch (error) {
    console.error("Error removing player:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.delete("/events/:eventId/remove-player", async (req, res) => {
//   try {
//     const eventId = req.params.eventId;
//     const playerId = req.body.playerId; // Get playerId from request body

//     if (!playerId) {
//       return res.status(400).json({ error: "Player ID not provided" });
//     }

//     const event = await model.Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ error: "Event not found" });
//     }

//     // Find the Player document using the playerId
//     const player = await model.Player.findById(playerId);

//     if (!player) {
//       return res.status(404).json({ error: "Player not found" });
//     }

//     // Find the index of the player's ObjectId in the event's playerList
//     const playerIndex = event.playerList.indexOf(player._id);

//     if (playerIndex === -1) {
//       return res
//         .status(404)
//         .json({ error: "Player not registered for this event" });
//     }

//     // Remove the player's ObjectId from the playerList
//     event.playerList.splice(playerIndex, 1);
//     await event.save();

//     res.status(200).json({ message: "Player successfully removed from event" });
//   } catch (error) {
//     console.error("Error removing player:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Update event information
// Tested and functional (needs testing with matches)
// app.put("/events/:eventId", async (req, res) => {
//   try {
//     const eventId = req.params.eventId;
//     const { matches, ...otherFields } = req.body; // Separate matches from other fields
//     // console.log("Received request body:", req.body);

//     let matchIds = [];

//     if (matches && matches.length > 0) {
//       for (const matchData of matches) {
//         // Create Match document
//         const match = new model.Match({
//           player1: matchData.player1._id, // Use player1's _id
//           player2: matchData.player2._id, // Use player2's _id
//         });
//         await match.save();
//         matchIds.push(match._id); // Push the match's _id
//       }
//     }

//     // Update the event with other fields and matchIds
//     const updatedEvent = await model.Event.findByIdAndUpdate(
//       eventId,
//       { ...otherFields, matches: matchIds }, // Save the matchIds array
//       { new: true }
//     );

//     // ...
//   } catch (error) {
//     // ...
//   }
// });
// app.put("/events/:eventId", async (req, res) => {
//   try {
//     const eventId = req.params.eventId;
//     const { matches, ...otherFields } = req.body;

//     let matchIds = [];

//     if (matches && matches.length > 0) {
//       for (const matchData of matches) {
//         const match = new model.Match({
//           player1: matchData.player1._id,
//           player2: matchData.player2._id,
//         });
//         await match.save();
//         matchIds.push(match._id);
//       }
//     }

//     const updatedEvent = await model.Event.findByIdAndUpdate(
//       eventId,
//       { ...otherFields, matches: matchIds },
//       { new: true }
//     );

//     if (!updatedEvent) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     res.status(200).json(updatedEvent); // Send the updated event as JSON
//   } catch (error) {
//     console.error("Error updating event:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// app.put("/events/:eventId", async (req, res) => {
//   try {
//     const eventId = req.params.eventId;
//     const { matches, ...otherFields } = req.body;

//     let matchIds = [];

//     if (matches && matches.length > 0) {
//       for (const matchData of matches) {
//         const match = new model.Match({
//           player1: matchData.player1._id,
//           player2: matchData.player2 ? matchData.player2._id : null,
//           isBye: matchData.player2 === null, // Set isBye based on player2
//         });
//         await match.save();
//         matchIds.push(match._id);
//       }
//     }

//     const updatedEvent = await model.Event.findByIdAndUpdate(
//       eventId,
//       { ...otherFields, matches: matchIds },
//       { new: true }
//     );

//     if (!updatedEvent) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     res.status(200).json(updatedEvent);
//   } catch (error) {
//     console.error("Error updating event:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// app.put("/events/:eventId", async (req, res) => {
//   try {
//     const eventId = req.params.eventId;
//     const { matches, ...otherFields } = req.body;

//     let matchIds = [];

//     if (matches && matches.length > 0) {
//       for (const matchData of matches) {
//         const match = new model.Match({
//           player1: matchData.player1._id,
//           player2: matchData.player2 ? matchData.player2._id : null,
//           isBye: matchData.player2 === null,
//         });
//         await match.save();
//         matchIds.push(match._id);
//       }
//     }

//     let updatedEvent = await model.Event.findByIdAndUpdate(
//       eventId,
//       { ...otherFields, matches: matchIds },
//       { new: true }
//     );

//     if (!updatedEvent) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     // Populate player data for each match
//     updatedEvent = await model.Event.findById(eventId).populate({
//       path: "matches",
//       populate: {
//         path: "player1 player2", // Populate both player1 and player2
//         model: "Player", // Assuming your player model is named "Player"
//       },
//     });

//     res.status(200).json(updatedEvent);
//   } catch (error) {
//     console.error("Error updating event:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
app.put("/events/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { matches, ...otherFields } = req.body;

    let matchIds = [];

    if (matches && matches.length > 0) {
      for (const matchData of matches) {
        const match = new model.Match({
          player1: matchData.player1,
          player2: matchData.player2 ? matchData.player2 : null,
          isBye: matchData.player2 === null,
        });
        await match.save();
        matchIds.push(match._id);
      }
    }

    let updatedEvent = await model.Event.findByIdAndUpdate(
      eventId,
      { ...otherFields, matches: matchIds },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Populate playerList and matches
    updatedEvent = await model.Event.findById(eventId)
      .populate({
        path: "playerList",
        model: "Player", // Assuming your player model is named "Player"
      })
      .populate({
        path: "matches",
        populate: {
          path: "player1 player2",
          model: "Player",
        },
      });

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Player match request
//Requires testing, cookies fuck
app.post("/events/:eventId/request-match", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const playerId = req.cookies.playerId; // Get player ID from cookie

    if (!playerId) {
      return res.status(400).json({ error: "Player ID not found in cookie" });
    }

    const event = await model.Event.findById(eventId);
    if (!event || event.eventType !== "pairing") {
      return res
        .status(404)
        .json({ error: "Event not found or not a pairing event" });
    }

    // Check if player is already in a match
    const alreadyMatched = event.matches.some(
      (match) =>
        match.player1.toString() === playerId ||
        match.player2?.toString() === playerId
    );
    if (alreadyMatched) {
      return res.status(400).json({ error: "Player is already in a match" });
    }

    // Find an open match (player2 is null)
    const openMatch = event.matches.find((match) => !match.player2);

    if (openMatch) {
      // Assign this player to an existing open match
      openMatch.player2 = playerId;
    } else {
      // Create a new match where this player is waiting for an opponent
      event.matches.push({ player1: playerId });
    }

    await event.save();
    res.status(200).json({ message: "Match request submitted", event });
  } catch (error) {
    console.error("Error requesting match:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Player request removal from match
//Requires testing cookeies fuck
app.delete("/events/:eventId/unmatch", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const playerId = req.cookies.playerId; // Get player ID from cookie

    if (!playerId) {
      return res.status(400).json({ error: "Player ID not found in cookie" });
    }

    const event = await model.Event.findById(eventId);
    if (!event || event.eventType !== "pairing") {
      return res
        .status(404)
        .json({ error: "Event not found or not a pairing event" });
    }

    // Find the match where this player is involved
    const matchIndex = event.matches.findIndex(
      (match) =>
        match.player1.toString() === playerId ||
        match.player2?.toString() === playerId
    );

    if (matchIndex === -1) {
      return res.status(400).json({ error: "Player is not in any match" });
    }

    const match = event.matches[matchIndex];

    if (match.player1.toString() === playerId) {
      // If player1 is leaving, make player2 the new player1
      if (match.player2) {
        match.player1 = match.player2;
        match.player2 = null;
      } else {
        // If no player2, remove the match completely
        event.matches.splice(matchIndex, 1);
      }
    } else {
      // If player2 is leaving, just set player2 to null
      match.player2 = null;
    }

    await event.save();
    res.status(200).json({ message: "Player successfully unmatched", event });
  } catch (error) {
    console.error("Error unmatching player:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Example Event
// {
//   "eventTitle": "Thursday Night Firefights",
//   "eventGame": "Warhammer 40,001",
//   "eventDescription": "Blah Here is a description...",
//   "eventOrganizer": "Grant",
//   "organizerContactInfo": "bistral9546@gmail.com",
//   "eventDate": "2026-03-26",
//   "eventDay": "Whursday",
//   "eventTime": "1900",
//   "playerList": [
//     {
//       "playerName": "Gwant",
//       "playerDiscordID": "Wammerhammer"
//     },
//     {
//       "playerName": "Wadrian",
//       "playerDiscordID": "WWOTH"
//     }
//   ]
// }
