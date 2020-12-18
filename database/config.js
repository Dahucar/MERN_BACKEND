const mongoose = require('mongoose');

const dbConecction = async () => {
    try {
        await mongoose.connect( process.env.DB_CNN , {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        }); 

        console.log('DB conectada.');
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar con la BBDD');
    }
}

module.exports = {
    dbConecction
}