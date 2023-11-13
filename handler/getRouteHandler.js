import axios from "axios";
import dotenv from "dotenv";
import User from "../databasemodels/user.js";
dotenv.config();
const apiUrl = process.env.API;

const cardsGetRouteHandler = async (req, res) => {
  try {
    // Extract the page parameter from the request
    const { page } = req.query;

    // Make the request to the Magic: The Gathering API
    const response = await axios.get(apiUrl, {
      params: {
        page: page || 1,
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
};
const getUserDataRouteHander = async (req, res) => {
  try {
    // Fetch user by ID
    const { userId } = req.query;
    const fieldsToInclude = "username email _id";
    const currentUser = await User.findById(userId).select(fieldsToInclude);
    if (!currentUser) {
      // User not found
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }
    // User found, send the response
    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export { cardsGetRouteHandler, getUserDataRouteHander };
