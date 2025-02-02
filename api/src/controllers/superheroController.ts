import { Request, Response } from "express";
import client from "../config/redisClient";

const HEROES_KEY = "superheroes";

// Add a superhero
export const addSuperhero = async (req: Request, res: Response) => {
  try {
    const { name, superpower, humilityScore } = req.body;
    const superhero = { name, superpower, humilityScore };

    // Store in descending order by appending minus sign before humilityScore
    await client.zadd(HEROES_KEY, -humilityScore, JSON.stringify(superhero));
    res
      .status(201)
      .json({ message: "Superhero added successfully", superhero });
  } catch (error) {
    res.status(500).json({ error: "Failed to add superhero" });
  }
};

// Get superheroes
export const getSuperheroes = async (_req: Request, res: Response) => {
  try {
    const heroes = await client.zrange(HEROES_KEY, 0, -1);
    const parsedHeroes = heroes.map((hero) => JSON.parse(hero));
    res.json(parsedHeroes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch superheroes" });
  }
};

// Delete all heroes
export const deleteSuperheroes = async () => {
  await client.del(HEROES_KEY);
};

// Initialize default superheroes
export const initializeSuperheroes = async () => {
  // if server is restarted, delete the existing heroes
  await client.del(HEROES_KEY);

  const initialHeroes = [
    { name: "Superman", superpower: "Flying", humilityScore: 10 },
    { name: "Batman", superpower: "Intelligence", humilityScore: 9 },
    { name: "Flash", superpower: "Super Speed", humilityScore: 8 },
  ];

  const existingHeroes = await client.zrange(HEROES_KEY, 0, -1);
  if (existingHeroes.length === 0) {
    for (const hero of initialHeroes) {
      await client.zadd(HEROES_KEY, -hero.humilityScore, JSON.stringify(hero));
    }
  }
};
