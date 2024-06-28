// import local or third party modules
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const router = require('./router');
const moviesdB = require('./database/movies');
const usersdB = require('./database/users');
const morgan = require('morgan');
const swanggerUI = require('swagger-ui-express');
const apiDocumentation = require('./openapi.json');


const app = express();


const PORT = process.env.PORT || 3000;
dotenv.config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(morgan('common'));
app.use('/API',router);

// SWAGGER
app.use('/api-docs',swanggerUI.serve,swanggerUI.setup(apiDocumentation));



app.listen(PORT, () => {
    console.log(`server is running in localhost port : ${PORT}`);
    moviesdB.sync().then(() => {
        console.log('Success connected to database and table movies');
    }) 
    usersdB.sync().then(() => {
        console.log('Success connected to database and table users');
    }) 
})
