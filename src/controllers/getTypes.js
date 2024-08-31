const axios = require("axios");
const { Type } = require("../db.js");

const getTypes = async (req, res) => {
  try {
    // Realizo una consulta a la DB utilizando Type.findAll() para obtener todos los types existentes.
    let existingTypes = await Type.findAll();

    // Respondo con un estado 200 y devuelvo los tipos existentes en la respuesta.
    res.status(200).json(existingTypes);
  } catch (error) {
    // En caso de error, respondo con un estado 404 y un mensaje de error.
    res.status(404).json({ error: error.message });
  }
};

module.exports = getTypes;
