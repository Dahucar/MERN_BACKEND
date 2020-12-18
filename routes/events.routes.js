// TODO: Validar todas las rutas con JWT
// TODO: Crear logica de rutas en /controllers
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/eventsController');
const { isDate } = require('../helpers/isDate');
const { validarCamposCheck } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// TODO: Aplicar un middleware a todas las rutas de este archivo
router.use( validarJWT ); // asi ya no debe añadirse en cada ruta
router.get('/', getEventos );

router.post('/', [
    check('title', 'El titulo es obligatorio.').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria.').custom( isDate ),
    check('end', 'La fecha de inicio es obligatoria.').custom( isDate ),
    validarCamposCheck
], crearEvento );

router.put('/:id',[
    check('title', 'El titulo es obligatorio.').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria.').custom( isDate ),
    check('end', 'La fecha de inicio es obligatoria.').custom( isDate ),
    validarCamposCheck
], actualizarEvento );
router.delete('/:id', eliminarEvento );


module.exports = router;

