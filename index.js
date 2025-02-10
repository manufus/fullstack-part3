require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

// app.use(morgan("tiny"));
app.use(morgan(':method :url :status :response-time :object'))
morgan.token('object', function (req) {
  return JSON.stringify(req.body)
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

// app.get("/", (request, response) => {
//   response.send("<h1>Phonebook backend</h1>");
// });

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then((result) => {
      const count = result.length
      response.send(
        `<p>Phonebook has info for ${count} people <br/>${new Date()}</p>`
      )
    })
    .catch((error) => {
      next(error)
      response.status(500).send('An error occurred while fetching data.')
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  // const id = request.params.id;
  // const person_info = persons.find((person) => person.id === id);
  // person_info ? response.json(person_info) : response.status(404).end();
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// function getRandomInt(min, max) {
//   const minCeiled = Math.ceil(min)
//   const maxFloored = Math.floor(max)
//   return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  // if (body.name.length < 3) {
  //   return response.status(400).json({ error: "name is too short" });
  // }

  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: "information missing",
  //   });
  // }
  // if (persons.find((person) => person.name === body.name)) {
  //   return response.status(400).json({
  //     error: "this name already exists",
  //   });
  // }
  const person = new Person({
    // id: getRandomInt(5, 100),
    name: body.name || 'John Doe',
    number: body.number || 654321,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))

  // persons = persons.concat(person);
  // response.json(person);
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  // if (body.name.length < 3) {
  //   return response.status(400).json({ error: "name is too short" });
  // }
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { runValidators: true })
    .then((updatedNumber) => {
      console.log(body.name)
      response.json(updatedNumber)
    })
    .catch((error) => next(error))
})

app.get('/api/login', function (req, res) {
  console.log('running the get method')
  res.send('using morgan!')
})

app.post('/api/login', function (req, res) {
  const body = req.body
  const person = {
    name: body.name || 'John Doe',
    number: body.number || 654321,
  }
  res.send(JSON.stringify(person))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('----')
})
