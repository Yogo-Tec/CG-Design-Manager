import { app } from "./app.js";
import "dotenv/config";
if(process.env.NODE_ENV==="production"){
  const required=["DATABASE_URL","SUPABASE_URL","SUPABASE_ANON_KEY","SESSION_SECRET"];
  const missing=required.filter((key)=>!process.env[key]);
  if(missing.length){console.error(`Missing required production configuration: ${missing.join(", ")}`);process.exit(1)}
}
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`CGDM is running at http://localhost:${port}`));
