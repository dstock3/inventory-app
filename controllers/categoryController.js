const Item = require('../models/item');
const Category = require('../models/category');
const async = require('async');
const { body,validationResult } = require("express-validator");

// Display detail page for a specific Category.
exports.category_detail = function(req, res) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id, 'name')
                .populate('name')
                .exec(callback)
        },
        list_categories: function(callback) {
            Category.find({}, 'name')
                .populate('name')
                .exec(callback)
        },
        list_items: function(callback) {
            Item.find({}, 'name description category price stock image')
                .populate('name')
                .populate('description')
                .populate('category')
                .populate('price')
                .populate('stock')
                .populate('image')
                .exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        let lowInv = []
        for (let i = 0; i < results.list_items.length; i++) {
            if (results.list_items[i].stock < 10 && results.list_items[i].category.name === results.category.name) {
                lowInv.push(results.list_items[i])
            }
        }

        res.render('category_detail', { title: results.category.name, cat_url: results.category.url, category_list: results.list_categories, item_list: results.list_items, thisCat: results.category.name, lowInv: lowInv })
    })
};

// Display Category create form on GET.
exports.category_create_get = function(req, res, next) {
    Category.find()
        .populate('name')
        .exec(function (err, list_categories) {
            if (err) { return next(err); }
            // Successful, so render
            res.render('category_form', { title: 'Create Category', category_list: list_categories })
            });
};

// Handle Category create on POST.
exports.category_create_post = [
    body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        let category = new Category({ 
            name: req.body.name,
        });

        if (!errors.isEmpty()) {
            Category.find()
                .populate('name')
                .exec(function (err, list_categories) {
                    if (err) { return next(err); }
                    res.render('category_form', { title: 'Create Category', category_list: list_categories })
                })
        } else {
            category.save(function (err) {
                if (err) { return next(err); }
                res.redirect(category.url);
            });
        }
    }
];

// Display Category delete form on GET.
exports.category_delete_get = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id, 'name')
                .populate('name')
                .exec(callback) 
        },
        list_categories: function(callback) {
            Category.find({}, 'name')
                .populate('name')
                .exec(callback)
        },
        list_items: function(callback) {
            Item.find({}, 'name category')
                .populate('name')
                .populate('category')
                .exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        let matchingItems = []
        for (let i = 0; i < results.list_items.length; i++) {
            if (results.list_items[i].category.name === results.category.name) {
                matchingItems.push(results.list_items[i])
            }
        }
        res.render('category_delete.pug', { title: 'Delete Category', category: results.category, category_list: results.list_categories, items: matchingItems })
    })
};

// Handle Category delete on POST.
exports.category_delete_post = function(req, res, next) {
    Category.findById(req.body.catid)
        .exec(function(err, results) {
            if (err) { return next(err); }
            // Success
            else {
                // Delete item and redirect to the list of items.
                Category.findByIdAndRemove(req.body.catid, function deleteCat (err) {
                    if (err) { return next(err); }
                    // Success - go to item list
                    res.redirect('/products')
                })
            }
        })
};

// Display Category update form on GET.
exports.category_update_get = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id, 'name')
                .populate('name')
                .exec(callback) 
        },
        list_categories: function(callback) {
            Category.find({}, 'name')
                .populate('name')
                .exec(callback)
        },
        list_items: function(callback) {
            Item.find({}, 'name category')
                .populate('name')
                .populate('category')
                .exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        let matchingItems = []
        for (let i = 0; i < results.list_items.length; i++) {
            if (results.list_items[i].category.name === results.category.name) {
                matchingItems.push(results.list_items[i])
            }
        }
        res.render('category_form.pug', { title: 'Update Category', category: results.category, category_list: results.list_categories, items: matchingItems })
    })
};

// Handle Category update on POST.
exports.category_update_post = [
    body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        let category = new Category({ 
            name: req.body.name,
            _id:req.params.id //This is required, or a new ID will be assigned
        });

        if (!errors.isEmpty()) {
            Category.find()
                .populate('name')
                .exec(function (err, list_categories) {
                    if (err) { return next(err); }
                    res.render('category_form', { title: 'Update Category', category_list: list_categories })
                })
        } else {
            // Data from form is valid. Update the record.
            Category.findByIdAndUpdate(req.params.id, category, {}, function (err,thiscat) {
                if (err) { return next(err); }
                   // Successful - redirect to item detail page.
                   res.redirect(thiscat.url);
                });
        }
    }
];