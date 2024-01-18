const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const userPostRoutes= require('./routes/userPostRoutes');
const searchUserRoutes = require('./routes/searchUserRoutes');
const followRoutes = require('./routes/followRoutes');
const commentRoutes = require('./routes/commentRoutes');
const path = require('path');

const app = express();

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
mongoose.connect('mongodb://127.0.0.1:27017/Ciao');

app.use(userRoutes);
app.use(postRoutes);
app.use(userPostRoutes);
app.use(searchUserRoutes);
app.use(followRoutes);
app.use(commentRoutes);
const PORT = 5000;

app.listen(PORT, ()=>console.log(`Server running the port ${PORT}`));