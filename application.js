
var express = require("express"),
    app = express(),
    methodOverride = require("method-override");

const port = 3000;
const host = "localhost";
const logger = require('./utils/logger');
const swaggerUi = require("swagger-ui-express"),
      swaggerDocument = require("./swagger.json");

const routes = require("./routes/mainRoutes");

app.use(methodOverride());

app.use('/api/products/', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Capture 500 errors
app.use((err,req,res,next) => {
  res.status(500).send('internal server error!');
     logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  });
  
  // Capture 404 erors
app.use((req,res,next) => {
  res.status(404).send("PAGE NOT FOUND");
  logger.error(`400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
});

app.listen(port, () => {
  console.log("Server started...");
  logger.info(`Server started and running on http://${host}:${port}`)
})
