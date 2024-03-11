const mongoose = require("mongoose");

// Yhteyden muodostus MongoDB:een
const open_mongo_connection = (password) => {
  const url = `mongodb+srv://kirillkeranen:${password}@fullstack24.n6uv5yd.mongodb.net/PhoneBook?retryWrites=true&w=majority`;
  mongoose.connect(url);
  mongoose.connection.on("connected", () => {
    //console.log("Connected to MongoDB");
  });
  mongoose.connection.on("error", (err) => {
    console.error("Error connecting to MongoDB:", err);
  });
};

//Yhteyden avaamisen jälkeen määritellään personin skeema ja sitä vastaava model:
const define_pers_schem_mod = () => {
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });
  const Person = mongoose.model("Person", personSchema);
  return Person;
};

// haetaan MongoDB:cstä kaikki ihmiset
const get_all_persons = (password) => {
  open_mongo_connection(password);
  Person = define_pers_schem_mod();

  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    // Suljetaan yhteys haun jälkeen
    mongoose.connection.close();
  });
};

const add_new_person = (password, name, number) => {
  open_mongo_connection(password);
  Person = define_pers_schem_mod();

  // Luodaan uusi henkilö-olio
  const newPerson = new Person({
    name: name,
    number: number,
  });
  // Tallennetaan uusi henkilö tietokantaan
  newPerson
    .save()
    .then((result) => {
      console.log(`Added ${name} with number ${number} into phonebook`);
      // Suljetaan yhteys tallentamisen jälkeen
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error("Error saving new person:", error);
    });
};

/////    OHJELMA     /////

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);

} else if (process.argv.length === 3) {
  const password = process.argv[2];
  console.log("")
  console.log("phonebook:")
  get_all_persons(password);

} else if (process.argv.length === 5) {
  const password = process.argv[2];
  const nameArg = process.argv[3];
  const number = process.argv[4];

  //tarkistus siltä varalta, että nimi on annettu sukunimen kanssa lainausmerkeissä
  const name = nameArg.includes('"') ? nameArg.substring(1, nameArg.length - 1) : nameArg;
  add_new_person(password, name, number);
}
