const express   = require('express');
const mongoose  = require('mongoose');
const dotenv    = require('dotenv');

dotenv.config();               

const app = express();
app.use(express.json());       



mongoose
  .connect('mongodb://127.0.0.1:27017/geoporteil', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(' Connexion à MongoDB réussie'))
  .catch((err) => console.error(' Erreur MongoDB :', err.message));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`)
);

const authRoutes  = require('./routes/auth');
app.use('/api/auth', authRoutes);