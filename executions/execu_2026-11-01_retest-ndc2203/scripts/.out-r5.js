{
 "B01a": {
  "n": "593",
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [
   "priv QA WF B01a private comment"
  ],
  "ex": [
   "eaae48a1 undefined AddTicketComment:Succeeded {\"comment_id\":\"bf8a1ae6-4375-55c0-bd2f-390499c2034c\"}"
  ],
  "h": [
   "comment.added [by QA WF B01a]",
   "ticket.workflow_rule_ran [{\"type\":\"AddTicketComment\",\"async\":true}]",
   "ticket.department_changed",
   "ticket.created"
  ]
 },
 "B01b": {
  "n": "594",
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [
   "pub QA WF B01b public comment"
  ],
  "ex": [
   "27a873c9 undefined AddTicketComment:Succeeded {\"comment_id\":\"52aa9cab-b6b5-54da-938d-739a53bddcc6\"}"
  ],
  "h": [
   "reply.sent [by QA WF B01b]",
   "reply.queued [by QA WF B01b]",
   "comment.added [by QA WF B01b]",
   "ticket.workflow_rule_ran [{\"type\":\"AddTicketComment\",\"async\":true}]",
   "ticket.created",
   "ticket.department_changed"
  ]
 },
 "B02": {
  "n": "595",
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [],
  "ex": [
   "201bea16 undefined SendTicketReply:Succeeded {\"reply_id\":\"ab717727-98db-4ae4-9bfb-4f30e70bbd78\",\"sent_to\":[\"mmohamed@anyware.software\"]}"
  ],
  "h": [
   "reply.sent [by QA WF B02]",
   "reply.queued [by QA WF B02]",
   "ticket.workflow_rule_ran [{\"type\":\"SendTicketReply\",\"async\":true}]",
   "ticket.department_changed",
   "ticket.created"
  ]
 },
 "B05": {
  "n": "596",
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "followers": [
   "3445ec4a-020e-4f12-b156-dd2de7610164"
  ],
  "cm": [],
  "ex": [
   "31addd51 undefined AddTicketFollowers:Succeeded {\"followed\":[\"3445ec4a-020e-4f12-b156-dd2de7610164\"],\"skipped\":[]}"
  ],
  "h": [
   "ticket.workflow_rule_ran [{\"type\":\"AddTicketFollowers\",\"async\":true}]",
   "ticket.department_changed",
   "ticket.created"
  ]
 },
 "B06": {
  "n": "597",
  "spam": true,
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [],
  "ex": [
   "ab891379 undefined MarkTicketSpam:Succeeded {\"marked\":true,\"contact_blocked\":null}"
  ],
  "h": [
   "ticket.marked_spam [by QA WF B06]",
   "ticket.workflow_rule_ran [{\"type\":\"MarkTicketSpam\",\"async\":true}]",
   "ticket.created",
   "ticket.department_changed"
  ]
 },
 "B07": {
  "n": "598",
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [],
  "ex": [
   "eda3e181 undefined ShareTicket:Succeeded {\"shared\":true}"
  ],
  "h": [
   "ticket.shared [by QA WF B07]",
   "ticket.workflow_rule_ran [{\"type\":\"ShareTicket\",\"async\":true}]",
   "ticket.department_changed",
   "ticket.created"
  ]
 },
 "B08": {
  "n": "599",
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [],
  "ex": [
   "e24d7c5b undefined ChangeTicketLayout:Succeeded {\"changed\":true,\"layout_id\":\"38bb71ea-9819-469b-8f36-83c3ec281394\"}"
  ],
  "h": [
   "ticket.layout_changed [by QA WF B08]",
   "ticket.workflow_rule_ran [{\"type\":\"ChangeTicketLayout\",\"async\":true}]",
   "ticket.department_changed",
   "ticket.created"
  ]
 },
 "B11": {
  "n": "600",
  "skills": [
   "tier_1_support"
  ],
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [],
  "ex": [
   "0081f316 undefined AddTicketSkills:Succeeded {\"skills\":[\"tier_1_support\"],\"changed\":true,\"skipped\":[]}"
  ],
  "h": [
   "ticket.workflow_rule_ran [{\"type\":\"AddTicketSkills\",\"async\":true}]",
   "ticket.department_changed",
   "ticket.created"
  ]
 },
 "B12": {
  "n": "601",
  "skills": [
   "tier_2_support"
  ],
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [],
  "ex": [
   "620fc7d3 undefined RemoveTicketSkills:Succeeded {\"skills\":[\"tier_2_support\"],\"changed\":true,\"skipped\":[]}"
  ],
  "h": [
   "ticket.workflow_rule_ran [{\"type\":\"RemoveTicketSkills\",\"async\":true}]",
   "ticket.department_changed",
   "ticket.created"
  ]
 },
 "B13": {
  "n": "602",
  "skills": [
   "tier_2_support"
  ],
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [],
  "ex": [
   "c8a1e406 undefined RecalculateTicketSkills:Succeeded {\"skills\":[\"tier_2_support\"],\"changed\":false,\"skipped\":[]}"
  ],
  "h": [
   "ticket.workflow_rule_ran [{\"type\":\"RecalculateTicketSkills\",\"async\":true}]",
   "ticket.created",
   "ticket.department_changed"
  ]
 },
 "B14": {
  "n": "603",
  "skills": [
   "tier_1_support"
  ],
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [],
  "ex": [
   "d86845d4 undefined ReassignTicketBySkills:Succeeded {\"reassigned\":false,\"owner_id\":null,\"reason\":\"nobody_online\"}"
  ],
  "h": [
   "ticket.workflow_rule_ran [{\"type\":\"ReassignTicketBySkills\",\"async\":true}]",
   "ticket.department_changed",
   "ticket.created"
  ]
 },
 "B15": {
  "n": "613",
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [],
  "ex": [
   "79125def undefined UpdateRelatedRecord:Succeeded {\"skipped\":\"no_related_record\"}"
  ],
  "h": [
   "ticket.workflow_rule_ran [{\"type\":\"UpdateRelatedRecord\",\"async\":true}]",
   "ticket.department_changed",
   "ticket.created"
  ]
 },
 "D2t": {
  "n": "612",
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [],
  "ex": [
   "a01d0d97 undefined Email:Succeeded {\"agents_emailed\":1,\"contact_emailed\":true,\"reason\":null}"
  ],
  "h": [
   "reply.sent",
   "reply.queued",
   "ticket.workflow_rule_ran [{\"type\":\"Email\",\"async\":true}]",
   "ticket.created",
   "ticket.department_changed"
  ]
 },
 "E3odT_past": {
  "n": "608",
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [
   "priv QA WF E3odT fired"
  ],
  "ex": [
   "96b51513 undefined AddTicketComment:Succeeded {\"comment_id\":\"7322f84d-a326-5db5-a11f-7e0b185b1b7f\"}"
  ],
  "h": [
   "comment.added [by QA WF E3odT]",
   "ticket.department_changed",
   "ticket.created"
  ]
 },
 "E3odT_future": {
  "n": "609",
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [],
  "ex": [],
  "h": [
   "ticket.department_changed",
   "ticket.created"
  ]
 },
 "E3odF_past": {
  "n": "610",
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [],
  "ex": [],
  "h": [
   "ticket.department_changed",
   "ticket.created"
  ]
 },
 "E3odF_future": {
  "n": "611",
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [
   "priv QA WF E3odF fired"
  ],
  "ex": [
   "04a7c216 undefined AddTicketComment:Succeeded {\"comment_id\":\"f5e2fbd3-8f1c-57c5-899e-6aa44f12d3db\"}"
  ],
  "h": [
   "comment.added [by QA WF E3odF]",
   "ticket.created",
   "ticket.department_changed"
  ]
 },
 "F1t2": {
  "n": "615",
  "owner": "3445ec4a-020e-4f12-b156-dd2de7610164",
  "cm": [],
  "ex": [
   "e2fd1dfb undefined Email:Succeeded {\"agents_emailed\":0,\"contact_emailed\":true,\"reason\":null}"
  ],
  "h": [
   "reply.sent",
   "reply.queued",
   "ticket.workflow_rule_ran [{\"type\":\"Email\",\"async\":true}]",
   "ticket.created",
   "ticket.department_changed"
  ]
 }
}
