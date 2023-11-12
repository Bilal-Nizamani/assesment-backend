import { Router } from "express";
import dotenv from "dotenv";
import axios from "axios";
import passport from "passport";
import stripeRouteHandler from "../handler/stripeRouteHandler.js";
import {
  userRegisterHandler,
  userLoginHandler,
} from "../handler/authroziationHandler.js";
dotenv.config();

const router = Router();
const apiUrl = process.env.API;
router.get("/api/cards", async (req, res) => {
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
});
router.post("/register", userRegisterHandler);
router.post("/login", userLoginHandler);

router.post(
  "/payment-checkout",
  passport.authenticate("jwt", { session: false }),
  stripeRouteHandler
);

export default router;
