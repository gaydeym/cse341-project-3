const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Recipes API'
    // description: 'Description'
  },
  // host: 'localhost:3000',
  // schemes: ['http']
  host: 'cse341-project-2-w7d5.onrender.com',
  schemes: ['https']
  // tags: [
  //   {
  //     name: 'API Endpoints'
  //   }
  // ]
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
