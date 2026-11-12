// Writes evidence/specs/W2-<Cx>.json for the Wave 2 bug candidates. Run: node make-w2-specs.js
const fs = require('fs'); const path = require('path');
const ENV = 'TAVI: staging-desk.taviportal.com, NDC-Staging (Wonder Travel), owner · Zoho Desk: test org techsolutionsegypt (Tech), screens + help docs · Edge';
const DATE = '12 Nov 2026';
const T = (img, crop, caption, boxes) => ({ img: 'w2/' + img, w: 1280, h: 720, crop, caption, boxes: boxes.map(([b, n]) => ({ b, n })) });
const Z = (img, crop, caption, boxes) => ({ img: 'w2/' + img, w: 1600, h: 900, crop, caption, boxes: boxes.map(([b, n]) => ({ b, n })) });
const S = [
 { id: 'C1', ticket: 'W2-17', label: 'BUG · Low', title: 'Ticket History: "Followers was updated" shows a raw user-id list instead of the follower\'s name',
   panels: [T('ui-history-uuid.png', [0, 56, 1280, 664], 'TAVI · #781 History after Follow and Unfollow by the owner (2 Nov run)', [[[710, 428, 1066, 600], 1]])],
   rows: [[1, 'Follower event in History', 'Zoho\'s ticket History names people, never ids (owner, assignee and follower changes show the agent\'s name). Broken on its own, whatever Zoho does.', 'Old ["97be04b6-0a08-4883-aa51-e1650b11cab7"] / New blank: an internal user id in a JSON array, no name.', 'BUG']] },
 { id: 'C2', ticket: 'W2-72', label: 'BUG · Medium', title: 'A saved reply draft fills the comment editor (Shift+C or the comment icon)',
   panels: [T('ui-shiftc-draft.png', [664, 56, 616, 480], 'TAVI · #787 with a saved reply draft; Shift+C opens the private comment editor', [[[720, 234, 1268, 421], 1], [[1013, 101, 1188, 133], 2]]),
            Z('z-c2-comment-editor.png', [650, 40, 950, 520], 'Zoho · #183 with a saved reply draft; the comment editor opens empty (checked live 12 Nov, ticket deleted after)', [[[659, 182, 1593, 376], 1], [[659, 441, 1593, 527], 2]])],
   rows: [[1, 'Comment editor when a reply draft exists', 'Opens empty; the draft stays a separate "Draft" entry.', 'Opens with the reply draft text ("QA GL W2 plain reply draft") inside a private comment. Saving would post the customer reply text as an internal note.', 'DIFFERS'],
          [2, 'Reply draft marker', 'Draft listed in the conversation: "Draft saved @ 01:01 PM".', '"Reply All DRAFT" on the header button.', 'INFO']] },
 { id: 'C4', ticket: 'W2-63', label: 'BUG · Medium', title: 'An Open ticket can be archived by hand and then drops out of All Tickets',
   panels: [T('i-archive-menu.png', [360, 56, 920, 664], 'TAVI · #3120 (Open) › More actions: Archive is offered', [[[1068, 470, 1262, 494], 1], [[391, 573, 457, 599], 2]]),
            Z('z-more-open-ticket.png', [330, 40, 1270, 500], 'Zoho · Open ticket › More Actions: no Archive', [[[1312, 105, 1532, 432], 1], [[358, 385, 426, 405], 2]])],
   rows: [[1, 'Archive action on a ticket', 'No Archive in More Actions (open or closed tickets). Help: "A ticket must be in closed state for 120 days" before archiving, and "Tickets cannot be archived manually".', 'Archive in More actions; on 2 Nov an Open ticket was archived and disappeared from All Tickets (only under Archived Tickets).', 'DIFFERS'],
          [2, 'Ticket status', 'Open', 'Open', 'INFO']] },
 { id: 'C5', ticket: 'W2-67..70', label: 'BUG · High', title: 'AI assist: summary, triage, reply suggestions, writing assistant and translate all fail (404)',
   panels: [T('ui-ai.png', [320, 56, 960, 500], 'TAVI · #781 › AI assist › Summarize ticket', [[[395, 231, 632, 377], 1]])],
   rows: [[1, 'AI summary / triage / suggestions / translate', 'Zia features (Summary, Sentiment, Field Predictions, reply assistance) work for an enabled plan. Broken on its own, whatever Zoho does.', '"Something went wrong. The AI request failed. Try again." Every AI endpoint returns 404 (summary, triage, suggest replies, writing assistant, translate).', 'BUG']] },
 { id: 'C6', ticket: 'W2-35', label: 'BUG · Medium', title: 'Moving a ticket to a department the owner belongs to clears the owner',
   panels: [T('i-move-history.png', [360, 56, 920, 664], 'TAVI · #3167 (owner ndc-staging-owner, member of Sales) moved Marketing › Sales', [[[391, 505, 560, 531], 1], [[712, 535, 960, 615], 2], [[738, 107, 822, 129], 3]]),
            Z('zi-move.png', [330, 40, 1270, 500], 'Zoho · ticket › More Actions › Move: target departments (nothing confirmed)', [[[358, 335, 500, 360], 1], [[1312, 100, 1532, 200], 3]])],
   rows: [[1, 'Owner after the move', 'Owner kept when the owner is an agent of the target department; cleared only if not (Zoho staff answer, Zoho Desk community, "Move ticket to another department").', 'Unassigned, though the owner is an agent of Sales.', 'DIFFERS'],
          [2, 'History', '-', '"Ticket Owner was updated · Old ndc-staging-owner · New blank" at the same minute as the move.', 'INFO'],
          [3, 'Target department', 'Move panel lists departments the agent can move to.', 'Sales', 'INFO']] },
 { id: 'C7', ticket: 'W2-27', label: 'BUG · Low', title: 'Snippet ticket-number placeholder adds its own "#": "ticket #{{ticket_number}}" gives "##3120"',
   panels: [T('i-snippet-inserted.png', [380, 56, 900, 560], 'TAVI · #3120 › Reply All › Snippets › qa_gl_w2_img preview ("Your ticket #{{ticket_number}} is with {{department_name}}.")', [[[832, 545, 1160, 578], 1], [[832, 400, 1060, 418], 2]])],
   rows: [[1, 'Resolved snippet text', '${Cases.Request Id} gives the bare number; help example: "support ticket number 116".', '"Your ticket ##3120 is with Marketing." The placeholder value already starts with "#".', 'DIFFERS'],
          [2, 'Snippet text as written', 'Agents write "#${Cases.Request Id}" or "number ${Cases.Request Id}".', '"Your ticket #{{ticket_number}} is with…"', 'INFO']] },
 { id: 'C10', ticket: 'W2-76, W2-85', label: 'NEEDS DECISION · Medium', title: 'An agent reads tickets of a department they are not in, when a lower-role agent owns them',
   panels: [T('r-c-marketing.png', [0, 56, 1280, 664], 'TAVI · agent C (Customer Support only) opens Marketing ticket #3105 owned by agent B', [[[738, 107, 850, 129], 1], [[391, 505, 620, 531], 2]]),
            Z('zi-datasharing.png', [220, 40, 1380, 600], 'Zoho · Setup › Data Sharing: access follows the role hierarchy', [[[253, 140, 1245, 198], 2]])],
   rows: [[1, 'Department of the ticket', 'An agent works only in departments they are added to; tickets of other departments are not listed for them (department membership comes before data sharing).', 'Marketing; agent C is not a Marketing agent but opens and lists it.', 'DIFFERS'],
          [2, 'Why C can see it', '"…only the records owned by themselves and their subordinates" (Data Sharing help). Not proven live: one admin account in the Zoho trial.', 'Tickets sharing = Private; owner is agent B, below C in the role hierarchy. Other Marketing tickets stay hidden from C.', 'INFO']] },
 { id: 'C11', ticket: 'W2-30', label: 'BUG · Medium', title: 'The agent\'s saved signature is not added to replies; only the company footer goes out',
   panels: [T('r-signature-page.png', [268, 56, 1012, 360], 'TAVI · Setup › My signatures, shown empty; "QA GL W2 signature line" was saved here for All departments before each test and removed after (API confirmed saved)', [[[350, 141, 1198, 211], 2]]),
            T('r-sig2-composer.png', [664, 220, 616, 450], 'TAVI · #3119 reply composer while the signature was saved: no signature in it', [[[677, 343, 1268, 450], 1]])],
   rows: [[1, 'Saved agent signature in the reply', 'The agent signature is added to outgoing replies (Zoho Desk help, agent signature).', 'Not in the composer and not in the email. Delivered emails of 12:05 and 15:16 (checked in the mmohamed@ inbox) end with "Wonder Travel / 09876543210 / 1, Maadi, Cairo, EG / https://crm.taviportal.com/ / ndc-staging-owner / ndc-staging-owner@anyware.software / Organization", without "QA GL W2 signature line".', 'DIFFERS'],
          [2, 'Which signature wins', '-', 'TAVI\'s own help: a company signature an administrator made required always applies instead. No screen found that shows whether the company signature is required; to confirm with the devs.', 'INFO']] },
 { id: 'C13', ticket: 'W2-19', label: 'BUG · Low', title: 'A CC added on a reply is not kept on the ticket ("Copied addresses" stays empty)',
   panels: [T('i-cc-ticket.png', [364, 56, 916, 600], 'TAVI · #3106 after Reply all with CC mahmoud.mmohamedsamy@gmail.com', [[[680, 366, 1120, 384], 1], [[391, 304, 640, 342], 2]])],
   rows: [[1, 'CC on the reply', 'The reply goes to the CC address.', 'Sent to mmohamed@ and the CC address.', 'SAME'],
          [2, 'Ticket CC list afterwards', 'A CC on a reply is added to the ticket\'s CC (secondary contacts), so later replies keep it.', '"Nobody else is copied"; GET /desk/tickets/{id}/cc returns []. The next reply (12:05) went to mmohamed@ only.', 'DIFFERS']] },
];
for (const s of S) {
  const spec = { out: `W2-${s.id}-vs-zoho.png`, ticket: `${s.id} · ${s.ticket}`, verdict: 'FAIL', date: DATE, env: ENV, title: s.title, label: s.label, panels: s.panels, rows: s.rows };
  fs.writeFileSync(path.join(__dirname, `W2-${s.id}.json`), JSON.stringify(spec, null, 1));
}
console.log(S.map(s => s.id).join(' '));
