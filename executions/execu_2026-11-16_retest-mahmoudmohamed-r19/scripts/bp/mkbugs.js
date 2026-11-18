// Writes RUN/bugs/<slug>.md drafts (not filed).
const fs = require('fs'); const path = require('path');
const OUT = path.join(__dirname, '..', '..', 'bugs'); fs.mkdirSync(OUT, { recursive: true });
const env = 'staging-desk.taviportal.com (NDC-Staging), Microsoft Edge (headless) on Windows 10, 16 Nov 2026, owner account ndc-staging-owner';
const B = {
  'history-auto-step-wrong-from-to': { t: 'Ticket History | Automatic blueprint steps show the wrong From state and To state', p: 'Medium', rel: 'NDC-3034 (From/To added to transition lines), NDC-3031 (continuous blueprints)',
    s: 'When a blueprint step runs by itself (continuous blueprint or timer), its History line shows From state Open and To state Escalated, whatever the real move was. The status line next to it shows the real move.',
    st: ['Create a continuous blueprint: Open → Escalated ("first", one checklist item) → On Hold ("auto", nothing to fill) → Closed ("end", nothing to fill).', 'Create a matching ticket and run "first".', 'Wait a few seconds; the ticket moves to On Hold and Closed by itself.', 'Open the ticket › History.'],
    e: '"Moved by <blueprint> automatically · Transition QA auto" shows From state Escalated, To state On Hold; QA end shows On Hold → Closed.',
    a: ['QA auto and QA end both show From state Open, To state Escalated (tickets #4165, #4166).', 'The Status changed lines next to them are correct (Escalated → On Hold, On Hold → Closed).', 'GET /desk/tickets/{id}/history: the ticket.blueprint_transition rows carry only the transition name, no from/to state.'] },
  'audit-log-internal-ip': { t: "Audit Log | Changes made in the web app show the server's internal address ::ffff:172.19.0.19 instead of the user's IP", p: 'Medium', rel: 'NDC-3029 (blueprint audit entries), NDC-3027',
    s: "Every change line in the Desk Audit Log (added, updated, published, deleted) shows IP ::ffff:172.19.0.19/128, an internal server address, for every user. Sign-in lines show the user's real public IP.",
    st: ['Sign in to Desk and change anything (edit a blueprint description, add a skill, edit a ticket field).', 'Open Setup › Audit Log.', 'Compare the IP under your change with the IP under your sign-in line.'],
    e: 'Each change line shows the IP of the user who made the change, the same as their sign-in line.',
    a: ['Change lines show "IP ::ffff:172.19.0.19/128" for every user and every entity.', "GET /api/v1/audit/events: login/logout rows have the public IP (41.40.x.x, 41.44.x.x); desk created/updated rows have ::ffff:172.19.0.19/128 (48 of today's rows) or no IP."] },
  'history-raw-closed-time': { t: 'Ticket History | Closed Time shows a raw timestamp and Resolution Time shows a bare number', p: 'Low', rel: 'NDC-3054 (close side effects)',
    s: 'After a ticket is closed, History shows "Closed Time was updated" with a raw ISO value in UTC and "Resolution Time was updated" with a bare number and no unit.',
    st: ['Close a ticket (here: through a blueprint transition into Closed).', 'Open the ticket › History.'],
    e: "Closed Time in the user's date/time format and time zone (e.g. 16/11/2026 11:48 AM); Resolution Time with a unit (e.g. 11 minutes).",
    a: ['"Closed Time · New 2026-11-16T09:48:59.7799208+00:00" (#4177) and "2026-11-16T09:09:14.975698+00:00" (#4166).', '"Resolution Time · New 11" / "New 3" with no unit, while Key Information shows "Less than a minute".'] },
  'blueprint-api-guid-parser-text': { t: 'Blueprint API | A malformed transition owner id returns .NET parser text instead of a readable error', p: 'Low', rel: 'NDC-3037',
    s: 'Saving a blueprint whose transition owner id is not a valid id returns 422 with internal framework text instead of a readable message naming the transition.',
    st: ['Send POST /api/v1/modules/{tickets}/blueprints with a transition whose before.allowedUserIds = ["not-a-uuid"].', 'Read the error.'],
    e: "422 with a plain message naming the transition and the bad value (e.g. \"Transition QA x: 'not-a-uuid' is not a valid user id\"), like the message for an unknown id.",
    a: ['422 BLUEPRINT_DEFINITION_FIELD_INVALID on path "definition" with "The JSON value could not be converted to System.Guid. Path: $.transitions[0].before.allowedUserIds[0] | LineNumber: 0 | BytePositionInLine: 535."', 'A valid but unknown id gives the readable "No user exists with id …" (fixed under NDC-3037).'] },
  'blueprint-save-without-revision-overwrites': { t: 'Blueprint API | A save that sends no revision is accepted and silently overwrites a newer change', p: 'Low', rel: 'NDC-3030 (designer path fixed)',
    s: "The NDC-3030 fix refuses a stale save that sends an old revision, but a save that sends no revision at all is still accepted and replaces the newer version. The designer always sends a revision; scripts or integrations that omit it can still lose other people's changes.",
    st: ['GET a blueprint (revision 11).', 'Save a rename with revision 11 (200, revision 12).', 'From the copy read in step 1, save a description change through PUT /blueprints/{id} (and PUT …/draft) without a revision field.', 'GET the blueprint.'],
    e: 'The save without a revision is refused (409, or 422 "revision is required"); the rename stays.',
    a: ['Both saves answer 200.', 'The name is back to the old one; the rename is lost with no warning. The same call with revision 11 gets 409 BLUEPRINT_REVISION_CONFLICT.'] },
  'read-only-agent-runs-transition': { t: 'Blueprint | An agent with read-only access to a ticket can still run a transition they own and move the ticket', p: 'High', rel: 'NDC-3036, NDC-3056',
    s: 'A ticket that an agent may only read (banner "You can read this ticket but not change it") still offers that agent the blueprint transition they own, and Run moves the ticket. The user confirmed: read-only agents must not run transitions.',
    st: ['Create a blueprint where transition "QA onlyA" (Open → Escalated) is owned only by agent A.', 'Create a ticket in it owned by someone else, so agent A can only read it.', 'Sign in as agent A and open the ticket.', 'Click QA onlyA › Run.'],
    e: 'Agent A sees the ticket read-only with no transition button (or a disabled one); a run through the API is refused.',
    a: ['The banner says "You can read this ticket but not change it" and Status is locked, but QA onlyA and Run are offered.', 'Run answers 200: #4182 moved Open → Escalated and History shows the agent did it (same on #4174).', 'Afterwards the agent gets "This ticket is not available" + "Permission denied."'], extra: ' and QA agent "Customer Experience Specialists 2" (Desk Agent, Customer Support)' },
};
for (const [k, b] of Object.entries(B)) {
  const md = `# ${b.t}\n\n**Summary**\n${b.s}\n\n**Steps to Reproduce**\n${b.st.map((x, i) => `${i + 1}. ${x}`).join('\n')}\n\n**Expected Result**\n- ${b.e}\n\n**Actual Result**\n${b.a.map(x => '- ' + x).join('\n')}\n\n**Environment**\n${env}${b.extra || ''}.\n\n**Suggested priority**: ${b.p}\n\n**Related**: ${b.rel}\n\n**Evidence**: screenshots/annotated/BUG-${k}-FAIL.png (spec scripts/specs-bugs/BUG-${k}.json)\n\n_Draft, not filed (retest round 19, Blueprint lane)._\n`;
  fs.writeFileSync(path.join(OUT, k + '.md'), md);
}
console.log(fs.readdirSync(OUT).join('\n'));
