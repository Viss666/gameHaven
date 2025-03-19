const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const matchSchema = new mongoose.Schema({
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: false, // Optional for unassigned matches
  },
  assignedByOrganizer: {
    type: Boolean,
    default: false, // True if manually assigned by an organizer
  },
});

const playerSchema = new mongoose.Schema(
  {
    playerName: {
      type: String,
      required: [true, "please enter a name"],
    },
    playerDiscordID: {
      type: String,
      required: [true, "please enter a Discord ID"],
    },
  },
  { _id: true }
);

const eventSchema = new mongoose.Schema(
  {
    eventTitle: {
      type: String,
      required: [true, "event title is required"],
    },
    eventGame: {
      type: String,
      required: [true, "game is required"],
    },
    eventType: {
      type: String,
      // required: [true, "event type is required"],
    },
    eventDescription: {
      type: String,
      required: [true, "add a description"],
    },
    eventOrganizer: {
      type: String,
      required: [true, "add an organizer"],
    },
    organizerContactInfo: {
      type: String,
      required: [true, "add contact info"],
    },
    eventDate: {
      type: Date,
      required: [true, "date is required"],
    },
    eventDay: {
      type: String,
      required: [true, "day is required"],
    },
    eventTime: {
      type: String,
      required: [true, "time is required"],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"], // Regex for 24-hour format
    },

    playerList: {
      type: [playerSchema],
      default: [],
    },
    eventMatches: { type: [matchSchema], default: [] }, // Stores player pairings
  },
  { _id: true }
);

const Event = new mongoose.model("Event", eventSchema);
const Player = new mongoose.model("Player", playerSchema);

module.exports = {
  Event: Event,
  Player: Player,
};
