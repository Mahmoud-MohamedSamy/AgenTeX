const fs=require("fs");const W=(n,o)=>fs.writeFileSync("cards/"+n+"-api-card.json",JSON.stringify({host:"staging-desk.taviportal.com",who:"owner session",date:"16 Nov 2026",...o}));
W(2853,{out:"2853-api-card.png",title:"NDC-2853 SLA escalation to Mahmoud Samy — QA RT19 SLA Dept, policy R19SLA2853ipe5 (1-min response; L1 at due custom template, L2 +1 min default)",rows:[
["#4613 owner = Samy","GET /api/v1/desk/tickets/{#4613}/activity (sla.escalation_fired)","L1 12:20:52Z (14:20:52 Cairo) notify outcome done → Mahmoud Samy; L2 12:21:48Z (14:21:48 Cairo) notify done → Mahmoud Samy","bad"],
["User inbox (Samy)","Gmail, checked by the user","Only \"Ticket #4613 assigned to you…\" 14:19 Cairo. NO escalation email for L1 (custom) or L2 (default)","bad"],
["#4690 recheck","GET …/tickets/{#4690}/activity","L1 13:13:39Z (15:13:39 Cairo) done, L2 13:14:45Z (15:14:45 Cairo) done → Mahmoud Samy (inbox pending user)","info"],
["#4614 owner = owner acct","GET …/tickets/{#4614}/activity","Both levels: notify skipped reason no_access (Samy is a dept member), then no_recipients — unchanged by product decision","info"],
["Template subjects","GET /api/v1/desk/email-templates?use_case=ticket.sla_escalation","custom \"QA RT19 SLA 2853 custom L{{sla.level}} #{{ticket.number}}\"; default \"[SLA] #{{ticket.number}} {{sla.obligation}} — level {{sla.level}} ({{sla.timing}})\"","info"]]});
W(2852,{out:"2852-api-card.png",title:"NDC-2852 escalation to an agent who cannot see the ticket — QA RT19 SLA Dept B (Mahmoud Samy not a member), policy R19SLA2852ipe5",rows:[
["Policy save","POST /api/v1/desk/sla/policies (L1 at due, recipient agent Mahmoud Samy)","201 — agent from outside the department accepted","info"],
["#4615 at due","GET …/tickets/{#4615}/activity","L1 12:20:52Z: notify skipped reason no_access; then skipped no_recipients (by product decision)","ok"],
["Editor","Setup › SLA & Escalation › Add Target › Whom to Escalate","Hint: \"Agents are emailed only for tickets they can see. With private ticket sharing, a chosen agent who can't open the ticket is skipped, and the ticket's History says so.\"","ok"]]});
W(2835,{out:"2835-api-card.png",title:"NDC-2835 Before-due escalation vs target time — POST/PUT /api/v1/desk/sla/policies (QA RT19 SLA Dept, inactive)",rows:[
["Respond 1 h, before 2 h","POST /desk/sla/policies","400 VALIDATION_ERROR targets[0].escalations.response[0].offset before_not_shorter_than_target","ok"],
["Equal 60 m / 60 m","POST","400 before_not_shorter_than_target","ok"],
["1 h / 61 m · 1 day / 25 h","POST","400 / 400","ok"],
["Resolution 3 h / before 4 h","POST","400 on targets[0].escalations.resolution[0].offset","ok"],
["Edit saved SLA to 2 h","PUT /desk/sla/policies/{id}","400; stored offset stays 30 minutes","ok"],
["Control 1 h / 59 m","POST","201 saved","ok"]]});
W(2834,{out:"2834-api-card.png",title:"NDC-2834 deleting an escalation template that an SLA uses — DELETE /api/v1/desk/email-templates/{id}",rows:[
["Used by 2 SLAs (active + inactive)","DELETE /desk/email-templates/{Tpl resp}","409 EMAIL_TEMPLATE_IN_USE \"This template is the escalation email of these SLA policies: QA RT19 SLA 2834 active 697c, QA RT19 SLA 2834 second user of resp 697c. Choose another email…\"","ok"],
["Used in an inactive SLA resolution level","DELETE /desk/email-templates/{Tpl resol}","409 naming QA RT19 SLA 2834 inactive 697c","ok"],
["After refusal","GET template · GET policy","template 200; SLA level still points at it","ok"],
["Control: unused template","DELETE","204","ok"],
["Control: after unlinking from the SLA","PUT policy (template_ref null) · DELETE","200 · 204","ok"]]});
W(2833,{out:"2833-api-card.png",title:"NDC-2833 plan allowance used up — account-only SLA, plan 1 ticket/month, contract (QA RT19 SLA Dept)",rows:[
["#4673 first ticket (account)","GET /api/v1/desk/tickets/{id}/sla","applied, coverage contract + plan, remaining 0, timers running","ok"],
["#4674 second ticket","GET …/sla","state none, no obligations (before fix: same SLA as Department policy)","ok"],
["#4676 third ticket","GET …/sla","state none","ok"],
["Plan usage","GET /desk/sla/support-plans/{plan}/usage","used 1, allowance 1, remaining 0, cycle 16 Nov–16 Dec","ok"],
["#4672 control: no account","GET …/sla","state none","ok"],
["#4677 other account, no contract","GET …/sla","applied, coverage general (SLA runs for any ticket with an account)","info"]]});
W(2841,{out:"2841-api-card.png",title:"NDC-2841 contract in QA RT19 SLA Dept vs plan of QA RT19 SLA Dept B",rows:[
["Attach own plan","PUT /api/v1/desk/sla/contracts/{c1}/plan","200","ok"],
["Attach Dept B plan","PUT …/contracts/{c1}/plan","409 SUPPORT_PLAN_OTHER_DEPARTMENT \"Choose a support plan of the contract's own department.\"; plan kept","ok"],
["Change plan list (screen)","Contract › Support plan Info › Change plan","options: QA RT19 SLA Plan 2833, QA RT19 SLA Plan 2841 A — no Dept B plan","ok"],
["Create contract with Dept B plan","POST /api/v1/modules/{Contracts}/records support_plan={Dept B plan}","201; field keeps the Dept B plan id; coverage no_plan; page \"No support plan is linked to this contract\" — no message","bad"],
["New Contract form","Create Contract › Support Plan picker (Dept = QA RT19 SLA Dept)","lists other departments' plans (QA AO Dept A, QA RT19 SLA Dept B, Tech)","bad"]]});
