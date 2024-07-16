// This file enables the connection with MongoDB and CRUD operations
const mongoose = require('mongoose');

// Verifies if the password was given
if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://HasanAsins:${password}@clusterasinshasan.yko1cvx.mongodb.net/phonebook?retryWrites=true&w=majority&appName=ClusterAsinsHasan`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

// If only the password is given, it shows all the entries
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('Phonebook:');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
    // If a name and a number are given, it adds a new entry
    const person = new Person({
        name: name,
        number: number,
    });

    person.save().then(() => {
        console.log(`Added ${name} number ${number} to the phonebook`);
        mongoose.connection.close();
    });
} else {
    console.log('Please provide the correct number of arguments: node mongo.js <password> <name> <number>');
    process.exit(1);
}
