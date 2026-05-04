import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('ok'));
app.listen(3003, () => console.log('Test server on 3003'));
