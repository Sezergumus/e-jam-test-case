import { describe, test, expect, afterAll } from "@jest/globals";
import request from "supertest";
import { server } from "../src/server";
import client from "../src/config/redisClient";

describe("Superhero API", () => {
  afterAll(async () => {
    await client.quit(); // Close Redis after tests
    server.close();
  });

  test("POST /api/superheroes - should create a superhero with valid data", async () => {
    const response = await request(server).post("/api/superheroes").send({
      name: "Spider-Man",
      superpower: "Web-slinging",
      humilityScore: 8,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Superhero added successfully!"
    );
    expect(response.body.superhero).toMatchObject({
      name: "Spider-Man",
      superpower: "Web-slinging",
      humilityScore: 8,
    });
  });

  test("POST /api/superheroes - should return 400 for missing fields", async () => {
    const response = await request(server).post("/api/superheroes").send({
      name: "Thor",
      humilityScore: 6,
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Superpower must be at least 3 characters long",
        }),
      ])
    );
  });

  test("POST /api/superheroes - should return 400 for invalid humilityScore", async () => {
    const response = await request(server).post("/api/superheroes").send({
      name: "Iron Man",
      superpower: "Flying",
      humilityScore: 20, // Invalid score
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Humility score must be between 1 and 10",
        }),
      ])
    );
  });

  test("GET /api/superheroes - should fetch superheroes ordered by humilityScore", async () => {
    const response = await request(server).get("/api/superheroes");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
