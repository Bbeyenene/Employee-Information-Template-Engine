const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// General questions for every employee
const employeeQuestions = [
    {
        type: "input",
        name: "name",
        message: "Enter employee name:",
        type: "string"
    },
    {
        type: "input",
        name: "id",
        message: "Enter employee's id number:",
        validate: function (id) {
            var valid = isNaN(id);
            if (valid) {
                console.log("\nInvalid Email!")
                return false;
            }
            else {
                return true;
            }
        }
    },
    {
        type: "input",
        name: "email",
        message: "Employee's email address(example@xyz.abc)?",
        validate: function validateEmail(email) {
            //email validation refereence: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
            const checkEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
            if(!checkEmail) {
                console.log('\nInvalid Email!')
                return false;
            }else {
                return true;
            }
        },
    },
    {
        type: "list",
        name: "employeeType",
        message: "Employee type:",
        choices: [
            "Manager",
            "Intern",
            "Engineer"
        ]
    }
]
// specific questions for managers only
const managerQuestions = [
    {
        type: "input",
        name: "officeNumber",
        message: "Manager's office number:",
        validate: function (id) {
            var valid = isNaN(id);
            if (valid) {
                console.log("\nInvalid Email!")
                return false;
            }
            else {
                return true;
            }
        }
    }
]
// specific questions for interns only
const internQuestions = [
    {
        type: "input",
        name: "school",
        message: "Name of the school this student is attending:",
        type: "string"
    }
]
// specific questions for engineers only
const engineerQuestions = [
    {
        type: "input",
        name: "github",
        message: "Enter your GitHub username(not url):",
        type: "string"
    }
]
// Question asking the user if there is a need to add more employee data
const moreEmployeeQuestion = [
    {
        type: "confirm",
        name: "more",
        message: "Do you want to add more employees?",
    }
]
