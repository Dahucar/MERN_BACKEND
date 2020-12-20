const mongoose = require('mongoose');

const dbConecction = async () => {
    try {
        await mongoose.connect( process.env.DB_CNN , {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        }).then(() => {
            console.log('MongoDB > ONLINE <') ;
        })
        .catch(( error ) => {
            console.log('MongoDB > OFFLINE <') ;
            console.log('------- Decription Error ------- ') ;
            console.error(error);
            console.log('------- Decription Error ------- ') ;
        }); 
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar con la BBDD');
    }
}

module.exports = {
    dbConecction
}