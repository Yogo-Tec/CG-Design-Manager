import test from "node:test";
import assert from "node:assert/strict";
import { app } from "../server/src/app.js";
test("health endpoint returns ok", async (t) => {
  const server = app.listen(0); t.after(() => server.close());
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { data: { status: "ok", service: "cgdm-api" } });
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
