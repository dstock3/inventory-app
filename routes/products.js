const express = require('express');
const router = express.Router();

//Controller Module
const items_controller = require('../controllers/itemsContoller')
const category_controller = require('../controllers/categoryController');

/// ITEM ROUTES ///

// GET products home page.
router.get('/', items_controller.index);

// GET request for creating an item. 
router.get('/products/create', items_controller.item_create_get);

// POST request for creating item.
router.post('/products/create', items_controller.item_create_post);

// GET request to delete item.
router.get('/products/:id/delete', items_controller.item_delete_get);

// POST request to delete item.
router.post('/products/:id/delete', items_controller.item_delete_post);

// GET request to update item.
router.get('/products/:id/update', items_controller.item_update_get);

// POST request to update item.
router.post('/products/:id/update', items_controller.item_update_post);

// GET request for one item.
router.get('/products/:id', items_controller.item_detail);

// GET request for list of all items.
router.get('/products', items_controller.item_list);



/// CATEGORY ROUTES ///

// GET request for creating a Category.
router.get('/category/create', category_controller.category_create_get);

//POST request for creating Category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete Category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete Category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update Category.
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update Category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one Category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all Categories.
router.get('/categories', category_controller.category_list);

module.exports = router;
