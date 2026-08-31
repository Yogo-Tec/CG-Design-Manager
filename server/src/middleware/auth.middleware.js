import { authService } from "../services/auth.service.js";
const localBypassEnabled = process.env.NODE_ENV !== "production" && process.env.LOCAL_AUTH_BYPASS === "true";
const localUser = {
  sub: "local-admin",
  email: "local@cgdm.test",
  name: "Local Administrator",
  role: "ADMIN"
};
export async function requireAuth(req, res, next) {
  if (localBypassEnabled) {
    req.user = localUser;
    return next();
  }
  const token = req.cookies.cgdm_session;
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try { req.user = await authService.verify(token); next(); }
  catch { res.clearCookie("cgdm_session"); res.status(401).json({ message: "Session expired" }); }
}
export const allowRoles = (...roles) => (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ message: "You do not have permission to perform this action" });
