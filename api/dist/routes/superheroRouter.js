"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const superheroController_1 = require("../controllers/superheroController");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
// /api/superheroes
// POST Add superhero
router.post("/", validate_1.validateSuperHero, superheroController_1.addSuperhero);
// GET All heroes
router.get("/", superheroController_1.getSuperheroes);
// DELETE Hero by ID
router.delete("/one", superheroController_1.deleteSuperheroByBody);
// PUT Update hero by id
router.put("/", superheroController_1.updateSuperhero);
exports.default = router;
