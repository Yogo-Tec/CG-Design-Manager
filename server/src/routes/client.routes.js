import { Router } from "express";
import { allowRoles } from "../middleware/auth.middleware.js";
import { clientService } from "../services/client.service.js";
const router=Router();
router.get("/",async(req,res,next)=>{try{res.json({data:{clients:await clientService.list({search:String(req.query.search||"").slice(0,100),status:["ACTIVE","INACTIVE"].includes(req.query.status)?req.query.status:"ALL",sort:["name_asc","name_desc"].includes(req.query.sort)?req.query.sort:"updated_desc"})}})}catch(e){next(e)}});
router.get("/:id",async(req,res,next)=>{try{const client=await clientService.find(req.params.id);if(!client)return res.status(404).json({message:"Client not found"});res.json({data:{client}})}catch(e){next(e)}});
router.post("/",allowRoles("ADMIN"),async(req,res,next)=>{try{res.status(201).json({data:{client:await clientService.create(req.body)}})}catch(e){next(e)}});
router.put("/:id",allowRoles("ADMIN"),async(req,res,next)=>{try{const client=await clientService.update(req.params.id,req.body);if(!client)return res.status(404).json({message:"Client not found"});res.json({data:{client}})}catch(e){next(e)}});
export default router;
