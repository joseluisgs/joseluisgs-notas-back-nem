/**
* CONFIGURACIÓN DE SERVIDOR
* Configuración principal de nuestro servidor
*/


// Librerías
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import env from './env';

// Creamos el módulo de configurar. Es una función que recibe Up
exports.setConfig = (app) => {
  // Quitamos la cabecera que indica que esta hecho con express, por seguridad, así nod amos pistas
  app.disable('x-powered-by');

  // Middleware Le indicamos el midlleware morgan a usar logger.
  // Nos dara información de las peticiones y de todo
  if (env.NODE_ENV !== 'test') {
    // Si no estamos en test sacamos los logs
    app.use(logger('dev'));
  }

  // Parseamos todos los peticiones POST y lo que nos llege a JSON
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Indicamos los cors. Por si nos llega una peticion de una URL distintas
  // Nos permite configurar cabeceras y peticiones los que nos llegue
  app.use(cors());

  // Configuramos el sistema de ficheros de subida
  app.use(fileUpload(
    {
      createParentPath: true,
      limits: { fileSize: env.FILE_SIZE * 1024 * 1024 }, // en MB
      useTempFiles: true, // Uso de ficheros temporales
      tempFileDir: '/tmp/', // Usamos un directorio y ficheros temporal y no memoria para el proceso de subida.
      preserveExtension: true, // dejamos la extensión por defecto
      debug: env.DEBUG, // Modo de depuración
    },
  ));

  // Modo historia en Vue/Nuxt SPA Web App
  // Middleware para Vue.js router modo history
};