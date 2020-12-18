const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
    // x-token: headers
    const token = req.header('x-token');
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No se ha enviado el token.'
        });
    }

    // verificar el token capturado
    try {
        // obtiene todos los datos añadidos durante la creacion del token.
        const { name, uid } = jwt.verify( token, process.env.SECRET_JWT_SED );
        // añadir datos obtenidos a request. para que esten disponibles en el controlador de rutas
        req.name = name;
        req.uid = uid;
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido.'
        });
    }

    next();
}

module.exports = {
    validarJWT
}