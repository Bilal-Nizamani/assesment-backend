import express from "express";
import dotenv from "dotenv";
import router from "./routes/router.js";
import cors from "cors";
import { createMongoConnection } from "./config/database.js";
import passport from "passport";
import configurePassport from "./config/passport.js";
dotenv.config();
const dbUrl = process.env.DATABASE_URL;
createMongoConnection(dbUrl);
configurePassport(passport);
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// API endpoint for fetching Elder Scrolls cards
app.use(passport.initialize());

app.use(router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
