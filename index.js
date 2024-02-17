const express = require("express");
const persons = require("./personsdata");
const app = express();



app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});


app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
   const currentTime = new Date();
   response.send(
      `Number of persons in the list: ${persons.length}
      <br>
      Current Time: ${currentTime}`
   );
});



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
