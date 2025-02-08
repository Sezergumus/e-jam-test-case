import { Router } from "express";
import {
  addSuperhero,
  getSuperheroes,
  deleteSuperheroByBody,
  updateSuperhero,
} from "../controllers/superheroController";
import { validateSuperHero } from "../middleware/validate";

const router = Router();

// /api/superheroes

// POST Add superhero
router.post("/", validateSuperHero, addSuperhero);

// GET All heroes
router.get("/", getSuperheroes);

// DELETE Hero by ID
router.delete("/one", deleteSuperheroByBody);

// PUT Update hero by id
router.put("/", updateSuperhero);

export default router;
