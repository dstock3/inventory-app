const Item = require('../models/item');
const Category = require('../models/category');
const async = require('async');
const { body,validationResult } = require("express-validator");

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

    //convert categories to array

    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category ==='undefined')
            req.body.category = [];
            else
            req.body.category = new Array(req.body.category);
        }
        next();
    },
    
    //form validation
    body('name', 'Item name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'Item description must not be empty. Please enter a desciption for this item.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Item price must not be empty. Please enter the retail price of this item.').trim().isLength({ min: 1 }).escape(),
    body('stock', 'Item amount must not be empty. Please enter the amount of this item in your inventory.').trim().isLength({ min: 1 }).escape(),
    body('category', 'Item category must not be empty.').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        let newCategory = false;

        //create new Item object with the trimmed form data
        let item = new Item({ 
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock
        });

        if (!errors.isEmpty()) {
            Category.find()
                .populate('name')
                .exec(function (err, list_categories) {
                    if (err) { return next(err); }

                    for (let i = 0; i < list_categories.length; i++) {
                        if (item.category.indexOf(list_categories[i]._id) > -1) {
                            list_categories[i].checked = 'true';
                        }
                    }
                    res.render('item_form', { title: 'Create Item', category_list: list_categories, item: item, errors: errors.array() })
                })
        } else {
            item.save(function (err) {
                if (err) { return next(err); }
                res.redirect(item.url);
            });
        }
    }
];

// Display Item delete form on GET.
exports.item_delete_get = function(req, res, next) {
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
        if (results.item==null) { // No results.
            res.redirect('/products');
        }
        // Successful, so render.
        res.render('item_delete', { title: 'Delete Item', item: results.item, category_list: results.category } );
    });
};

// Handle Item delete on POST.
exports.item_delete_post = function(req, res, next) {
    Item.findById(req.body.itemid)
        .exec(function(err, results) {
            if (err) { return next(err); }
            // Success
            else {
                // Delete item and redirect to the list of items.
                Item.findByIdAndRemove(req.body.itemid, function deleteItem (err) {
                    if (err) { return next(err); }
                    // Success - go to item list
                    res.redirect('/products')
                })
            }
    })
};

// Display Item update form on GET.
exports.item_update_get = function(req, res, next) {
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
        if (results.item==null) { // No results.
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        // Success
        res.render('item_form', { title: 'Update Item', item: results.item, category_list: results.category });
    })
};

// Handle Item update on POST.
exports.item_update_post = [
    // Convert the category to an array

    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category==='undefined')
            req.body.category=[];
            else
            req.body.category=new Array(req.body.category);
        }
        next();
    },

    //form validation
    
    body('name', 'Item name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'Item description must not be empty. Please enter a desciption for this item.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Item price must not be empty. Please enter the retail price of this item.').trim().isLength({ min: 1 }).escape(),
    body('stock', 'Item amount must not be empty. Please enter the amount of this item in your inventory.').trim().isLength({ min: 1 }).escape(),
    body('category', 'Item category must not be empty.').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create an Item object with escaped/trimmed data and old id.
        let item = new Item({ 
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock,
            _id:req.params.id //This is required, or a new ID will be assigned
        });

        if (!errors.isEmpty()) {
            Category.find()
                .populate('name')
                .exec(function (err, list_categories) {
                    if (err) { return next(err); }

                    for (let i = 0; i < list_categories.length; i++) {
                        if (item.category.indexOf(list_categories[i]._id) > -1) {
                            list_categories[i].checked = 'true';
                        }
                    }
                    res.render('item_form', { title: 'Update Item', category_list: list_categories, item: item, errors: errors.array() })
                })
        }
        else {
            // Data from form is valid. Update the record.
            Item.findByIdAndUpdate(req.params.id, item, {}, function (err,thisitem) {
                if (err) { return next(err); }
                   // Successful - redirect to item detail page.
                   res.redirect(thisitem.url);
                });
        }
    }

];