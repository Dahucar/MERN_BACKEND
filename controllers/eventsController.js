const { response } = require('express');
const Evento = require('../models/Evento')

const getEventos = async ( req, res = response ) => {
    const { uid } = req; 
    const eventos = await Evento.find({ user: uid }).populate('user', 'name');
    res.status(200).json({
        ok: true,
        eventos
    });
}

const crearEvento = async ( req, res = response ) => {
    // crear un evento
    const evento = new Evento( req.body );
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        return res.status(201).json({
            ok:true,
            eventoGuardado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error durante el guardado del evento.'
        });
    }
}

const actualizarEvento = async ( req, res = response ) => {
    const eventoId = req.params.id;
    try {
        const evento = await Evento.findById( eventoId );
        if ( !evento ) {
            return res.status(400).json({
                ok: false,
                msg: 'Evento no existe.'
            });
        }

        if ( evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Usted no posee provilegios para alterar este registro.'
            });
        }

        // por defecto regressa el documento antiguo.
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, {
            ...req.body,
            user: req.uid
        }, { new: true});

        return res.status(201).json({
            ok: true,
            msg: 'Evento actualizado.',
            eventoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar los datos.'
        });
    }
}

const eliminarEvento = async ( req, res = response ) => {
    const { uid } = req;
    const eventoId = req.params.id;
    try {
        // buscar el evento
        const evento = await Evento.findById( eventoId );
        if ( !evento ) {
            return res.status(400).json({
                ok: false,
                msg: 'El evento no existe.'
            });
        }
        // verificar su autor
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'Usted no tiene acceso al evento espesificado.'
            });
        }
        //eliminar
        Evento.findByIdAndDelete( eventoId, ( err, eventoBorrado ) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error inesperado, no fue posible eliminar el evento.'
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    eventoBorrado
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error durante el elimado de registro.'
        });
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}