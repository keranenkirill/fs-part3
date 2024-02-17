const express = require("express");
const persons = require("./personsdata");
const app = express();

app.use(express.json());

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

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  const person = persons.find((person) => person.id === id);
  console.log(person);

  if (person) {
    response.json(person);
  } else {
    response.status(404).send("No person in book by the given ID.");
    console.log("No person in book by the given ID.");
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
