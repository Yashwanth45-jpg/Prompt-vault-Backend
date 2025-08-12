const mongoose = require('mongoose')


const PromptSchema = new mongoose.Schema({
    title: { type: String, required: true },
    promptText: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    createdAt: { type: Date, default: Date.now }
})

const PromptModel = mongoose.model("prompt", PromptSchema);

module.exports = PromptModel;