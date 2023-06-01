'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');
const PORT = 8000;

const server = http.createServer(function(req, res) {
    const index = req.url.slice(6);
    if(req.method === 'GET' && req.url.includes('/pets')) {
        const petsPath = path.join(__dirname, 'pets.json');
        fs.readFile(petsPath, 'utf-8', function(err, data) {
            if(err) {
                res.statusCode = 500;
                console.error(err.message);
            } else {
                const parsed = JSON.parse(data);
                // users enters /pets as the route
                if(index === '') {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(parsed));
                }
                // user enters something after /pets/index but index is out of bounds
                else if(!parsed[parseInt(index)]) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Not Found');
                    //user entered a valid index /pets/index, return only the data at that index
                } else {
                    console.log("Made it to first line of else");
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(parsed[parseInt(index)]));
                }
                
            }
        })
    } 
    // other routes
});

//create a listener
server.listen(PORT, function() {
    console.log('listening on port', PORT);
})


