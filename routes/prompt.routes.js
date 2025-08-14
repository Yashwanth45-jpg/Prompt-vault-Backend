const express = require('express')
const {promptController, publishPrompt, upvotePrompt,getCommunityPrompts, getMyPrompts} = require('../controllers/prompt.controller')
const {authMiddleware}  = require('../middleware/auth.middleware')
const searchPromptController = require('../controllers/searchprompt.controller')
const router = express.Router();

//to create new prompt
router.post('/', authMiddleware, promptController);

//to get the serched prompts
router.get('/search', authMiddleware, searchPromptController);

//to put the prompt in community
// Add this new route
router.put('/:id/publish', authMiddleware, publishPrompt);

// Add this new route. Note: No authMiddleware if it's public.
router.get('/community', getCommunityPrompts);


// Add this new route
router.put('/:id/upvote', authMiddleware, upvotePrompt);

// 2. Add the new route
router.get('/myprompts', authMiddleware, getMyPrompts);

module.exports = router;