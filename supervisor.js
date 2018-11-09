var mysql = require("mysql");
var inquirer = require("inquirer");
require('console.table')
//connection to the database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "1230",
    database: "bamazon"
});
//connect to the connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    mainFunction();

});


var mainFunction = function () {
    // 1ST INQUIRER PROMPT
    inquirer.prompt([{
        type: "list",
        name: "whatToDo",
        message: "What would you like to do today?",
        choices:  ["See all the items in the table", "See items with low stock", "Exist"]
    }]).then(function (response) {
        //1ST OPTION INSIDE 1ST PROMPT , if user chooses first/buy option then: 
        if (response.whatToDo === "Buy Products") {
            console.log("you chose to buy. Here is the lit of products for you: ");
            //show the product list to the user
            connection.query("SELECT * FROM products", function (err, results) {
                if (err) throw err;
                console.table(results);
                //connection.end();
                inquirer.prompt([{
                        type: "input",
                        name: "chooseId",
                        message: "Please enter the  ID of the product you would like to buy.",
                        validate: function(user){
                            connection.query("SELECT * FROM products", function (err, results) {
                                if (err) throw err;
                                if(user.chooseId > results.length)
                                {
                                    console.log("BIg error");
                                    
                                }
                                
                                
                            })
                          
                        }

                    },

                    {
                        type: "input",
                        name: "chooseUnits",
                        message: "How many units would you like to buy?"
                    }
                ]).then(function (user) {
                    console.log('You chose Item Number' + ' ' + user.chooseId + ' ' + 'and units' + ' ' + user.chooseUnits);
                    console.log("Processed your transaction");
                    
                    // when the user chooses the id and item, if user ID === id in the database and if database has more or 
                    // === to user chosen units then 
                    //if (user.chooseId === results.products.item_id && user.chooseUnits <= results.products.stock_quantity){
                    //run query to update the user given number of items in the id corresponding to user chosen id.

                    connection.query("UPDATE  products set stock_quantity = stock_quantity-" + mysql.escape(user.chooseUnits) + "WHERE item_id = " + mysql.escape(user.chooseId), function (err, res) {
                        if (err) throw err;
                        console.log(res);

                    })
                });
            });
        }
        //2ND OPTION INSIDE 1ST PROMPT , if user wants to choose the 2nd option from the 1st prompt:
        else if (response.whatToDo === "Sell Products") {
            console.log("you chose to sell");
            // 2ND-B INQUIRER PROMPT INSIDE 1ST PROMPT 

            return inquirer.prompt([{
                    type: "input",
                    name: "product_name",
                    message: "Please enter the name of the product you would like to sell."
                },
                {
                    type: "input",
                    name: "department_name",
                    message: "Please enter the department of the product you would like to sell."
                },
                {
                    type: "input",
                    name: "price",
                    message: "Please enter the price of the product you would like to sell."
                },
                {
                    type: "input",
                    name: "stock_quantity",
                    message: "How many units would you like to sell?"
                }
            ]).then(function (user) {
                console.log("Processed your transaction");
                // when the user chooses the id and item, if user ID === id in the database and if database has more or 
                // === to user chosen units then 
                //if (user.chooseId === results.products.item_id && user.chooseUnits <= results.products.stock_quantity){
                //run query to update the user given number of items in the id corresponding to user chosen id.

                var query = connection.query(
                    "INSERT INTO products SET ?", {
                        product_name: user.product_name,
                        department_name: user.department_name,
                        price: user.price,
                        stock_quantity: user.stock_quantity
                    },
                    function (err, res) {
                        console.log(res.affectedRows + " product inserted!\n");
                        // Call updateProduct AFTER the INSERT completes
                        //updateProduct();
                    }
                );

                // logs the actual query being run
                console.log(query.sql);

            });

        }



    });

}