// Writes API-card specs (from the saved live responses in access/raw, 17 Nov) and renders them with scripts/apicard.js
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname; const S = path.join(D, '../../../scripts/apicard.js');
const cards = {
  'g3-tavi.png': { title: 'TAVI · light agent put in a team (NDC-Staging, owner, 17 Nov)', sub: 'Test User 1 switched to Desk Light Agent; then a team is created with them in Customer Support', rows: [
    ['Profile', 'POST /iam/users/{TestUser1}/profiles  {profile: Desk Light Agent, replace: true}', '204 · profileNames "Desk Light Agent"', 'info'],
    ['Make light agent the owner', 'POST /desk/tickets/{SH2}/assign  {owner_id: TestUser1}', '422 "User … is not an active agent of the ticket\'s department." (owner refused — correct)', 'ok'],
    ['Create team with light agent', 'POST /desk/teams  {name: "QA AC Light Team", department: Customer Support, sources: [agent TestUser1]}', '201 · team created', 'bad'],
    ['Team members', 'GET /desk/teams/{QA AC Light Team}', 'member_user_ids: [TestUser1]  (the light agent is a member)', 'bad'],
    ['Give the team a ticket', 'POST /desk/tickets/{CSE}/assign  {owner_id: null, team_id: QA AC Light Team}', '200 · ticket now owned by the light agent\'s team', 'bad'] ] },
  'g3-zoho.png': { title: 'Zoho Desk · light agent put in a team (org TechEgySolutions, admin, 17 Nov, live)', sub: 'test agent 1 switched to Light Agent; the same team call with a full agent as control', rows: [
    ['Make agent 1 light', 'PATCH agents/{agent1}  {rolePermissionType: "Light"}', '200 · profile Light Agent', 'info'],
    ['Team with light agent', 'POST teams  {name: "QA AC2 Light Team", departmentId: TechEgySolutions, agents: [agent1]}', '422 INVALID_DATA · fieldName "/agents" invalid', 'ok'],
    ['Control: full agent', 'POST teams  {name: "QA AC2 Control Team", departmentId: TechEgySolutions, agents: [agent2]}', '200 · team created (deleted after)', 'info'] ] },
  'g5-zoho.png': { title: 'Zoho Desk · ticket access set per agent (org TechEgySolutions, 17 Nov, live)', sub: 'agent 2 opens agent 1\'s ticket #130 in TechEgySolutions (both agents in that department)', rows: [
    ['agent 2 = AgentPublic', 'GET tickets/{#130}  (as agent 2)', '200 · and PATCH priority 200 (all department tickets)', 'info'],
    ['Change agent 2 only', 'PATCH agents/{agent2}  {rolePermissionType: "AgentPersonal"}', '200 · role "Personal" (own + unassigned tickets)', 'info'],
    ['agent 2 = AgentPersonal', 'GET tickets/{#130}  (as agent 2)', '403 FORBIDDEN "You are not authorized to access this resource."', 'ok'],
    ['agent 2 = AgentPersonal', 'PATCH tickets/{#130} {priority}; POST comments', '403 / 403', 'ok'],
    ['Other agents', '—', 'unchanged: still see every department ticket (setting is per agent)', 'info'] ] },
  'g6-zoho.png': { title: 'Zoho Desk · follower after the ticket leaves their department (17 Nov, live)', sub: 'agent 2 (TechEgySolutions only) follows Y3; admin moves it to Tech', rows: [
    ['Follow', 'POST tickets/{Y3}/addFollowers  {followerIds: [agent2]}  (as agent 2)', '204', 'info'],
    ['Followers before', 'GET tickets/{Y3}/followers', 'data: [test agent 2]', 'info'],
    ['Move', 'POST tickets/{Y3}/move  {departmentId: Tech}  (admin)', '200', 'info'],
    ['Followers after', 'GET tickets/{Y3}/followers', 'data: []  · agent 2 removed, gets no more updates', 'ok'] ] },
  'g6-tavi.png': { title: 'TAVI · follower after the ticket leaves their department (NDC-Staging, 17 Nov)', sub: 'agent C (Customer Support) follows #4860; owner moves it to Sales and adds a comment', rows: [
    ['Follow', 'PUT /desk/tickets/{#4860}/follow  (as C)', '200', 'info'],
    ['Move', 'POST /desk/tickets/{#4860}/move  {department: Sales}  (owner)', '200', 'info'],
    ['Followers after', 'GET /desk/tickets/{#4860}/followers', 'data: [C]  · C still a follower', 'bad'],
    ['C opens the ticket', 'GET /modules/{tickets}/records/{#4860}  (as C)', '403 · GET /desk/tickets/{#4860} 404', 'info'],
    ['C\'s bell', 'GET /notifications  (as C)', '"Ticket #4860 moved to Sales: QA AC2 R3" + "New comment on ticket #4860: QA AC2 R3"', 'bad'] ] },
  'd08-tavi.png': { title: 'TAVI · Share data with peers on role Manager (NDC-Staging, 17 Nov)', sub: 'Ticket Access: Private, own departments, peers = Manager. D and E are both Manager in Customer Support', rows: [
    ['D views E\'s ticket', 'GET /modules/{tickets}/records/{CSE}  (as D)', '200', 'ok'],
    ['D edits E\'s ticket', 'PATCH /modules/{tickets}/records/{CSE}  {priority: low}', '403 "Permission denied."', 'bad'],
    ['D comments', 'POST /desk/tickets/{CSE}/comments  {private}', '201', 'info'],
    ['E on D\'s ticket', 'same three calls (as E on CSD)', '200 / 403 / 201', 'bad'],
    ['Page text', 'Setup › Ticket Access › Share data with peers', '"Agents in a ticked role can read — not edit — the tickets owned by the other agents in the same role."', 'info'] ] },
  'd08-zoho.png': { title: 'Zoho Desk · Share Data with Peers on role Manager (17 Nov, live)', sub: 'agents 1 and 2: access type Custom, role Manager, Agent profile; tickets data sharing Private', rows: [
    ['Peers OFF', 'GET tickets/{Y5 owned by agent 1}  (as agent 2)', '403 · PATCH 403 · comment 403', 'info'],
    ['Peers ON', 'PATCH roles/{Manager}  {shareDataWithPeers: true}', '200', 'info'],
    ['agent 2 views', 'GET tickets/{Y5}', '200', 'ok'],
    ['agent 2 edits', 'PATCH tickets/{Y5}  {priority: High}', '200 · priority now High', 'ok'],
    ['agent 2 comments', 'POST tickets/{Y5}/comments  {isPublic: false}', '200', 'ok'] ] },
};
for (const [out, c] of Object.entries(cards)) { const f = path.join(D, 'card-' + out.replace('.png', '.json')); fs.writeFileSync(f, JSON.stringify({ out, title: c.title, rows: c.rows, width: 900, height: 560, host: /zoho/.test(out) ? 'desk.zoho.com, org TechEgySolutions' : 'staging-desk.taviportal.com, NDC-Staging', who: (/zoho/.test(out) ? 'admin + test agent 2' : 'owner + agents C/D/E') + ' — ' + c.sub, date: '17 Nov 2026' })); console.log(execFileSync('node', [S, f]).toString().trim()); }
