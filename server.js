const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

// Routes & middleware
const authRoute = require('./routes/authRoute.js');
const itinRoute = require('./routes/itinRoute.js');
const profileRoute = require('./routes/profileRoute.js');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToViews = require('./middleware/pass-user-to-views.js');
const homeRoute = require('./routes/homeRoute.js');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'partials/_layout');
app.use(expressLayouts);

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
}));

app.use(passUserToViews);

// Routes
app.use('/auth', authRoute);
app.use('/', homeRoute);
app.use('/itineraries', isSignedIn, itinRoute);
app.use('/profile', isSignedIn, profileRoute);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
});

// Start server
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
