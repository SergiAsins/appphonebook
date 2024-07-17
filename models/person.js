require('dotenv').config();
import mongoose from 'mongoose';

const url = `mongodb+srv://HasanAsins:${password}@clusterasinshasan.yko1cvx.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {userNewUrlParser: true, userUnifiedToplogy: true});

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Person = mongoose.model('Person', personSchema);

export default Person;