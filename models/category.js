var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        name: {type: String, required: true, minLength: 3, maxLength: 100},
    }
)

// Virtual for genre url
CategorySchema
.virtual('url')
.get(function () {
  return '/category/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);