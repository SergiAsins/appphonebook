// This file enables the connection with MongoDB and the CRUD operations
import pkg from 'mongoose';
const { connect, Schema, model, connection } = pkg;


// Verifies if the password was provided
if (process.argv.length<3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://HasanAsins:${password}@clusterasinshasan.yko1cvx.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery',false)

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
    name: Mohammed,
    number: 12312144455,
})

// If only the password is provided, it shows all the entries
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        connection.close();
    });
} else if (process.argv.length === 5) {
    // If a name and number are provided, it adds a new entry
    const person = new Person({
        name: name,
        number: number,
    });

    person.save().then(() => {
        console.log(`added ${name} number ${number} to the phonebook`);
        connection.close();
    });
} else {
    console.log('Please provide the correct number of arguments: node mongo.js <password> <name> <number>');
    process.exit(1);
}
