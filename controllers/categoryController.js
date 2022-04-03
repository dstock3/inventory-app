const Item = require('../models/item');
const Category = require('../models/category');
const async = require('async');
const { body,validationResult } = require("express-validator");

// Display list of all Categories.
exports.category_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Category list');
};

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
            Item.find({}, 'name description category price stock')
                .populate('name')
                .populate('description')
                .populate('category')
                .populate('price')
                .populate('stock')
                .exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('category_detail', { title: results.category.name, category_list: results.list_categories, item_list: results.list_items })
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

        //create new Item object with the trimmed form data
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
exports.category_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category delete GET');
};

// Handle Category delete on POST.
exports.category_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category delete POST');
};

// Display Category update form on GET.
exports.category_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category update GET');
};

// Handle Category update on POST.
exports.category_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category update POST');
};