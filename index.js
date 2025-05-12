const express = require("express");
const cors = require("cors");
const model = require("./model");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");

const Player = model.Player;
const Event = model.Event;
const Template = model.Template;

var session = require("express-session");

const app = express();

const publicDirectoryPath = path.join(__dirname, "/public");
app.use(express.static(publicDirectoryPath));

const allowedOrigins = [
  "https://gamehavenstg.com", // live site
  "http://127.0.0.1:5500", // Local development
  "https://gamehaven-production.up.railway.app",
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
// app.use(express.static("public"));
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
    credentials: true,
  })
);

app.get("/api/events", async function (request, response) {
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
app.get("/templates", async function (request, response) {
  try {
    const templates = await model.Template.find();
    response.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates: ", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/events/:eventId", async function (request, response) {
  // Consider prefixing API routes
  try {
    const event = await model.Event.findById(request.params.eventId)
      .populate("playerList")
      .populate({
        path: "matches",
        populate: { path: "player1 player2", model: "Player" },
      });

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
app.post("/events", async function (request, response) {
  console.log("Received request body:", request.body);

  try {
    let newEvent = new model.Event({
      eventTitle: request.body.eventTitle,
      eventGame: request.body.eventGame,
      eventDescription: request.body.eventDescription,
      eventOrganizer: request.body.eventOrganizer,
      organizerContactInfo: request.body.organizerContactInfo,
      eventDate: request.body.eventDate,
      eventDay: request.body.eventDay,
      eventTime: request.body.eventTime,
      playerList: request.body.playerList || [],
      matches: request.body.matches || [],
      isPublished: request.body.isPublished || false,
      maxPlayers: request.body.maxPlayers,
      iconUrl: request.body.iconUrl,
      eventFee: request.body.eventFee,
    });

    let savedEvent = await newEvent.save();
    response.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    response.status(500).json({ error: error.message });
  }
});
//create a template
app.post("/templates", async function (request, response) {
  console.log("Received request body: ", request.body);
  try {
    let newTemplate = new model.Template({
      eventTitle: request.body.eventTitle,
      eventGame: request.body.eventGame,
      eventDescription: request.body.eventDescription,
      maxPlayers: request.body.maxPlayers,
      iconUrl: request.body.iconUrl,
      eventFee: request.body.eventFee,
    });
    let savedTemplate = await newTemplate.save();
    response.status(201).json(savedTemplate);
  } catch (error) {
    console.log("error creating template:", error);
    response.status(500).json({ error: error.message });
  }
});

// Delete an event
app.delete("/events/:eventId", async function (request, response) {
  console.log("API route /events/:eventId hit:", request.params.eventId);

  try {
    const eventId = request.params.eventId;
    const event = await model.Event.findById(eventId).populate("playerList");

    if (!event) {
      return response.status(404).json({ message: "Event not found" });
    }

    await model.Event.findByIdAndDelete(eventId);

    response
      .status(200)
      .json({ message: "Event and associated players deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

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

app.put("/events/:eventId/add-player", async (req, res) => {
  try {
    const { playerName, playerDiscordID } = req.body;

    // console.log("Received request body:", req.body);

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

// app.delete("/events/:eventId/remove-player", async (req, res) => {
//   try {
//     const eventId = req.params.eventId;
//     const playerId = req.body.playerId;

//     if (!playerId) {
//       return res.status(400).json({ error: "Player ID not provided" });
//     }

//     const event = await model.Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ error: "Event not found" });
//     }

//     // Convert playerId to ObjectId
//     const playerObjectId = new mongoose.Types.ObjectId(playerId);

//     // Find the index of the player's ObjectId in the event's playerList
//     const playerIndex = event.playerList.findIndex((player) =>
//       player.equals(playerObjectId)
//     );

//     if (playerIndex === -1) {
//       return res
//         .status(404)
//         .json({ error: "Player not registered for this event" });
//     }

//     // Remove the player's ObjectId from the playerList
//     event.playerList.splice(playerIndex, 1);
//     await event.save();

//     // Delete the player document
//     await model.Player.findByIdAndDelete(playerId);

//     res
//       .status(200)
//       .json({ message: "Player successfully removed from event and deleted" });
//   } catch (error) {
//     console.error("Error removing player:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

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

    const playerObjectId = new mongoose.Types.ObjectId(playerId);
    const playerIndex = event.playerList.findIndex((player) =>
      player.equals(playerObjectId)
    );

    if (playerIndex === -1) {
      return res
        .status(404)
        .json({ error: "Player not registered for this event" });
    }

    event.playerList.splice(playerIndex, 1);
    await event.save(); // Player is NOT deleted here

    res.status(200).json({ message: "Player removed from event" }); // Updated response
  } catch (error) {
    console.error("Error removing player:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/events/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { matches, ...otherFields } = req.body;
    console.log("request body: ", req.body);
    console.log("Incoming matches:", req.body.matches);

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
        model: "Player",
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

//updated templates
// Corrected function to update/edit templates
app.put("/templates/:templateId", async (req, res) => {
  console.log("Attempting to update template with ID:", req.params.templateId);
  console.log("Update data:", req.body);

  try {
    const templateId = req.params.templateId;
    const templateBody = req.body; // Contains fields like eventTitle, eventGame etc.

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return res.status(400).json({ message: "Invalid template ID format" });
    }

    let updatedTemplate = await model.Template.findByIdAndUpdate(
      templateId,
      templateBody,
      { new: true, runValidators: true }
    );

    if (!updatedTemplate) {
      return res
        .status(404)
        .json({ message: "Template not found with that ID" });
    }

    res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error("Error updating template:", error);

    if (error.name === "CastError" && error.path === "_id") {
      return res.status(400).json({
        message: "Invalid template ID format provided.",
        error: error.message,
      });
    }
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed.", errors: error.errors });
    }

    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.delete("/templates/:templateId", async (req, res) => {
  console.log("Attempting to delete template with ID:", req.params.templateId);

  try {
    const templateId = req.params.templateId;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return res.status(400).json({ message: "Invalid template ID format" });
    }
    const deletedTemplate = await model.Template.findByIdAndDelete(templateId);

    if (!deletedTemplate) {
      return res
        .status(404)
        .json({ message: "Template not found with that ID" });
    }
    res.status(200).json({
      message: "Template deleted successfully",
      deletedTemplate: deletedTemplate,
    });
  } catch (error) {
    console.error("Error deleting template:", error);

    if (error.name === "CastError" && error.path === "_id") {
      return res.status(400).json({
        message: "Invalid template ID format provided.",
        error: error.message,
      });
    }

    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//Player match request
//Unused
app.post("/events/:eventId/request-match", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const playerId = req.cookies.playerId;

    if (!playerId) {
      return res.status(400).json({ error: "Player ID not found in cookie" });
    }

    const event = await model.Event.findById(eventId);
    if (!event || event.eventType !== "pairing") {
      return res
        .status(404)
        .json({ error: "Event not found or not a pairing event" });
    }

    const alreadyMatched = event.matches.some(
      (match) =>
        match.player1.toString() === playerId ||
        match.player2?.toString() === playerId
    );
    if (alreadyMatched) {
      return res.status(400).json({ error: "Player is already in a match" });
    }

    const openMatch = event.matches.find((match) => !match.player2);

    if (openMatch) {
      openMatch.player2 = playerId;
    } else {
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
//Unused
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
      if (match.player2) {
        match.player1 = match.player2;
        match.player2 = null;
      } else {
        event.matches.splice(matchIndex, 1);
      }
    } else {
      match.player2 = null;
    }

    await event.save();
    res.status(200).json({ message: "Player successfully unmatched", event });
  } catch (error) {
    console.error("Error unmatching player:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}...`);
});
