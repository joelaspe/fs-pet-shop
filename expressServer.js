const fs = require('fs')
const express = require('express')
const path = require('path')

const app = express()

const PORT = 8000;

app.get('/pets', function (req, res) {
    let petsPath = path.join(__dirname, "pets.json")
    fs.readFile(petsPath, "utf-8", function(err, data) {
        if(err) {
            console.error(err.message)
        }
        else {
            let parsed = JSON.parse(data);

            res.json(parsed)
        }
    })
})

app.get('/pets/:id', function (req, res, next) {
    const id = req.params.id
    let petsPath = path.join(__dirname, "pets.json")
    fs.readFile(petsPath, "utf-8", function(err, data) {
        if(err) {
            console.error(err.message)
        }
        else {
            if (!Number(id)) {
                res.type('text/plain');
                next({ status: 400, type: "text/plain", message: 'Please enter a number!' })
            }
            else {
                let parsed = JSON.parse(data);
                if (!parsed[id]) {
                    res.type('text/plain');
                    next({ status: 404, type: "text/plain", message: 'Not Found'})
                }
                else {
                    
                    res.json(parsed[id])
                }

            }
            
        }
    })
})
  
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(404).send('Not Found')
  })
  

app.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`)
})