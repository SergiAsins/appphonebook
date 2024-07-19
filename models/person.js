//import { config } from 'dotenv';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


//dotenv configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const url = process.env.MONGODB_URI;
console.log('connecting to', url);

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

/*const password = process.argv[2];
mongoose.set('strictQuery',false) */

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

//const Person = mongoose.model('Person', personSchema);
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

personSchema.plugin(uniqueValidator);

const Person = mongoose.model('Person', personSchema)


export default Person;