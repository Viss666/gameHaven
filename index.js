const express = require("express");
const cors = require("cors");
const model = require("./model");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

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

app.get("/events", function (request, response) {
  console.log("events: ", request.session);
  model.Event.find().then((Events) => {
    console.log("All events: ", Events);
    response.json(Events);
  });
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
    const deletedEvent = await model.Event.findByIdAndDelete(
      request.params.eventId
    );

    if (!deletedEvent) {
      return response.status(404).json({ message: "Event not found" });
    }

    response.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/events/:eventId/add-player", async (req, res) => {
  const eventId = req.params.eventId;
  const { playerName, playerDiscordID } = req.body;

  if (!playerName || !playerDiscordID) {
    return res
      .status(400)
      .json({ error: "Player name and Discord ID are required." });
  }

  try {
    const event = await model.Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if the player is already in the list
    const existingPlayer = event.playerList.find(
      (player) => player.playerDiscordID === playerDiscordID
    );

    if (existingPlayer) {
      return res.status(400).json({ error: "Player is already checked in." });
    }

    // Add the player to the event
    event.playerList.push({ playerName, playerDiscordID });
    await event.save();

    res.status(200).json({ message: "Player successfully checked in.", event });
  } catch (error) {
    console.error("Error adding player:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Remove a player from an event player side
// Needs testing -> fuck postman cookies
app.delete("/events/:eventId/remove-player", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    // Get the player's ID from the cookie (ensure the cookie name matches)
    const playerId = req.cookies.discordId;

    if (!playerId) {
      return res.status(400).json({ error: "Player ID not found in cookie" });
    }

    // Find the event by ID
    const event = await model.Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Find the index of the player in the event's playerList
    const playerIndex = event.playerList.findIndex(
      (player) => player._id.toString() === playerId
    );

    if (playerIndex === -1) {
      return res
        .status(404)
        .json({ error: "Player not registered for this event" });
    }

    // Remove the player from the playerList
    event.playerList.splice(playerIndex, 1);
    await event.save();

    res.status(200).json({ message: "Player successfully removed from event" });
  } catch (error) {
    console.error("Error removing player:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update event information
// Tested and functional (needs testing with matches)
app.put("/events/:eventId", async function (request, response) {
  try {
    const updatedEvent = await model.Event.findByIdAndUpdate(
      request.params.eventId,
      request.body, // Contains the updated fields
      { new: true, runValidators: true } // Returns updated doc & validates fields
    );

    if (!updatedEvent) {
      return response.status(404).json({ message: "Event not found" });
    }

    response
      .status(200)
      .json({ message: "Event updated successfully", updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    response.status(500).json({ message: "Internal Server Error" });
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
