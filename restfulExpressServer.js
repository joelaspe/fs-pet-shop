

const express = require('express');
const app = express()
app.use(express.json());

const basicAuth = require('./auth.js');


// Postgres module
const { Pool } = require('pg');
const client = new Pool({
    connectionString: 'postgres://petshopapi:petshopapi@localhost:5432/petshop'
}); 


const PORT = 8000;
const JSONFILE = 'pets.json'


// Authentication middleware before the routes
app.use(basicAuth);

// GET ALL
app.get('/pets', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM pets');
        res.json(result.rows);
    } catch {
        console.error(error.message);
        res.status(500).type('text/plain').send('Internal Server Error');
        console.error('Internal Server Error');
        //next({ status: 500, type: 'text/plain', message: 'Internal Server Error', error: err});
    }
});
// GET ONE
app.get('/pets/:id', async (req, res) => {
    const id = req.params.id
    if (isNaN(parseInt(id))) {
        res.status(400).type('text/plain').send('Bad Request');
    }
    else {
       try {
            const result = await client.query('SELECT name, age, kind FROM pets WHERE id = $1', [id]);
            // check if result is empty, if it is return 404 else give back the data
            if(result.rows.length < 1){
                res.status(404).type('text/plain').send('Not Found')
            } else {
                console.log(result.rows);
                res.json(result.rows);
            }
            
        } catch {
            console.error(error.message);
            res.status(500).type('text/plain').send('Internal Server Error');
            console.error('Internal Server Error');
        }
       
    }
});
// CREATE ONE
app.post('/pets', async (req, res) => {
    const newPet = req.body;
    console.log(newPet);
    if(isNaN(parseInt(newPet.age)) || newPet['name'] === undefined || newPet['name'] === '' || newPet['kind'] === undefined || newPet['kind'] === '') {
        res.type("text/plain").status(400).send('Bad Request');
        
    } else {
        try {
            const result = await client.query('INSERT INTO pets (name, age, kind) VALUES ($1, $2, $3)', [newPet.name, newPet.age, newPet.kind]);
            console.log(result);
            res.status(200).send(newPet);
        } catch (error) {
            console.error(error.message);
            res.status(500).type('text/plain').send('Internal Server Error');
            console.error('Internal Server Error');
        }
    }
});
// DELETE ONE
app.delete('/pets/:id', async (req, res) => {
    const id = req.params.id
    if (isNaN(parseInt(id))) {
        res.status(400).type('text/plain').send('Bad Request');
    }
    else {
        try {
            const deletedPet = await client.query('SELECT name, age, kind FROM pets WHERE id = $1', [id]);
            const result = await client.query('DELETE FROM pets WHERE id = $1', [id]);
            if(result.rowCount === 0){
                res.status(404).type('text/plain').send('Not Found')
            } else {
                res.status(200).send(deletedPet.rows[0]);
            }
            
        } catch {
            console.error(error.message);
            res.status(500).type('text/plain').send('Internal Server Error');
            console.error('Internal Server Error');
        }
       
    }
});
// UPDATE ONE
app.patch('/pets/:id', async (req, res) => {
    const updatePetInfo = req.body;
    const id = req.params.id
    if (isNaN(parseInt(id))) {
        res.status(400).type('text/plain').send('Bad Request');
    }
    const keyList = Object.keys(updatePetInfo);
    let SQLString = 'UPDATE pets SET '; // will build on this later
    let inputs = '';
    for(let i = 0; i < keyList.length; i++) {
        // filter the inputted data. If the key is anything other than 'age' add single quotes ' ' around the data.
        if(updatePetInfo[keyList[i]] === undefined || updatePetInfo[keyList[i]] === '') {
            res.status(400).type('text/plain').send('Bad Request');
            return;
        }
        if(keyList[i] !== 'age'){
            updatePetInfo[keyList[i]] = '\'' + updatePetInfo[keyList[i]] + '\''
        } else {
            if (isNaN(parseInt(updatePetInfo[keyList[i]]))) {
                res.status(400).type('text/plain').send('Bad Request');
                return;
            }
        }
        // now build onto the SQL string adding commas if not last
        if(i < keyList.length-1){
            inputs += keyList[i] + ' = ' + updatePetInfo[keyList[i]] + ', ';
        } else { //last item, no comma required
            inputs += keyList[i] + ' = ' + updatePetInfo[keyList[i]];
        }
    }
    SQLString += inputs;
    SQLString += ' WHERE id = ' + '\'' + id + '\'';
    try {
        const result = await client.query(SQLString);
        if(result.rowCount === 0){
            res.status(404).type('text/plain').send('Not Found')
        } else {
            
            const updatedRecord = await client.query('SELECT name, age, kind FROM pets WHERE id = $1', [id]);    
            res.status(200).send(updatedRecord.rows[0]); 
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).type('text/plain').send('Internal Server Error');
        console.error('Internal Server Error'); 
    }
});

app.use((req, res, next) => {
    res.status(404).type('text/plain').send('Not Found');
})

app.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`)
})