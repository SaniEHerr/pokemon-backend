const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const typesRouter = require("./typesRouters");
const pokemonsRouters = require("./pokemonsRouters");
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/pokemon", pokemonsRouters);
router.use("/types", typesRouter);

module.exports = router;
