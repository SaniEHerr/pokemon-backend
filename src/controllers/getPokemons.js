const axios = require("axios");
const { Pokemon, Type } = require("../db.js");

const getPokemons = async (req, res) => {
  try {
    const pokeApi = await axios.get(
      // "https://pokeapi.co/api/v2/pokemon?limit=12"
      "https://pokeapi.co/api/v2/pokemon?limit=151"
      // "https://pokeapi.co/api/v2/pokemon?limit=600"
    );
    const pokeApiData = pokeApi.data.results;

    if (!pokeApiData) throw new Error("URL malito");

    // Utilizo map() para iterar sobre cada objeto de pokeApiData (cada objeto representa un Pokenon). Para cada objeto, realizo una solicitud HTTP a la URL pokemon.url para obtener informacion detallada de ese Pokemon en particular.
    const pokemonDetailsPromises = pokeApiData.map(async (pokemon) => {
      const pokemonResponse = await axios.get(pokemon.url);
      const pokemonData = pokemonResponse.data;
      return {
        id: pokemonData.id,
        name: pokemonData.name,
        image: pokemonData.sprites.front_default,
        // image: pokemonData.sprites.other.home.front_default,
        // image: pokemonData.sprites.versions['generation-iii']['firered-leafgreen'].front_default,
        types: pokemonData.types.map((type) => type.type.name),
        hp: pokemonData.stats.find((stat) => stat.stat.name === "hp").base_stat,
        attack: pokemonData.stats.find((stat) => stat.stat.name === "attack")
          .base_stat,
        defense: pokemonData.stats.find((stat) => stat.stat.name === "defense")
          .base_stat,
        speed: pokemonData.stats.find((stat) => stat.stat.name === "speed")
          .base_stat,
        weight: pokemonData.weight,
        height: pokemonData.height,
      };
    });

    const pokeDB = await Pokemon.findAll({
      include: [Type], // Incluir directamente el modelo Type
    });

    const pokeDBData = pokeDB.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      types: pokemon.Types ? pokemon.Types.map((type) => type.name) : [], // Verificar si pokemon.Types está definido antes de llamar a map
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
      speed: pokemon.speed,
      weight: pokemon.weight,
      height: pokemon.height,
    }));

    // Utilizo Promise.all() para esperar a que todas las promesas en el array "pokemonDetailsPromises" se resuelvan, así como también se incluyen los datos de la DB  en "pokeDBData".
    const result = await Promise.all([
      ...pokemonDetailsPromises,
      ...pokeDBData,
    ]);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

module.exports = getPokemons;

// const deletePokemonHandler = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const pokemon = await Pokemon.findByPk(id);
//     if (!pokemon) {
//       throw new Error("Pokemon not found");
//     }
//     await pokemon.destroy();
//     res.status(200).json(pokemon);
//   } catch (error) {
//     res.status(400).json({ error: "Pokemon not found" });
//   }
// };
