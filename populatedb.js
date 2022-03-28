#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []

function categoryCreate(name, cb) {
  var cat = new Category({ name: name });
       
  cat.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + cat);
    categories.push(cat)
    cb(null, cat);
  }   );
}

function itemCreate(name, desc, cat, price, stock, cb) {
  var item = new Item({ name:name , description:desc, category:cat, price:price, stock:stock });
       
  item.save(function (err) {
    if (err) {
      console.log("Error creating..."  + name + ", des: " + desc + ", cat: " + cat + ", price: " + price + ", stock: " + stock)
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}

function createCategories(cb) {
  async.parallel([
      function(callback) {
        categoryCreate("Fresh Fruit", callback);
      },
      function(callback) {
        categoryCreate("Dairy & Eggs", callback);
      },
      function(callback) {
        categoryCreate("Meat & Seafood", callback);
      },
      function(callback) {
        categoryCreate("Beverages", callback);
      },
      ],
      // optional callback
      cb);
}


/* (name, desc, cat, price, stock, cb) */

function createItems(cb) {
    async.series([
        function(callback) {
          itemCreate('Blueberries Package', '1 pint container', categories[0], 4.09, 48, callback);
        },
        function(callback) {
          itemCreate('Deli Sliced Mild Cheddar Cheese', '8 oz', categories[1], 2.35, 55, callback);
        },
        function(callback) {
          itemCreate('Grade A Large Eggs', '1 pint container', categories[1], 1.69, 75, callback);
        },
        function(callback) {
          itemCreate('Green Grapes', '1 lb bunch', categories[0], 2.19, 36, callback);
        },
        function(callback) {
          itemCreate('Orange Juice', '59 fl oz', categories[3], 2.45, 12, callback);
        },
        function(callback) {
          itemCreate('1% Milk', '1 gal', categories[3], 2.75, 57, callback);
        },
        function(callback) {
          itemCreate('Ginger Beer', '12 fl oz', categories[3], 3.55, 7, callback);
        },
        function(callback) {
          itemCreate('Fresh Chicken Breasts', 'per lb', categories[2], 8.27, 15, callback);
        },
        function(callback) {
          itemCreate('85% Ground Beef', 'per lb', categories[2], 11.77, 19, callback);
        },
        function(callback) {
          itemCreate('Turkey Bacon', '12 oz', categories[2], 2.75, 4, callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
  createCategories,
  createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Items: '+items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




