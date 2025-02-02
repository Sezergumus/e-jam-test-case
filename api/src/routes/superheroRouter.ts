import { Router } from "express";
import { body } from "express-validator";
import {
  addSuperhero,
  getSuperheroes,
} from "../controllers/superheroController";

const router = Router();

// POST /api/superheroes
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("superpower").notEmpty().withMessage("Superpower is required"),
    body("humilityScore")
      .isInt({ min: 0, max: 10 })
      .withMessage("Humility Score must be between 0 and 10"),
  ],
  addSuperhero
);

// GET /api/superheroes
router.get("/", getSuperheroes);

export default router;
