// This file enables the connection with MongoDB and the CRUD operations
import mongoose from 'mongoose';
import pkg from 'mongoose';
const { connect, Schema, model, connection } = pkg;
import Person from './models/persons.js'


// Verifies if the password was provided
if (process.argv.length<3) {
    console.log('give password as argument');
    process.exit(1);
}

//possible error xq al conexió a mongoDB està a person.js y mongo.js
const password = process.argv[2];

const url = `mongodb+srv://HasanAsins:${password}@clusterasinshasan.yko1cvx.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAsinsHasan`

mongoose.set('strictQuery',false)

mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    });

const person = new Person({
    name: 'Mohammed',
    number: 12312144455,
})

person.save().then(result => {
        console.log('contact saved!');
        mongoose.connection.close()
})
    .catch((error) => {
        console.log('Error saving contact:', error.message);
        mongoose.connection.close();
});

