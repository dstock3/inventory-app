const Item = require('../models/item');
const Category = require('../models/category');
const async = require('async');

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

// Display detail page for a specific Item.
exports.item_detail = function(req, res, next) {
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id, 'name description category price stock')
                .populate('name')
                .populate('description')
                .populate('category')
                .populate('price')
                .populate('stock')
                .exec(callback)
        },
        category: function(callback) {
            Category.find({ 'category': req.params.id },'name')
                .exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); } 
        res.render('item_detail', { title: 'Product Detail', item: results.item, category_list: results.category } );
    })
};

// Display list of all Items.
exports.item_list = function(req, res) {

};

// Display Item create form on GET.
exports.item_create_get = function(req, res, next) {
    Category.find()
        .populate('name')
        .exec(function (err, list_categories) {
            if (err) { return next(err); }
            // Successful, so render
            res.render('item_form', { title: 'Create Item', category_list: list_categories })
            });
};

// Handle Item create on POST.
exports.item_create_post = [
    //convert the category into an array

    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.category ==='undefined')
            req.body.category = [];
            else
            req.body.category = new Array(req.body.genre);
        }
        next();
    },
    
    //form validation
    body('name', 'Item name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'Item description must not be empty. Please enter a desciption for this item.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Item price must not be empty. Please enter the retail price of this item.').trim().isLength({ min: 1 }).escape(),
    body('stock', 'Item amount must not be empty. Please enter the amount of this item in your inventory.').trim().isLength({ min: 1 }).escape(),
    body('category.*').escape(),

    
];

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