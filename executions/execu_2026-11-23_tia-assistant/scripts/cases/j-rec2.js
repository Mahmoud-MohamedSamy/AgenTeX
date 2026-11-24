ledger('CRM contact "QA TIA J11 Expiry" (created by early confirm, J-11 retry pending) and "QA TIA J13 Double" — from Tia; ids looked up in cleanup');
result('J-06', 'Fail', 'RST (has desk:ticket:comment) asked Tia to add a private comment to QA TIA T1: "I cannot add a private comment… because your workspace admin has not allowed me to make changes to Desk tickets." The write-module picker /agents/modules lists only 15 CRM modules — Desk tickets can never be chosen, so private ticket comments (a suggested action on ticket pages) cannot work.');
result('J-07', 'Pass', 'KB draft card (kind kb_draft, category QA RT18 KB) → confirm → draft article "QA TIA How to reset your password", status draft, author = the asker (RST and ADM each made one)');
result('J-13', 'Pass', 'Two parallel confirms of one create-contact card → one 200 done, one 409 TIA_ACTION_DECIDED; one contact');
result('J-15', 'Finding', 'Deal with no name: Tia still offered a card (only amount 500) while saying a name is required; confirm → failed "This was refused: The app refused this request (RECORD_VALIDATION_FAILED)." Nothing created (good) but the message shows a raw code.');
result('J-17', 'Pass', 'Services not in write modules → no card: "your workspace admin has not allowed me to make changes in this module"');
result('J-23', 'Pass', 'In CRM, ticket comment refused (no ticket-comment tool in CRM); reason given "You do not have access to the Desk tickets module" is not quite right for CRA (Desk Administrator)');
result('J-24', 'Fail', '"Change the lead source of QA TIA Lead 2 and QA TIA Lead 3 to other" → text says it prepared the change for both leads, but only ONE card (Lead 2). Lead 3 silently dropped. (cards rejected)');
return 'ok';
