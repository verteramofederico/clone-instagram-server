const express = require('express');

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.send('todo ok')
})

app.listen(process.env.Port || 3333)