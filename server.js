const express= require('express');
const session= require('express-session');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const methodOverride= require('method-override');
const authRoute =require('./routes/authRoute.js');
const itinRoute = require('./routes/itinRoute.js');
const profileRoute =require('./routes/profileRoute.js')
const isSignedIn =require('./middleware/is-signed-in.js');
const passUserToViews= require('./middleware/pass-user-to-views.js')
const User = require('./models/user.js');
const path = require('path');



dotenv.config();

const app = express();
app.set('views', path.join(__dirname, 'views'));

const port = process.env.PORT ? process.env.PORT : '3000';

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(
    session({
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:true,
        cookie: {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production'
        }
    })
);

app.use('/', authRoute);
app.use(passUserToViews);
app.use('/itineraries', isSignedIn);
app.use('/profile', profileRoute);

app.use(itinRoute);


app.get('/home', async (req, res) => {
    console.log("Session data:", req.session);  // Log session
    if (!req.session || !req.session.userId) {
        console.log("No active session found")
        return res.redirect('/login');
    }
    try {
        const user= await User.findById(req.session.userId);
        if (!user) {
            console.log("User not found")
            return res.redirect('/login');
        }
        console.log("User Found:", user);
        res.render('navigations/home.ejs', { user });
    }catch (err) {
        console.error('Error fetching user:,', err)
        res.redirect('/login');
    }
});

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`)
})
