const fs = require('fs')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const PORT = 8000;
const JSONFILE = 'pets.json'


app.get('/pets', function (req, res, next) {
    let petsPath = path.join(__dirname, JSONFILE)
    fs.readFile(petsPath, "utf-8", function(err, data) {
        if(err) {
            next({ status: 500, type: 'text/plain', message: 'Internal Server Error', error: err});
        } else {
            let parsed = JSON.parse(data);
            res.json(parsed)    
        }
    });
});

app.get('/pets/:id', function (req, res, next) {
    const id = req.params.id
    let petsPath = path.join(__dirname, JSONFILE)
        fs.readFile(petsPath, "utf-8", function(err, data) {
        if(err) {
            next({ status: 500, type: 'text/plain', message: 'Internal Server Error', error: err});
        } else {
            if (!Number(id)) {
                res.status(400).type('text/plain').send('Bad Request');
            }
            else {
                let parsed = JSON.parse(data);
                if (!parsed[id]) {
                    res.status(404).type('text/plain').send('Not Found')
                }
                else {
                    
                    res.json(parsed[id])
                }
            }
        }
    });        
});

app.post('/pets', function (req, res, next) {
    const newPet = req.body
    let petsPath = path.join(__dirname, JSONFILE)
    fs.readFile(petsPath, "utf-8", function(err, data) {
        if(err) {
            next({ status: 500, type: 'text/plain', message: 'Internal Server Error', error: err});
        }
        else {
            let parsed = JSON.parse(data)
            if(isNaN(parseInt(newPet.age)) || newPet['name'] === undefined || newPet['name'] === '' || newPet['kind'] === undefined || newPet['kind'] === '') {
                res.type("text/plain")
                next({ status: 400, message: 'Bad Request'})
            }
            else {
                parsed.push(newPet);
                fs.writeFile(petsPath, JSON.stringify(parsed), function(err) {
                    if(err) {
                        next({ status: 500, type: 'text/plain', message: 'Internal Server Error', error: err});
                    } else {
                        res.status(200).send(newPet);
                    }
                });
            }
        }
    });
});

app.use((req, res, next) => {
    res.status(404).type('text/plain').send('Not Found');
})

app.use((err, req, res, next) => {
    res.status(err.status).type(err.type).send(err.message);
});

app.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`)
})