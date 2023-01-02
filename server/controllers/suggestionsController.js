import express from 'express';
import Suggestion from '../models/suggestions.js'
const router = express.Router();

export const getSuggestions = async (req, res) => {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Missing query parameter' });
    }
    // retrieve suggestions from database
    Suggestion.find({ query: { $regex: `^${query}`, $options: 'i' } }, (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(data)
    });
}

export const saveSuggestions = async (req, res) => {
  const query = req.body.suggestion;
   // Validate the request body
   if (!query) {
    return res.status(400).send({ message: 'Missing query parameter' });
  }

  const existingSuggestion = await Suggestion.findOne({ query: req.body.suggestion });

  if (existingSuggestion) {
    return res.status(400).send({message:'query value already exists in the collection'});
  }
  // Create a new suggestion
  const suggestion = new Suggestion({ query });
  // Save the suggestion to the database
  suggestion.save((err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.send(data);
  });
}

export default router;