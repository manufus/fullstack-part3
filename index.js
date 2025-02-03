const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

morgan.token("object", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(express.static("dist"));

app.use(cors());

app.use(morgan("tiny"));
app.use(morgan(":method :url :status :response-time :object"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Phonebook backend</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people <br/>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person_info = persons.find((person) => person.id === id);
  person_info ? response.json(person_info) : response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "information missing",
    });
  }
  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "this name already exists",
    });
  }
  const person = {
    id: getRandomInt(5, 100),
    name: body.name || "John Doe",
    number: body.number || 654321,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.get("/api/login", function (req, res) {
  console.log("running the get method");
  res.send("using morgan!");
});

app.post("/api/login", function (req, res) {
  const body = req.body;
  const person = {
    name: body.name || "John Doe",
    number: body.number || 654321,
  };
  res.send(JSON.stringify(person));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`----`);
});
