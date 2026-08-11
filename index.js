const express = require('express');
const app = express();
const swaggerDocument = require('./src/docs/swagger');

//routes
const usersRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/authroutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes')

//middleware
const middlewareLog = require('./src/middleware/logs');
const { notFoundHandler, errorHandler } = require('./src/middleware/errorHandler');

//essentials
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const serverless = require('serverless-http');
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(middlewareLog.logRequest);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api-docs.json', (req, res) => {
    res.json(swaggerDocument);
});

app.get('/api-docs', (req, res) => {
    res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Attendance Backend API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; }
      #swagger-ui { min-height: 100%; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js" crossorigin></script>
    <script>
      window.onload = function () {
        window.ui = SwaggerUIBundle({
          url: '/api-docs.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: 'BaseLayout'
        });
      };
    </script>
  </body>
</html>`);
});

app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/attendance', attendanceRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

if(process.env.NODE_ENV !== 'production') {
    const PORT = process.env.DB_PORT;
    app.listen(PORT, () => {
        console.log(`app listening from port ${PORT}`);
    });
};

module.exports = app;
// module.exports.handler = serverless(app);    
