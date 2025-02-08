"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const superheroRouter_1 = __importDefault(require("./routes/superheroRouter"));
const superheroController_1 = require("./controllers/superheroController");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Humble Superhero API is up and running!");
});
app.use("/api/superheroes", superheroRouter_1.default);
(0, superheroController_1.initializeSuperheroes)();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
exports.server = server;
