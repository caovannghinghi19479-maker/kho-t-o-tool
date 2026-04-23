import { Router } from "express";
import { validateLicense } from "../services/licenseManager.js";

export const licenseRouter = Router();
licenseRouter.post("/validate", async (req, res) => res.json(validateLicense(req.body.key)));
