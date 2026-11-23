// Full details for the 4 failing cases and the 10 new run-2 findings (execution report).
// Steps / expected / actual come from bug-drafts.js; this file adds the rule set-up, every attempt, the exact system message and the impact.
module.exports = {
  "fails": [
    {
      "id": "TC-01",
      "severity": "Medium",
      "setup": [
        "Editor (app code): the \"changed\" operator is hidden for On Create rules but offered for On Edit and Create or Edit rules.",
        "Rules on QA AO Dept B, guarded by Subject starts with \"QA WF <tag> \", action Field Update (Agency code = WF):",
        "A. On Create + Priority changed · B. On Create + Subject changed · C. On Edit + Priority changed (control) · D. Create or Edit + Priority changed."
      ],
      "attempts": [
        [
          "Run 2 (22 Nov)",
          "A, ticket created High",
          "1 ticket",
          "Fired"
        ],
        [
          "Retest 1 (23 Nov)",
          "A, ticket created High",
          "1 ticket",
          "Fired"
        ],
        [
          "Retest 2 (23 Nov)",
          "A, tickets created High / default (Medium) / Low",
          "3 tickets",
          "Fired on all 3"
        ],
        [
          "Retest 2 (23 Nov)",
          "B, ticket created",
          "1 ticket",
          "Fired"
        ],
        [
          "Retest 2 (23 Nov)",
          "D, ticket created Low, then Low→High",
          "1 ticket",
          "Fired on create (wrong) and on the edit (right)"
        ],
        [
          "Retest 2 (23 Nov)",
          "C control, Priority Low→High",
          "1 ticket",
          "Fired once on the edit (right)"
        ],
        [
          "Retest 2 (23 Nov)",
          "C control, another field edited",
          "1 ticket",
          "No run (right)"
        ],
        [
          "Teammate Jam 40183b6e (23 Nov)",
          "Rule \"test\": Create or Edit + Priority changed, Customer Support",
          "4 tickets",
          "Fired on create for #7197, #7208–#7210 (Medium default and Urgent)"
        ]
      ],
      "message": "Execution History: Fired (trigger RecordCreated), Field Update Succeeded.",
      "impact": "Any Create or Edit rule that uses \"changed\" runs on every new ticket, so actions meant for a field change (notify, reassign, escalate) also hit all new tickets.",
      "evidence": "evidence/TC01-editor-code-check.txt"
    },
    {
      "id": "OB-02",
      "severity": "Medium",
      "setup": [
        "Unsaved rule: Tickets · On Create · Priority is High · Field Update. Sent to Test rule with a sample record.",
        "Control: Test rule on a saved rule with the same condition works (match and no-match both answered)."
      ],
      "attempts": [
        [
          "Run 1 (22 Nov)",
          "Sample record id and real ticket id",
          "4 tries",
          "Error 500 every time"
        ],
        [
          "Retest (23 Nov)",
          "Sample with Priority High (should match) and Low (should not match)",
          "2 tries",
          "Error 500 both times"
        ]
      ],
      "message": "An unexpected error occurred. Please try again. (INTERNAL_ERROR, HTTP 500)",
      "impact": "Admins cannot test a rule before saving it, so the only way to try a rule is to save and activate it on live tickets.",
      "evidence": "OB02-new-editor.png"
    }
  ],
  "findings": [
    {
      "id": "AC-10",
      "severity": "Low",
      "setup": [
        "Zoho Desk (live, 23 Nov): workflow action \"Assign Ticket\" offers Assignee = Agent, Team or Agent in a Team only. No assignment-rule option.",
        "Editor: Add action → Owner Assignment shows only \"Assign to\" (user, team, role, profile, user field). The \"Assign by → assignment rule\" switch is in the app code but needs a setting Desk never turns on (ownerAssignmentOptions), so the option cannot be chosen in the editor or the saved-actions library. Checked by hand and in the code, 23 Nov.",
        "API set-up used for the runtime test. Department: QA AO Dept B (agents Test User 1, Dev Team 2, owner).",
        "Assignment rule A (direct, active): when Subject starts with \"QA WF RTAC10d\", assign agent Test User 1.",
        "Assignment rule B (round robin, active, sequential): when Subject starts with \"QA WF RTAC10r\", pool Test User 1 + owner.",
        "Workflow rule 1: Tickets · On Create · condition Subject starts with \"QA WF RTAC10d \" · action Owner Assignment → An assignment rule → A.",
        "Workflow rule 2: same, pointing at B."
      ],
      "attempts": [
        [
          "Run 2 (22 Nov)",
          "Active direct, inactive direct, active round robin (first set-up)",
          "3 tickets",
          "Skipped \"the assignment rule picked nobody\" on all 3"
        ],
        [
          "Run 2 (22 Nov)",
          "Active direct, active round robin, rule deleted after saving (second set-up)",
          "3 tickets",
          "Skipped on all 3, yet the 3 tickets ended up with owners (Test User 1, owner, Test User 1) set outside the workflow action. The deleted rule stays in the workflow action, rule still active, no warning"
        ],
        [
          "Retest (23 Nov)",
          "Active direct rule A",
          "1 ticket",
          "Skipped, no owner"
        ],
        [
          "Retest (23 Nov)",
          "Active round-robin rule B",
          "1 ticket",
          "Skipped; the round-robin rule then assigned Test User 1 on its own"
        ],
        [
          "UI check (23 Nov)",
          "Look for the assignment-rule choice in the Owner Assignment form",
          "manual + code",
          "Not offered in Desk"
        ],
        [
          "Zoho live (23 Nov)",
          "Setup › Workflows › Rules › new rule › Actions › Assign Ticket",
          "read only",
          "Agent / Team / Agent in a Team; no assignment rule"
        ]
      ],
      "message": "Not assigned: the assignment rule picked nobody.",
      "evidence": "evidence/AC10-ui-code-check.txt, AC10-zoho-assign-ticket-options.png",
      "impact": "No user can reach this through the editor, and the editor matches Zoho. The risk is an API-only option that saves without error and then never assigns. Remove it or make it work."
    },
    {
      "id": "MR-07",
      "severity": "High",
      "setup": [
        "Rule: On Create · Field Update (Company = MR07-v1) delayed 90 s.",
        "A matching ticket created; 5 s later the rule was edited (value → MR07-v2) and saved (200)."
      ],
      "attempts": [
        [
          "Run 2 (22 Nov)",
          "Edit while the action is pending",
          "1 ticket",
          "Pending action Cancelled; new version never scheduled; field unchanged after 2 min"
        ],
        [
          "Run 2 (22 Nov)",
          "Control: edit refused (PUT, 405), rule unchanged",
          "1 ticket",
          "Ran after 90 s (MR07-v1 set)"
        ]
      ],
      "message": "Cancelled — rule_action 52e726c3… no longer exists",
      "impact": "Any edit of a rule, even a typo fix, silently drops every pending scheduled action on every ticket. Time-based follow-ups (reminders, escalations) can be lost without anyone noticing."
    },
    {
      "id": "AT-12",
      "severity": "Medium",
      "setup": [
        "Skill \"QA WF skill1\" given only to Dev Team 2 (offline, last active 19 Nov).",
        "Rule: On Edit · Reassign based on skills.",
        "Ticket 1 has skill1; ticket 2 has no skill any agent has."
      ],
      "attempts": [
        [
          "Run 2 (22 Nov)",
          "Ticket with skill1",
          "1 ticket",
          "Owner → Dev Team 2 (offline); Succeeded"
        ],
        [
          "Run 2 (22 Nov)",
          "Ticket with no matching skill",
          "1 ticket",
          "Owner cleared; Succeeded"
        ]
      ],
      "message": "Execution History: ReassignTicketBySkills = Succeeded (both tickets)",
      "impact": "Tickets go to agents who are not working, and tickets no agent can handle lose their current owner with no trace of why."
    },
    {
      "id": "AT-03",
      "severity": "Medium",
      "setup": [
        "Rule: On Create · Add comment \"S=${subject} P=${priority} N=${ticket_number} \" + Arabic text + 3,000 characters + \"END\"."
      ],
      "attempts": [
        [
          "Run 2 (22 Nov)",
          "One ticket",
          "1 ticket",
          "Comment added (3,046 chars, Arabic and END kept); N= empty"
        ]
      ],
      "message": "Comment text began: \"S=QA WF AT03 ticket P=medium N= مرحبا بكم …\"",
      "impact": "Comments and emails that quote the ticket number show a blank."
    },
    {
      "id": "CF-11",
      "severity": "Medium",
      "setup": [
        "Department with no SLA.",
        "Rules: SLA name is empty; SLA violated is false; SLA escalated is false; First response at is not empty (On Edit)."
      ],
      "attempts": [
        [
          "Run 2 (22 Nov)",
          "New ticket, no SLA",
          "1 ticket",
          "SLA name is empty matched; SLA violated is false and SLA escalated is false did not match"
        ],
        [
          "Run 2 (22 Nov)",
          "After an agent reply",
          "1 ticket",
          "First response at is not empty matched on the next edit"
        ]
      ],
      "message": "SLA violated and SLA escalated are empty (null) on these tickets, not false.",
      "impact": "Rules meant for \"tickets not in breach\" skip every ticket without an SLA."
    },
    {
      "id": "PF-03",
      "severity": "Medium",
      "setup": [
        "217 workflow rules on Tickets (164 active, 53 inactive).",
        "Browser: Settings → Automation → Workflow Rules, owner account."
      ],
      "attempts": [
        [
          "Run 2 (22 Nov)",
          "Open the list",
          "1 load",
          "First row after about 74 s; all 217 rows rendered at once"
        ],
        [
          "Run 2 (22 Nov)",
          "Open one rule",
          "1 load",
          "4.4 s"
        ]
      ],
      "message": "—",
      "impact": "With a realistic number of rules the page looks broken for over a minute. The limit is 200 per department, so lists this size are expected."
    },
    {
      "id": "AC-25",
      "severity": "Low",
      "setup": [
        "Rule: On Create · Update related record → Contact → set a field.",
        "Ticket created with no contact."
      ],
      "attempts": [
        [
          "Run 2 (22 Nov)",
          "First set-up",
          "1 ticket",
          "Succeeded"
        ],
        [
          "Run 2 (22 Nov)",
          "Repeat",
          "1 ticket",
          "Succeeded"
        ]
      ],
      "message": "Execution History: UpdateRelatedRecord = Succeeded",
      "impact": "Execution History says the update happened when nothing was updated, which misleads anyone tracing a rule."
    },
    {
      "id": "CO-86",
      "severity": "Low",
      "setup": [
        "Rules on Subject: Contains \"co86 lower\" with the case-insensitive flag off and on; Subject is \"abc\".",
        "Tickets with \"CO86 LOWER\" and \"ABC\" in the subject."
      ],
      "attempts": [
        [
          "Run 2 (22 Nov)",
          "Contains, flag off",
          "1 ticket",
          "No match"
        ],
        [
          "Run 2 (22 Nov)",
          "Contains, flag on",
          "1 ticket",
          "Matched"
        ],
        [
          "Run 2 (22 Nov)",
          "Is \"abc\" vs \"ABC\"",
          "1 ticket",
          "No match"
        ]
      ],
      "message": "—",
      "impact": "Text conditions depend on letter case unless the flag is sent; \"is\" never ignores case. Zoho compares text without case."
    },
    {
      "id": "CO-90",
      "severity": "Low",
      "setup": [
        "Rule: Due date between From = later date and To = earlier date."
      ],
      "attempts": [
        [
          "Run 2 (22 Nov)",
          "Save",
          "—",
          "Saved (201)"
        ],
        [
          "Run 2 (22 Nov)",
          "Ticket with a due date inside the range",
          "1 ticket",
          "No match"
        ]
      ],
      "message": "—",
      "impact": "A typo in the dates gives a rule that silently never runs."
    },
    {
      "id": "CO-92",
      "severity": "Low",
      "setup": [
        "A QA tag created; rule with condition Tags is that tag.",
        "Tag deleted (Desk settings, confirmed)."
      ],
      "attempts": [
        [
          "Run 2 (22 Nov)",
          "Read the rule after the delete",
          "—",
          "Rule active, condition still holds the deleted tag id, no marker"
        ],
        [
          "Run 2 (22 Nov)",
          "Ticket before and after",
          "2 tickets",
          "No match either time (correct)"
        ]
      ],
      "message": "—",
      "impact": "Rules keep pointing at tags that no longer exist and the admin is not told."
    },
    {
      "id": "L-10",
      "severity": "Low",
      "setup": [
        "Workflow Rules list filtered by QA AO Dept B (84 rules: 75 active, 9 inactive)."
      ],
      "attempts": [
        [
          "Run 2 (22 Nov)",
          "Look for a usage counter",
          "—",
          "None; settings only say \"Up to 200 rules per module and department\""
        ]
      ],
      "message": "The limits endpoint already returns maxRulesPerDepartment 200 and the used count per department.",
      "impact": "Admins only find the limit when saving fails.",
      "evidence": "U5-dept-filter.png"
    }
  ]
};
