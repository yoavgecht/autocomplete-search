import express from 'express';
import History from '../models/history.js'
const router = express.Router();

export const saveSearched = async (req, res) => {
  const query  = req.body.suggestion;
  if (!query) {
    return res.status(400).send({ message: 'Missing query parameter' });
  }

  // Retrieve the most recent item in the history collection
  const mostRecentItem = await History.findOne().sort({ date: -1 });

  // Check if the suggestion is already the most recent item in the collection
  if (mostRecentItem && mostRecentItem.query === query) {
    return res.send({ message: 'Suggestion already saved in history' });
  }

  // create a new history item
  const history = new History({ query });
  history.save((err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.send(data);
  });
}

export const getSearchHistory = async (req, res) => {
History.find({}).sort({_id: -1}).limit(10).exec((err, data) => {
    if (err) {
        return res.status(500).send(err);
    }   
        return res.status(200).send(data);
    });
}

export const removeSearch = async (req, res) => {
    const query = req.params.searchItem;
    await History.deleteOne({ query });
    History.find({}).sort({_id: -1}).limit(10).exec((err, data) => {
        if (err) {
            return res.status(500).send(err);
        }   
            return res.status(200).send(data);
        });
}

export default router;