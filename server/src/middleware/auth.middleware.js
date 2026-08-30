import { authService } from "../services/auth.service.js";
export async function requireAuth(req, res, next) {
  const token = req.cookies.cgdm_session;
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try { req.user = await authService.verify(token); next(); }
  catch { res.clearCookie("cgdm_session"); res.status(401).json({ message: "Session expired" }); }
}
export const allowRoles = (...roles) => (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ message: "You do not have permission to perform this action" });
