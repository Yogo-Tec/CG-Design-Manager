import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authService } from "../services/auth.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false, message: { message: "Too many login attempts. Try again later." } });
router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return res.status(400).json({ message: "Enter a valid email and password" });
    const result = await authService.login(email, password);
    if (!result) return res.status(401).json({ message: "Invalid email or password" });
    res.cookie("cgdm_session", result.token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", maxAge: 8 * 60 * 60 * 1000, path: "/" });
    res.json({ data: { user: result.user } });
  } catch (error) { next(error); }
});
router.get("/me", requireAuth, (req, res) => res.json({ data: { user: { id: req.user.sub, email: req.user.email, displayName: req.user.name, role: req.user.role } } }));
router.post("/logout", (_req, res) => { res.clearCookie("cgdm_session", { path: "/" }); res.json({ data: { success: true } }); });
export default router;
