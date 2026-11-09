# Plane draft — Desk Skills (not filed)

| Field | Proposal |
|---|---|
| Project | NDC |
| Title | Desk Skills: missing functions vs Zoho Desk |
| Module | Desk |
| Label | Assignment Rules |
| Priority | Medium (NDC-1978 puts skills in Phase 3) |
| State | Backlog |
| Assignees | Mahmoud Mohamed + mfathy (same as NDC-2275) |
| Relations | relates to NDC-2275 (RR-9, RR-18) and NDC-1978 (detail 6) |
| Attachments | `evidence/tavi-01-skills-tab.png`, `tavi-02-agent-skills-tab.png`, `tavi-03-skill-editor.png`, `../desk-assignment-rules/evidence/11-skills-vs-zoho.png` |

Checked 1 Nov 2026 on staging-desk.taviportal.com (org Anyware, owner), bundle `index-Dhp544pg.js` / `AssignmentRulesPage-BdfrCSQL.js`. Pages, code, strings and the API were read with GET requests only. Nothing was saved. Zoho side: live check on 6 Oct 2026 (Setup → Customization → Skills), plus Zoho's help and API docs (`docs/desk-assignment-rules/reference/zoho-docs-inventory.md` §3.2, `zoho-live-notes.md`).

---

## Description (what goes into Plane)

### Goal
Make Desk Skills work like Zoho Desk: an admin defines skills with a type, criteria and agents. Desk adds skills to matching tickets. Skill-based round robin then sends each ticket to an agent who has those skills. This ticket lists only what is still missing. Routing rules are in NDC-2275.

### Already in TAVI Desk (checked 1 Nov 2026)
- **Assignment Rules → Skills tab** (new since 6 Oct):
  - **Preferences:** "Add skills to tickets by their criteria" (off by default) and "Where added skills go": top, bottom, or the order of the list.
  - **Skill types:** add, rename and delete. Deleting a type keeps its skills and leaves them untyped.
  - **Per skill:** type, description and criteria (AND / OR builder). "Clear" resets a skill that was removed from the field.
- **Skills come from the Tickets "Skills" field.** They are options of a multi-select field, added and renamed in Modules & Fields.
- **Agent Skills tab:** tick the skills each agent has.
- **Skill-based round robin:** only agents who hold every skill on the ticket are eligible. Offline agents are skipped.
- **Workflow actions:** Add skills, Remove skills (1–25 skills), Recalculate skills, Reassign ticket based on skills. The ticket history shows these actions.
- Sandbox deploy covers skills, skill types, agent skills and skill settings.
- Not run yet: skill stamping, recalculation and reassignment on a real ticket. No ticket was created during this check.

### Missing compared with Zoho Desk
1. **Skills per department.**
   - Zoho: skills, the skill preference and the skill order are set per department. The limit is 30 active skills per department, and agents are mapped to skills per department.
   - TAVI: one list of skills and one set of preferences for the whole company.
2. **Active / Inactive status for a skill.**
   - Zoho: each skill is Active or Inactive. An inactive skill is not added to tickets and is not used for assignment.
   - TAVI: no status. The only way to stop a skill is to delete the field option.
3. **Create a skill on the Skills page, with a required type.**
   - Zoho: "Add Skill" asks for Skill Name (required), Skill Type (required, with "Add Skill Type" inline), Description, Criteria and Agents.
   - TAVI: no Add Skill button. The name is added in Modules & Fields, and the type is optional ("No type").
4. **Agents on the skill form.**
   - Zoho: the skill form has an Agents field ("Associate agents with this skill…").
   - TAVI: agents can only be picked one agent at a time on the Agent Skills tab. The skill editor has no agents.
5. **Search and filters on the skills list.**
   - Zoho: Skills and Skill Types tabs, filters by Name, Skill Type, Agents and Status.
   - TAVI: a plain list with no search and no filters. Skill types are a single inline row.
6. **Reorder skills.**
   - Zoho: skills are reordered per department, and "Order in which they are added during settings" follows that order.
   - TAVI: the "In the order the skills are listed here" option exists, but the Skills tab has no reorder control. The order follows the field options.
7. **Recalculate skills and run skill-based assignment on a single ticket.**
   - Zoho (API docs): "Recalculate Skills" and "Execute skill-based assignment" can be run for one ticket.
   - TAVI: only as workflow actions. There is nothing on the ticket itself.
8. **Show where a skill is used.**
   - Zoho: lists the rules that use a skill ("related rules").
   - TAVI: deleting a skill option shows "Removed from the field". No warning names the workflows or rules that still use it.
9. **Limits.**
   - Zoho: at most 10 skills on a ticket. The first skill has the highest priority.
   - TAVI: no limit on the ticket field, and the workflow action allows 25. Decide whether to match Zoho.

### Questions for the team
- The Department form still has its own Routing setting (Round robin / Least busy / Skill match). Which one decides when it conflicts with the assignment rules?
- Is skill stamping meant to run before Direct Assignment (step 1 of the execution order in NDC-2275, EO-1)?

### Evidence
- TAVI: Skills tab, Agent Skills tab, skill editor (attached).
- TAVI vs Zoho: `11-skills-vs-zoho.png` (from 6 Oct, Zoho Skills / Add Skill).
