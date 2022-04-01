const Item = require('../models/item');
const Category = require('../models/category');
const async = require('async');
const { body,validationResult } = require("express-validator");
const item = require('../models/item');

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

    //form validation
    body('name', 'Item name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'Item description must not be empty. Please enter a desciption for this item.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Item price must not be empty. Please enter the retail price of this item.').trim().isLength({ min: 1 }).escape(),
    body('stock', 'Item amount must not be empty. Please enter the amount of this item in your inventory.').trim().isLength({ min: 1 }).escape(),
    body('category', 'Item category must not be empty.').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        //create new Item object with the trimmed form data
        let item = new Item({ 
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock
        });

        if (!errors.isEmpty()) {

        } else {
            Category.find()
                .populate('name')
                .exec(function (err, list_categories) {
                    if (err) { return next(err); }
                    for (let i = 0; i < list_categories.length; i++) {
                        if (req.body.category === list_categories[i].name) {
                            //If the category entered in the form is already one of our preexisting categories, assign the corresponding id to the item category
                            item.category = list_categories[i]._id

                            item.save(function (err) {
                                if (err) { return next(err); }
                                res.redirect(item.url);
                            });

                        } else {
                            /*
                            //Otherwise, create a new category
                            let newCategory = new Category({
                                name: req.body.category
                            })
                            //And add its ID as a property to the item
                            item.category = newCategory._id

                            item.save(function (err) {
                                newCategory.save(function (err) {
                                    if (err) { return next(err); }
                                    res.redirect(item.url);

                                })

                            });
                            */

                        }
                    }

                })
        }
    }
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