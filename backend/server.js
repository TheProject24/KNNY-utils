const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();
const app = express();

//*Middleware
app.use(cors());
app.use(express.json());
app.use('uploads', express.static('uploads'));

//*Routing
const assignmentsRoutes = require('./routes/assignments');
const lecturesRoutes = require('./routes/lectures');
const linksRoutes = require('./routes/link');
const snippetsRoutes = require('./routes/snippet');
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/lectures', lecturesRoutes);
app.use('/api/links', linksRoutes);
app.use('/api/snippets', snippetsRoutes);


//*Mongoose connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Mongoose connected'))
    .catch(err => console.error('DB connection error:', err));

//!Errors Middleware
app.use(errorHandler);


app.listen(5000, () => console.log(`Server is up and running at http://localhost:5000`));