# Mail to check (8 Nov 2026)

Inbox: mahmoud.mmohamedsamy@gmail.com, including Spam. Search for each tag.

| Row | Tag | What should happen | Why it matters |
|---|---|---|---|
| NT-05 | NT05on108680 | A comment mail and a closed mail arrive | First proof that customer mail reaches an inbox |
| NT-05 | NT05offbd81b7 | Nothing arrives | The rules were off |
| NT-13 | NT132cca0a | Nothing arrives | Private comment |
| NT-05b | NT05bb61f69 | Comment added, edited and removed mails arrive | Each has its own rule |
| SL-21 | SL211539d2 | An SLA escalation mail arrives | Contact recipient at the due time |
| NT-07 | NT0741928b | Sent to the +qaao alias: an "added as CC" mail, and a closed mail | The feed logged only one mail, so the closed mail may be missing |
| NT-16 | NT165739fd | A closed mail whose subject starts "QA AO NT16", with the ticket number and subject filled in and no {{ }} left | **The feed logged no mail. If nothing arrives, this is a bug** |
| NT-15c | NT15a028c59 | A closed mail whose subject starts "QA AO NT15c" | **Same check as NT-16** |
| NT-15c | NT15icd23ae | Tell me what arrives | Closed right after the template was bound; the feed logged a mail |

## Added 9 Nov 2026 (afternoon, Cairo time)

| Row | Search for | What should arrive | Why it matters |
|---|---|---|---|
| NT-24 | NT24ax8yl, NT24bx8yl | One "closed" mail per ticket (tickets closed together on screen, about 15:35) | Bulk close sends the closed mail to each contact |
| SL-22 | SL22pczr | Mail with subject "QA AO SL22pczr custom: #… level 1 (at)", tokens filled; then a default "[SLA] #… first_response — level 2 (after)" mail about a minute later (about 15:57) | Custom template per level, then the default template |
| SL-57 | SL57pczr, or an "[SLA] … level 1 (at)" mail at about 15:57 | Tell me which: the deleted custom template ("QA AO SL57pczr custom (deleted later)") or the default "[SLA]" one, or nothing | The template was deleted after the policy chose it, with no warning |
| SL-22/57 (aborted run) | SL22tved, SL57tved | May also have arrived from a run cut short by a network drop; ignore them | — |
