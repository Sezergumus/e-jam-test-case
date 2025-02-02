import { Router } from "express";
import {
  addSuperhero,
  getSuperheroes,
} from "../controllers/superheroController";
import { validateSuperHero } from "../middleware/validate";

const router = Router();

// POST /api/superheroes
router.post("/", validateSuperHero, addSuperhero);

// GET /api/superheroes
router.get("/", getSuperheroes);

export default router;
