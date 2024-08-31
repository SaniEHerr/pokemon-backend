const axios = require("axios");
const { Type } = require("../db.js");

const initialTypes = async () => {
  // Me fijo si la DB de Type esta llena
  const typeDB = await Type.findAll();

  // Si esta vacia, llamo a la api y guardo en DB
  if (typeDB.length === 0) {
    const pokeApi = await axios.get("https://pokeapi.co/api/v2/type");
    // Extraigo la propiedad results de los datos de respuesta obtenidos de la API.
    // Creo un nuevo array llamado "newTypes" utilizando map() en el array results. En cada iteración, se crea un objeto con la propiedad name establecida en el nombre del type correspondiente.
    const newTypes = pokeApi.data.results.map((type) => {
      return { name: type.name };
    });
    // Utilizo Type.bulkCreate(newTypes) para crear múltiples registros de tipo en la DB de una sola vez utilizando los datos de "newTypes". Que por lo que investigue, el "bulkCreate", es mas eficiente que crear cada tipo por separado.
    await Type.bulkCreate(newTypes);
  }
};

module.exports = initialTypes;
