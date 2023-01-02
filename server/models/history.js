import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    query: { type: String, required: true },
    date: { type: Date, default: Date.now },
  });

const History = mongoose.model('History', historySchema);

export default History;