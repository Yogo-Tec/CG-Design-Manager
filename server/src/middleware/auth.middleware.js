import { authService } from "../services/auth.service.js";
import { userRepository } from "../repositories/user.repository.js";
const localBypassEnabled = process.env.NODE_ENV !== "production" && process.env.LOCAL_AUTH_BYPASS === "true";
const localUser = {
  sub: "00000000-0000-4000-8000-000000000001",
  email: "local@cgdm.test",
  name: "Local Administrator",
  role: "ADMIN"
};
let localUserSynced = false;
export async function requireAuth(req, res, next) {
  if (localBypassEnabled) {
    if (!localUserSynced) {
      await userRepository.syncExternalUser({ id: localUser.sub, email: localUser.email, displayName: localUser.name, role: localUser.role });
      localUserSynced = true;
    }
    req.user = localUser;
    return next();
  }
  const token = req.cookies.cgdm_session;
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try { req.user = await authService.verify(token); next(); }
  catch { res.clearCookie("cgdm_session"); res.status(401).json({ message: "Session expired" }); }
}
export const allowRoles = (...roles) => (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ message: "You do not have permission to perform this action" });
