import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";
import { supabase, supabaseEnabled } from "../config/supabase.js";

const secret = process.env.SESSION_SECRET || "development-only-change-me";
const publicUser = ({ id, email, display_name, role }) => ({ id, email, displayName: display_name, role });

export const authService = {
  async login(email, password) {
    if(supabaseEnabled){const {data,error}=await supabase.auth.signInWithPassword({email,password});if(error||!data.user)return null;const role=String(data.user.app_metadata?.role||data.user.user_metadata?.role||"DESIGNER").toUpperCase();const user={id:data.user.id,email:data.user.email,displayName:data.user.user_metadata?.display_name||data.user.email.split("@")[0],role:role==="ADMIN"?"ADMIN":"DESIGNER"};await userRepository.syncExternalUser(user);return{user,token:data.session.access_token,refreshToken:data.session.refresh_token,expiresIn:data.session.expires_in}}
    const user = await userRepository.findByEmail(email);
    if (!user || user.status !== "ACTIVE" || !(await bcrypt.compare(password, user.password_hash))) return null;
    await userRepository.recordLogin(user.id);
    return { user: publicUser(user), token: jwt.sign({ sub: user.id, email: user.email, role: user.role, name: user.display_name }, secret, { expiresIn: "8h", issuer: "cgdm" }) };
  },
  async verify(token) { if(supabaseEnabled){const {data,error}=await supabase.auth.getUser(token);if(error||!data.user)throw new Error("Invalid session");const role=String(data.user.app_metadata?.role||data.user.user_metadata?.role||"DESIGNER").toUpperCase();return{sub:data.user.id,email:data.user.email,name:data.user.user_metadata?.display_name||data.user.email.split("@")[0],role:role==="ADMIN"?"ADMIN":"DESIGNER"}}return jwt.verify(token,secret,{issuer:"cgdm"}); }
};
