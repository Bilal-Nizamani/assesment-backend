import stripe from "stripe";
import dotenv from "dotenv";
import User from "../databasemodels/user.js"; // Adjust the path to your user model
dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY; // Corrected variable name

const stripeRouteHandler = async (req, res) => {
  try {
    const stripeInstance = new stripe(stripeSecretKey);
    const { item, userId, card } = req.body; // Assuming you have a userId in your request

    // Fetch the user from the database based on the userId
    const currentUser = await User.findById(userId);
    // Check if the user is found
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const redirectURL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/profile"
        : "https://production-url.com/profile"; // Replace with your production URL

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
    //test mode
    currentUser.cards.push(card);
    // Save the user instance to persist the changes in the database
    await currentUser.save();

    // for the real payment
    // switch (session.payment_status) {
    //   case "paid": {
    //     // Create a new card object with the card data
    //     // Push the new card to the user's cards array
    //     currentUser.cards.push(card);
    //     // Save the user instance to persist the changes in the database
    //     await currentUser.save();
    //     break;
    //   }
    //   default: {
    //     console.log("Payment not yet successful");
    //     break;
    //   }
    // }

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create session" });
  }
};

export default stripeRouteHandler;
