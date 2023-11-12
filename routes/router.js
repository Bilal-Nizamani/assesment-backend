import { Router } from "express";
import dotenv from "dotenv";
import axios from "axios";
import stripe from "stripe";
import {
  userRegisterHandler,
  userLoginHandler,
} from "../handler/authroziationHandler.js";
dotenv.config();

const stripeSecretKey = process.env.SECRET_KEY;
const stripeInstance = new stripe(stripeSecretKey);
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

router.post("/payment-checkout", async (req, res) => {
  try {
    const { item } = req.body;
    console.log(item);
    const redirectURL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://production-url.com"; // Replace with your production URL

    const transformedItem = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              images: [item.image],
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        },
      ],
      mode: "payment",
      success_url: redirectURL + "?status=success",
      cancel_url: redirectURL + "?status=cancel",
      metadata: {
        images: item.image,
      },
    };

    const session = await stripeInstance.checkout.sessions.create(
      transformedItem
    );

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create session" });
  }
});

export default router;
