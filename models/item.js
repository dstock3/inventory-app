var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ItemSchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 100},
        description: {type: String, required: true, maxLength: 280},
        category:  {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        price: {type: Number, required: true},
        stock: {type: Number, required: true},
    }
)

// Virtual for Items's URL
ItemSchema
.virtual('url')
.get(function () {
  return '/products/' + this._id;
});

//Export model
module.exports = mongoose.model('Item', ItemSchema);