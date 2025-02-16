const mongoose = require("mongoose");

//inaccurate lol
mongoose.connect(
  "mongodb+srv://viss_666:ERQgfO4Xn4cn5mzO@cluster0.ooxemxf.mongodb.net/StoryHub?retryWrites=true&w=majority"
);


//example schema
const storySchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, "Author is required"],
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
  },
  storyTitle: {
    type: String,
    required: [true, "Story title is required"],
  },
  storyBody: {
    type: String,
    required: [true, "Story body is required"],
  },
});

//event
const Story = new mongoose.model("Story", storySchema);

//export
module.exports = {
  Story: Story,
};
