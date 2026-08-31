import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";
import { supabase, supabaseEnabled } from "../config/supabase.js";
const secret=process.env.SESSION_SECRET||"development-only-change-me";
const publicUser=({id,email,display_name,role})=>({id,email,displayName:display_name,role});
const supabaseRole=(user)=>String(user.app_metadata?.role||"DESIGNER").toUpperCase()==="ADMIN"?"ADMIN":"DESIGNER";
export const authService={
  async login(email,password){
    if(supabaseEnabled){
      const{data,error}=await supabase.auth.signInWithPassword({email,password});
      if(error||!data.user)return null;
      const user={id:data.user.id,email:data.user.email,displayName:data.user.user_metadata?.display_name||data.user.email.split("@")[0],role:supabaseRole(data.user)};
      await userRepository.syncExternalUser(user);
      return{user,token:data.session.access_token,refreshToken:data.session.refresh_token,expiresIn:data.session.expires_in};
    }
    const user=await userRepository.findByEmail(email);
    if(!user||user.status!=="ACTIVE"||!(await bcrypt.compare(password,user.password_hash)))return null;
    await userRepository.recordLogin(user.id);
    return{user:publicUser(user),token:jwt.sign({sub:user.id,email:user.email,role:user.role,name:user.display_name},secret,{expiresIn:"8h",issuer:"cgdm"})};
  },
  async verify(token){
    if(supabaseEnabled){
      const{data,error}=await supabase.auth.getUser(token);
      if(error||!data.user)throw new Error("Invalid session");
      return{sub:data.user.id,email:data.user.email,name:data.user.user_metadata?.display_name||data.user.email.split("@")[0],role:supabaseRole(data.user)};
    }
    return jwt.verify(token,secret,{issuer:"cgdm"});
  },
  async requestPasswordReset(email){
    if(!supabaseEnabled)throw Object.assign(new Error("Password recovery is not configured"),{status:503});
    const redirectTo=process.env.PASSWORD_RESET_REDIRECT_URL||`http://localhost:${process.env.PORT||3000}/pages/reset-password.html`;
    const{error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo});
    if(error)throw Object.assign(new Error("Unable to send password recovery email"),{status:502});
  },
  async updatePassword(accessToken,password){
    if(!supabaseEnabled)throw Object.assign(new Error("Password recovery is not configured"),{status:503});
    const response=await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`,{method:"PUT",headers:{apikey:process.env.SUPABASE_ANON_KEY,authorization:`Bearer ${accessToken}`,"content-type":"application/json"},body:JSON.stringify({password})});
    if(!response.ok)throw Object.assign(new Error("This recovery link is invalid or expired"),{status:401});
  }
};
