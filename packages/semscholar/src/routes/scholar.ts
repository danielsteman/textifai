import express from "express";
import { scholarController } from "../controllers/scholarController";

const router = express.Router();

// When you have more routes, checkout routes naming conventions / patterns
// Like this: https://www.reddit.com/r/node/comments/n0ce63/which_of_these_express_route_param_naming/

router.post("/scholar", scholarController);

export default router;
