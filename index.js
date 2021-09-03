const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors')

const { MONGODB } = require("./config.js");
const apiRoutes = require("./api-routes");

const app = express();
const PORT = process.env.PORT || 5000;

// configure to handle post requests
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(cors({credentials: true, origin: true}))

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log('Mongo connected!');
    return app.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`App listening at ${PORT}`);
  });

app.use('/api', apiRoutes);

app.get('/', async (req, res) => {
    res.send('Hello!')
});

