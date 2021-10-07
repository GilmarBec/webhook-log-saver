require('dotenv').config();

const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const fs = require('fs');

app.get('/', (req, res) => {
    fs.readdir('tmp/', (err, files) => {
        return res.json(files)
    });
})

app.get('/log/:id', (req, res) => {
    fs.readFile(`tmp/${req.params.id}.log`, (err, data) => {
        if (!data) {
            return res.status(404).json({code: `ID[${req.params.id}] not exists`})
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    })
})

app.all('/add/*', (req, res) => {
    const content = JSON.stringify({
        url: req.url,
        method: req.method,
        headers: req.headers,
        body: req.json()
    });

    fs.appendFile(`tmp/${Math.floor(Date.now() / 1000)}.log`, content, err => {
        if (err) throw err;
        console.log('Saved!');
    });

    return res.json('success')
})

app.all('/create/:id', (req, res) => {
    const content = JSON.stringify({
        url: req.url,
        method: req.method,
        headers: req.headers,
        body: req.json()
    });

    fs.appendFile(`tmp/${req.params.id}.log`, content, err => {
        if (err) throw err;
        console.log('Saved!');
    });

    return res.json('success')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
