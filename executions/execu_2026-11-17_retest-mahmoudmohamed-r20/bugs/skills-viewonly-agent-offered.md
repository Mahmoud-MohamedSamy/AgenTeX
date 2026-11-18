# Skills | View-only agents are offered in the skill's Agents list, and saving only says "The skill is invalid."

**Summary**
An agent who has view-only access to a department cannot be given that department's skills (correct: a view-only agent cannot own tickets, so skill-based round robin must not pick them). But Add Skill still lists the view-only agent in the Agents list like everyone else, with no mark. When the admin ticks them and saves, the save is refused and the only message is "The skill is invalid." The admin is not told which agent caused it or why. The server's reason ("not_in_department") is also misleading: the agent is in the department, with view-only access.

**Steps to Reproduce**
1. Setup > Departments > Customer Support: Mahmoud Mohamed is a member with View only access.
2. Setup > Skills, department Customer Support > Add Skill.
3. Fill Skill name and Skill type, tick Customer Experience Specialists 1, Mahmoud Mohamed and Customer Experience Specialists 2 in Agents.
4. Save.
5. Untick Mahmoud Mohamed and save again.

**Expected Result**
- The Agents list does not offer view-only agents, or shows them disabled with "(view only)" and a hint such as "View-only agents can't have this department's skills."
- If the server refuses an agent, the message names the agent and the reason, e.g. "Mahmoud Mohamed has view-only access to Customer Support, so they can't have its skills."
- The server's reason says view-only, not "not in department".
- To decide: what happens to an agent's existing skills when they are later made view-only (removed, kept but ignored, or flagged).

**Actual Result**
- Mahmoud Mohamed is offered and can be ticked, with no "(view only)" mark.
- Step 4: 400, banner "The skill is invalid." (server details: agent_ids[1] not_in_department, not shown).
- Step 5: 201, the skill is created with the other two agents.

**Environment**
staging-desk.taviportal.com (NDC-Staging), Edge 156, Windows 10, 18 Nov 2026 09:33 UTC. Jam recording: https://jam.dev/c/a8af1960-ab37-48a9-b4fb-73a7d136244d

**Suggested priority**: Medium

**Evidence**: BUG-skills-viewonly-agent-offered-FAIL.png
