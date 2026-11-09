{
 "inbound": {
  "id": "6c946bb8-1fb4-4c9a-b3e2-8089913f32cb",
  "ticket_id": "44681cc8-30c5-49b5-a50d-718fee90c862",
  "direction": "inbound",
  "mode": null,
  "is_public": false,
  "from_user_id": null,
  "from_address": "mahmoud.mmohamedsamy@gmail.com",
  "subject": "Re: QA WF A4 ticket",
  "status": "sent",
  "error": null,
  "attempts": 0,
  "sent_at": "2026-10-27T12:16:23.031844+00:00",
  "bounced_at": null,
  "dkim_aligned": true,
  "trusted": false,
  "created_at": "2026-10-27T12:16:33.272253+00:00",
  "pinned_at": null,
  "pinned_by": null,
  "visibility_locked": false,
  "visibility_rule": "private_thread_answer"
 },
 "ticket": {
  "status": "Open"
 },
 "hist": [
  "comment.added 12:16:39 {\"is_public\":false,\"by_rule_id\":\"8c34764e-c351-478f-8861-a18fbda218ec\",\"attachments\":[],\"by_rule_name\":\"QA WF A4both\",\"attachment_count\":0}",
  "comment.added 12:16:39 {\"is_public\":false,\"by_rule_id\":\"a61ea946-735a-431a-8739-c10575a07a8d\",\"attachments\":[],\"by_rule_name\":\"QA WF A4in\",\"attachment_count\":0}",
  "ticket.workflow_rule_ran 12:16:34 {\"actions\":[{\"type\":\"AddTicketComment\",\"async\":true}],\"rule_id\":\"8c34764e-c351-478f-8861-a18fbda218ec\",\"trigger\":\"TicketEvent\",\"rule_name\":\"QA WF A4both\"}",
  "ticket.workflow_rule_ran 12:16:34 {\"actions\":[{\"type\":\"AddTicketComment\",\"async\":true}],\"rule_id\":\"a61ea946-735a-431a-8739-c10575a07a8d\",\"trigger\":\"TicketEvent\",\"rule_name\":\"QA WF A4in\"}",
  "message.received 12:16:23 {\"match\":\"HeaderChain\",\"trusted\":false,\"dkim_aligned\":true,\"attachment_count\":0}",
  "message.untrusted 12:16:23 {\"reason\":\"sender_not_entitled\",\"from_domain\":\"gmail.com\"}",
  "comment.added 11:35:26 {\"is_public\":false,\"by_rule_id\":\"8c34764e-c351-478f-8861-a18fbda218ec\",\"attachments\":[],\"by_rule_name\":\"QA WF A4both\",\"attachment_count\":0}",
  "ticket.workflow_rule_ran 11:35:24 {\"actions\":[{\"type\":\"AddTicketComment\",\"async\":true}],\"rule_id\":\"8c34764e-c351-478f-8861-a18fbda218ec\",\"trigger\":\"TicketEvent\",\"rule_name\":\"QA WF A4both\"}",
  "comment.added 11:35:25 {\"is_public\":false,\"by_rule_id\":\"e755a79e-cef3-4868-b9fb-b3a54dbba581\",\"attachments\":[],\"by_rule_name\":\"QA WF A4out\",\"attachment_count\":0}",
  "ticket.workflow_rule_ran 11:35:24 {\"actions\":[{\"type\":\"AddTicketComment\",\"async\":true}],\"rule_id\":\"e755a79e-cef3-4868-b9fb-b3a54dbba581\",\"trigger\":\"TicketEvent\",\"rule_name\":\"QA WF A4out\"}",
  "reply.sent 11:35:21 {\"error\":null,\"status\":\"sent\",\"attempt\":1}",
  "reply.queued 11:35:19 {\"cc\":[],\"to\":[\"<email>\"],\"subject\":\"Fwd: QA WF A4 ticket\",\"is_public\":false,\"attachments\":[],\"recipient_count\":1,\"visibility_rule\":\"forward\",\"attachment_count\":0,\"source",
  "ticket.department_changed 11:34:36 {\"field_key\":\"department_id\",\"old_value\":null,\"new_value\":\"7e1ac409-58b0-41ab-97e1-0e7d5c8c5158\"}",
  "ticket.created 11:34:36 {\"initial\":{\"status\":\"Open\",\"team_id\":null,\"owner_id\":\"3445ec4a-020e-4f12-b156-dd2de7610164\"},\"created_values\":{\"email\":\"<email>\",\"owner\":\"3445ec4a-020e-4f12-b156-dd2de76"
 ],
 "ex": [
  "8c34764e Fired 12:16:34",
  "a61ea946 Fired 12:16:34",
  "8c34764e Fired 11:35:24",
  "e755a79e Fired 11:35:24"
 ]
}
