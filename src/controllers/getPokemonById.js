const axios = require("axios");
const { Pokemon, Type } = require("../db.js");

const getPokemonById = async (req, res) => {
  const { id } = req.params;

  try {
    if (id.length < 8) {
      
      // Llamado para el Detail
      const pokemonResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${id}`
      );

      const pokemonData = pokemonResponse.data;

      // Llamado para la Description
      const speciesResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${id}/`
      );
      const speciesData = speciesResponse.data;

      res.json({
        id: pokemonData.id,
        name: pokemonData.forms[0].name,
        // image: pokemonData.sprites.other.home.front_default,
        image: pokemonData.sprites.front_default,
        // image: pokemonData.sprites.versions['generation-iii']['firered-leafgreen'].front_default,
        types: pokemonData.types.map((elem) => elem.type.name),
        hp: pokemonData.stats[0].base_stat,
        attack: pokemonData.stats[1].base_stat,
        defense: pokemonData.stats[2].base_stat,
        speed: pokemonData.stats[5].base_stat,
        weight: pokemonData.weight,
        height: pokemonData.height,
        description: speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === "en" && entry.version.name === "omega-ruby"
        ).flavor_text,
      });
    } else {
      try {
        const onePokemon = await Pokemon.findOne({
          where: { id },
          include: {
            model: Type,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        });

        const types = onePokemon.Types.map((type) => type.name);
        const pokemon = {
          id: onePokemon.id,
          name: onePokemon.name,
          image: onePokemon.image,
          types: types,
          hp: onePokemon.hp,
          attack: onePokemon.attack,
          defense: onePokemon.defense,
          speed: onePokemon.speed,
          weight: onePokemon.weight,
          height: onePokemon.height,
          description: onePokemon.description,
        };

        res.json(pokemon);
      } catch (error) {
        res.json(error.message);
      }
    }
  } catch (error) {
    res.status(404).json({ message: "Pokemon not found" });
  }
};

module.exports = getPokemonById;



// const axios = require("axios");
// const { Pokemon, Type } = require("../db.js");

// const getPokemonById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (id.length < 8) {
//       await axios
//         .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
//         .then((data) => data.data)
//         .then((data) => {
//           res.json({
//             id: data.id,
//             name: data.forms[0].name,
//             image: data.sprites.versions['generation-iii']['firered-leafgreen'].front_default,
//             types: data.types.map((elem) => elem.type.name), // Asi me da un array de nombres de types directamente
//             hp: data.stats[0].base_stat,
//             attack: data.stats[1].base_stat,
//             defense: data.stats[2].base_stat,
//             speed: data.stats[5].base_stat,
//             weight: data.weight,
//             height: data.height,
//           });
//         })
//         .catch((error) => res.json(error.message));
//     } else {
//       try {
//         const onePokemon = await Pokemon.findOne({
//           where: { id },
//           include: {
//             model: Type,
//             attributes: ["name"],
//             through: {
//               attributes: [],
//             },
//           },
//         });

//         const types = onePokemon.Types.map((type) => type.name);
//         const pokemon = {
//           id: onePokemon.id,
//           name: onePokemon.name,
//           image: onePokemon.image,
//           types: types,
//           hp: onePokemon.hp,
//           attack: onePokemon.attack,
//           defense: onePokemon.defense,
//           speed: onePokemon.speed,
//           weight: onePokemon.weight,
//           height: onePokemon.height,
//         };

//         res.json(pokemon);
//       } catch (error) {
//         res.json(error.message);
//       }
//     }
//   } catch (error) {
//     res.status(404).json({ message: "Pokemon not found" });
//   }
// };

// module.exports = getPokemonById;