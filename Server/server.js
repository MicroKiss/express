const express = require('express');
const app = express();
const cors = require('cors')
const userRoute = require('./routes/user');
const transactionRoute = require('./routes/transaction');
const {Authenticate} = require('./utility/authorization');
const port = 3000

function logger(req, res, next)  {
	console.log('Request:', req.method, req.url)
	console.log('Time: %d', Date.now());
	next();
}

app.use(logger);
app.use(cors())
app.use(express.json());
app.use(Authenticate);

app.use('/transaction', transactionRoute);
app.use('/user', userRoute);


app.get('/', (req, res) => {
  res.json('Got a GET request');
})


app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})