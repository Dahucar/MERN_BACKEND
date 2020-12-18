const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {
    try {
        const { email, password } = req.body;
        let usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            res.status(400).json({
                ok: true,
                msg: 'El correo ingresado ya esta uso por otro usuario.',
            });
        }

        usuario = new Usuario( req.body );

        // encriptacion de contraseña
        const saltos = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, saltos );

        await usuario.save();

        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            msg: 'Te acabas de registrar correctamente.',
            token,
            user: usuario
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error al procesar su solicitud.'
        });
    }
}

const loginUsuario = async (req, res = response) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'No hay usuarios con el correo ingresado.',
            });
        }

        const match = bcrypt.compareSync(password, usuario.password);
        if( !match ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecta.'
            });
        }

        // generando un JWT con los datos
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            msg: 'login in.',
            token,
            usuario
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error durante el proceso de login.'
        });
    }
}

const revalidarToken = async (req, res = response) => {
    const { uid, name} = req;
    const nuevoToken = await generarJWT( uid, name );
    res.json({
        ok: true,
        msg: 'renew',
        nuevoToken
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}