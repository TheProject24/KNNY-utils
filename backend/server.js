const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app  = express();

//*Middleware
app.use(cors())
app.use(express.json());

//*Routing
const assignmentsRoutes = require('./routes/assignments');
app.use('/api/assignments', assignmentsRoutes)


//*Mongoose connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Mongoose connected'))
    .catch(err => console.error('DB connection error:', err));



app.listen(5000, () => console.log(`Server is up and running at http://localhost:5000`));