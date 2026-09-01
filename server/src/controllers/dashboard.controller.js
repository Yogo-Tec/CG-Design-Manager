import { dashboardService } from "../services/dashboard.service.js";
export async function getDashboard(_req,res,next){try{res.json({data:await dashboardService.getSummary()})}catch(error){next(error)}}
