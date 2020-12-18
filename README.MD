# Creacion de un Backend con Node y Express.
> npm i express

> npm i moongose

> npm i dotenv

user: mern_mongo_user
password: 2RUq7oKY7TDOqzfJ

## Configuracion inicial.
- dentro del directorio del proyecto debere usar el comando 
    > npm init 

    con el cual se creara el archivo package.json, donde estará la configuracion inicial de mi servidor. Por ello una vez creado instalare algunas paquetes como **moongose** con el cual podre trabajar de formas mucho mas optima en local e igualmente el **Framework Express** con el cual el desarrollo es mucho mas agil.

## Creando el servidor.
- una vez definida la estructura del proyecto, voy a crear en mi index una referencia a express para poder crear el servidor.

    ````
    const express = require('express');
    ````

    Esta constante la debere asignar como funcion a una nueva varibla para acceder a los metodos de creacion de rutas, aplicacion de middlewares y otros. 
    **EN DEFINITIBA LA SIGUIENTE INSTRUCCION CREA EL SERVIDOR.**
    ````
    const app = express();
    ````

    Con esta nueva constante podre poner a "escuchar" el servidor en un puerto a las diferentes peticiones que sean realizadas. De forma que este sea accesible en mi servidor.
    
    Pero cabe la posibilidad de que el puerto seleccionado no este disponible y se tenga que obtener el valor desde el archivo **.env**, por ello mediante la instalacion de un paquete extra, (dotenv) voy a requerir el mismo y sus configuraciones dentro del servidor. 
    ````
    require('dotenv').config();
    ````
    Asi podre acceder a los diferentes procesos en ejeción, pero en particular a la propiedad **PORT** definida en el archivo .env

    De manera que la escucha del puerto se vería de la siguiente forma.


    ````
    app.listen( proces.env.PORT , () => {
        console.log('servidor ejecutandose.');
    });
    ````

    De esta forma ya se podria acceder desde una navegador y obtener una respuesta del servidor.

## Definir las rutas del servidor (endPoints)

- Para llevar una mejor gestión de tantas rutas que pueden ser creadas, se trabajaran dentro de un directorio en particular del servidor, en donde lo primero que debere hacer es.
- Requerir express nuevamente en este nuevo archivo. **IMPORTANTE** realizar un nuevo require(); cuando talvez dentro de otros directorios ya se ha realizado no quiere decir que de alguna forma afecte a la carga en momoria o algo asi, ya que cuando ya sea ha requerio una libreia o paquete antes simplemente se trae el que este en memoria, NO se crea un nuevo.
- Para realizar la creacion de las rutas y sus defirentes metodos HTTP's debere obtener desde el express el router y mediante el crear las rutas. Como bien se muestra acontinuación.

    ````
    const express = require('express');
    const router = express.Router();
    ````
- Luego mediante la constante router voy a crear mis rutas, donde estas tendran el path y los parametros REQUEST y RESPONSE. 

    ````
    router.get('/', (req, res) => {
        res.json({ok: true});
    });
    ````

- Ahora para llevar las rutas definidas en este archivo a mi index tendre que exportar el contedio de mi router que es quien almacena la defincion de todas las rutas creadas. Para ello usare la exportacion de Node.

    ````
    module.exports = router;
    ````
- Y ahora dentro del index voy a requerir este archivo. donde mediante el middleware **use** voy a definir un path para las rutas creadas y voy a requerir las mimas.
    ````
    app.use('/api/auth', require('./routes/auth'));
    ````
## Definir el contenidos de las rutas (en archivos separados.)
- Para esto, dentro del proyecto, espesificamente dentro de la carpeta "controllers" creare difentes archivos que me ayuden con la orgnizacion de las acciones de mis rutas.
- Por ejemplo. Donde originalmente teniamos la definicion de la ruta con el router y la logica en un callback, será reemplazado por la importacion de esa misma accion desde el contenido de controllers. 
- De esa forma dentro de las rutas en /routers. voy a tener los iguiente.

    ````
    router.get('/rutademo', logicaDeLaRuta );
    ````

    Donde esa logia, será una funcion que esta siendo exportada desde otro archivo, para favorecer a una mejor organizacion del codigo. 

- Dichos archivos tendran la importacion de express para tener las ayudas del menu intelicens del editor, pero añadirla no seria necesario.
    ````
    const { response } = require('express');
    ````

    Y la logica de las rutas finalmente se veria de la siguiente forma.
    ````
    const crearUsuario = (req, res = response) => {
        res.json({
            ok: true,
            msg: 'login'
        });
    }
    ````
    E igualmente tendra que ser exportado. 
    
    ````
    module.exports = {
        crearUsuario,
        loginUsuario,
        revalidarToken
    }
    ````
