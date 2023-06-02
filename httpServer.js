'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');
const PORT = 8000;

const server = http.createServer(function(req, res) {
    const route = req.url.slice(0, 5); //get the first 5 characters of the url, with the goal of checking for /pets, if the string is anything other than that, 404 not found
    const index = req.url.slice(6); // if an additional route on top of /pets i.e. /pets/0 or /pets/1, get the number that is passed in , and make it our index. Checking for type Number is done inside the GET if statement
    if(req.method === 'GET' && route === '/pets') {
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
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(parsed[parseInt(index)]));
                }
                
            }
        });
    } else if(req.method === 'POST' && req.url === '/pets') {
        const petsPath = path.join(__dirname, 'pets.json');
        fs.readFile(petsPath, 'utf-8', function(err, data) {
            if(err) {
                res.statusCode = 500;
                console.error(err.message);
            } else {
                const parsed = JSON.parse(data);
                //read the buffer from the HTTP PUT request body
                let body = [];
                let parsedBody;
                req.on('data', (chunk) => {
                    body.push(chunk);
                } ).on('end', () => {
                    parsedBody = JSON.parse(body);
                    
                    // check the parsedBody to make sure it meets minimum requirements of age=integer and nothing else empty
    
              
                    if(isNaN(parseInt(parsedBody.age)) || !parsedBody['name'] || !parsedBody['kind'] || parsedBody['name'] === undefined || parsedBody['kind'] === undefined) {
                        res.statusCode = 400;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('Bad Request'); 
                    } else {
                        parsed.push(parsedBody);
                        fs.writeFile(petsPath, JSON.stringify(parsed), function(err) {
                            if(err) {
                                console.error(err);
                            } else {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify(parsedBody));
                            }
                        });
                    }
                    
                });
                
            } 
        });
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    } 
});

//create a listener
server.listen(PORT, function() {
    console.log('listening on port', PORT);
})


