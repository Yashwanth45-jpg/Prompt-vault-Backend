const PromptModel = require('../models/prompt.models')

async function searchPromptController(req, res) {
    try {
    // Ensure you are reading from `req.query.term` to match the frontend
    const { term } = req.query;

    if (term === undefined) {
      // If no search term is provided, return all user prompts
      const allPrompts = await PromptModel.find({ author: req.user.id }).sort({ createdAt: -1 });
      return res.status(200).json(allPrompts);
    }
    
    // Create a case-insensitive regular expression for searching
    const regex = new RegExp(term, 'i');

    const prompts = await PromptModel.find({
      author: req.user.id, // Only search prompts belonging to the logged-in user
      $or: [
        { title: regex },
        { promptText: regex },
        { tags: regex }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(prompts);

  } catch (error) {
    console.error('Error searching prompts:', error);
    res.status(500).json({ message: 'Server error while searching prompts.' });
  }

}

module.exports = searchPromptController;