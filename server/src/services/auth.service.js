import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";

const secret = process.env.SESSION_SECRET || "development-only-change-me";
const publicUser = ({ id, email, display_name, role }) => ({ id, email, displayName: display_name, role });

export const authService = {
  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || user.status !== "ACTIVE" || !(await bcrypt.compare(password, user.password_hash))) return null;
    await userRepository.recordLogin(user.id);
    return { user: publicUser(user), token: jwt.sign({ sub: user.id, email: user.email, role: user.role, name: user.display_name }, secret, { expiresIn: "8h", issuer: "cgdm" }) };
  },
  verify(token) { return jwt.verify(token, secret, { issuer: "cgdm" }); }
};
