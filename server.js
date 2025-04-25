require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/public_transport', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const userRoutes = require('./routes/userRoutes');

// Basic route
app.get('/', (req, res) => {
  res.send('Public Transport Backend is running');
});

app.use('/api/users', userRoutes);

const routeRoutes = require('./routes/routeRoutes');
app.use('/api', routeRoutes);

const transportRoutes = require('./routes/transportRoutes');
app.use('/api', transportRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
