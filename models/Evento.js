const { Schema, model } = require('mongoose');

const EventoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    // Creara una realacion con los registros de usuario
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

// Esta modificación afecta los datos cuando son mostrador, No en la Base de datos.
EventoSchema.method('toJSON', function(){
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Evento', EventoSchema);