import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateSuperHero = [
  body("name").notEmpty().withMessage("Name is required"),
  body("superpower")
    .isLength({ min: 3 })
    .withMessage("Superpower must be at least 3 characters long"),
  body("humilityScore")
    .isInt({ min: 1, max: 10 })
    .withMessage("Humility score must be between 1 and 10"),

  // Middleware to handle validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];
