import "dotenv/config";
import { spawn } from "node:child_process";
import { mkdir, readdir, stat, rm, cp } from "node:fs/promises";
import path from "node:path";
const database=process.env.DATABASE_URL,retention=Number(process.env.BACKUP_RETENTION_DAYS||30),root=path.resolve(process.env.BACKUP_PATH||"backups"),stamp=new Date().toISOString().replaceAll(":","-").replace(".","-");
if(!database){console.error("DATABASE_URL is required");process.exit(1)}
await mkdir(root,{recursive:true});
const dbFile=path.join(root,`cgdm-db-${stamp}.dump`);
await new Promise((resolve,reject)=>{const child=spawn("pg_dump",["--format=custom","--no-owner","--file",dbFile,database],{stdio:"inherit",shell:false});child.on("error",reject);child.on("exit",code=>code===0?resolve():reject(new Error(`pg_dump exited with ${code}`)))});
const uploads=path.resolve(process.env.STORAGE_PATH||"uploads"),filesTarget=path.join(root,`cgdm-files-${stamp}`);
try{await cp(uploads,filesTarget,{recursive:true})}catch(error){if(error.code!=="ENOENT")throw error}
const cutoff=Date.now()-retention*86400000;
for(const name of await readdir(root)){const target=path.resolve(root,name);if(target.startsWith(root+path.sep)&&(await stat(target)).mtimeMs<cutoff)await rm(target,{recursive:true,force:true})}
console.log(`Backup completed: ${dbFile}`);
