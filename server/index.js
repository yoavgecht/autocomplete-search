import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import suggestionRoutes from './routes/suggestionRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
const app = express();
const port = 5000;
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));

app.use('/api/suggestions', suggestionRoutes);
app.use('/api/history', historyRoutes);

mongoose.connect('mongodb://localhost:27017/searchx', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
.catch((error) => console.log('error', error.msg));;

const db = mongoose.connection;

db.on('error', (error) => {
    console.error(error);
});
  
db.once('open', () => {
    console.log('Connected to MongoDB');
});
