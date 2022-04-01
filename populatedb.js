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
  async.series([
      function(callback) {
        //0
        categoryCreate("Fresh Fruit", callback);
      },
      function(callback) {
        //1
        categoryCreate("Dairy & Eggs", callback);
      },
      function(callback) {
        //2
        categoryCreate("Meat & Seafood", callback);
      },
      function(callback) {
        //3
        categoryCreate("Beverages", callback);
      },
      function(callback) {
        //4
        categoryCreate("Frozen", callback);
      },
      ],
      // optional callback
      cb);
}



/* (name, desc, cat, price, stock, cb) */

function createItems(cb) {
    let Fruit = categories[0]
    let Dairy = categories[1]
    let Meat = categories[2]
    let Beverages = categories[3]
    let Frozen = categories[4]

    async.series([
        function(callback) {
          itemCreate('Blueberries Package', '1 pint container', Fruit, 4.09, 48, callback);
        },
        function(callback) {
          itemCreate('Deli Sliced Mild Cheddar Cheese', '8 oz', Dairy, 2.35, 55, callback);
        },
        function(callback) {
          itemCreate('Grade A Large Eggs', '1 pint container', Dairy, 1.69, 75, callback);
        },
        function(callback) {
          itemCreate('Green Grapes', '1 lb bunch', Fruit, 2.19, 36, callback);
        },
        function(callback) {
          itemCreate('Orange Juice', '59 fl oz', Beverages, 2.45, 12, callback);
        },
        function(callback) {
          itemCreate('1% Milk', '1 gal', Dairy, 2.75, 57, callback);
        },
        function(callback) {
          itemCreate('Ginger Beer', '12 fl oz', Beverages, 3.55, 7, callback);
        },
        function(callback) {
          itemCreate('Fresh Chicken Breasts', 'per lb', Meat, 8.27, 15, callback);
        },
        function(callback) {
          itemCreate('85% Ground Beef', 'per lb', Meat, 11.77, 19, callback);
        },
        function(callback) {
          itemCreate('Turkey Bacon', '12 oz', Meat, 2.75, 4, callback);
        },
        function(callback) {
          itemCreate('Drumstick Dairy Dessert', '8 ct', Frozen, 7.15, 14, callback);
        },
        function(callback) {
          itemCreate('Tamales, Pork in Red Sauce', '24 oz', Frozen, 8.25, 28, callback);
        },
        function(callback) {
          itemCreate('Three Meat Pizza Rising Crust', '29.8 oz', Frozen, 3.29, 53, callback);
        },
        function(callback) {
          itemCreate('Moose Tracks Ice Cream', '48 fl oz', Frozen, 2.15, 3, callback);
        },
        function(callback) {
          itemCreate('Nonfat Plain Greek Yogurt', '32 oz', Dairy, 3.75, 18, callback);
        },
        function(callback) {
          itemCreate('Kombucha', '16 fl oz', Beverages, 2.75, 5, callback);
        },
        function(callback) {
          itemCreate('Avocado', 'per lb', Fruit, 1.25, 65, callback);
        },
        function(callback) {
          itemCreate('93% Ground Beef', 'per lb', Meat, 6.95, 18, callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
  createCategories,
  createItems
],

function() {
  for (let i = 0; i < categories.length; i++) {
    console.log(categories[i].name + " " + i)
  }
},

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




