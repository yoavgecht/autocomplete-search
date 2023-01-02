import express from "express";
import { getSuggestions, saveSuggestions } from '../controllers/suggestionsController.js'
const router = express.Router();

router.get('/', getSuggestions);
router.post('/saveSuggestion', saveSuggestions);

export default router;