R('TF-09', 'PARTIAL', 'webhook 1 and webhook 2 arrived in the configured order (same second); the custom action placed between them arrived ~3 s later, because it runs separately in Workflow. Ordering holds for webhooks / field updates, not for custom actions');
R('TF-07', 'PASS', 'custom action "QA BP echo" ran once with the ticket and reached the receiver. Note: {{subject}} typed into a custom-action input is sent as the literal text "{{subject}}" (merge tokens are replaced in notification titles, see TF-10)');
R('TF-06', 'NOT RUN', 'email delivery is Phase 4 (mailbox)');
