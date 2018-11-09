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
        name: "chooseSteps",
        message: "What would you like to do? ",
        choices: ["View Products for Sale", "View Low Inventory and add stock", "Add New Product"]
    }]).then(function (choice) {
        if (choice.chooseSteps === "View Products for Sale") { //"View Products for Sale"
            connection.query("SELECT * FROM products", function (err, results) {
                if (err) throw err;
                console.table(results);
                console.log("---------------------------------------");
                console.log("The table above shows all the items in our stock.")
                mainFunction();
            })
        } else if (choice.chooseSteps === "View Low Inventory and add stock") {
            console.log(" ");
            console.log("Here are items with quantity less than 5, please order more. Thank you.");
            console.log(" ");
            // show items less then 6
            connection.query("SELECT * FROM products where stock_quantity < 5 ", function (err, results) {
                if (err) throw err;
                console.table(results);
                console.log("    ");

                inquirer.prompt([{
                        type: "input",
                        name: "chooseId",
                        message: "Please enter the  ID of the product you would like add more stock."
                    },

                    {
                        type: "input",
                        name: "chooseUnits",
                        message: "How many units would you like to add?"
                    }
                ]).then(function (user) {
                    console.log('You chose Item Number' + ' ' + user.chooseId + ' ' + 'and units' + ' ' + user.chooseUnits);
                    connection.query("UPDATE  products set stock_quantity = stock_quantity+" + mysql.escape(user.chooseUnits) + "WHERE item_id = " + mysql.escape(user.chooseId), function (err, res) {
                        if (err) throw err;
                        //console.log(res);
                        console.log("Processed your request");
                        console.log("");
                        mainFunction();
                    })

                });

            })


        } else if (choice.chooseSteps === "Add New Product") {
            return inquirer.prompt([{
                    type: "input",
                    name: "product_name",
                    message: "Please enter the name of the product you would like to add."
                },
                {
                    type: "input",
                    name: "department_name",
                    message: "Please enter the department of the product you would like to add."
                },
                {
                    type: "input",
                    name: "price",
                    message: "Please enter the price of the product you would like to add."
                },
                {
                    type: "input",
                    name: "stock_quantity",
                    message: "How many units would you like to add?"
                }
            ]).then(function (user) {
                console.log("Processed your transaction");
                var query = connection.query(
                    "INSERT INTO products SET ?", {
                        product_name: user.product_name,
                        department_name: user.department_name,
                        price: user.price,
                        stock_quantity: user.stock_quantity
                    },
                    function (err, res) {
                        console.log(res.affectedRows + " product inserted!\n");
                    
                        //updateProduct();
                    }
                );

                // logs the actual query being run
                //console.log(query.sql);

            });
        }
    });
};