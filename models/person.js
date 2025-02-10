const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('----')
console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{2,3}-\d+$/.test(value)
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
})

// const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//   name: process.argv[3],
//   number: process.argv[4],
// });

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

// if (process.argv.length < 4) {
//   Person.find({}).then((result) => {
//     result.forEach((person) => {
//       console.log(person);
//     });
//     mongoose.connection.close();
//   });
// } else if (process.argv.length == 5) {
//   person.save().then((result) => {
//     console.log(`added ${person.name} number ${person.number} to phonebook`);
//     mongoose.connection.close();
//   });
// }

module.exports = mongoose.model('Person', personSchema)
