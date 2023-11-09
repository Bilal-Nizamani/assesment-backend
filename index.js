import express from "express";
import dotenv from "dotenv";
import router from "./router.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// API endpoint for fetching Elder Scrolls cards
app.use(router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
