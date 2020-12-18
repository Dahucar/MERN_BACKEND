const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCamposCheck = (req, res = response, next) => {

    const errors = validationResult( req );

    if ( !errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.mapped() });
    }

    next();
}

module.exports = {
    validarCamposCheck
}