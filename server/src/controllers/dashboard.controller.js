import { dashboardService } from "../services/dashboard.service.js";
export function getDashboard(_req, res) { res.json({ data: dashboardService.getSummary() }); }
