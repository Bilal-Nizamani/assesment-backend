import { Router } from "express";

import passport from "passport";
import stripeRouteHandler from "../handler/stripeRouteHandler.js";
import {
  cardsGetRouteHandler,
  getUserDataRouteHander,
} from "../handler/getRouteHandler.js";

import {
  userRegisterHandler,
  userLoginHandler,
} from "../handler/authroziationHandler.js";

const router = Router();
router.get("/api/cards", cardsGetRouteHandler);
router.post("/register", userRegisterHandler);
router.post("/login", userLoginHandler);
router.get(
  "/user-data",
  passport.authenticate("jwt", { session: false }),
  getUserDataRouteHander
);
router.post(
  "/payment-checkout",
  passport.authenticate("jwt", { session: false }),
  stripeRouteHandler
);

export default router;
