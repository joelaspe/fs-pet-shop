#! /usr/bin/env node

const fs = require('fs')

const jsonFile = './pets.json';
const inputs = process.argv;

if(inputs.length < 3) {
    console.error("Usage: node pets.js [read | create | update | destroy]");
    return -1;
}


var data;
if(inputs[2] === 'read') {
    data = fs.readFile(jsonFile, readData);
}

if(inputs[2] === 'create') {
    if(inputs.length < 6) {
        console.error('Usage: node pets.js create AGE KIND NAME');
        return -3;
    }
    data = fs.readFile(jsonFile, writeData);
}

if(inputs[2] === 'update') {
    if(inputs.length < 7) {
        console.error('Usage: node pets.js update INDEX AGE KIND NAME');
        return -4;
    }
    data = fs.readFile(jsonFile, updateData);
}

if(inputs[2] === 'destroy') {
    if(inputs.length < 4) {
        console.error('Usage: node pets.js destroy INDEX');
        return -5;
    }
    data = fs.readFile(jsonFile, destroyData);
}

async function destroyData(err, data) {
    var parsed;
    try {
        parsed = JSON.parse(data);
        var index = inputs[3];
        if(!(parsed[index])) {
            console.error("Usage: node pets.js update INVALID INDEX");
        }
        const deletePet = parsed[index];
        parsed.splice(index, 1);
        const toJSON = JSON.stringify(parsed);
        fs.writeFile(jsonFile, toJSON, function(error) {
            if(error) {
                console.error(error);
            } else {
                console.log(deletePet);
            } 
        })

    }
    catch {
        console.error(err);
    }

}

async function updateData(err, data) {
    var parsed;
    try {
        parsed = JSON.parse(data);
        var index = inputs[3];
        var age = parseInt(inputs[4]);
        var kind = inputs[5];
        var name = inputs[6];
        var updatedPet = {"age": age, "kind": kind, "name": name};
        if(!(parsed[index])) {
            console.error("Usage: node pets.js update INVALID INDEX");
        }
        parsed[index] = updatedPet;
        const toJSON = JSON.stringify(parsed);
        fs.writeFile(jsonFile, toJSON, function(error) {
            if(error) {
                console.error(error);
            } else {
                console.log(updatedPet);
            } 
        })

    }
    catch {
        console.error(err);
    }

}

async function writeData(err, data) {
    var parsed;
    try {
        parsed = JSON.parse(data);
        
        var age = parseInt(inputs[3]);
        var kind = inputs[4];
        var name = inputs[5];
        const newPet = {"age": age, "kind": kind, "name": name}
        parsed.push(newPet);
        const toJSON = JSON.stringify(parsed);
        fs.writeFile(jsonFile, toJSON, function(error) {
            if(error) {
                console.error(error);
            } else {
                console.log(newPet);
            } 
        })

    }
    catch {
        console.error(err);
    }

}

async function readData(err, data) {
    var parsed;
    try {
         
        parsed = JSON.parse(data);
        if(inputs.length === 4) {
            if(inputs[3] >= parsed.length) {
                console.error('Usage: node pets.js read INDEX');
                return -2;
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



