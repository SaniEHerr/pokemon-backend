const axios = require("axios");
const { Pokemon, Type } = require("../db.js");
// const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

const getPokemonName = async (req, res) => {
  const { name } = req.query;
  const searchName = name.toLowerCase();

  try {
    // Buscar en la base de datos
    const pokemonDB = await Pokemon.findOne({
      where: {
        name: {
          // [Op.iLike]: `%${searchName}%`, // Aca si lo que mando en la ruta contiene aunque sea un poco de lo que pongo en searchname, lo trae
          [Op.iLike]: searchName, // Si pongo el nombre incompleto, no lo busca. Tambien  es sensible a mayus y minus
        },
      },
      include: {
        model: Type,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });

    // Verificar si el Pokémon se encuentra en la base de datos
    if (pokemonDB) {
      const types = pokemonDB.Types.map((type) => type.name);
      const pokemon = {
        id: pokemonDB.id,
        name: pokemonDB.name,
        image: pokemonDB.image,
        types: types,
        hp: pokemonDB.hp,
        attack: pokemonDB.attack,
        defense: pokemonDB.defense,
        speed: pokemonDB.speed,
        weight: pokemonDB.weight,
        height: pokemonDB.height,
      };

      return res.status(200).json(pokemon);
    } else {
      // Buscar en la API si el Pokémon no está en la base de datos
      const pokeApi = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${searchName}`
      );

      const pokeApiData = pokeApi.data;

      if (pokeApiData) {
        const pokemon = {
          id: pokeApiData.id,
          name: pokeApiData.forms[0].name,
          image: pokeApiData.sprites.other.home.front_default,
          types: pokeApiData.types.map((elem) => elem.type.name),
          hp: pokeApiData.stats[0].base_stat,
          attack: pokeApiData.stats[1].base_stat,
          defense: pokeApiData.stats[2].base_stat,
          speed: pokeApiData.stats[5].base_stat,
          weight: pokeApiData.weight,
          height: pokeApiData.height,
        };

        return res.status(200).json(pokemon);
      } else {
        res.status(404).json({ message: "Pokemon not found" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getPokemonName;
