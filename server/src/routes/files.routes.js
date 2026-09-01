import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { allowRoles } from "../middleware/auth.middleware.js";
import { databaseEnabled,query } from "../config/database.js";

const allowed=new Set(["image/jpeg","image/png","image/webp","image/svg+xml","application/pdf","application/zip","application/postscript"]);
const storageRoot=path.resolve(process.env.STORAGE_PATH||"uploads");
const storage=multer.diskStorage({destination:(_request,_file,callback)=>callback(null,storageRoot),filename:(_request,file,callback)=>callback(null,`${Date.now()}-${randomUUID()}${path.extname(file.originalname).toLowerCase().slice(0,10)}`)});
const upload=multer({storage,limits:{fileSize:Number(process.env.UPLOAD_MAX_SIZE_MB||50)*1024*1024,files:5},fileFilter:(_request,file,callback)=>callback(allowed.has(file.mimetype)?null:new Error("Unsupported file type"),allowed.has(file.mimetype))});
const router=Router(),files=[];

router.get("/",async(req,res,next)=>{try{if(databaseEnabled){const values=[],scope=req.user.role==="ADMIN"?"":`WHERE uploaded_by=$1`;if(scope)values.push(req.user.sub);const rows=(await query(`SELECT id,original_name name,stored_name "storedName",mime_type "mimeType",file_size size,uploaded_by "ownerId",design_job_id "jobId",version_no version,created_at "createdAt" FROM design_files ${scope} ORDER BY created_at DESC`,values)).rows;return res.json({data:{files:rows}})}res.json({data:{files:files.filter(item=>req.user.role==="ADMIN"||item.ownerId===req.user.sub)}})}catch(error){next(error)}});
router.post("/",allowRoles("ADMIN","DESIGNER"),upload.array("files",5),async(req,res,next)=>{try{const saved=[];for(const file of req.files){if(databaseEnabled){const row=(await query(`INSERT INTO design_files(design_job_id,uploaded_by,original_name,stored_name,mime_type,file_size,version_no) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id,original_name name,stored_name "storedName",mime_type "mimeType",file_size size,uploaded_by "ownerId",design_job_id "jobId",version_no version,created_at "createdAt"`,[req.body.jobId||null,req.user.sub,file.originalname,file.filename,file.mimetype,file.size,Number(req.body.version||1)])).rows[0];saved.push(row)}else saved.push({id:randomUUID(),name:file.originalname,storedName:file.filename,mimeType:file.mimetype,size:file.size,ownerId:req.user.sub,jobId:req.body.jobId||null,version:req.body.version||"1",createdAt:new Date().toISOString()})}if(!databaseEnabled)files.unshift(...saved);res.status(201).json({data:{files:saved}})}catch(error){next(error)}});
router.delete("/:id",allowRoles("ADMIN","DESIGNER"),async(req,res,next)=>{try{let item;if(databaseEnabled){const values=[req.params.id],scope=req.user.role==="ADMIN"?"":" AND uploaded_by=$2";if(scope)values.push(req.user.sub);item=(await query(`DELETE FROM design_files WHERE id=$1${scope} RETURNING stored_name "storedName"`,values)).rows[0]}else{const index=files.findIndex(file=>file.id===req.params.id&&(req.user.role==="ADMIN"||file.ownerId===req.user.sub));if(index>=0)item=files.splice(index,1)[0]}if(!item)return res.status(404).json({message:"File not found"});const target=path.resolve(storageRoot,item.storedName);if(target.startsWith(`${storageRoot}${path.sep}`))await unlink(target).catch(error=>{if(error.code!=="ENOENT")throw error});res.json({data:{success:true}})}catch(error){next(error)}});
export default router;
