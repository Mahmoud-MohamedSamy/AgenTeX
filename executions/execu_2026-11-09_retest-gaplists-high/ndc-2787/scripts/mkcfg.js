const fs=require('fs');const Z='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/ndc-zoho';
const SUB="TAVI Desk NDC-Staging (ndc-staging-owner) vs NDC's own Zoho Desk (portal wondertravel, read-only captures 2 Nov 2026)";
const C={
c1:{out:"annotated/01-channels-addons-vs-ndc-zoho.png",id:"NDC-2787 M-01 M-02 M-11 M-13",title:"Live chat, IM, Gamescope and Marketplace still missing",verdict:"Gap",
panels:[
{side:"TAVI",caption:"Setup: Channels = Email, Web Forms, Help Center, Community; no Gamescope, no Marketplace",img:"raw/settings-home.png",boxes:[{n:1,x:690,y:140,w:280,h:180},{n:3,x:990,y:485,w:280,h:150},{n:4,x:88,y:140,w:282,h:320}]},
{side:"TAVI",caption:"/chat: \"In Development\" placeholder",img:"raw/p-chat.png",boxes:[{n:2,x:612,y:106,w:636,h:316}]},
{side:"Zoho",caption:"NDC Setup: Chat, Instant Messaging, Gamescope, Marketplace",img:Z+"/setup-home.png",boxes:[{n:1,x:596,y:258,w:210,h:34},{n:2,x:596,y:338,w:210,h:34},{n:4,x:22,y:418,w:200,h:34},{n:3,x:884,y:573,w:200,h:34}]},
{side:"Zoho",caption:"NDC Gamescope: 4 trophies on",img:Z+"/setup/Gamescope/page.png",boxes:[{n:4,x:276,y:215,w:1260,h:390}]}],
rows:[
{n:"1",b:"M-01 Live chat channel",zoho:"Chat channel; 842 K chat tickets (33 %)",tavi:"No Chat channel in Setup",match:"Gap"},
{n:"2",b:"M-01/M-02 Chat + IM inbox",zoho:"Chat and IM tabs; WhatsApp + FlyWT widget active",tavi:"/chat and /social show \"In Development\"; workflows have Reply/Notify via IM but there is no channel",match:"Gap"},
{n:"3",b:"M-11 Extensions",zoho:"Marketplace, 9 extensions installed",tavi:"No marketplace; customer history and calendar exist; related tickets by custom field, attendance, geolocation not found",match:"Gap"},
{n:"4",b:"M-13 Gamescope",zoho:"Quick Responder, SLA Saver, Smile Reaper, Rapid Resolver",tavi:"No Gamescope page",match:"Gap"}],
notes:["Checked read-only on NDC-Staging, 9 Nov 2026. Zoho side: NDC's own Zoho Desk, captured read-only on 2 Nov 2026."]},
c2:{out:"annotated/02-ai-vs-ndc-zoho.png",id:"NDC-2787 M-04",title:"AI on tickets still fails (404)",verdict:"Gap",
panels:[
{side:"TAVI",caption:"Ticket #1803 → AI assist: Summarize and Suggest triage both fail",img:"raw/ai-summary.png",boxes:[{n:1,x:384,y:124,w:260,h:266},{n:2,x:384,y:404,w:260,h:130}]},
{side:"Zoho",caption:"NDC Zia Generative AI: enabled",img:Z+"/setup/Generative-AI/page.png",boxes:[{n:1,x:292,y:325,w:360,h:165},{n:3,x:1428,y:58,w:104,h:28}]}],
rows:[
{n:"1",b:"Ticket summary",zoho:"Zia summary on (NDC)",tavi:"POST /desk/tickets/{id}/ai/summary → 404, \"Something went wrong\"",match:"Gap"},
{n:"2",b:"Owner / priority prediction",zoho:"Field Predictions on (NDC)",tavi:"\"Suggest triage\" → POST …/ai/triage 404",match:"Gap"},
{n:"3",b:"AI in workflows, writing assistant, sentiment",zoho:"Zia workflow action, writing and reply assistant, sentiment on",tavi:"No AI action in Workflow Actions; no writing assistant or sentiment seen",match:"Gap"}],
notes:["New since 2 Nov: an AI assist panel (Summary, Triage suggestion) on the ticket page. The calls still return 404 on NDC-Staging."]},
c3:{out:"annotated/03-agent-scale-vs-ndc-zoho.png",id:"NDC-2787 M-05",title:"User list still stops at 200 rows and ignores paging",verdict:"Gap",
panels:[
{side:"TAVI",caption:"API on NDC-Staging, 9 Nov 2026",flag:"API RESULT — seen 9 Nov 2026",text:["GET /iam/users → 200 rows (121 active + 79 invited).","Same 200 rows, same first and last user for: ?page=2, ?page=2&page_size=50, ?pageNumber=2&pageSize=50, ?pageSize=500, ?limit=5&offset=5, ?cursor=x, ?search=a.","meta = null: no total and no next-page link, so a picker cannot load user 201 and up.","The Desk Agents page (12 desk agents) pages on the screen only (Page 1 of 2)."]},
{side:"Zoho",caption:"NDC Zoho Desk, read 2 Nov 2026",flag:"NDC ZOHO DATA — read-only API, 2 Nov 2026",text:["886 agents, 478 active.","Each active agent is in 9.3 departments on average, up to 57.","Owner, approver and team pickers list all of them."]}],
rows:[{n:"1",b:"List every user",zoho:"478 active agents reachable",tavi:"Fixed 200 rows; paging parameters ignored",match:"Gap"}],
notes:["The bug for this is still not filed (noted in NDC-2787 on 4 Nov)."]},
c4:{out:"annotated/04-attachments-privacy-vs-ndc-zoho.png",id:"NDC-2787 M-10 M-16",title:"No attachment limits and no data subject requests",verdict:"Gap",
panels:[
{side:"TAVI",caption:"Setup → Data Administration: no attachment control, no data subject requests",img:"raw/settings-home.png",boxes:[{n:1,x:390,y:485,w:280,h:345}]},
{side:"TAVI",caption:"Data Retention: deletes old records only (no anonymise)",img:"raw/set-retention.png",boxes:[{n:2,x:290,y:60,w:1000,h:300}]},
{side:"Zoho",caption:"NDC Privacy and Security: Data Subject Requests, Attachments Control",img:Z+"/setup/Attachments-Control/page.png",boxes:[{n:2,x:12,y:598,w:190,h:26},{n:1,x:282,y:478,w:1256,h:170}]}],
rows:[
{n:"1",b:"M-10 Attachment limits",zoho:"Attachments Control (file types); NDC: 40 MB / 40 files for agents",tavi:"No admin setting for size, count or file type",match:"Gap"},
{n:"2",b:"M-16 Anonymise a customer",zoho:"Data Subject Requests; anonymised contacts exist",tavi:"Data Retention deletes closed tickets / activities / idle contacts on a schedule, with legal holds; no anonymise or request flow",match:"Gap"}],
notes:["Upload size itself was not re-tested today (200 MB was accepted on 2 Nov)."]},
c5:{out:"annotated/05-translation-vs-ndc-zoho.png",id:"NDC-2787 M-12",title:"Help Center has English + Arabic; translation still \"Coming soon\"",verdict:"PARTIAL",
panels:[
{side:"TAVI",caption:"Help Center → Languages",img:"raw/hc-languages.png",boxes:[{n:1,x:648,y:280,w:744,h:180},{n:3,x:1300,y:515,w:96,h:30},{n:2,x:648,y:935,w:744,h:60}]},
{side:"Zoho",caption:"NDC Languages: Arabic (ar-EG) configured",img:Z+"/setup/Languages/page.png",boxes:[{n:1,x:240,y:350,w:1360,h:40}]}],
rows:[
{n:"1",b:"Arabic help center",zoho:"ar-EG configured",tavi:"English + Arabic (right to left) can be switched on",match:"Same as Zoho"},
{n:"2",b:"Translate help-center content",zoho:"Automatic translation (Google) on",tavi:"\"Agents translate\" and \"Machine translation\" both \"Coming soon\"",match:"Gap"},
{n:"3",b:"Ticket translation / more languages",zoho:"Available",tavi:"No Translate on the ticket page (NDC-2005 still Backlog); \"Add a language\" Coming soon",match:"Gap"}],notes:[]},
c6:{out:"annotated/06-remote-cliq-vs-ndc-zoho.png",id:"NDC-2787 M-14 M-15",title:"No remote support and no Zoho Cliq",verdict:"Gap",
panels:[
{side:"TAVI",caption:"Collaboration Tools: Slack, Google Drive, Microsoft Teams, Google Chat",img:"raw/set-collab.png",boxes:[{n:2,x:292,y:146,w:976,h:632}]},
{side:"Zoho",caption:"NDC Integrations → Zoho: Zoho Assist and Zoho Lens enabled",img:Z+"/setup/Zoho/page.png",boxes:[{n:1,x:546,y:548,w:862,h:168}]}],
rows:[
{n:"1",b:"M-14 Remote support",zoho:"Zoho Assist + Zoho Lens enabled",tavi:"No screen sharing or remote control in Setup or on the ticket",match:"Gap"},
{n:"2",b:"M-15 Zoho Cliq",zoho:"Cliq integration enabled (NDC on Zoho One)",tavi:"Slack, Teams, Google Chat only",match:"Gap"}],notes:[]}};
for(const k in C){fs.writeFileSync('evidence/'+k+'.json',JSON.stringify({...C[k],sub:SUB,date:'TAVI 9 Nov 2026'},null,1));}
console.log('ok');
