const mongoose = require('mongoose');
const autosavePlugin = require('mongoose-autosave');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  draftContent: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  lastSavedAt: {
    type: Date
  }
}, { timestamps: true });

// Plugin pour l'enregistrement automatique
PostSchema.plugin(autosavePlugin, {
  interval: 30000, // 30 secondes
  saveHandler: function (doc, callback) {
    if (doc.isModified('draftContent')) {
      doc.lastSavedAt = new Date();
      doc.save(callback);
    } else {
      callback(null);
    }
  }
});

module.exports = mongoose.model('Post', PostSchema);