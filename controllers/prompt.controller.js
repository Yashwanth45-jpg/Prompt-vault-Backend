// Correctly destructure the function from the service
const { generateTagsForPrompt } = require('../services/ai.service');
const PromptModel = require('../models/prompt.models');
// Requiring the user model here helps prevent populate issues
require('../models/user.models'); 

async function promptController(req, res) {
    try {
        const { title, promptText, isPublic } = req.body;

        if (!title || !promptText) {
            return res.status(400).json({ message: 'Title and prompt text are required.' });
        }

        const generatedTags = await generateTagsForPrompt(promptText);

        const newPrompt = await PromptModel.create({
            title,
            promptText: promptText,
            tags: generatedTags,
            isPublic: isPublic || false,
            author: req.user.id,
        });

        res.status(201).json({
            msg: "New Prompt Created",
            prompt: newPrompt
        });

    } catch (error) {
        console.error('Error creating prompt:', error);
        res.status(500).json({ message: 'Server error while creating prompt.' });
    }
}

async function publishPrompt(req, res) {
    try {
        const prompt = await PromptModel.findById(req.params.id);

        if(!prompt) {
            return res.status(404).json({ msg:"Prompt Not Found" });
        }

        if(prompt.author.toString() !== req.user.id) {
            return res.status(403).json({ msg:"Unauthorized Access" });
        }

        prompt.isPublic = true;
        // FIX: You must save the change to the database.
        await prompt.save(); 

        res.status(200).json({ // Use 200 for a successful update
            msg:"Prompt published successfully",
            prompt
        });
    }
    catch(err) { // FIX: Correct catch block syntax
        console.error("Error publishing prompt:", err);
        res.status(500).json({ msg: "Server error" });
    }
}

async function getCommunityPrompts(req, res){
  try {
    // Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9; // e.g., 9 prompts per page
    const skip = (page - 1) * limit;

    const prompts = await PromptModel.find({ isPublic: true })
      .populate('author', 'username')
      .populate('upvotes', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total number of documents to calculate total pages
    const totalPrompts = await PromptModel.countDocuments({ isPublic: true });
    const totalPages = Math.ceil(totalPrompts / limit);

    res.status(200).json({
        prompts,
        currentPage: page,
        totalPages,
    });
  } catch (error) {
    console.error('Error fetching community prompts:', error);
    res.status(500).json({ msg: 'Server error' }); 
  }
};

async function upvotePrompt(req, res){
  try {
    const prompt = await PromptModel.findById(req.params.id);

    if (!prompt || !prompt.isPublic) {
      return res.status(404).json({ msg: 'Public prompt not found' });
    }

    const hasUpvoted = prompt.upvotes.includes(req.user.id);

    if (hasUpvoted) {
      prompt.upvotes.pull(req.user.id);
    } else {
      prompt.upvotes.push(req.user.id);
    }

    await prompt.save();

    const populatedPrompt = await PromptModel.findById(prompt._id)
        .populate('author', 'username')
        .populate('upvotes', 'username');

    // After saving, emit an event to all clients
    // The event is named 'prompt:updated' and carries the updated prompt data
    req.io.emit('prompt:updated', populatedPrompt);

    res.status(200).json(populatedPrompt);

  } catch (error) {
    console.error('Error upvoting prompt:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

async function getMyPrompts(req, res) {
  try {
    const prompts = await PromptModel.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(prompts);
  } catch (error) {
    console.error('Error fetching user prompts:', error);
    res.status(500).json({ message: 'Server error while fetching prompts.' });
  }
};

module.exports = {
    promptController, 
    publishPrompt, 
    getCommunityPrompts, 
    upvotePrompt, 
    getMyPrompts
};
