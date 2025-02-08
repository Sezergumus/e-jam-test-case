"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSuperheroes = exports.updateSuperhero = exports.deleteSuperheroByBody = exports.deleteSuperheroes = exports.getSuperheroes = exports.addSuperhero = void 0;
const redisClient_1 = __importDefault(require("../config/redisClient"));
const HEROES_KEY = "superheroes";
let currId = 3; // we initialize currentId by 3 three because the initial data has max id of 3.
// Add a superhero
const addSuperhero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, superpower, humilityScore } = req.body;
        const superhero = { name, superpower, humilityScore };
        currId++;
        // Store in descending order by appending minus sign before humilityScore
        yield redisClient_1.default.zadd(HEROES_KEY, -humilityScore, JSON.stringify(Object.assign({ id: currId }, superhero)));
        res
            .status(201)
            .json({ message: "Superhero added successfully!", superhero });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to add superhero" });
    }
});
exports.addSuperhero = addSuperhero;
// Get superheroes
const getSuperheroes = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const heroes = yield redisClient_1.default.zrange(HEROES_KEY, 0, -1);
        const parsedHeroes = heroes.map((hero) => JSON.parse(hero));
        res.json(parsedHeroes);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch superheroes" });
    }
});
exports.getSuperheroes = getSuperheroes;
// Delete all heroes
const deleteSuperheroes = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient_1.default.del(HEROES_KEY);
});
exports.deleteSuperheroes = deleteSuperheroes;
// Delete hero with body
const deleteSuperheroByBody = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, superpower, humilityScore } = req.body;
        const superheroString = JSON.stringify({
            id,
            name,
            superpower,
            humilityScore,
        });
        const result = yield redisClient_1.default.zrem(HEROES_KEY, superheroString);
        if (result === 0) {
            return res
                .status(404)
                .json({ error: "Superhero not found or already removed" });
        }
        return res.status(200).json({ message: "Superhero deleted successfully!" });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to delete superhero" });
    }
});
exports.deleteSuperheroByBody = deleteSuperheroByBody;
// Update superhero by id
const updateSuperhero = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, superpower, humilityScore } = req.body;
        // Find the existing superhero by id
        const heroes = yield redisClient_1.default.zrange(HEROES_KEY, 0, -1);
        const existingHero = heroes
            .map((hero) => JSON.parse(hero))
            .find((hero) => hero.id === id);
        if (!existingHero) {
            return res.status(404).json({ error: "Superhero not found" });
        }
        // Remove the existing superhero from Redis
        yield redisClient_1.default.zrem(HEROES_KEY, JSON.stringify(existingHero));
        // Update superhero with new data
        const updatedHero = { id, name, superpower, humilityScore };
        // Add the updated hero back into the Redis sorted set, sorted by humilityScore in descending order
        yield redisClient_1.default.zadd(HEROES_KEY, -humilityScore, JSON.stringify(updatedHero));
        res.status(200).json({
            message: "Superhero updated successfully!",
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update superhero" });
    }
});
exports.updateSuperhero = updateSuperhero;
// Initialize default superheroes
const initializeSuperheroes = () => __awaiter(void 0, void 0, void 0, function* () {
    // if server is restarted, delete the existing heroes
    yield redisClient_1.default.del(HEROES_KEY);
    const initialHeroes = [
        { id: 1, name: "Superman", superpower: "Flying", humilityScore: 10 },
        { id: 2, name: "Batman", superpower: "Intelligence", humilityScore: 7 },
        { id: 3, name: "Flash", superpower: "Super Speed", humilityScore: 4 },
    ];
    const existingHeroes = yield redisClient_1.default.zrange(HEROES_KEY, 0, -1);
    if (existingHeroes.length === 0) {
        for (const hero of initialHeroes) {
            yield redisClient_1.default.zadd(HEROES_KEY, -hero.humilityScore, JSON.stringify(hero));
        }
    }
});
exports.initializeSuperheroes = initializeSuperheroes;
