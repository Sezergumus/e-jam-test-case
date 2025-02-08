"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSuperHero = void 0;
const express_validator_1 = require("express-validator");
exports.validateSuperHero = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("superpower")
        .isLength({ min: 3 })
        .withMessage("Superpower must be at least 3 characters long"),
    (0, express_validator_1.body)("humilityScore")
        .isInt({ min: 1, max: 10 })
        .withMessage("Humility score must be between 1 and 10"),
    // Middleware to handle validation errors
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
];
