process.env.SUPABASE_URL="";
process.env.SUPABASE_ANON_KEY="";
process.env.DATABASE_URL="";
import test from "node:test";
import assert from "node:assert/strict";
const { app } = await import("../server/src/app.js");
test("health endpoint returns ok", async (t) => {
  const server = app.listen(0); t.after(() => server.close());
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { data: { status: "ok", service: "cgdm-api", dependencies: { database: "not_configured", supabase: "not_configured" } } });
});

test("dashboard requires authentication and accepts a valid session", async (t) => {
  const server = app.listen(0); t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  const denied = await fetch(`${base}/api/dashboard`);
  assert.equal(denied.status, 401);
  const login = await fetch(`${base}/api/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: "admin@cgdm.local", password: "admin123" }) });
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie").split(";")[0];
  const dashboard = await fetch(`${base}/api/dashboard`, { headers: { cookie } });
  assert.equal(dashboard.status, 200);
  assert.equal((await dashboard.json()).data.priorityJobs.length, 4);
});

test("admin can create, search and update clients", async (t) => {
  const server=app.listen(0);t.after(()=>server.close());const base=`http://127.0.0.1:${server.address().port}`;
  const login=await fetch(`${base}/api/auth/login`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"admin@cgdm.local",password:"admin123"})});const cookie=login.headers.get("set-cookie").split(";")[0];
  const created=await fetch(`${base}/api/v1/clients`,{method:"POST",headers:{"content-type":"application/json",cookie},body:JSON.stringify({client_name:"Test Client",company_name:"Test Studio",email:"client@example.com",status:"ACTIVE"})});assert.equal(created.status,201);const client=(await created.json()).data.client;
  const search=await fetch(`${base}/api/v1/clients?search=Test%20Studio`,{headers:{cookie}});assert.equal((await search.json()).data.clients.some(x=>x.id===client.id),true);
  const updated=await fetch(`${base}/api/v1/clients/${client.id}`,{method:"PUT",headers:{"content-type":"application/json",cookie},body:JSON.stringify({...client,client_name:"Updated Client",status:"INACTIVE"})});assert.equal(updated.status,200);assert.equal((await updated.json()).data.client.status,"INACTIVE");
});

test("authenticated users can read production modules",async(t)=>{const server=app.listen(0);t.after(()=>server.close());const base=`http://127.0.0.1:${server.address().port}`;const login=await fetch(`${base}/api/auth/login`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"admin@cgdm.local",password:"admin123"})});const cookie=login.headers.get("set-cookie").split(";")[0];for(const module of["projects","jobs","designers","revisions","proofs","payments"]){const response=await fetch(`${base}/api/v1/operations/${module}`,{headers:{cookie}});assert.equal(response.status,200);assert.ok(Array.isArray((await response.json()).data.records))}});

test("reports, notifications and client approval portal respond",async(t)=>{const server=app.listen(0);t.after(()=>server.close());const base=`http://127.0.0.1:${server.address().port}`;const login=await fetch(`${base}/api/auth/login`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"admin@cgdm.local",password:"admin123"})});const cookie=login.headers.get("set-cookie").split(";")[0];for(const path of["/api/v1/support/reports","/api/v1/support/notifications","/api/v1/files"]){assert.equal((await fetch(base+path,{headers:{cookie}})).status,200)}const portal=await fetch(`${base}/api/portal/demo-client-token`);assert.equal(portal.status,200);const decision=await fetch(`${base}/api/portal/demo-client-token/decision`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({decision:"APPROVED"})});assert.equal(decision.status,200)});

test("password recovery pages and validation are available",async(t)=>{const server=app.listen(0);t.after(()=>server.close());const base=`http://127.0.0.1:${server.address().port}`;assert.equal((await fetch(`${base}/pages/forgot-password.html`)).status,200);assert.equal((await fetch(`${base}/pages/reset-password.html`)).status,200);const forgot=await fetch(`${base}/api/auth/forgot-password`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"invalid"})});assert.equal(forgot.status,400);const reset=await fetch(`${base}/api/auth/reset-password`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({password:"short"})});assert.equal(reset.status,400)});
