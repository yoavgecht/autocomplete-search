import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    unique: true,
  },
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

export default Suggestion;
