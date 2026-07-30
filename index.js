require("dotenv").config()
const Person = require("./modules/person")
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(express.static('dist')) 

morgan.token('body', function (req, res) { return req.body ? JSON.stringify(req.body) : '' })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = []

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const date = new Date()
    const info = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
    return response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        return response.json(person)
    } else {
        return response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            console.error(error)
            response.status(400).json({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({ 
            error: 'name is missing' 
        })
    }

    if (!body.number) {
        return response.status(400).json({ 
            error: 'number is missing' 
        })
    }

    // const existingPerson = persons.find(person => person.name === body.name)
    // if (existingPerson) {
    //     return response.status(400).json({ 
    //         error: 'name must be unique' 
    //     })
    // }

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })

    newPerson.save().then(savedPerson => {
        return response.status(201).json(savedPerson)
    }) 
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const body = request.body

    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    const person = persons.find(person => person.id === id)
    if (!person) {
        return response.status(404).json({
            error: 'person not found'
        })
    }

    const updatedPerson = { ...person, number: body.number }
    persons = persons.map(person => person.id === id ? updatedPerson : person)

    return response.json(updatedPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
