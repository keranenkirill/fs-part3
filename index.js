const express = require("express");
const app = express();

let persons = [
   {
      "id": "0422",
      "name": "Essi Nokko",
      "number": "7845360011"
    },
    {
      "id": "5158",
      "name": "Eetu",
      "number": "888888888"
    },
    {
      "id": "740a",
      "name": "Aarni",
      "number": "11232245"
    }
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
