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

//this is the main function
var mainFunction = function () {
    // 1ST INQUIRER PROMPT
    inquirer.prompt([{
        type: "list",
        name: "whatToDo",
        message: "Hi, Welcome to Bamazon! What would you like to do today?",
        choices: ["Buy Products", "Exit"]
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
                        // validate: function (user) {
                        //     connection.query("SELECT * FROM products", function (err, results) {
                        //         if (err) throw err;
                        //         if (user.chooseId > results.length) {
                        //             console.log("BIg error");

                        //         }


                        //     })

                        // }

                    },

                    {
                        type: "input",
                        name: "chooseUnits",
                        message: "How many units would you like to buy?"
                    }
                ]).then(function (user) {
                    console.log('You chose Item Number' + ' ' + user.chooseId + ' ' + 'and units' + ' ' + user.chooseUnits);
                    console.log("Processed your transaction");
                    connection.query("UPDATE  products set stock_quantity = stock_quantity-" + mysql.escape(user.chooseUnits) + "WHERE item_id = " + mysql.escape(user.chooseId), function (err, res) {
                        if (err) throw err;
                        process.exit();
                        //console.log(res);
                    })
                });
            });
        }
        //2ND OPTION INSIDE 1ST PROMPT , if user wants to choose the 2nd option from the 1st prompt:
        else if (response.whatToDo === "Exit") {
            process.exit();

        }
    });

}
