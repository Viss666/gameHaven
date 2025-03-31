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
    required: false,
  },
  isBye: {
    type: Boolean,
    default: false,
  },
  assignedByOrganizer: { type: Boolean, default: false },
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
    eventTitle: { type: String, required: [true, "event title is required"] },
    eventGame: { type: String, required: [true, "game is required"] },
    eventType: { type: String },
    eventDescription: { type: String, required: [true, "add a description"] },
    eventOrganizer: { type: String, required: [true, "add an organizer"] },
    organizerContactInfo: {
      type: String,
      required: [true, "add contact info"],
    },
    eventDate: { type: Date, required: [true, "date is required"] },
    eventDay: { type: String, required: [true, "day is required"] },
    eventTime: {
      type: String,
      required: [true, "time is required"],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"],
    },

    playerList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // ✅ Store as ObjectId references

    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }], // ✅ Store as ObjectId references
    isPublished: {
      type: Boolean,
      required: [true, "event publishing required"],
    },
    maxPlayers: {
      type: Number,
      min: 1, // Optional: Set a minimum value
      required: true, // Optional: Make it required if needed
      default: null, // Use null to represent "no maximum"
      nullable: true, //Added to explicitly say it is nullable
    },
    iconUrl: {
      // Added iconUrl field
      type: String,
      required: true, // Optional: Make it required if needed
    },
  },
  { _id: true }
);

const Event = mongoose.model("Event", eventSchema);
const Player = mongoose.model("Player", playerSchema);
const Match = mongoose.model("Match", matchSchema);

module.exports = {
  Event: Event,
  Player: Player,
  Match: Match,
};
