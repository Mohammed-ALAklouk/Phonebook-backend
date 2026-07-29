const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://phonebook:${password}@phonebook.pdae2hk.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Phonebook`

mongoose.set("strictQuery", false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 3) {
    Person.find({}).then((result) => {
        console.log("phonebook:")
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
else {

    if (process.argv.length !== 5) {
        console.log("give name and number as arguments")
        process.exit(1)
    }

    if (process.argv[3] === undefined || process.argv[4] === undefined) {
        console.log("name or number is missing")
        process.exit(1)
    }

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then((result) => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}