const { Pokemon, Type } = require("../db.js");

const createPokemon = async (req, res) => {
  try {
    const { name, image, hp, attack, defense, speed, height, weight, description, types } =
      req.body;

    // Verifico si el Pokémon ya existe
    const pokeCheck = await Pokemon.findOne({ where: { name: name } });
    if (pokeCheck) {
      return res.status(200).json({ message: "Pokemon already exists" });
    }

    // Creo el nuevo Pokémon en la base de datos
    const newPokemon = await Pokemon.create({
      name: name,
      image: image,
      hp: hp,
      attack: attack,
      defense: defense,
      speed: speed,
      height: height,
      weight: weight,
      description: description,
    });

    // Obtengo los tipos de Pokémon existentes en la base de datos
    const existingTypes = await Type.findAll({
      where: { name: types.map((t) => t.name) },
    });

    // Agrego los tipos al nuevo Pokémon
    await newPokemon.addTypes(types);

    const result = await Pokemon.findOne({
      where: { id: newPokemon.id },
      include: {
        model: Type,
        attributes: ["name"],
        through: { attributes: [] },
      }, // Excluye los atributos no deseados
    });

    // Obtengo los nombres de los tipos asociados al nuevo Pokémon
    const typeNames = result.Types.map((type) => type.name);

    // Responde al cliente con el nuevo Pokémon creado y los nombres de los tipos
    return res.status(200).json({
      message: "New pokemon added to the pokedex!!",
      pokemon: {
        id: newPokemon.id,
        name: newPokemon.name,
        image: newPokemon.image,
        hp: newPokemon.hp,
        attack: newPokemon.attack,
        defense: newPokemon.defense,
        speed: newPokemon.speed,
        height: newPokemon.height,
        weight: newPokemon.weight,
        types: typeNames,
        description: newPokemon.description,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

module.exports = createPokemon;
