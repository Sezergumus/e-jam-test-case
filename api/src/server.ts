import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import superheroRouter from "./routes/superheroRouter";
import { initializeSuperheroes } from "./controllers/superheroController";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Humble Superhero API is up and running!");
});

app.use("/api/superheroes", superheroRouter);

initializeSuperheroes();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

export { server };
