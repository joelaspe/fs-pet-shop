#! /usr/bin/env node

const fs = require('fs')

const JSONFILE = './pets.json';
const inputs = process.argv;

/** Program must have at least one input */
if(inputs.length < 3) {
    console.error("Usage: node pets.js [read | create | update | destroy]");
    process.exit(1);
}

/** Parse the user inputs to determine function to execute ***/
switch (inputs[2]) {
    case "read": {
        fs.readFile(JSONFILE, readData);
        break;
    } case "create": {
        if(inputs.length < 6) {
            console.error('Usage: node pets.js create AGE KIND NAME');
            process.exitCode = 2;
        } else {
            fs.readFile(JSONFILE, writeData);
        }
        break;
    } case "update": {
        if(inputs.length < 7) {
            console.error('Usage: node pets.js update INDEX AGE KIND NAME');
            process.exitCode = 3;
        } else {
            fs.readFile(JSONFILE, updateData);
        }
        break;
    } case "destroy": {
        if(inputs.length < 4) {
            console.error('Usage: node pets.js destroy INDEX');
            process.exitCode = 4;
        } else {
            fs.readFile(JSONFILE, destroyData);
        }
        break;
    } default: {
        console.error("Usage: node pets.js [read | create | update | destroy]");
        process.exitCode = 1;
    }
}

/** Reads the .json file and displays to the user in the console */
async function readData(err, data) {
    try {
        var parsed = JSON.parse(data);
        if(inputs.length === 4) {
            if(inputs[3] >= parsed.length) {
                console.error('pets.js read INVALID INDEX');
                process.exitCode = 5;
                return;
            } else {
                console.log(parsed[inputs[3]])
            }

        } else {
            console.log(parsed);
        }

    }
    catch {
        console.error(err);
    }
}

/** used to create a new item to add to the .json file */
async function writeData(err, data) {
    try {
        var parsed = JSON.parse(data);
        
        var age = parseInt(inputs[3]);
        var kind = inputs[4];
        var name = inputs[5];
        const newPet = {"age": age, "kind": kind, "name": name}
        parsed.push(newPet);
        fs.writeFile(JSONFILE, JSON.stringify(parsed), function(error) {
            if(error) {
                console.error(error);
                process.exitCode = 6;
                return;
            } else {
                console.log(newPet);
            } 
        });

    }
    catch {
        console.error(err);
    }

}

/** updates an item from the .json file based on the provided index **/
async function updateData(err, data) {
    try {
        var parsed = JSON.parse(data);
        var index = inputs[3];
        var age = parseInt(inputs[4]);
        var kind = inputs[5];
        var name = inputs[6];
        var updatedPet = {"age": age, "kind": kind, "name": name};
        if(!(parsed[index])) {
            console.error("pets.js update INVALID INDEX");
            process.exitCode = 5;
            return;
        }
        parsed[index] = updatedPet;
        fs.writeFile(JSONFILE, JSON.stringify(parsed), function(error) {
            if(error) {
                console.error(error);
                process.exitCode = 6;
                return;
            } else {
                console.log(updatedPet);
            } 
        });
    }
    catch {
        console.error(err);
    }

}

/** removes an item from the .json file based on the provided index */
async function destroyData(err, data) {
    try {
        var parsed = JSON.parse(data);
        var index = inputs[3];
        if(!(parsed[index])) {
            console.error("pets.js destroy INVALID INDEX");
            process.exitCode = 5;
            return;
        }
        const deletePet = parsed[index];
        parsed.splice(index, 1);
        fs.writeFile(JSONFILE, JSON.stringify(parsed), function(error) {
            if(error) {
                console.error(error);
            } else {
                console.log(deletePet);
            } 
        });

    }
    catch {
        console.error(err);
    }
}
