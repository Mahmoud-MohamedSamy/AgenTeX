# Zoho Desk ledger — r19 Zoho comparison lane (16 Nov 2026)
Portal: techegysolutions (org 946801013, Enterprise), admin account = row 1 of "Zoho Credentials 14-11-2026.csv" (techsolutionsegypt not usable: its credentials file is gone and its trial ended 15 Nov).

| time (UTC) | action | record | state |
|---|---|---|---|
| 13:24:58 | API create x5 (parallel), dept Tech | tickets #114..#118 (ids 1499272000000480038..484038), subject "QA RT19 ZD D2 burst 1..5", contact "QA RT19 ZD" (example.com address) | created |
| 13:35 | API create skill types | 'QA RT19 ZD Type' (Tech, 1499272000000485001), 'QA RT19 ZD Type E' (TechEgySolutions, 1499272000000485004) | created |
| 13:44 | API create skills (criteria Subject is "QA RT19 ZD nomatch") | Tech: QA RT19 ZD SkA 1499272000000485010 (active), QA RT19 ZD SkInact 485020 (inactive), QA RT19 ZD SkDel 485030 (to delete); TechEgySolutions: QA RT19 ZD SkOther 485040 | created |
| 13:46-13:50 | D4: SkDel deleted (204); ticket #114 entitySkills PATCHed 7 times (ends []); API create #119 (480073), #120 (480111), #121 (480155) 'QA RT19 ZD D4 create ...' | tickets created; SkDel deleted |
| 14:38 | Setup > Import (UI) Tickets.csv, 2 rows: owner 'test agent 1' (name) / unknown example.com email; Owner mapped to Owner > Email ID (wizard offers only Agent ID / Agent External Id / Email ID) | import 1499272000000485053 Success | created |
| 14:38 | import result: #122 (1499272000000491001, owner 'test agent 1' by name) and #123 (491037, unknown email) created in TechEgySolutions, both Unassigned; detail view Total 2 / Created 2 / Skipped 0 / Failed 0 / Success | created |
| 14:45 | cleanup: tickets #114-#123 (10) moveToTrash 204; skills 485010/485020/485040 DELETE 204 (485030 deleted earlier); skill types 485001/485004 DELETE 204; contacts "QA RT19 ZD" x5 (480001..484001, created by the parallel API creates) moveToTrash 204 | deleted |
| 14:46 | Recycle Bin: POST /api/v1/recycleBin/delete for the 15 QA RT19 ZD items -> 200; bin now 0 items | purged |
| 14:47 | verify: ticket search "QA RT19*" 0, contact search 0, bin 0, skills 0 and skill types 0 in Tech + TechEgySolutions | clean |
| left | Import History row 1499272000000485053 (Zoho offers no delete for import history) | remains |
| 15:10 | API create support plans 'QA RT19 ZD Plan E' (TechEgySolutions, 1499272000000485162) and 'QA RT19 ZD Plan T' (Tech, 485177), Bronze SLA, TICKETS monthly 10 | created |
| 15:25 | API ticket #124 (1499272000000483110) 'QA RT19 ZD 2963 comment' in Tech + 2 private comments with HTML body (contentType html 483145, plainText 483149); contact QA RT19 ZD (new) | created |
| 15:40 | API contract 'QA RT19 ZD C own' (TechEgySolutions, plan E) 1499272000000485192 created; 'QA RT19 ZD C other' (plan of Tech) refused 422 'Invalid SupportPlan ID' (not created) | created |
| 15:50 | cleanup: contract 485192 moveToTrash 204; ticket #124 moveToTrash 204; contact QA RT19 ZD 483073 moveToTrash 204; support plan T 485177 DELETE 204; Recycle Bin delete (3 QA items) 200 -> bin 0; support plan E 485162 DELETE 204 (first try refused while the contract still existed in the bin) | deleted |
| 15:51 | verify: support plans 0 and contracts 0 in both depts, ticket search "QA RT19*" 0, bin 0 | clean |
| 15:34 | GS lane (Zoho CRM org946877290): global set "QA RT19 GS Zsort" 7666662000000722001 (entered order Silver, Platinum, Bronze) |
| 15:34 | GS lane (Zoho CRM org946877290): Leads field "QA RT19 GS ZTier" 7666662000000722008 |
| 15:34 | GS lane (Zoho CRM org946877290): lead "QA RT19 GS Z1" 7666662000000722020 (Bronze) |
| 15:34 | GS lane (Zoho CRM org946877290): lead "QA RT19 GS Z2" 7666662000000722022 (Platinum) |
| 15:34 | GS lane (Zoho CRM org946877290): lead "QA RT19 GS Z3" 7666662000000722024 (Silver) |
| 15:35 | GS lane (Zoho CRM org946877290): Leads custom view "QA RT19 GS Zsort view" 7666662000000722031 (sorted asc by QA RT19 GS ZTier) |
| 15:41 | GS lane (Zoho CRM org946877290): cleanup: view 400, leads 200, field 200, set 202, bin purge 200, bin QA left 0 |
| 15:43 | GS lane (Zoho CRM org946877290): cleanup check: custom views {"cvsMine":"200 7666662000000722031:QA RT19 GS Zsort view","del 7666662000000722031":"400 {\"code\":\"INVALID_REQUEST_METHOD\",\"details\":{},\"message\":\"The http request method type is not a valid one\",\"status\":\"error\"}\n","setsAfter":"Source, Industry, Team Member Role, Access, Country__s,  |
| 15:44 | GS lane (Zoho CRM org946877290): custom view delete via UI → QA views left 1; sets now: Source, Industry, Team Member Role, Access, Country__s, States__s, QA RT19 GS Zsort |
| 15:59 | GS lane (Zoho CRM org946877290): final check: QA set present=true, QA views 1 (7666662000000722031), leads search 204, bin QA 0, QA fields 0 |
| 15:59 | GS lane (Zoho CRM org946877290): set delete retry → 202 {"global_picklists":[{"code":"SCHEDULED","details":{"job_id":"7666662000000722049"},"message":"global picklist delete scheduled successfully","status":"success"; GET set → 200 |
