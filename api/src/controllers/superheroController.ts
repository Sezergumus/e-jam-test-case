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

// Delete hero with body
export const deleteSuperheroByBody = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id, name, superpower, humilityScore } = req.body;
    const superheroString = JSON.stringify({
      id,
      name,
      superpower,
      humilityScore,
    });

    const result = await client.zrem(HEROES_KEY, superheroString);

    if (result === 0) {
      return res
        .status(404)
        .json({ error: "Superhero not found or already removed" });
    }

    return res.status(200).json({ message: "Superhero deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete superhero" });
  }
};

// Update superhero by id
export const updateSuperhero = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id, name, superpower, humilityScore } = req.body;

    // Find the existing superhero by id
    const heroes = await client.zrange(HEROES_KEY, 0, -1);
    const existingHero = heroes
      .map((hero) => JSON.parse(hero))
      .find((hero) => hero.id === id);

    if (!existingHero) {
      return res.status(404).json({ error: "Superhero not found" });
    }

    // Remove the existing superhero from Redis
    await client.zrem(HEROES_KEY, JSON.stringify(existingHero));

    // Update superhero with new data
    const updatedHero = { id, name, superpower, humilityScore };

    // Add the updated hero back into the Redis sorted set, sorted by humilityScore in descending order
    await client.zadd(HEROES_KEY, -humilityScore, JSON.stringify(updatedHero));

    res.status(200).json({
      message: "Superhero updated successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update superhero" });
  }
};

// Initialize default superheroes
export const initializeSuperheroes = async () => {
  // if server is restarted, delete the existing heroes
  await client.del(HEROES_KEY);

  const initialHeroes = [
    { id: 1, name: "Superman", superpower: "Flying", humilityScore: 10 },
    { id: 2, name: "Batman", superpower: "Intelligence", humilityScore: 7 },
    { id: 3, name: "Flash", superpower: "Super Speed", humilityScore: 4 },
  ];

  const existingHeroes = await client.zrange(HEROES_KEY, 0, -1);
  if (existingHeroes.length === 0) {
    for (const hero of initialHeroes) {
      await client.zadd(HEROES_KEY, -hero.humilityScore, JSON.stringify(hero));
    }
  }
};
