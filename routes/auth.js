const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const { validarCamposCheck } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// rutas: tercer parametro son middlewares
router.post('/new', [ 
    check('name', 'El nombre usuario es requerido.').not().isEmpty(),
    check('email', 'El email es requerido con formato correcto').isEmail(),
    check('password', 'La contraseña debe contener entre 5 y 8 caracteres').isLength({ min:5, max: 8 }),
    validarCamposCheck 
], crearUsuario);

router.post('/', [
    check('email', 'El email es requerido con formato correcto').isEmail(),
    check('password', 'La contraseña debe contener entre 5 y 8 caracteres').isLength({ min:5, max: 8 }),
    validarCamposCheck 
], loginUsuario);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;