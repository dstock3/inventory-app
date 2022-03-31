const Item = require('../models/item');
const Category = require('../models/category');
const async = require('async');
/*
exports.index = function(req, res) {
    Item.find({}, 'name description category price stock')
    .populate('name')
    .populate('description')
    .populate('category')
    .populate('price')
    .populate('stock')
    .exec(function (err, list_items) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('index', { title: 'Item List', item_list: list_items });
    });
    
};
*/

exports.index = function(req, res, next) {
    async.parallel({
        list_items: function(callback) {
            Item.find({}, 'name description category price stock')
            .populate('name')
            .populate('description')
            .populate('category')
            .populate('price')
            .populate('stock')
            .exec(callback)

        },
        list_categories: function(callback) {
            Category.find({}, 'name')
            .populate('name')
            .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        // Successful, so render.
        res.render('index', { title: 'Products', item_list: results.list_items, category_list: results.list_categories } );
    });
};

// Display list of all Items.
exports.item_list = function(req, res) {


};

// Display detail page for a specific Item.
exports.item_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Item detail: ' + req.params.id);
};

// Display Item create form on GET.
exports.item_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Item create GET');
};

// Handle Item create on POST.
exports.item_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Item create POST');
};

// Display Item delete form on GET.
exports.item_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Item delete GET');
};

// Handle Item delete on POST.
exports.item_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Item delete POST');
};

// Display Item update form on GET.
exports.item_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Item update GET');
};

// Handle Item update on POST.
exports.item_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Item update POST');
};