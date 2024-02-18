const express = require("express");
let persons = require("./personsdata");
const app = express();

app.use(express.json());

const generateID = () => {
  do {
    // generoidaan arvo
    randomID = Math.floor(Math.random() * 1000000);
  } while (
    // tsekataan onko jo olemassa, toistetaan looppi jos on vastaava arvo olemassa
    persons.some((person) => person.id === randomID)
  );
  return randomID;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    // jos nimi tai numero ovat ""
    console.log("name or number missing");
    return response.status(400).json({
      error: "name or number missing",
    });
  }
  const person = {
    id: generateID(),
    name: body.name,
    number: body.number,
  };
  console.log(persons);
  console.log("adding: ", person);
  persons = persons.concat(person);
  console.log("updated phonebook:");
  console.log(persons);
  response.json(person);
});

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

app.delete("/api/persons/:id", (request, response) => {
  console.log(persons);
  const id = Number(request.params.id);
  let person = persons.find((person) => person.id === id);

  if (person) {
    console.log("deleting...");
    console.log(person.id, person.name);

    persons_after_delete = persons.filter((person) => person.id !== id);
    response.status(204).end();

    console.log("deleted succesfully");
    console.log(persons_after_delete);
  } else {
    response.status(404).send("No person in book by the given ID.");
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
