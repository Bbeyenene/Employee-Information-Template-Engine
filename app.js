const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");

// Four general questions for every employee
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
        name: "employeeType", //employeeType will be used to render question specifically
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
        const myEmployees = []
        var addEmployees = true;
        while (addEmployees) {
            
            // Await the results from the prompt for general qestions, then store answers as employeeAnswers
            const employeeAnswers = await inquirer.prompt(employeeQuestions);
            // for spesific quesions switch case is used based on employe etype(manager or intern or engineer).
            switch (employeeAnswers.employeeType) {
                case "Manager": {
                    const managerAnswers = await inquirer.prompt(managerQuestions);
                    employeeAnswers.thisAnswers = managerAnswers;
                    break;
                }
                case "Intern": {
                    const internAnswers = await inquirer.prompt(internQuestions);
                    employeeAnswers.thisAnswers = internAnswers;
                    break;
                }
                case "Engineer": {
                    const engineerAnswers = await inquirer.prompt(engineerQuestions);
                    employeeAnswers.thisAnswers = engineerAnswers;
                    break;
                }
            }
            myEmployees.push(employeeAnswers);
            const moreEmployeesObject = await inquirer.prompt(moreEmployeeQuestion);
            addEmployees = moreEmployeesObject.more;
        }
        const totalEmployees = [];

        // for each emloyee in my emmploye list add employee information
        myEmployees.forEach(employee => {
            const name = employee.name;
            const id = employee.id;
            const email = employee.email;
            const employeeType = employee.employeeType;

            //based on employee type add the additional information per employee and return total employee
            switch (employeeType) {
                case "Manager": {
                    const officeNumber = employee.thisAnswers.officeNumber;
                    const manager = new Manager(name, id, email, officeNumber);
                    totalEmployees.push(manager);
                    break;
                }
                case "Intern": {
                    const school = employee.thisAnswers.school;
                    const intern = new Intern(name, id, email, school);
                    totalEmployees.push(intern);
                    break;
                }
                case "Engineer": {
                    const github = employee.thisAnswers.github;
                    const engineer = new Engineer(name, id, email, github);
                    totalEmployees.push(engineer);
                    break;
                }
            }
        });
        return (totalEmployees);
    }
    catch (err) {
        //if error, return the error
        console.log(err);
    }
}

// generate html template based on for every employee
async function renderHTMLTemplate() {
    const totalEmployees = await renderQuestions();
    const outputHTML = await render(totalEmployees)
    fs.writeFile(outputPath, outputHTML, function (err) {
        if (err) {
            return console.log(err);
        }
        else {
            console.log("Successfully wrote the team.html file!");
        }
    });
}

//calling for the renderHTMLTemplet function above
renderHTMLTemplate();
