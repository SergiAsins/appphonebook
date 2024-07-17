//import { config } from 'dotenv';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: join(__dirname, '..', '.env') }); //it loads the environment variables from the file .env

//const url = `mongodb+srv://HasanAsins:${password}@clusterasinshasan.yko1cvx.mongodb.net/phonebook?retryWrites=true&w=majority`
//mongoose.connect(url, {userNewUrlParser: true, userUnifiedToplogy: true});

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