## Obtener los datos del contexto REQUEST.
- Para poder obtener los datos que son enviados desde un formulario por ejemplo, es necesario establecer un nuevo middleware por el cual todas las peticiones van a pasar. de la siguiente forma.
    ````
    app.use( express.json() );
    ````
    Asi, podremos obtener los datos que vengan en un formulario con el formato JSON. Igualmente desde la logica de mis rutas podre acceder a los diferentes campos que sean enviados.
    ````
    const { email, password } = req.body;
    ````
## Crear conexión con MongoDB a travez de Mongoose.

- primero que nada. debere acceder a la web de mongoAtlas en donde voy a acceder con mi cuenta, desde alli debere conectar a la base de datos, en este caso mediante mongoCompass para trabajar con al interfas grafica de excritorio. igualmente debere hacer la configuracion de usuario, una vez realizado esto (o antes) tendre que crear un cluster.
- en la conexion mediante mongoCompass me daran una cadena de conexion para conectarme a mi base de datos, la cual luce de la siguiente forma.
    ````
    mongodb+srv://<username>:<password>@cluster0.qspyc.mongodb.net/test
    ````

    Esta cadena de conexión la pegarpe dentro del archivo .env para acceder a ella de forma mucho mas facil.
    Ahora que ya puedo establecer la conexión con mi base de datos mongoDB voy a realizar la configiguracion para poder realizas las inserciones correspondientes.

    Para ello en un archivo independiente añadire lo siguiente.
    
    **Primero:** voy a crear una constante donde almacenar el contenido de **mongoose** el cual me permitirá crear modelos, establecer las reglas de conexion a la base de datos, entre otros. Entonces una vez importado mongoose.

    Voy a crear una funcion asincrona (ya que la funcion que establece la conexion a la base de datos retorna una promesa) donde mediante mongoose.connect voy a establecer mi cadena de conexion (**LA CUAL SE OBTIENE DESDE EL ARCHIVO .ENV**) y algunos parametros necesarios para la conexion. por ende una vez esta funcion se resuelva mandare un mensaje a consola para saber lo sucedido.

    Y claro como dentro de esta funcion puede ocurrir cualquier clase de error debere envolver el contenido dentro de un try catch para saber lo sucedido.
    ````
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
    ````

    Finalmente se exporta la funcion para poder usarla dentro del index. Y asi tener mis archivos lo mas limpios posibles. Ahora solo hace falta llamar esta funcion dentro del index. Importandola claro.

    Esta funcion podria ir despues de la creacion de la constante app.

    ````
    dbConecction();
    ````

## Creacionde modelos mediante Mongoose.
- Para ello, lo primero será crear modelos, estos modelos representaran a los registro que me intereza guardar. En este caso estaran dentro de /models

    Por ende dentro del modelo creado debere añadir la importacion de Schema y model desde mongoose, donde con Schema voy a dar la estructura a mi modelo ya sea los diferentes atributos que este tendra, el tipado de los mismos, entre otros. Y model para realizar la exportacion de un modelo y que cuando se llame este modelo para realizar el guadado de datos por ejemplo se creen sus registros automaticamente (Osea: que si yo créo un modelo llamado **CardSchema** mongoose automaticamente creara la agrupacion de registros llamada **cards**)

    ````
    const { Schema, model } = require('mongoose');

    const UsuarioSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    });

    module.exports = model('Usuario', UsuarioSchema);
    ````

    Entonces como se ve en el codigo anterior el modelo que estoy exportando se llamara Usuarios pero mongoose hará la capitalicación del mismo al guardar los datos.

## Guardar registros en la base de datos 
- Primero que nada debere importar los modelos que se hayan creado, en este caso el UsuarioSchema, la importacion de estos modelos debera hacerse donde este la logica de las rutas definidas, en este caso dentro del controller. como se muestra a continuación.
    
    ````
    const Usuario = require('../models/Usuario');
    ````

    Por ende dentro de alguna de las funciones podre crear diferentes objetos los cuales tendran acceso a metodos para guardar, buscar por id o por filtros personalizados. Esto gracias a que la constente manejada en el modelo corresponde a un Schema de mongoose.

    Y claro las funciones de busquedes o cualquier otras correspondientes a mongoose retornan promesas por ende mediante un aweit esperare a que estas se resuelvan antes de continuar con la ejecucion del codigo. En este caso se esta usando el metodo **findOne** al cual se puedo pasar un objeto de JS con las diferentes propiedades que deseo filtrar. Y en caso de no tener resultado obtendre NULL y si lo encuentra dentre un objeto con todas las propiedades del registro obtenido.

    ````
    let usuario = await Usuario.findOne({ email });
    ````

    Ahora para realizar el guardado de los datos creare un nuevo objeto de mi modelo creado. esto para acceder a los diferentes metodos como el save()
    ````
    usuario = new Usuario( req.body );
    await usuario.save();
    ````
    En el caso anterior al nuevo objeto le estamos asignando todas las propiedes obtenidas desde el request. Para finalmente realizar el guardado del mismo.


    ## Crear tokens mediante JWT.
    

