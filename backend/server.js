const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const dotenv    = require('dotenv');

dotenv.config();

const app = express();


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

mongoose
  .connect('mongodb://127.0.0.1:27017/geoporteil', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  .then(() => console.log(' Connexion à MongoDB réussie'))
  .catch((err) => console.error(' Erreur MongoDB:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});