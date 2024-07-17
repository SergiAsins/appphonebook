import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Person from '../models/person.js';
import cors from 'cors';
import path from 'path';
import morganMiddleware from './morganMiddleware.js';

dotenv.config(); //it loads the environment variables from the file .env

const app = express();

const url = process.env.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message);
  });

app.use(cors()); // enables Cross-Origin Resource Sharing
app.use(express.json()); // Enables the management of JSON data format in the petitions WITH Express middleware
app.use(morganMiddleware);// It uses the middleware of Morgan
app.use(express.static(path.join(__dirname, '../dist'))) // Serve static files from the 'dist' folder


let persons = [
    { id: 1, name: "El Pepitos Local", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
]


//get all phonebook contacts from the DB
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    });
});


//add a new contact in the phonebook
app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then(savedPerson => {
        res.json(savedPerson);
    }).catch(error => {
        res.status(400).json({
            error: 'name must be unique'
        });
    });
});


//get an specific contact of the phonebook
app.get('/api/persons/:id', (req,res) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).end();
        }
    }).catch(error => {
        res.status(400).send({ error: "malformatted id"});
    });
});


//delete a contact from the phonebook
app.delete('/api/persons/:id', (req,res) => {
    Person.findByIdAndRemove(req.params.id).then(() => {
        res.status(204).end();
    }).catch(error => {
        res.status(400).send({ error: 'malformatted id' });
    });
});


//info
app.get('/info', (req,res) => {
    const numberOfPersons = persons.length;
    const currentDate = new Date ();
    const info =`
        <p>Phonebook has info for ${numberOfPersons} people</p>
        <p>${currentDate}</p>
    `;
    res.send(info);
})


//Serve the frontend for any other routes not managed by the API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist'), 'index.html')
}) 

//listen in the specified port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
