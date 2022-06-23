import { Router } from "express";
import { authenticate } from "../middlewares/authentication";

const todosRoutes = Router();

todosRoutes.get("/", authenticate, (req, res) => {
  return res.json({ message: req.account.account_id });
});

export { todosRoutes };
