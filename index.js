import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import morganMiddleware from './api/morganMiddleware.js';
import { dirname, join } from 'path'
import { fileURLToPath } from 'url';
//import mongoose from 'mongoose';
import Person from './models/person.js';
import persons from './src/services/persons.jsx';

// Resolve __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });


/*no està al solcuionari:
import path from 'path'*/

const app = express();

// AI: Configurar dotenv
dotenv.config();

app.use(cors()); // enables Cross-Origin Resource Sharing
app.use(express.json()); // Enables the management of JSON data format in the petitions WITH Express middleware
app.use(express.static(join(__dirname, 'dist'))); // Serve static files from the 'dist' folder
app.use(morganMiddleware);// It uses the middleware of Morgan
app.use('/api/persons', persons)



//solution: tokens morgan
app.use(morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  }))


//info route:
app.get('/info', (req, res) => {
    const currentDate = new Date().toLocaleString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    Person.find({}).then(persons => {
        res.send(
            `
            <div>
                <p>Phonebook has info for ${persons.length} people</p>
            </div>
            <div>
                <p>${currentDate} (${timeZone})</p>
            </div>`
        )
        })
})

//get all phonebook contacts from the DB
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()));
    });
});


//get an specific contact of the phonebook
app.get('/api/persons/:id', (req,res,next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person.toJSON);
        } else {
            res.status(404).end();
        }
    }).catch(error =>next(error));
});

//delete a contact from the phonebook
app.delete('/api/persons/:id', (req,res,next) => {
    Person.findByIdAndRemove(req.params.id).then(() => {
        res.status(204).end();
    }).catch(error => next(error));
});


//add a new contact 
app.post('/api/persons', (req,res,next) => {
    const body = req.body

    const personName = body.name
    const personNumber = body.number

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }

    if (Object.keys(body).length === 0) {
        return response.status(400).json({
          error: 'content missing'
        })
    }

    const person = new Person({
    name: personName,
    number: personNumber,
    });

    person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
        console.log(`added ${person.name} number ${person.number} to the phonebook`)
        res.json(savedAndFormattedPerson)
    }).catch(error => next(error));
    mongoose.connection.close()//no està a git
});

/*Serve the frontend for any other routes not managed by the API
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist'), 'index.html')
}) */

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
        response.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
    })

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
        }
        next(error)
}

app.use(errorHandler)


//listen in the specified port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
