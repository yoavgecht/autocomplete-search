import express from "express";
import { saveSearched, getSearchHistory, removeSearch } from '../controllers/historyController.js'
const router = express.Router();

router.get('/', getSearchHistory)
router.post('/saveSearch', saveSearched);
router.delete('/removeSearch/:searchItem', removeSearch)

export default router;