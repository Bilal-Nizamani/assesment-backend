import { Router } from "express";
import axios from "axios";
const router = Router();

const apiUrl = process.env.API || "https://api.magicthegathering.io/v1/cards";

router.get("/api/cards", async (req, res) => {
  try {
    // Define the base URL

    // Set the page size to 20

    // Extract the page parameter from the request
    const { page } = req.query;

    // Make the request to the Magic: The Gathering API
    const response = await axios.get(apiUrl, {
      params: {
        page: page || 1, // Default to page 1 if not provided
        pageSize: 20,
      },
    });

    // Extract the cards from the API response
    const cards = response.data.cards;
    // Send the cards as the API response
    res.json(cards);
  } catch (error) {
    // Handle errors
    console.error("Error fetching cards:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
