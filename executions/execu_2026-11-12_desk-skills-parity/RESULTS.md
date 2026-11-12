# Results — TAVI vs Zoho Desk Skills (12 Nov 2026)
Match: Same / Differs / Gap / TAVI extra / Not comparable

| Id | Behaviour | Zoho (seen live 12 Nov) | TAVI (NDC-Staging 12 Nov) | Match |
|---|---|---|---|---|
| SK-B01 | Skill type required | 422 skillTypeId missing | 400 type_id required | Same |
| SK-B02 | Duplicate skill name (any case) | refused | 409 SKILL_DUPLICATE | Same |
| SK-B03 | Name max length | 50 (51+ refused) | 100 (51 accepted, 101 refused) | TAVI extra |
| SK-B04 | Blank / spaces name | refused | refused | Same |
| SK-B05 | Criteria required | yes (422 criteria missing) | optional ("never added automatically") | TAVI extra |
| SK-B06 | HTML characters in a skill name | refused ("does not match the allowed values") | accepted and shown as plain text (escaped, safe) | TAVI extra |
| SK-B07 | Create skill as Inactive | allowed | allowed | Same |
| SK-C01 | Duplicate skill type (any case) | refused 422 | 409 SKILL_TYPE_DUPLICATE | Same |
| SK-C02 | Rename skill type | allowed | allowed | Same |
| SK-C03 | Delete type that skills use | refused "has skill mappings" | 409 "Skills still have this skill type" | Same |
| SK-A01 | Reorder skills (whole list) | POST /skills/order, list follows | PUT /desk/skills/order, list follows; partial list → 409 stale | Same |
| SK-D01 | Active ↔ Inactive toggle | allowed | allowed | Same |
| SK-D02 | 30 active skills per department | 31st refused (create or activate); inactive allowed | same, message "up to 30 active skills" | Same |
| SK-F01 | Agents on a skill ↔ an agent's skills | skill agentIds; unconfirmed agent silently dropped | both directions stay in step; agent outside the department refused | Same |
| SK-E01 | Default preferences of a department | auto-add ON, AT_THE_END (both depts) | new dept: auto_add OFF, bottom | Differs |
| SK-G01 | Auto-add on create, order (placement end, list order S3,S2,S1) | S3,S2,S1 (+ matching 'test'); inactive not added | S3,S2,S1; inactive not added | Same |
| SK-G02 | Manually set an INACTIVE skill on ticket | silently dropped | saved on ticket | Differs (bug) |
| SK-G03 | Manually set a skill of ANOTHER department | silently dropped | saved on ticket | Differs (bug) |
| SK-G04 | Manual order of ticket skills kept | kept | kept | Same |
| SK-G05 | 10 skills max per ticket | 11 → 422 range 0-10 | 11 → 422 "more than 10" | Same |
| SK-G06 | Unknown skill | (ids) | 422 not allowed value | Same |
| SK-G07 | Skill rename reaches tickets | ids, so yes | stored by name but rename updates tickets (seen) | Same |
| SK-G08 | Edit of another field re-adds matching skills | yes | yes | Same |
| SK-G09 | Recalculate one ticket | re-applies criteria: adds matching, removes non-matching (even manual) | same (adds S3/S1, drops S2); no-criteria manual skill kept | Same |
| SK-H01 | Skill-based RR: ticket skills [S3], pool agent lacks S3 | not assigned (#180) | not assigned (#3130) | Same |
| SK-H02 | Skill-based RR: ticket [S3,S1/test], agent has only one of them | ASSIGNED (#181) — agent needs at least one skill | NOT assigned (#3131) — TAVI needs every skill ("holding every active skill") | Differs (bug) |
| SK-H03 | Skill-based RR: ticket with NO skills | not assigned (#182) | ASSIGNED to pool agent (#3132) | Differs (bug) |
| SK-H04 | Skill-based RR on create (rule + threshold free) | assigned (#174) | (B-series run on create) | Same |
| SK-H05 | Assign by skills on one ticket | executeSkillbasedAssignment assigns when an agent has any one of the ticket skills | POST /skills/assign: "No agent of the department holds every skill on the ticket" for [S3,S1] | Differs (bug) |
| SK-H06 | Department threshold blocks skill RR | counts only the agent's open tickets IN THIS DEPARTMENT: Fathy 5 open in Tech + 1 elsewhere; threshold 3 → not assigned, threshold 6 → assigned (#189) | counts the agent's open tickets in ALL departments: Test User 1 has 2 open in QA SK13 Dept A but ~92 tenant-wide; threshold 1 and 40 → not assigned (#3177, #3181), 100 → assigned (#3182); threshold off → assigned (#3179) | Differs (bug, NDC-2970) |
| SK-J01 | Skills as a ticket layout field | YES: standard field Skills (Lookup, entitySkills), Ticket Information, removable, not mandatory | YES: multi-select skills, Ticket Information, deletable | Same |
| SK-J02 | Skills on the create form | not on Add Ticket | shown on Create Ticket | Differs (bug) |
| SK-J03 | Skills on the ticket page | Ticket Properties › Ticket Information (chips, editable) | Ticket Properties › Ticket Information + a side-rail Skills tab | Same |
| SK-D03 | Delete a skill that tickets use | allowed; removed from ticket #181 | allowed; removed from tickets; dialog lists where it is used first | Same |
| SK-D04 | Where a skill is used | relatedRules (rules only) | usage: assignment rules, workflow rules/actions, other skills' criteria, agents, open tickets (no approval processes, NDC-2805) | TAVI extra |
| SK-G10 | Recalculate many tickets | no bulk action seen (per ticket / workflow action) | Skills page Recalculate skills: every open unowned ticket in ALL departments (96), progress + last run | TAVI extra |
| SK-J04 | New Ticket form Skills options | no Skills input on Add Ticket | Skills chips on Create Ticket list EVERY department's skills, incl. inactive (dept = Sales showed Customer Support, QA AS6, QA SK12 skills, QA AS6 sk3 inactive) | Differs (bug) |
| SK-J05 | Ticket page inline "Edit Skills" options | Skills field in Ticket Properties (Zoho drops inactive/other-dept on save) | lists every department's skills incl. inactive; long names overflow sideways | Differs (bug) |
| SK-J06 | Ticket Skills tab › Associate Skills | Skills panel (Associate Skills, seen 9 Nov) | only active skills of the ticket's department | Same |
| SK-B08 | Skill name with HTML shown on the page | n/a (refused) | escaped, shown literally | Same |
| SK-K01 | Desk Agent without automation permission | needs Help Desk Automation permission (docs) | 403 desk:assignment:manage on list/create/prefs/delete/recalc | Same |
| SK-A02 | Skills list page | Name, Skill Type, Agents, Status; filters; Add Skill; Skill Preferences | same, plus Active skills n of 30, Recalculate, Agent Skills tab | Same |
| SK-I01 | Workflow skill actions available | Add Skills, Remove Skills, Recalculate Skills, Reassign ticket based on Skills | Add skills, Remove skills, Recalculate skills, Reassign ticket based on skills | Same |
| SK-I02 | Add/Remove Skills: how many per action | 1–10 ("You have reached maximum number of skills.") | 1–10 (11th box disabled; hint "Choose 1 to 10 skills") | Same |
| SK-I03 | Add/Remove Skills: which skills the picker offers | only the rule department's ACTIVE skills (13 Tech skills; inactive and other-department skills not listed) | 87 skills: every department's skills, inactive ones, and 31 skills already DELETED (QA SK12 …); choosing a department for the rule does not narrow the list | Differs (bug, NDC-2971) |
| SK-I04 | Add Skills on a ticket that would pass 10 skills | ticket kept at 10; extra skills silently skipped (#187 → 10; #188 had 2 → 10) | ticket kept at 10; extra skills skipped (#3174; #3175 had 2 → 10) | Same |
| SK-I05 | Add Skills action holding an inactive skill | cannot be chosen | can be chosen; skipped when the rule runs (#3174 got 9 of 10) | Same at run time (picker = SK-I03) |
| SK-J07 | Deleted skill still offered on tickets | a deleted skill is gone everywhere | Create Ticket Skills field lists 32 deleted QA SK12 skills; a ticket saved with deleted "QA SK12 S1" keeps it (#3176) | Differs (bug, NDC-2971) |
