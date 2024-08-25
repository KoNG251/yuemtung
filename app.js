const express = require('express');
const app = express();
const port = 8080;

const connectDB = require('./config/db')


const { readdirSync } = require('fs')
app.use(express.json());


readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)))


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
