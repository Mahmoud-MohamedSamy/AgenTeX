{
 "replies": [
  "outbound | true | agent_choice | true | false | 12:01:11 |  | QA WF A1 ticket",
  "inbound | true |  | true | true | 12:18:25 | mahmoud.mahamed1515@… | Re: QA WF A1 ticket"
 ],
 "ticket": {
  "n": "648",
  "status": "Open",
  "customer_responded": true
 },
 "fired": [
  "QA WF A1 fired @12:18:30"
 ],
 "hist": [
  "comment.added 12:18:30 {\"is_public\":false,\"by_rule_id\":\"40db0944-4783-4131-a775-14f29ec4835e\",\"attachments\":[],\"by_rule_name\":\"QA WF A1\",\"attachment_count\":0}",
  "ticket.workflow_rule_ran 12:18:25 {\"actions\":[{\"type\":\"AddTicketComment\",\"async\":true}],\"rule_id\":\"40db0944-4783-4131-a775-14f29ec4835e\",\"trigger\":\"TicketEvent\",\"rule_name\":\"QA WF A1\"}",
  "message.received 12:18:23 {\"match\":\"HeaderChain\",\"trusted\":true,\"dkim_aligned\":true,\"attachment_count\":0}",
  "reply.sent 12:01:12 {\"error\":null,\"status\":\"sent\",\"attempt\":1}",
  "ticket.created 12:01:10 \"\"",
  "reply.queued 12:01:11 {\"cc\":[],\"to\":[\"<email>\"],\"subject\":\"QA WF A1 ticket\",\"is_public\":true,\"attachments\":[],\"recipient_count\":1,\"visibility_rule\":\"agent_choice\",\"attachme",
  "ticket.department_changed 12:01:10 {\"field_key\":\"department_id\",\"old_value\":null,\"new_value\":\"7e1ac409-58b0-41ab-97e1-0e7d5c8c5158\"}"
 ],
 "ex": [
  "40db0944 Fired 12:18:25"
 ]
}
