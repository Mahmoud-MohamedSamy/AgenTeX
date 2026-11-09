// Writes the two Plane work-item bodies (compact HTML, no whitespace between tags).
const fs = require('fs');
const JAM = 'https://jam.dev/c/66d8afd1-07f6-4798-be51-141d09767226';
const common = { state: '34a7f4b6-7207-4955-b927-0d8d1dd3c666', labels: ['b4793725-8568-4924-ae21-055387b991f2'],
  assignees: ['9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', '82cf7a79-0707-4f47-97ca-f8926587b6db', 'e1364b0b-d3cd-4167-8261-6194577a480a'] };
const env = '<h2>Environment</h2><ul><li>App: TAVI Desk, staging (staging-desk.taviportal.com), organization NDC-Staging</li><li>Page: Setup › Modules &amp; Fields › Tickets › Layouts › Standard</li><li>Browser: Edge 156 on Windows 10, 1272×866</li><li>Reporter: ndc-staging-owner (Jam recorded 8 Nov 2026, 08:50 UTC); checked again 8 Nov 2026</li></ul>';
const att = `<h2>Attachment</h2><p><a href="${JAM}">Attachment</a></p>`;

const b1 = {
  ...common, priority: 'high',
  name: 'Layouts | Saving a ticket layout replaces its Detail view with the Create view, so the Standard layout can never be saved',
  description_html:
    '<h2>Summary</h2><p>When an admin changes anything in a ticket layout and clicks Save, the Detail view is overwritten with a copy of the Create view. On the Standard ticket layout the Detail view has fields that are not on Create (Resolution, plus an Integration section with CRM Deal and Contract). Because Resolution must stay on the Detail view, every save of the Standard layout is refused with “Layout not saved”.</p>' +
    '<h2>Steps to Reproduce</h2><ol><li>Sign in as an admin and go to Setup › Modules &amp; Fields › Tickets › Layouts.</li><li>Open the Standard layout. It opens on the Create tab.</li><li>Open the Detail View tab and note that Resolution is shown there. It is not on the Create tab.</li><li>Go back to the Create tab, click any field label (for example Phone), change the text and press Enter.</li><li>Click Save.</li></ol>' +
    '<h2>Expected Result</h2><ul><li>The layout saves.</li><li>The Detail view keeps its own fields and sections, including Resolution and the Integration section.</li></ul>' +
    '<h2>Actual Result</h2><ul><li>The message “Layout not saved: \"resolution\" cannot be removed from the layout: non-removable standard fields stay on it. Move them instead.” appears.</li><li>Nothing in the layout is saved. The same happens after opening the Detail View tab before saving, so the Standard layout cannot be changed at all.</li><li>The layout sent on Save has the Create view’s fields in place of the Detail view’s: 18 fields in 2 sections, against 21 fields in 3 sections on the Detail view. Resolution, CRM Deal and Contract are missing.</li></ul>' +
    '<h2>Risk</h2><ul><li>Saving is blocked here only because Resolution is a protected field. On a layout whose Detail-only fields are not protected, Save would go through and those fields would disappear from the ticket detail page without any warning.</li><li>On Standard, the whole Integration section (CRM Deal, Contract) would be lost this way.</li><li>All 10 QA NDC ticket layouts already have a Detail view identical to their Create view. This fits earlier saves having flattened them, but it was not seen happening.</li></ul>' +
    '<h2>Side effect</h2><ul><li>The error asks the admin to “move” Resolution, but Resolution is not on the tab being edited and the admin did not remove it. The message cannot be acted on. Once the Detail view is kept on Save, this message should not appear for normal edits.</li></ul>' +
    '<h2>Related</h2><ul><li>The label rename in the same recording is saved even though this error says nothing was saved. Filed separately.</li></ul>' + env + att
};
const b2 = {
  ...common, priority: 'medium',
  name: 'Layouts | A field label rename is saved even though the layout editor says "Layout not saved"',
  description_html:
    '<h2>Summary</h2><p>In the ticket layout editor, renaming a field label and clicking Save can show “Layout not saved” while the new label is in fact saved. The admin is told nothing was saved when part of the change was.</p>' +
    '<h2>Steps to Reproduce</h2><ol><li>Sign in as an admin and go to Setup › Modules &amp; Fields › Tickets › Layouts.</li><li>Open the Standard layout. It cannot be saved at the moment because of the related bug, which makes the failed save easy to see.</li><li>On the Create tab, click a field label (in the recording, the Email field labelled “test”), type a new name (“Email”) and press Enter.</li><li>Click Save. The message “Layout not saved: …” appears.</li><li>Go to Setup › Modules &amp; Fields › Tickets › Fields and search for the field.</li></ol>' +
    '<h2>Expected Result</h2><ul><li>If the layout cannot be saved, nothing is saved, including the label.</li><li>Or, if the label is kept, the message says that the label was saved and the layout was not.</li></ul>' +
    '<h2>Actual Result</h2><ul><li>The editor says “Layout not saved”.</li><li>The Fields list shows the field with its new label “Email”, so the rename was saved.</li><li>For about an hour afterwards the layout editor still showed the old label “test” on the Create tab, then it changed to “Email” without anyone saving the layout.</li></ul>' +
    '<h2>Related</h2><ul><li>Related bug: Saving a ticket layout replaces its Detail view with the Create view (the reason this save failed). This bug still applies whenever a layout save fails for any reason.</li></ul>' + env + att
};
for (const [k, v] of [['b1', b1], ['b2', b2]]) { if (/>\s+</.test(v.description_html)) throw new Error(k + ' has whitespace between tags'); fs.writeFileSync(`${k}-item.json`, JSON.stringify(v)); }
console.log('ok');
