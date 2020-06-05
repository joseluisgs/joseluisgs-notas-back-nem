/**
 * MODELO EN BASE AL ESQUEMA DE NOTAS
 */

import mongoose from 'mongoose';
import db from '../database';

const { Schema } = mongoose;

// Creación del esquema
const NotaSchema = new Schema(
  {
    titulo: { type: String, required: [true, 'Título de la nota obligatorio'] },
    descripcion: { type: String },
    usuarioId: { type: String },
    fecha: { type: Date, default: Date.now },
    activo: { type: Boolean, default: true },
    fichero: { type: String },
  },
  // El método estriccto nos dice si aceptamos o no un documento incpleto. Lo ponemos así porque no vamos a meter el id y da un poco de flexibilidad
  { strict: false },
  // Le añadimos una huella de tiempo
  { timestamps: true },
);

// Métodos estaticos que nos servirán para métodos rápidos

// Devuelve el ID
NotaSchema.statics.getById = function getById(id) {
  return this.findOne({ _id: id })
    .lean() // Con Lean le estamos diciendo que aprenda y la memorice porque la usaremos mucho
    .exec(); // Que lo ejecute
};

// Devuelve una lista de todos
NotaSchema.statics.getAll = function getAll(pageOptions, searchOptions) {
  // Si no quieres buscar por nada, deja la función fin vacía, sin where ni equals
  return this.find()
    .where(searchOptions.search_field)
    .equals({ $regex: searchOptions.search_content, $options: 'i' })
    .skip(pageOptions.page * pageOptions.limit) // si no quieres filtrar o paginar no pongas skip o limit
    .limit(pageOptions.limit)
    .sort({ title: searchOptions.search_order })
    .exec();
};

// Sobre escribimos el método JSON, esto es porque si hacemos una vista necesitamos id y no _id que es como lo guarda Mongo
/* NotaSchema.method('toJSON', function toJSON() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
}); */

// Creamos un modelo del esquema
NotaSchema.RecipeModel = () => db.connection().model('Nota', NotaSchema);
const Nota = NotaSchema.RecipeModel;

export default Nota;