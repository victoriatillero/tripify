// load environment variables from .env
const dotenv = require('dotenv');
dotenv.config();

// import downloaded dependency modules
const express= require('express'); // Web Framework
const mongoose = require('mongoose'); // MongoDB Object Document Modelling
const methodOverride= require('method-override'); // enables PUT & DELETE requests via forms
const session= require('express-session'); // handles user sessions
//define the port
const port = process.env.PORT ? process.env.PORT : '3000'; // sets the port in .env file

const authRoute =require('./routes/authRoute.js')
const itineraryRoute = require('./routes/itineraryRoute.js')
const app = express(); // create express application


app.get('/', (req,res)=>{
    res.send("Connected to Tripify");
})

//middleware
app.use(express.urlencoded({extended:true})); // parse incoming data
app.use(methodOverride('_method')); // support HTTP verbs like PUT & DELETE in forms


// session set up (keeps users logged in across diff pages)
app.use(
    session({
        secret:process.env.SESSION_SECRET, // used to sign session cookies
        resave:false, // prevents saving data unless modified
        saveUninitialized:true, // ensures uninitialized sessions are saved
    })
);
app.use('/', authRoute)
app.use('/itineraries', itineraryRoute)
// connect to mongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// routes
app.get('/', (req, res) => {
    res.send("Tripify is live!")
})

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`)
})
