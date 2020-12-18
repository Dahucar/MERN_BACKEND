const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConecction } = require('./database/config');

// Crear servidor de Express
const app = express();

// conectando la BBDD
dbConecction();

app.use( cors() );

// middlewares
// Directorio publico.
app.use( express.static('public') );

//lectura y parseo del body
app.use( express.json() );

//rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events.routes'));

// Escuchar peticiones
app.listen( process.env.PORT , () => {
    console.log('Corriendo en el puerto: '+ process.env.PORT);
});