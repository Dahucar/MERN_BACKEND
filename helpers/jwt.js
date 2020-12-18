const jwt = require('jsonwebtoken');

const generarJWT = ( uid, name ) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, name };
        jwt.sign( payload, process.env.SECRET_JWT_SED, { expiresIn: '2h' }, ( err, token ) => {
            // Si hay errores enviare la respecta en el reject de la promesa.
            if ( err ) {
                console.log( err );
                reject('No fue posible generar el token.');
            }
            resolve( token );
        });
    });
}

module.exports = {
    generarJWT
}