const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors')
require("dotenv").config();
const MONGODB = process.env.MONGODB;
const apiRoutes = require("./api-routes");

const app = express();

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
    return app.listen({ port: process.env.PORT || 5000 });
  })
  .then((res) => {
    console.log(`App listening at ${process.env.PORT}`);
  });

app.use('/api', apiRoutes);

const path = require("path");
app.use(express.static(path.resolve(__dirname, './client/build')))
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.get('/', async (req, res) => {
    res.send('Hello!')
});

