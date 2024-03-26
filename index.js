require('dotenv').config()
const express = require("express");
let persons = require("./personsdata");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
//const mongodb = require("./mongo")

const PhoneBook = require("C:/Users/keran/Documents/HY_KURSSIT/FullStack/fs-part3/modules/phonebook.js");

//tulostaa servun console logiin tietoa requestin tyypistä, kohdennetusta pathistä ja sisällöstä
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method); // mitä recuestia käytettiin (GET, POST, RJNE..)
  console.log("Path:  ", request.path); // mille pathille "sivulle" pyyntö oli tehty
  console.log("Body:  ", request.body); // millainen sisältö oli toteutettu
  console.log("---");
  next();
};

//kustomoitu tokeni, jolla saadaan hakluttu request data tulostettua morgania hyödyntäen
morgan.token("reqContent", (request) => {
  return JSON.stringify(request.body);
});

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(morgan("- :date[web] -"));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqContent"
  )
);

// virheenkäsittelijä olemattomille patheille "sivuille"
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
/*tuloksena y.o:lle virheenkäsittelijälle on seuraava tulostus servun console logissa:
    Method: GET
    Path:   /nonexistent
    Body:   {}
*/

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
    // jos nimi tai numero puuttuvat
    console.log("name or number missing");
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  // tarkistetaan jos nimi tai numero ovat jo olemassa puhelinkirjassa... (erikseenkin olisi voinut tarkastella nimeä ja nueroa)
  const existingUserData =
    persons.some((person) => person.number === body.number) ||
    persons.some((person) => person.name === body.name);
  if (existingUserData) {
    console.log("Name or number already in phonebook");
    return response.status(400).json({
      error: "Name or number already in phonebook",
    });
  }

  const person = new PhoneBook({
    id: generateID(),
    name: body.name,
    number: body.number,
  });
  console.log(persons);
  console.log("adding: ", person);
  persons = persons.concat(person);
  console.log("updated phonebook:");
  console.log(persons);
  person.save().then(savedNote => {
    response.json(savedNote)
  })
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

//app.get("/api/persons", (request, response) => {
//  response.json(persons);
//});
app.get("/api/persons", (request, response) => {
  PhoneBook.find({}).then((persons) => {
    response.json(persons);
  });
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
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
