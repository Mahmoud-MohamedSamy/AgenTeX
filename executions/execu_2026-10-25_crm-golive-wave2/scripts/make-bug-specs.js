// Writes the annotation specs for the Wave 2 bugs NDC-2621..2627 (TAVI left, Zoho right; same box number per row on both sides).
const fs = require('fs'); const G = '#16a34a';
const env = 'staging-crm.taviportal.com vs Zoho CRM org943261092 (read-only)', date = '26 Oct 2026';
const NC = 'Not checked live';
const specs = {
  'NDC-2621': { title: 'Pipelines | A deal can’t be moved to another pipeline (record page, Mass Update, API)', verdict: 'FAIL', label: 'BUG',
    panels: [{ img: 'pl06-change-pipeline-fails-silently.png', caption: 'TAVI — deal "QA W2 PL Standard": "Change pipeline" to pipeline "1" confirmed; the PATCH answered 422 and the dialog stays open with no message. The deal is still in "Standard (Default)".', crop: [0, 0, 1600, 900], boxes: [{ b: [544, 293, 1056, 607], n: 1 }, { b: [372, 272, 596, 304], n: 2 }] },
      { img: 'z-pipelines.png', w: 1600, h: 950, caption: 'Zoho — Setup › Customization › Pipelines. This org has only the default sales process, so moving a deal between pipelines could not be shown here.', crop: [0, 0, 1600, 950], boxes: [{ b: [258, 170, 1584, 640], n: 1, color: G }] }],
    rows: [['1', 'Move a deal to another pipeline from the record page', NC + ': this Zoho org has no second pipeline (the Pipelines page offers "Create New Pipeline")', 'Confirm sends PATCH → 422 "Invalid value for: Pipeline"; the dialog stays open and shows no message', 'FAIL'],
      ['2', 'The deal after the attempt', NC, 'Still in pipeline "Standard (Default)"; nothing moved', 'FAIL'],
      ['3', 'Move by Mass Update or the API', NC, 'Mass Update → 422 "‘640e03a4…’ is not one of the allowed values (Standard (Standard))"; API PATCH, and even create with the layout’s own pipeline id → 422. Only the text "Standard (Standard)" is accepted', 'FAIL']] },
  'NDC-2622': { title: 'Search | Users on the built-in "User" profile can’t use global search', verdict: 'FAIL', label: 'BUG',
    panels: [{ img: 'gs03-user-profile-no-search.png', caption: 'TAVI — test user 1 (built-in User profile) searches "QA W2 RC": "You don’t have access to search."', crop: [0, 0, 1600, 900], boxes: [{ b: [512, 108, 1088, 310], n: 1 }] },
      { img: 'z-search-benton.png', w: 1600, h: 950, caption: 'Zoho — global search "Benton" returns results grouped by module (Leads, Contacts, Accounts, Deals, Tasks). Seen with the admin account.', crop: [0, 0, 1600, 950], boxes: [{ b: [16, 105, 1586, 880], n: 1, color: G }] }],
    rows: [['1', 'Global search for a user', 'Search returns grouped results (admin account). A user on the Standard profile was not checked live', 'Built-in User profile: "You don’t have access to search."; API 403 "Missing required permission ‘search.global.access’"', 'FAIL'],
      ['2', 'The same user’s other access', '—', 'The same user can open and edit their own leads, so only search is blocked', 'INFO']] },
  'NDC-2623': { title: 'Activities | A recurring task ("Weekly, 3 times") never creates the next tasks', verdict: 'FAIL', label: 'BUG',
    panels: [{ img: 'api-ac01-recurring-task.png', w: 1600, h: 489, caption: 'TAVI — API facts from the automated test (26 Oct 2026): the repeat setting is stored, but only one task exists.', crop: [0, 0, 1600, 489], boxes: [{ b: [20, 240, 1580, 272], n: 1 }, { b: [20, 332, 1580, 410], n: 2 }] },
      { img: 'z-task-repeat.png', w: 1600, h: 950, caption: 'Zoho — Create Task form: the Repeat switch opens Repeat type and Ends (Never / After n Times / On date). Opened and cancelled; nothing saved.', crop: [0, 0, 1600, 950], boxes: [{ b: [513, 455, 1098, 798], n: 1, color: G }] }],
    rows: [['1', 'Set a task to repeat', 'Repeat on the task form: Repeat type; Ends Never / After n Times / On date', '"Weekly, ends after 3 times" is stored on the task', 'INFO'],
      ['2', 'The next tasks are created', NC + ' (nothing is saved in Zoho)', 'Only 1 task with that subject exists, before and after the first is marked Completed', 'FAIL']] },
  'NDC-2624': { title: 'Timeline | Deleting a record and adding / removing attachments are not logged', verdict: 'FAIL', label: 'BUG',
    panels: [{ img: 'tl01-timeline-missing-delete-attach.png', caption: 'TAVI — lead deleted, then restored: the Timeline shows created, name updated, Record restored and Note added, but no deleted entry.', crop: [0, 0, 1600, 900], boxes: [{ b: [300, 355, 960, 765], n: 1 }, { b: [412, 470, 660, 530], n: 2 }] },
      { img: 'z-task-timeline.png', w: 1600, h: 950, caption: 'Zoho — record Timeline (History). The org’s sample records have no logged changes ("No logs found"), so Zoho’s entries could not be shown.', crop: [0, 0, 1600, 950], boxes: [{ b: [252, 240, 1288, 400], n: 1, color: G }] }],
    rows: [['1', 'Record deleted is logged', NC + ': sample records have no timeline entries', 'No deleted entry; the API feed holds only RecordCreated, FieldChanged, NoteAdded, RecordRestored', 'FAIL'],
      ['2', 'Record restored is logged', NC, '"Record restored" is shown', 'PASS'],
      ['3', 'Attachment added / removed is logged', NC, 'No entry for adding 2 attachments or removing 1 (screen and API)', 'FAIL']] },
  'NDC-2625': { title: 'Tags | The record tag API lets a record hold more than 10 tags', verdict: 'FAIL', label: 'BUG',
    panels: [{ img: 'api-tg02-eleven-tags.png', w: 1600, h: 443, caption: 'TAVI — API facts from the automated test (26 Oct 2026): 11 tags accepted on one lead.', crop: [0, 0, 1600, 443], boxes: [{ b: [20, 194, 1580, 226], n: 1 }, { b: [20, 286, 1580, 364], n: 2 }] },
      { img: 'z-deal-tags.png', w: 1600, h: 950, caption: 'Zoho — Add Tags on a deal opens the tag picker (opened and cancelled; nothing saved).', crop: [0, 0, 1600, 950], boxes: [{ b: [292, 90, 862, 208], n: 1, color: G }] }],
    rows: [['1', 'Add up to 10 tags to a record', 'Tag picker on the record', '10 tags → 200; the record holds 10', 'PASS'],
      ['2', 'Add an 11th tag', NC + ' (it would change Zoho data)', '200, no error; the record now holds 11 tags', 'FAIL']] },
  'NDC-2626': { title: 'Transactions | Pipeline shown as a raw id and stages as raw keys', verdict: 'FAIL', label: 'BUG',
    panels: [{ img: 'pl07-inline-pipeline-raw-id.png', caption: 'TAVI — Transactions list: the Pipeline column and the inline editor show the id 5170500c-…; the Stage column shows keys (needs_analysis, qualification, negotiation).', crop: [0, 0, 1600, 900], boxes: [{ b: [890, 240, 1240, 830], n: 1 }, { b: [1240, 240, 1345, 830], n: 2 }] },
      { img: 'z-deal-overview.png', w: 1600, h: 950, caption: 'Zoho — deal "Benton": the stage bar and the Stage field show labels (Qualification, Needs Analysis, Value Proposition…).', crop: [0, 0, 1600, 950], boxes: [{ b: [512, 256, 1440, 284], n: 2, color: G }, { b: [560, 398, 790, 424], n: 2, color: G }] }],
    rows: [['1', 'Pipeline shown by name', NC + ': this org has only the default pipeline, so no Pipeline field is shown', 'Pipeline column, record page and inline editor show 5170500c-b335-479c-96d1-ed138965c345', 'FAIL'],
      ['2', 'Stages shown by label', 'Stage bar and Stage field show labels: Qualification, Needs Analysis, …', 'Stage column, stage bar and Stage field show keys: needs_analysis, qualification, negotiation, closed_won', 'FAIL']] },
  'NDC-2627': { title: 'Timeline | The created entry reads "leads created" instead of "Lead created"', verdict: 'FAIL', label: 'BUG',
    panels: [{ img: 'tavi-tl01-ui-test-2026-10-26.png', w: 1276, h: 808, caption: 'TAVI — new lead "QA W2 UI 50121", Timeline tab (automated test RecordScreensUiTest.timelineWording, 26 Oct 2026): "leads created".', crop: [0, 0, 1276, 808], boxes: [{ b: [408, 360, 540, 414], n: 1 }] },
      { img: 'z-task-timeline.png', w: 1600, h: 950, caption: 'Zoho — record Timeline (History). The org’s sample records have no logged entries, so Zoho’s wording could not be shown.', crop: [0, 0, 1600, 950], boxes: [{ b: [252, 240, 1288, 400], n: 1, color: G }] }],
    rows: [['1', 'Wording of the created entry', NC + ': sample records have no timeline entries ("No logs found")', '"leads created" — the module key, lower case and plural, instead of "Lead created"', 'FAIL']] }
};
for (const [t, s] of Object.entries(specs)) fs.writeFileSync(`spec-${t}.json`, JSON.stringify({ out: `${t}-vs-zoho.png`, ticket: t, env, date, ...s }, null, 1));
console.log(Object.keys(specs).join(' '));
