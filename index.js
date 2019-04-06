const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res, next) => {
    next();
});

app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))