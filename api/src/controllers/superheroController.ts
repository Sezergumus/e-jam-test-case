import { Request, Response } from "express";
import client from "../config/redisClient";

const HEROES_KEY = "superheroes";
let currId = 3; // we initialize currentId by 3 three because the initial data has max id of 3.

// Add a superhero
export const addSuperhero = async (req: Request, res: Response) => {
  try {
    const { name, superpower, humilityScore } = req.body;
    const superhero = { name, superpower, humilityScore };
    currId++;

    // Store in descending order by appending minus sign before humilityScore
    await client.zadd(
      HEROES_KEY,
      -humilityScore,
      JSON.stringify({
        id: currId,
        ...superhero,
      })
    );
    res
      .status(201)
      .json({ message: "Superhero added successfully!", superhero });
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
    { id: 1, name: "Superman", superpower: "Flying", humilityScore: 10 },
    { id: 2, name: "Batman", superpower: "Intelligence", humilityScore: 7 },
    { id: 3, name: "Flash", superpower: "Super Speed", humilityScore: 4 },
    { id: 4, name: "Superman", superpower: "Flying", humilityScore: 10 },
    { id: 5, name: "Batman", superpower: "Intelligence", humilityScore: 7 },
    { id: 6, name: "Flash", superpower: "Super Speed", humilityScore: 4 },
    { id: 7, name: "Superman", superpower: "Flying", humilityScore: 10 },
    { id: 8, name: "Batman", superpower: "Intelligence", humilityScore: 7 },
    { id: 9, name: "Flash", superpower: "Super Speed", humilityScore: 4 },
    { id: 10, name: "Superman", superpower: "Flying", humilityScore: 10 },
    { id: 11, name: "Batman", superpower: "Intelligence", humilityScore: 7 },
    { id: 12, name: "Flash", superpower: "Super Speed", humilityScore: 4 },
  ];

  const existingHeroes = await client.zrange(HEROES_KEY, 0, -1);
  if (existingHeroes.length === 0) {
    for (const hero of initialHeroes) {
      await client.zadd(HEROES_KEY, -hero.humilityScore, JSON.stringify(hero));
    }
  }
};
