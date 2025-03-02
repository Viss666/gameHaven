const express = require("express");
const cors = require("cors");
const model = require("./model");

var session = require("express-session");

const app = express();

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

app.listen(8080, function () {
  console.log("Server is running...");
});

app.get("/events", function (request, response) {
  console.log("events: ", request.session);
  model.Event.find().then((Events) => {
    console.log("All events: ", Events);
    response.json(Events);
  });
});

app.post("/events", function (request, response) {
  console.log();
});

// example
// app.post("/stories", authorizeRequest(false), async function (request, response) {
//   console.log("request body:", request.body)
//   try {
//       let newStory = new model.Story({
//           author: request.body.author,
//           genre: request.body.genre,
//           storyTitle: request.body.storyTitle,
//           storyBody: request.body.storyBody,
//           user: request.session.userId
//       })
//       await newStory.save()
//       response.status(201).send("created")
//   }catch(error){
//       if(error.errors) {
//           var errorMessages = {};
//           for(var fieldName in error.errors) {
//               errorMessages[fieldName] = error.errors[fieldName].message;
//           }
//           return response.status(422).json(errorMessages)
//       } else {
//           return response.status(500).send("Server error")
//       }
//   }

// })
