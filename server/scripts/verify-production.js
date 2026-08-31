import "dotenv/config";
import { Pool } from "pg";
import { readFileSync } from "node:fs";
const required=["DATABASE_URL","SUPABASE_URL","SUPABASE_ANON_KEY","SESSION_SECRET"],missing=required.filter(key=>!process.env[key]);
if(missing.length){console.error(`Missing configuration: ${missing.join(", ")}`);process.exit(1)}
const checks={configuration:"ok",supabaseAuth:"checking",database:"checking",migrations:"checking"};
try{const response=await fetch(`${process.env.SUPABASE_URL}/auth/v1/settings`,{headers:{apikey:process.env.SUPABASE_ANON_KEY}});if(!response.ok)throw new Error(`Auth endpoint returned ${response.status}`);checks.supabaseAuth="healthy"}catch(error){checks.supabaseAuth="unhealthy";console.error(`Supabase Auth: ${error.message}`)}
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_SSL==="disable"?false:{rejectUnauthorized:true,...(process.env.DATABASE_SSL_CA_PATH?{ca:readFileSync(process.env.DATABASE_SSL_CA_PATH,"utf8")}:{})},connectionTimeoutMillis:10000});
try{await pool.query("SELECT 1");checks.database="healthy";const result=await pool.query("SELECT name FROM schema_migrations ORDER BY name");checks.migrations=result.rows.length>=6?`healthy (${result.rows.length} applied)`:`incomplete (${result.rows.length} applied)`}catch(error){checks.database="unhealthy";checks.migrations="not_checked";console.error(`PostgreSQL: ${error.message}`)}finally{await pool.end()}
console.log(JSON.stringify(checks,null,2));if(Object.values(checks).some(value=>String(value).startsWith("unhealthy")||String(value).startsWith("incomplete")||value==="not_checked"))process.exit(1);
