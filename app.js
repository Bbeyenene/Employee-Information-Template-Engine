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

// Async function to promise user input questions from the command line 
//i.e.   try{  } catch(err){  }
async function renderQuestions() {
    try {
        const myEmployee = []
        var addEmployees = true;
        while (addEmployees) {
            //moreEmployee
            // Await the results from the prompt, then store as employeeAnswers
            const employeeAnswers = await inquirer.prompt(employeeQuestions);

            switch (employeeAnswers.employeeType) {
                case "Manager": {
                    const managerAnswers = await inquirer.prompt(managerQuestions);
                    employeeAnswers.supplementalAnswers = managerAnswers;
                    break;
                }
                case "Intern": {
                    const internAnswers = await inquirer.prompt(internQuestions);
                    employeeAnswers.supplementalAnswers = internAnswers;
                    break;
                }
                case "Engineer": {
                    const engineerAnswers = await inquirer.prompt(engineerQuestions);
                    employeeAnswers.supplementalAnswers = engineerAnswers;
                    break;
                }
            }

            // Pushing the employeeAnswers object into the  array
            myEmployee.push(employeeAnswers);

            // Asking a question to the user if they want to input more employee data
            // The question is a boolean, returning true or false, stored within an object
            const moreEmployeesObject = await inquirer.prompt(moreEmployeeQuestion);

            // Going in the moreEmployeesObject and going to the more key
            // The value there will either be true or false
            // Set that value as the value of the variable moreEmployees
            // The while loop will only continue to run moreEmployees is true
            addEmployees = moreEmployeesObject.more;
        }

        // Initializing an empty array to hold all the formatted employee objects
        const formattedAllEmployeesObject = [];
        console.log(formattedAllEmployeesObject)
        // Going through the raw data array and formatting it
        // (Each element is an employee object)
        myEmployee.forEach(element => {
            const name = element.name;
            const id = element.id;
            const email = element.email;
            const employeeType = element.employeeType;
            // Running a switch case dependent on the employee type
            switch (employeeType) {
                case "Manager": {
                    const officeNumber = element.supplementalAnswers.officeNumber;
                    const manager = new Manager(name, id, email, officeNumber);
                    formattedAllEmployeesObject.push(manager);
                    break;
                }
                case "Intern": {
                    const school = element.supplementalAnswers.school;
                    const intern = new Intern(name, id, email, school);
                    formattedAllEmployeesObject.push(intern);
                    break;
                }
                case "Engineer": {
                    const github = element.supplementalAnswers.github;
                    const engineer = new Engineer(name, id, email, github);
                    formattedAllEmployeesObject.push(engineer);
                    break;
                }
            }
        });

        return (formattedAllEmployeesObject);

    }
    catch (err) {
        //if error, return the error
        console.log(err);
    }
}
