const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const { QueryTypes } = require('sequelize');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { sequelize, testConnection } = require('./config/database');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const http = require('http');
const { socket: socketFunction } = require('./controllers/soketController');
const passport = require('passport');
const session = require('express-session');



passport.serializeUser((user, next)=>{
  return next(null, user)
})

passport.deserializeUser((user, next)=>{
  return next(null, user)
})

// Session configuration
const sessionConfig = {
  secret: 'secret',
  resave: false,
  saveUninitialized: true
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());



// Test the database connection
testConnection()
  .then(() => {
    // Routes
    app.use('/api', userRoutes);
    app.use('/api', categoryRoutes);
    app.use('/api',  productRoutes);


    const server = http.createServer(app);
    socketFunction(server);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to start server:', err);
  });