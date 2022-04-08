const express = require('express');
const router = express.Router();
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images')
  },

  filename: (req, file, cb) => {
    cb(null,  file.originalname)
  }
})

const upload = multer({ storage: storage })

//Controller Module
const items_controller = require('../controllers/itemsContoller')
const category_controller = require('../controllers/categoryController');

/// ITEM ROUTES ///

// GET products home page.
router.get('/', items_controller.index);

// GET request for creating an item. 
router.get('/item/create', items_controller.item_create_get);

// POST request for creating item.
router.post('/item/create', upload.single('image'), items_controller.item_create_post);

// GET request to delete item.
router.get('/item/:id/delete', items_controller.item_delete_get);

// POST request to delete item.
router.post('/item/:id/delete', items_controller.item_delete_post);

// GET request to update item.
router.get('/item/:id/update', items_controller.item_update_get);

// POST request to update item.
router.post('/item/:id/update', upload.single('image'), items_controller.item_update_post);

// GET request for one item.
router.get('/item/:id', items_controller.item_detail);

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

module.exports = router;
