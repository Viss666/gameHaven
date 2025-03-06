const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const playerSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: [true, "please enter a name"],
  },
  playerDiscordID: {
    type: String,
    required: [true, "please enter a Discord ID"],
  },
});

const eventSchema = new mongoose.Schema({
  eventTitle: {
    type: String,
    required: [true, "event title is required"],
  },
  eventGame: {
    type: String,
    required: [true, "game is required"],
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
  playerCount: {
    type: Number,
    default: 0,
  },
  eventDate: {
    type: Date,
    required: [true, "date is required"],
  },
  eventTime: {
    type: Number,
    required: [true, "time is required"],
  },
  playerList: {
    type: [playerSchema],
    default: [],
  },
});

const Event = new mongoose.model("Event", eventSchema);
const Player = new mongoose.model("Player", playerSchema);

module.exports = {
  Event: Event,
  Player: Player,
};
