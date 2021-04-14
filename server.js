const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const userRoutes = require('./routes/users');
const athletesRoutes = require('./routes/athletes');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/scouting', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const server = express();

server.engine('ejs', ejsMate)
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'))

server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));
server.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

server.use(session(sessionConfig))
server.use(flash());

server.use(passport.initialize());
server.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

server.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


server.use('/', userRoutes);
server.use('/athletes', athletesRoutes)
server.use('/athletes/:id/reviews', reviewRoutes)


server.get('/', (req, res) => {
    res.render('home')
});


server.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

server.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

server.listen(8080, () => {
    console.log("Serving on port 8080")
});