{
 "contactFields": "name:single_line created_at:date_time created_by:user modified_at:date_time modified_by:user approval_status:pick_list first_name:single_line last_name:single_line email:email phone:phone mobile:phone account_id:lookup title:single_line owner:user secondary_email:email twitter:single_line facebook:single_line mailing_address:address description:multi_line type:pick_list language:pick_list products:multi_select_lookup crm_record_id:single_line crm_sync_status:pick_list crm_synced_at:date_time is_spam:checkbox external_ref:single_line",
 "teams": [
  "1adfefb7-0c25-4484-ae92-782964695054 Customer Experience Specialists dept 7e1ac409-58b0-41ab-97e1-0e7d5c8c5158 members 2",
  "3389d15c-ec5e-4d17-843a-e76df9a3f4bc Dev dept 19510fdc-91f3-4a7a-8888-153f1318b765 members 2",
  "9eb4ee89-20b2-435d-884d-c760d7c5c738 QA dept 19510fdc-91f3-4a7a-8888-153f1318b765 members 2"
 ],
 "tpl": [
  "system.ticket.acknowledgement Automatic acknowledgement desk_tickets contact",
  "system.ticket.closed Ticket closed desk_tickets contact",
  "system.ticket.resolution Resolution notification desk_tickets contact",
  "system.ticket.comment_added Public comment desk_tickets contact",
  "system.ticket.reply_acknowledgement Reply acknowledgement desk_tickets contact",
  "system.ticket.comment_edited Public comment updated desk_tickets contact",
  "system.ticket.comment_deleted Public comment removed desk_tickets contact",
  "system.ticket.cc_added Added as a copied address desk_tickets contact",
  "system.ticket.sla_escalation SLA escalation desk_tickets agent",
  "system.ticket.cc_ticket_received CC: new ticket desk_tickets secondary_contact",
  "system.ticket.cc_reply_received CC: reply received desk_tickets secondary_contact",
  "system.ticket.cc_ticket_closed CC: ticket closed desk_tickets secondary_contact"
 ],
 "ownerBad": "400 [{\"field\":\"Actions[0].OwnerTargetKind\",\"issue\":\"OwnerTargetKind must be SpecificUser, UserField, RoleRoundRobin, OrgUnitRoundRobin, or Team.\"}]",
 "emailBad": "400 [{\"field\":\"Actions[0].EmailRecipients[0].Kind\",\"issue\":\"Recipient Kind must be User, Role, UserField, OrgUnit, Team, OrgUnitTree, Contact, or RecordEmailField.\"}]",
 "created": []
}
