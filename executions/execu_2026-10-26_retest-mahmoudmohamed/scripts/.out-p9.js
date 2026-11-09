{
 "tplKeys": [
  "email_templates",
  "use_cases",
  "max_templates"
 ],
 "tplSample": "{\"id\":\"system.ticket.acknowledgement\",\"is_system\":true,\"use_case\":\"ticket.acknowledgement\",\"module\":\"desk_tickets\",\"notification_type\":\"contact\",\"folder_id\":null,\"folder_name\":null,\"from_address_id\":null,\"reply_to\":null,\"attachments\":[],\"name\":\"Automatic acknowledgement\",\"description\":\"Sent once to a customer whose email opens a new ticket, when the department's \\\"Receiving a new ticket\\\" notification rule is on (Setup → Customization → Notifications).\",\"subject\":\"Re: {{ticket.subject}} [#{{ticket.number}}]\",\"body_html\":\"<p>Thanks for getting in touch. We have your message and it is now ticket",
 "tplPostEmpty": "400 {\"success\":false,\"data\":null,\"error\":{\"code\":\"VALIDATION_ERROR\",\"message\":\"The template is not valid.\",\"details\":[{\"field\":\"name\",\"issue\":\"required\"},{\"field\":\"subject\",\"issue\":\"required\"},{\"field\":\"body_html\",\"issue\":\"required\"}]},\"meta\":null}",
 "skillPostEmpty": "405 {\"success\":false,\"data\":null,\"error\":{\"code\":\"METHOD_NOT_ALLOWED\",\"message\":\"That operation is not available on this resource.\"},\"meta\":null}",
 "skillPutEmpty": "404 {\"success\":false,\"data\":null,\"error\":{\"code\":\"NOT_FOUND\",\"message\":\"'' is not an option of the tickets' skills field.\",\"details\":null},\"meta\":null}",
 "created": []
}
