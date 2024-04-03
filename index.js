require("dotenv").config();
const express = require("express");
let persons = require("./personsdata");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
//const mongodb = require("./mongo")

const PhoneBook = require("C:/Users/keran/Documents/HY_KURSSIT/FullStack/fs-part3/modules/phonebook.js");
const phonebook = require("C:/Users/keran/Documents/HY_KURSSIT/FullStack/fs-part3/modules/phonebook.js");

app.use(express.static("dist"));

//tulostaa servun console logiin tietoa requestin tyypistä, kohdennetusta pathistä ja sisällöstä
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method); // mitä recuestia käytettiin (GET, POST, RJNE..)
  console.log("Path:  ", request.path); // mille pathille "sivulle" pyyntö oli tehty
  console.log("Body:  ", request.body); // millainen sisältö oli toteutettu
  console.log("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

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

//kustomoitu tokeni, jolla saadaan hakluttu request data tulostettua morgania hyödyntäen
morgan.token("reqContent", (request) => {
  return JSON.stringify(request.body);
});

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

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

//haetaan koko puheliinnumeroluettelo
app.get("/api/persons", (request, response, next) => {
  PhoneBook.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

//hateaan tietyn ihmisen tiedot id:n perusteella
app.get("/api/persons/:id", (request, response, next) => {
  PhoneBook.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  PhoneBook.find({})
    .then((persons) => {
      const currentTime = new Date();
      response.send(
        `Number of persons in the list: ${persons.length}
         <br>
         Current Time: ${currentTime}`
      );
    })
    .catch((error) => next(error));
});

//uuden ihmisen lisäämistoiminto huomioiden syötekenttien sisältö ja se, onko samalla nimellä oleva henkilö jo luettelossa
app.post("/api/persons", (request, response, next) => {
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
  person
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

//poistetaan valittu käyttäjä id:n perusteella
app.delete("/api/persons/:id", (request, response, next) => {
  PhoneBook.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//päivitetään olemassa olevan käyttäjän tiedot (puhelinnumero)
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }

  PhoneBook.findByIdAndUpdate(request.params.id, person, {new:true})
  .then(updatedNoteBook =>{
    response.json(updatedNoteBook)
  })
  .catch(error => next(error))
})


app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
