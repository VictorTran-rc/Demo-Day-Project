const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoritesSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  },
  smsStatus: {
    type: String
  }
});

const Favorites = mongoose.model('Favorites', FavoritesSchema, 'favorites');

module.exports = Favorites;
