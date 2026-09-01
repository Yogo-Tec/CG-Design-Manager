import { databaseEnabled, query } from "../config/database.js";

const listSql = {
  projects: `SELECT p.id,p.project_code code,p.name,COALESCE(c.company_name,c.client_name) client,p.client_id,p.priority,p.status,p.deadline,p.description,p.created_at,p.updated_at FROM projects p JOIN clients c ON c.id=p.client_id ORDER BY p.updated_at DESC`,
  jobs: `SELECT j.id,j.job_code code,j.title,p.name project,j.project_id,d.name designer,j.lead_designer_id,j.design_type,j.priority,j.status,j.base_charge,j.deadline,j.notes,j.created_at,j.updated_at FROM design_jobs j JOIN projects p ON p.id=j.project_id LEFT JOIN designers d ON d.id=j.lead_designer_id ORDER BY j.updated_at DESC`,
  designers: `SELECT d.id,d.name,d.email,d.phone,d.status,COUNT(j.id)::int "activeJobs",COALESCE(LEAST(100,COUNT(j.id)*18),0)::int capacity,d.created_at FROM designers d LEFT JOIN design_jobs j ON j.lead_designer_id=d.id AND j.status NOT IN('COMPLETED','CANCELLED') GROUP BY d.id ORDER BY d.name`,
  revisions: `SELECT r.id,'REV-'||RIGHT(j.job_code,8)||'-'||LPAD(r.version_no::text,2,'0') code,j.title job,r.design_job_id,r.version_no version,r.feedback,r.status,r.requested_by,r.created_at FROM revisions r JOIN design_jobs j ON j.id=r.design_job_id ORDER BY r.created_at DESC`,
  proofs: `SELECT p.id,'PRF-'||RIGHT(j.job_code,8)||'-'||LPAD(p.version_no::text,2,'0') code,j.title job,p.design_job_id,p.version_no version,p.file_path,p.status,p.client_feedback,p.submitted_at,p.approved_at,p.created_at FROM proofs p JOIN design_jobs j ON j.id=p.design_job_id ORDER BY p.created_at DESC`,
  payments: `SELECT py.id,'PAY-'||RIGHT(py.id::text,8) code,p.name project,py.project_id,py.amount,py.payment_type,py.status,py.direction,py.stage,py.reference,py.paid_at,py.created_at FROM payments py JOIN projects p ON p.id=py.project_id ORDER BY py.created_at DESC`
};

const createSql = {
  projects: { sql: `INSERT INTO projects(project_code,client_id,name,description,priority,status,deadline) VALUES('PRJ-'||TO_CHAR(NOW(),'YYYY')||'-'||LPAD(NEXTVAL('project_code_seq')::text,4,'0'),$1,$2,$3,$4,$5,$6) RETURNING *`, values: x => [x.client_id,x.name,x.description||null,x.priority||"NORMAL",x.status||"NEW",x.deadline||null] },
  jobs: { sql: `INSERT INTO design_jobs(job_code,project_id,title,design_type,lead_designer_id,priority,status,base_charge,deadline,notes) VALUES('DJ-'||TO_CHAR(NOW(),'YYYY')||'-'||LPAD(NEXTVAL('design_job_code_seq')::text,4,'0'),$1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`, values: x => [x.project_id,x.title,x.design_type,x.lead_designer_id||null,x.priority||"NORMAL",x.status||"NEW",Number(x.base_charge||0),x.deadline||null,x.notes||null] },
  designers: { sql: `INSERT INTO designers(name,email,phone,status) VALUES($1,$2,$3,$4) RETURNING *`, values: x => [x.name,x.email||null,x.phone||null,x.status||"ACTIVE"] },
  revisions: { sql: `INSERT INTO revisions(design_job_id,version_no,feedback,status,requested_by) SELECT $1,COALESCE(MAX(version_no),0)+1,$2,$3,$4 FROM revisions WHERE design_job_id=$1 RETURNING *`, values: x => [x.design_job_id,x.feedback,x.status||"REQUESTED",x.requested_by||null] },
  proofs: { sql: `INSERT INTO proofs(design_job_id,version_no,file_path,status,client_feedback,submitted_at) SELECT $1,COALESCE(MAX(version_no),0)+1,$2,$3::varchar,$4,CASE WHEN $3::varchar='DRAFT' THEN NULL ELSE NOW() END FROM proofs WHERE design_job_id=$1 RETURNING *`, values: x => [x.design_job_id,x.file_path||null,x.status||"DRAFT",x.client_feedback||null] },
  payments: { sql: `INSERT INTO payments(project_id,amount,payment_type,status,reference,paid_at,direction,stage,designer_id) VALUES($1,$2,$3,$4::varchar,$5,CASE WHEN $4::varchar='PAID' THEN NOW() ELSE NULL END,$6,$7,$8) RETURNING *`, values: x => [x.project_id,Number(x.amount),x.payment_type||"CLIENT",x.status||"PENDING",x.reference||null,x.direction||"RECEIVABLE",x.stage||"PENDING",x.designer_id||null] }
};

const tableByModule = { projects:"projects", jobs:"design_jobs", designers:"designers", revisions:"revisions", proofs:"proofs", payments:"payments" };
const editable = {
  projects:["client_id","name","description","priority","status","deadline"], jobs:["project_id","title","design_type","lead_designer_id","priority","status","base_charge","deadline","notes"], designers:["name","email","phone","status"], revisions:["design_job_id","feedback","status","requested_by"], proofs:["design_job_id","file_path","status","client_feedback"], payments:["project_id","amount","payment_type","status","reference","direction","stage","designer_id"]
};

export const operationsRepository = {
  enabled: databaseEnabled,
  async list(module) { return (await query(listSql[module])).rows; },
  async create(module,input) { const config=createSql[module]; return (await query(config.sql,config.values(input))).rows[0]; },
  async update(module,id,input) {
    const entries=editable[module].filter(key=>Object.hasOwn(input,key)).map(key=>[key,input[key]===""?null:input[key]]);
    if(!entries.length)return null;
    const values=entries.map(([,value])=>value); values.push(id);
    const sets=entries.map(([key],index)=>`${key}=$${index+1}`);
    if(["projects","jobs"].includes(module))sets.push("updated_at=NOW()");
    const statusIndex=entries.findIndex(([key])=>key==="status");
    if(module==="payments"&&statusIndex>=0)sets.push(`paid_at=CASE WHEN $${statusIndex+1}::varchar='PAID' THEN COALESCE(paid_at,NOW()) ELSE NULL END`);
    return (await query(`UPDATE ${tableByModule[module]} SET ${sets.join(",")} WHERE id=$${values.length} RETURNING *`,values)).rows[0]||null;
  },
  async remove(module,id) { return (await query(`DELETE FROM ${tableByModule[module]} WHERE id=$1 RETURNING id`,[id])).rows[0]||null; }
};
