const { Router } = require("express");
const getPokemons = require("../controllers/getPokemons");
const getPokemonName = require("../controllers/getPokemonName");
const getPokemonById = require("../controllers/getPokemonById");
const createPokemon = require("../controllers/createPokemon");
const router = Router();

router.get("/", getPokemons);
router.get("/name", getPokemonName);
router.get("/:id", getPokemonById);

router.post("/", createPokemon);

module.exports = router;
