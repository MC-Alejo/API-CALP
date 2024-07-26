const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarJWT, esGerente } = require("../middlewares");
const { realizarReporte } = require("../controllers");

const router = Router();

router.post("/", [validarJWT, esGerente, validarCampos], realizarReporte);

module.exports = router;
