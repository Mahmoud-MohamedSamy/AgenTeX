# Plane Desk items (NDC, all states)

Pulled 2026-11-01 via Plane REST API (read-only). Module: Desk. "Kind" is inferred from name/labels/state (PRD = "PRD" in name/label; gap list = "missing/gap/parity" in name; bug = Bug label/state or "Bug" prefix).

## Counts: Desk module (353 items)

| kind | Backlog | Bug | Cancelled | Done | In Progress | Ready For Test | Ready for Deployment | total |
|---|---|---|---|---|---|---|---|---|
| PRD |  |  |  | 1 |  |  |  | 1 |
| gap list | 7 |  | 4 | 5 | 2 |  | 2 | 20 |
| bug |  | 6 |  |  |  |  |  | 6 |
| other | 34 |  | 4 | 225 | 40 | 3 | 20 | 326 |
| **total** | 41 | 6 | 8 | 231 | 42 | 3 | 22 | 353 |

## Counts: strays outside the Desk module (163, name keyword match; many are CRM or other apps)

| kind | Backlog | Bug | Cancelled | Done | In Progress | Ready For Test | Todo | total |
|---|---|---|---|---|---|---|---|---|
| gap list |  |  |  | 5 |  |  |  | 5 |
| bug |  | 8 |  |  |  |  |  | 8 |
| other | 12 |  | 1 | 100 | 27 | 9 | 1 | 150 |
| **total** | 12 | 8 | 1 | 105 | 27 | 9 | 1 | 163 |

## Desk module items

| id | name | state | priority | labels | cycle | created | kind |
|---|---|---|---|---|---|---|---|
| NDC-1844 | PRD: Zoho Desk ↔ SalesIQ Integration | Done | medium | Desk Integrations | Sprint 01 | 2026-09-27 | PRD |
| NDC-2346 | Headquarters: features Zoho Desk has that Desk is missing | Backlog | medium | Home Page |  | 2026-10-21 | gap list |
| NDC-2364 | Advanced Analytics for Desk: features Zoho Analytics for Zoho Desk has that Desk + Analytics are missing | Backlog | medium |  |  | 2026-10-21 | gap list |
| NDC-2392 | CRM + Desk Integration: features Zoho CRM + Desk has that TAVI is missing | Backlog | high | Desk Integrations | Sprint 13 | 2026-10-22 | gap list |
| NDC-2635 | Activity Life Cycle: features Zoho Desk has that Desk is missing | Backlog | medium | Activities | Sprint 13 | 2026-10-26 | gap list |
| NDC-2636 | Ticket Replies: features Zoho Desk has that Desk is missing | Backlog | medium | Tickets | Sprint 13 | 2026-10-26 | gap list |
| NDC-2752 | Desk Skills: missing functions vs Zoho Desk | Backlog | medium | Assignment Rules |  | 2026-11-01 | gap list |
| NDC-2754 | Blueprint (with SLA tie-in): features Zoho Desk has that Desk is missing | Backlog | high |  | Sprint 14 | 2026-11-01 | gap list |
| NDC-1779 | Desk ticket list and views are missing Zoho Desk capabilities | Cancelled | medium | Tickets |  | 2026-09-22 | gap list |
| NDC-1782 | Desk Activities module is missing custom views, reminders and team assignment | Cancelled | medium | Activities |  | 2026-09-22 | gap list |
| NDC-1783 | Desk Customers module is not shipped and the customer record is missing Zoho Desk tabs and actions | Cancelled | medium | Customers |  | 2026-09-22 | gap list |
| NDC-1784 | Desk Settings pages are missing Zoho Desk capabilities across departments, agents, sharing, layouts, workflows and rebranding | Cancelled | medium | Desk Settings |  | 2026-09-22 | gap list |
| NDC-2093 | Merge Tickets: features Zoho Desk has that Desk is missing | Done | high | Merge Tickets |  | 2026-10-06 | gap list |
| NDC-2171 | A rating link with the code missing opens a blank page | Done | low | Customer Happiness |  | 2026-10-07 | gap list |
| NDC-2177 | Scheduled Replies: features Zoho Desk has that Desk is missing | Done | medium | Scheduled Replies |  | 2026-10-07 | gap list |
| NDC-2203 | DESK Workflow Missings | Done | urgent | Workflow Rules | Sprint 13 | 2026-10-11 | gap list |
| NDC-2211 | Spam and Shared Tickets views are missing on desk.anyware.software | Done | high | Merge Tickets |  | 2026-10-11 | gap list |
| NDC-2174 | Modules and Fields Missings | In Progress | urgent | Modules & Fields |  | 2026-10-07 | gap list |
| NDC-2266 | SLA and Escalation: features Zoho Desk has that Desk is missing | In Progress | medium | SLA & Business Hours |  | 2026-10-14 | gap list |
| NDC-2389 | Email Templates and Notifications: features Zoho Desk has that Desk is missing | Ready for Deployment | medium |  |  | 2026-10-21 | gap list |
| NDC-2494 | Data Administration: features Zoho Desk has that Desk is missing | Ready for Deployment | medium |  | Sprint 13 | 2026-10-24 | gap list |
| NDC-1987 | Macros and workflow actions | Bug | medium | Templates & Workflow |  | 2026-10-05 | bug |
| NDC-2751 | Web Forms / Form added with the website code doesn't appear on the website (Desk and CRM) | Bug | high |  | Sprint 14 | 2026-11-01 | bug |
| NDC-2753 | Title: Blueprint / Running a transition with an attached file fails: “File … does not belong to you” (422) | Bug | urgent | Blueprint | Sprint 14 | 2026-11-01 | bug |
| NDC-2755 | Blueprint / A state's automatic close after its time limit is not shown in the state panel ("No limit"), so it can be lost or not noticed | Bug | high | Blueprint | Sprint 14 | 2026-11-01 | bug |
| NDC-2756 | Blueprint / The time-limit example always says "Counted on a Monday to Friday, 9 to 5 week", not the tenant's real business hours | Bug | low | Blueprint | Sprint 14 | 2026-11-01 | bug |
| NDC-2757 | Blueprint / "Close ticket" button is still shown on a ticket that is inside a blueprint | Bug | medium | Blueprint | Sprint 14 | 2026-11-01 | bug |
| NDC-1865 | Desk Features Testing | Backlog | none | Work Plan |  | 2026-09-30 | other |
| NDC-1951 | Desk: Tickets core | Backlog | high | Tickets |  | 2026-10-05 | other |
| NDC-1953 | Desk: Teams and agents | Backlog | high | Teams & Agents |  | 2026-10-05 | other |
| NDC-1954 | Desk: Templates and workflow | Backlog | high | Templates & Workflow |  | 2026-10-05 | other |
| NDC-1957 | Desk: Channels | Backlog | medium | Email Channel |  | 2026-10-05 | other |
| NDC-1958 | Desk: AI | Backlog | low | AI Features |  | 2026-10-05 | other |
| NDC-1959 | Desk: Customers and activities | Backlog | medium | Customers |  | 2026-10-05 | other |
| NDC-1960 | Desk: Platform and data | Backlog | medium | API & Platform |  | 2026-10-05 | other |
| NDC-1970 | Personal time zone and date format | Backlog | high | Desk Settings | Sprint 13 | 2026-10-05 | other |
| NDC-1973 | Time-based rules and auto-close | Backlog | medium | SLA & Business Hours | Sprint 13 | 2026-10-05 | other |
| NDC-1977 | Agent sign-in security: SSO, two-factor, allowed IPs | Backlog | high | Teams & Agents |  | 2026-10-05 | other |
| NDC-1978 | Assignment rules and skills | Backlog | medium | Assignment Rules | Sprint 13 | 2026-10-05 | other |
| NDC-1984 | Template engine with placeholders | Backlog | high | Templates & Workflow | Dev - Sprint 3 | 8 June - 10 June | 2026-10-05 | other |
| NDC-1988 | Layout rules, validation rules, nested picklists | Backlog | medium | Templates & Workflow | Sprint 13 | 2026-10-05 | other |
| NDC-1989 | Custom scripts and scheduled jobs | Backlog | low | Templates & Workflow |  | 2026-10-05 | other |
| NDC-1993 | Web form extras: position, analytics, languages | Backlog | low | Web Forms | Sprint 13 | 2026-10-05 | other |
| NDC-1994 | Guided conversations (self-service flows) | Backlog | low | Help Center | Sprint 13 | 2026-10-05 | other |
| NDC-1995 | Help widget for websites | Backlog | low | Help Center | Sprint 13 | 2026-10-05 | other |
| NDC-1997 | Customer Happiness automation and reports | Backlog | low | Customer Happiness | Sprint 13 | 2026-10-05 | other |
| NDC-1998 | Desk mobile apps for agents and supervisors | Backlog | low | Work Plan |  | 2026-10-05 | other |
| NDC-2000 | Chat, Social and Community channels | Backlog | low | Social Channels |  | 2026-10-05 | other |
| NDC-2003 | AI answer bot and AI tagging upgrades | Backlog | low | AI Features |  | 2026-10-05 | other |
| NDC-2004 | AI help for agents: summary, reply suggestion, writing assistant | Backlog | low | AI Features |  | 2026-10-05 | other |
| NDC-2005 | Ticket translation | Backlog | low | AI Features |  | 2026-10-05 | other |
| NDC-2006 | AI field prediction, auto-triage, volume alerts | Backlog | low | AI Features |  | 2026-10-05 | other |
| NDC-2009 | Public API keys and webhooks | Backlog | medium | API & Platform |  | 2026-10-05 | other |
| NDC-2013 | More integrations: Jira, Shopify, finance, Zapier | Backlog | low | Desk Integrations |  | 2026-10-05 | other |
| NDC-2014 | More interface languages and translated field labels | Backlog | low | Localization |  | 2026-10-05 | other |
| NDC-2015 | Remote assistance (screen sharing) | Backlog | low | API & Platform |  | 2026-10-05 | other |
| NDC-2068 | User Story: Tavi Desk → Tavi Analytics integration | Backlog | medium | Desk Integrations |  | 2026-10-06 | other |
| NDC-2275 | Assignment Rules: Direct Assignment and Round Robin (requirements) | Backlog | urgent | Assignment Rules |  | 2026-10-14 | other |
| NDC-2295 | CRM - Desk Integration / Attachments added to a linked contact in Desk or CRM don't appear on the same contact in the other app | Backlog | high | CRM Integration, Desk Integrations | Sprint 13 | 2026-10-19 | other |
| NDC-2347 | Headquarters: user stories for the functions not built yet | Backlog | medium | Home Page |  | 2026-10-21 | other |
| NDC-2365 | Advanced Analytics for Desk: user stories for the functions not built yet | Backlog | medium |  |  | 2026-10-21 | other |
| NDC-1780 | Desk bulk actions on the ticket list are mostly disabled compared with Zoho Desk | Cancelled | medium | Tickets |  | 2026-09-22 | other |
| NDC-1781 | Desk ticket detail page lacks many Zoho Desk ticket actions and sub-tab features | Cancelled | medium | Tickets |  | 2026-09-22 | other |
| NDC-2001 | Phone channel: calls to tickets, IVR, call queues | Cancelled | low | Telephony |  | 2026-10-05 | other |
| NDC-2002 | App store and YouTube reviews as tickets | Cancelled | low | Social Channels |  | 2026-10-05 | other |
| NDC-1786 | Desk settings links open the In Development page and the workflow editor deep link renders __no-module__ | Done | medium | Desk Settings |  | 2026-09-22 | other |
| NDC-1798 | Attach From Cloud crashes the whole Desk app to a white screen | Done | urgent | Tickets |  | 2026-09-24 | other |
| NDC-1799 | Contacts with no last name can never be edited from their record page | Done | high | Customers |  | 2026-09-24 | other |
| NDC-1801 | The ticket due date field accepts free text | Done | medium | Tickets |  | 2026-09-24 | other |
| NDC-1802 | A NUL character in a search query returns an internal server error | Done | medium | Search |  | 2026-09-24 | other |
| NDC-1803 | Comments on an activity can be added but never edited or deleted | Done | medium | Activities |  | 2026-09-24 | other |
| NDC-1804 | Searching for a single underscore returns every ticket | Done | low | Search |  | 2026-09-24 | other |
| NDC-1805 | The attachment size limit shown to agents does not match the limit enforced | Done | low | Tickets |  | 2026-09-24 | other |
| NDC-1811 | The ticket History records the creation event with the ticket's current field values | Done | high | Tickets |  | 2026-09-24 | other |
| NDC-1812 | An inbound customer email is recorded in the ticket History as an unattributed "Ticket updated" | Done | medium | Tickets |  | 2026-09-24 | other |
| NDC-1813 | A Call can never leave a Completed or Cancelled status — it has no Reopen action | Done | medium | Activities |  | 2026-09-24 | other |
| NDC-1815 | The ticket History shows only relative times, so the time of day of an audited change cannot be read | Done | low | Tickets |  | 2026-09-24 | other |
| NDC-1817 | An account record has no Contracts tab, so a contract linked to it cannot be reached from the account | Done | low | Customers |  | 2026-09-24 | other |
| NDC-1818 | The Conversation tab renders the raw translation key tickets.conversation.showQuoted instead of a label | Done | low | Tickets |  | 2026-09-24 | other |
| NDC-1831 | E-mail and phone fields accept invalid values through the API | Done | medium | Customers |  | 2026-09-24 | other |
| NDC-1838 | Reply All after a Forward copies the forward recipient and quotes the private forward to the customer | Done | high | Email Channel |  | 2026-09-27 | other |
| NDC-1839 | Editing a receiving email address always fails with "That operation is not available on this resource" | Done | medium | Email Channel |  | 2026-09-27 | other |
| NDC-1840 | The Suppressions tab always shows "Nothing is suppressed" even when addresses are suppressed | Done | medium | Email Channel |  | 2026-09-27 | other |
| NDC-1841 | Add address accepts invalid email addresses that cannot receive mail | Done | low | Email Channel |  | 2026-09-27 | other |
| NDC-1842 | One suppressed Cc address stops the whole reply, so the customer gets nothing | Done | low | Email Channel |  | 2026-09-27 | other |
| NDC-1843 | Forwarding a ticket conversation leaves out the attachments of the forwarded messages | Done | low | Email Channel |  | 2026-09-27 | other |
| NDC-1845 | Adding an email provider saves invalid settings and credentials without checking them | Done | medium | Email Channel |  | 2026-09-28 | other |
| NDC-1846 | Replace credentials adds a second connection and leaves the old one listed | Done | low | Email Channel |  | 2026-09-28 | other |
| NDC-1847 | SendGrid and Amazon SES connections are listed as "Bulk sending service" | Done | low | Email Channel |  | 2026-09-28 | other |
| NDC-1850 | Collaboration Integrations | Done | medium | Desk Integrations | Sprint 01 | 2026-09-29 | other |
| NDC-1851 | Ticket Replies | Done | medium | Tickets | Sprint 01 | 2026-09-29 | other |
| NDC-1855 | Web form: HTML typed by a visitor in Description is rendered in the agent's ticket view and loads outside images | Done | medium | Web Forms | Sprint 11 | 2026-09-29 | other |
| NDC-1856 | Web form: a program file renamed to .png is accepted as an image attachment | Done | medium | Web Forms | Sprint 11 | 2026-09-29 | other |
| NDC-1857 | Web form changes are not recorded in the Audit Log | Done | medium | Web Forms | Sprint 11 | 2026-09-29 | other |
| NDC-1858 | Web form: the "websites the form is on" restriction can be bypassed by claiming an allowed website | Done | low | Web Forms | Sprint 11 | 2026-09-29 | other |
| NDC-1859 | Feedback widget embed code says it works only on listed websites when the website list is empty | Done | low | Web Forms | Sprint 11 | 2026-09-29 | other |
| NDC-1860 | Web form API returns internal .NET class names for values of the wrong type | Done | low | Web Forms | Sprint 11 | 2026-09-29 | other |
| NDC-1861 | Feedback widget shows "Offer live chat" ticked while saying no live chat is linked | Done | low | Web Forms | Sprint 11 | 2026-09-29 | other |
| NDC-1886 | An agent without the delete permission can still delete tickets through the API | Done | high | Tickets |  | 2026-10-04 | other |
| NDC-1887 | Ticket attachments can be downloaded by an agent who cannot see the ticket, including private and removed files | Done | high | Tickets |  | 2026-10-04 | other |
| NDC-1888 | A non-admin agent can edit and delete another agent's comment on a ticket | Done | high | Tickets |  | 2026-10-04 | other |
| NDC-1889 | Images in a customer email load before "Show images" is clicked, so tracking pixels fire | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1890 | Ticket status and priority accept values outside their allowed lists | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1891 | Ticket API stores owner, contact and department ids that do not exist | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1892 | Ticket API lets an agent write system fields such as Created Time and add fields that do not exist | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1893 | Ticket subject and description have no length limit | Done | low | Tickets |  | 2026-10-04 | other |
| NDC-1894 | Saving a ticket from an older tab silently undoes changes made in another tab | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1895 | A due date set on the New Ticket form is saved without a time zone | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1896 | The ticket History tab shows no field changes to non-admin agents | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1897 | The Ticket Owner picker offers users from other departments and then refuses them | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1898 | New Ticket lists every company user as owner and saves an owner from another department | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1899 | A ticket created with status Closed has no closed time | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1900 | A reopened ticket keeps its old Closed Time | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1901 | Time entries are kept in two places that never match, so ticket time totals are wrong | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1902 | The Time Entry form accepts a single entry longer than 24 hours | Done | low | Tickets |  | 2026-10-04 | other |
| NDC-1903 | Decimal hours in a time entry are silently cut (2.5 hours saved as 2:00) | Done | low | Tickets |  | 2026-10-04 | other |
| NDC-1904 | A resolution made of only spaces can be saved from the Resolution tab | Done | low | Tickets |  | 2026-10-04 | other |
| NDC-1905 | Bulk Close closes the selected tickets immediately, with no confirmation | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1906 | An empty reply can be sent to the customer (single and bulk reply) | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1907 | "Add Task" from a ticket's Activity tab always fails for agents | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1908 | Reply or Forward from an older message quotes the newest message instead | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1909 | A ticket marked as spam stays in the normal ticket views | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1910 | Team members cannot be saved: the team form fails with 400 | Done | high | Teams & Agents |  | 2026-10-04 | other |
| NDC-1911 | In Arabic, ticket page labels stay in English | Done | low | Tickets |  | 2026-10-04 | other |
| NDC-1912 | Starred ticket views are kept only in the browser, not saved to the user | Done | low | Custom Views |  | 2026-10-04 | other |
| NDC-1913 | A custom view's link, reload or "Open in New Tab" lands on All Tickets | Done | medium | Custom Views |  | 2026-10-04 | other |
| NDC-1914 | Custom view criteria cannot use OR, and a view with an OR pattern shows the wrong tickets | Done | medium | Custom Views |  | 2026-10-04 | other |
| NDC-1915 | Sharing a custom view with specific agents fails with a server error, and the picker lists CRM users | Done | medium | Custom Views |  | 2026-10-04 | other |
| NDC-1916 | Searching a ticket number with # (e.g. "#120") finds nothing | Done | low | Search |  | 2026-10-04 | other |
| NDC-1917 | Ticket Table view has no Subject, Status, Priority or Ticket Number column, and they cannot be added | Done | medium | Tickets |  | 2026-10-04 | other |
| NDC-1961 | Ticket fields: customer responded, team, first-response time, response due, category, archived | Done | high | Tickets | Sprint 12 | 2026-10-05 | other |
| NDC-1962 | Ticket metrics: first response and resolution time | Done | high | Tickets | Sprint 12 | 2026-10-05 | other |
| NDC-1963 | Merge tickets and a real Spam view | Done | high | Merge Tickets | Dev - Sprint 3 | 8 June - 10 June | 2026-10-05 | other |
| NDC-1964 | Views for the new fields: Customer Responded, Response Overdue, SLA Violated | Done | high | Tickets | Sprint 12 | 2026-10-05 | other |
| NDC-1966 | Tickets: saved filters, more filters, bulk move, parent and child tickets, split, archive, templates, number prefix | Done | medium | Tickets | Sprint 12 | 2026-10-05 | other |
| NDC-1967 | Custom views: clone and show in all departments | Done | medium | Custom Views | Sprint 12 | 2026-10-05 | other |
| NDC-1968 | Real-time ticket list and counts | Done | medium | Tickets | Sprint 12 | 2026-10-05 | other |
| NDC-1969 | Several business-hours sets, split shifts, two holiday lists | Done | high | SLA & Business Hours | Sprint 11 | 2026-10-05 | other |
| NDC-1971 | SLA policies and escalations | Done | high | SLA & Business Hours | Sprint 11 | 2026-10-05 | other |
| NDC-1972 | Support plans with usage tracking | Done | high | SLA & Business Hours | Sprint 11 | 2026-10-05 | other |
| NDC-1975 | Working teams | Done | high | Teams & Agents | Sprint 11 | 2026-10-05 | other |
| NDC-1976 | Agent online / offline status | Done | high | Teams & Agents | Sprint 11 | 2026-10-05 | other |
| NDC-1979 | Queues, Team Feeds and tags extras | Done | medium | Queues & Tags | Sprint 13 | 2026-10-05 | other |
| NDC-1980 | Users and departments: reassign on leave, email invitations, signatures | Done | medium | Teams & Agents | Sprint 13 | 2026-10-05 | other |
| NDC-1981 | Light agents (view and private comment only) | Done | medium | Teams & Agents | Sprint 11 | 2026-10-05 | other |
| NDC-1982 | Agent accessibility controls | Done | low | Teams & Agents | Sprint 11 | 2026-10-05 | other |
| NDC-1985 | Notification rules and email templates | Done | high | Templates & Workflow |  | 2026-10-05 | other |
| NDC-1996 | Basic reports and dashboards | Done | high | Reports | Sprint 11 | 2026-10-05 | other |
| NDC-2007 | Customers: several accounts per contact, duplicates, GDPR requests, contract alerts | Done | medium | Customers | Sprint 13 | 2026-10-05 | other |
| NDC-2011 | Data retention policy | Done | medium | Data Administration | Sprint 12 | 2026-10-05 | other |
| NDC-2016 | Headquarters landing page | Done | medium | Home Page | Sprint 11 | 2026-10-05 | other |
| NDC-2017 | Scheduled replies | Done | medium | Scheduled Replies, Tickets |  | 2026-10-05 | other |
| NDC-2094 | Merge Tickets: user stories for the functions not built yet | Done | high | Merge Tickets |  | 2026-10-06 | other |
| NDC-2138 | A merged ticket can still be reopened and worked on, and that work never reaches the master ticket | Done | high | Merge Tickets |  | 2026-10-06 | other |
| NDC-2139 | Tickets closed by a merge have no Closed Time | Done | medium | Merge Tickets |  | 2026-10-06 | other |
| NDC-2140 | Merge page lets you pick an already merged ticket, then shows its internal id in the error | Done | low | Merge Tickets |  | 2026-10-06 | other |
| NDC-2141 | Merge API returns wrong error messages for unknown tickets and fields | Done | low | Merge Tickets |  | 2026-10-06 | other |
| NDC-2142 | Customer Happiness rating page is blank for every valid rating link, so customers cannot rate | Done | urgent | Customer Happiness |  | 2026-10-07 | other |
| NDC-2143 | Ticket Closed rating link is refused for the ticket's own requester in "Requesters and cc'd users" mode | Done | high | Customer Happiness |  | 2026-10-07 | other |
| NDC-2144 | Saving Customer Happiness settings without the newer fields silently resets them | Done | medium | Customer Happiness |  | 2026-10-07 | other |
| NDC-2145 | An empty rating link access value is saved as "Anyone on internet" | Done | medium | Customer Happiness |  | 2026-10-07 | other |
| NDC-2146 | Changes to who is notified about bad ratings are not recorded in the Audit Log | Done | medium | Customer Happiness |  | 2026-10-07 | other |
| NDC-2147 | Agent profile Happiness Rating tab shows the score but says customers have not rated the agent | Done | medium | Customer Happiness |  | 2026-10-07 | other |
| NDC-2148 | Rating page shows "check your connection" instead of the real reason a rating was refused | Done | medium | Customer Happiness |  | 2026-10-07 | other |
| NDC-2149 | Rating links in customer emails go through SendGrid click tracking, exposing the rating link to a third party | Done | medium | Customer Happiness |  | 2026-10-07 | other |
| NDC-2150 | Customers see the raw text {{happiness.link}} in the quoted history of later emails | Done | medium | Customer Happiness |  | 2026-10-07 | other |
| NDC-2151 | Rating links of a deleted ticket stay open and still accept ratings, and the stats count them | Done | medium | Customer Happiness |  | 2026-10-07 | other |
| NDC-2152 | Merging tickets leaves the merged ticket's ratings behind instead of moving them to the master ticket | Done | medium | Customer Happiness |  | 2026-10-07 | other |
| NDC-2153 | After a "someone else changed these settings" conflict, the Customer Happiness page throws away the admin's edit | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2154 | Double-clicking Save on Customer Happiness sends two saves and can show a false conflict message | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2155 | A reminder interval set outside the menu choices is shown as "Never" on the Customer Happiness page | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2156 | A decimal link expiry gives only "One or more validation errors occurred." | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2157 | Leaving the Customer Happiness page discards unsaved changes without a warning | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2158 | Invalid Customer Happiness settings values are accepted and silently replaced instead of refused | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2159 | Audit Log entries for Customer Happiness show a raw key and internal field names | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2160 | My Profile happiness score differs from the agent's happiness score elsewhere | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2161 | If the connection drops while submitting a rating, the whole form and the customer's choice are lost | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2162 | An Arabic rating question is emailed without right-to-left direction | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2163 | "Send the Ticket Closed email" is on, but closing a ticket does not always send it | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2164 | The customer's rating comment is silently changed when it is saved | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2165 | Ticket history shows "System" instead of the customer for a rating and the reopen it causes | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2166 | "Customer Happiness" Setup entry is not translated in the Arabic interface | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2167 | Language names in Customer Happiness → Languages are not translated in the Arabic interface | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2168 | Rating option icon pickers cannot be used efficiently with the keyboard | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2169 | "Add a language" menu has no label for screen readers, and the download buttons all have the same name | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2172 | The public rating page has no enforced Content Security Policy | Done | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2175 | Scheduling a reply for a date and time fails with "Unknown time zone." for every real time zone | Done | high | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2178 | Scheduled Replies: user stories for the functions not built yet | Done | medium | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2179 | After "Clear schedule" the reply is saved as a draft, but the draft never appears in the ticket's reply box | Done | high | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2180 | Replies can be scheduled on phone, web and chat tickets, although scheduling is for email tickets only | Done | medium | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2181 | A private reply, or one with an attachment from another ticket, is accepted for scheduling but then silently fails at the send time | Done | medium | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2182 | Reply emails are not cleaned: script tags, onerror attributes and javascript: links reach the customer | Done | medium | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2183 | The author is not told when someone else sends their scheduled reply with "Send now" | Done | medium | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2186 | "Scheduled for" on the Scheduled Replies list has no time zone and uses a different zone from the schedule picker | Done | low | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2187 | The scheduled reply details open below the list, out of sight, when a row is clicked | Done | low | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2188 | Saving a reply that was paused past its time says "scheduled again" but sends it at once | Done | low | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2189 | A scheduled reply with an empty paragraph as its text is accepted | Done | low | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2190 | Repeating a schedule request with the same key but different content silently returns the old reply | Done | low | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2191 | Scheduled-reply errors for wrong value types show internal .NET type names | Done | low | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2192 | Audit Log entries for scheduled replies show a raw key and internal fields, with no ticket named | Done | low | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2197 | Tickets, Contacts and Tasks module dashboards show 0 or far too few records | Done | urgent | Dashboards |  | 2026-10-07 | other |
| NDC-2198 | Double-clicking Save creates two dashboards in Desk Analytics | Done | urgent | Dashboards |  | 2026-10-07 | other |
| NDC-2199 | Saving a dashboard that was changed in another tab fails without any message | Done | urgent | Dashboards |  | 2026-10-07 | other |
| NDC-2206 | Workflow Rules / Rules that run on a Date-Time field can't be saved — "An unexpected error occurred" | Done | urgent | Workflow Rules | Sprint 11 | 2026-10-11 | other |
| NDC-2207 | Workflow Rules / Owner Assignment › Users lists CRM users instead of Desk agents | Done | urgent | Workflow Rules | Sprint 11 | 2026-10-11 | other |
| NDC-2209 | Merging tickets does not move time entries to the master ticket | Done | high | Merge Tickets |  | 2026-10-11 | other |
| NDC-2210 | A ticket shared with a department cannot be opened by that department's agents | Done | high | Tickets |  | 2026-10-11 | other |
| NDC-2212 | Connecting Google Drive from a ticket fails with "redirect_uri_mismatch" | Done | high | Desk Integrations |  | 2026-10-11 | other |
| NDC-2213 | The enable/disable switch on the Web Forms list is invisible | Done | medium | Web Forms |  | 2026-10-11 | other |
| NDC-2214 | Tickets, Contacts and Tasks module dashboards never appear and stay on "Preparing this dashboard" | Done | high | Dashboards |  | 2026-10-12 | other |
| NDC-2215 | A support plan can't be removed from a contract, and stays "in use" forever after its contract is deleted | Done | high | SLA & Business Hours |  | 2026-10-12 | other |
| NDC-2216 | A business-hours set used by an SLA target can be deleted without warning, and the SLA keeps using the deleted set | Done | medium | SLA & Business Hours |  | 2026-10-12 | other |
| NDC-2217 | Company currency and primary contact can't be cleared once set | Done | medium | Desk Settings |  | 2026-10-12 | other |
| NDC-2218 | Tickets / Ticket Owner filter lists CRM users alongside Desk agents | Done | urgent | Tickets | Sprint 11 | 2026-10-12 | other |
| NDC-2220 | Modules and Fields / Profiles chosen in the Create Module dialog are not applied | Done | urgent | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2221 | Modules and Fields / Records can be saved without the required Name field | Done | high | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2223 | Modules and Fields / Record API ignores single-line max length | Done | high | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2224 | Modules and Fields / Record API ignores number min/max and accepts text in number fields | Done | high | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2225 | Modules and Fields / Record API accepts invalid email, phone and javascript: URLs | Done | high | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2226 | Modules and Fields / Record API accepts pick-list values that are not in the list | Done | high | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2227 | Modules and Fields / Field regex is saved but not enforced | Done | high | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2228 | Modules and Fields / A required field can be set to "Don't Show" | Done | high | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2229 | Modules and Fields / Access Control picker lists CRM users and profiles instead of Desk ones | Done | high | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2233 | Modules and Fields / File and image upload restrictions are not enforced | Done | high | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2234 | Modules and Fields / Radio and Status fields accept values that are not in their list | Done | high | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2236 | Modules and Fields / A module can be created with a blank name | Done | medium | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2237 | Modules and Fields / Rename accepts an empty name or another module's name | Done | medium | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2239 | Modules and Fields / Layout builder → Rename Module crashes the page | Done | medium | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2240 | Modules and Fields / Set as default on a layout that holds records returns 500 | Done | medium | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2242 | Modules and Fields / Record API accepts invalid dates | Done | medium | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2243 | Modules and Fields / Record API ignores multi-select max items | Done | medium | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2244 | Modules and Fields / A new lookup to Contacts is not registered as a related module | Done | medium | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2245 | Modules and Fields / Deleted dependency rules come back after Save | Done | medium | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2246 | Modules and Fields / Custom data types are listed but cannot be used to create a field (API) | Done | medium | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2249 | Modules and Fields / Arabic UI leaves "Create New Layout" and the layouts description in English | Done | medium | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2250 | Modules and Fields / Module list shows "UN" as last modifier of every seeded module | Done | low | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2252 | Modules and Fields / Setup sidebar says "Set up your CRM" | Done | low | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2253 | Modules and Fields / Two modules can share the same display name | Done | low | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2254 | Modules and Fields / Layout builder does not warn about a duplicate layout name | Done | low | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2255 | Modules and Fields / Field label length (50) not enforced by the API | Done | low | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2256 | Modules and Fields / Two lookups to the same module can use the same related-list title | Done | low | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2257 | Modules and Fields / A multi-module lookup can be saved with no modules | Done | low | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2258 | Modules and Fields / Two layout-builder buttons have no accessible name | Done | low | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2259 | Modules and Fields / The 512-fields-per-layout limit is not enforced by the API | Done | low | Modules & Fields | Sprint 11 | 2026-10-12 | other |
| NDC-2269 | A deactivated holiday list still counts as a holiday in SLA due times | Done | medium | SLA & Business Hours |  | 2026-10-14 | other |
| NDC-2270 | An SLA escalation can be saved with any text as the new priority | Done | low | SLA & Business Hours |  | 2026-10-14 | other |
| NDC-2271 | The server accepts an SLA policy description of 501 characters, but the editor limit is 500 | Done | low | SLA & Business Hours |  | 2026-10-14 | other |
| NDC-2272 | Reapplying an inactive SLA policy to open tickets returns success from the server, but the screen blocks it | Done | low | SLA & Business Hours |  | 2026-10-14 | other |
| NDC-2273 | A department still counts deleted tickets, so it cannot be deleted without moving "tickets" that no longer exist | Done | low |  |  | 2026-10-14 | other |
| NDC-2274 | A deleted department cannot be permanently deleted from the Recycle Bin | Done | low |  |  | 2026-10-14 | other |
| NDC-2277 | Advanced Analytics Desk | Done | high |  | Sprint 13 | 2026-10-15 | other |
| NDC-2299 | Ticket list shows tickets the agent is not allowed to open, together with all their details | Done | high | Access Control |  | 2026-10-19 | other |
| NDC-2300 | Share data with peers has no effect — agents in the same role still cannot see each other's tickets | Done | high | Access Control |  | 2026-10-19 | other |
| NDC-2301 | Setting ticket data sharing to Public Read/Write/Delete hides every ticket from Light Agents and Reviewers | Done | high | Access Control |  | 2026-10-19 | other |
| NDC-2304 | Light Agents and Reviewers cannot open a ticket shared with their department | Done | high | Access Control |  | 2026-10-19 | other |
| NDC-2306 | Users without the Export Records permission can still export tickets through the export request | Done | high | Access Control |  | 2026-10-19 | other |
| NDC-2307 | A Desk Administrator cannot assign any profile to other agents from the Agents page | Done | high | Access Control |  | 2026-10-20 | other |
| NDC-2353 | Headquarters layout save accepts invalid layouts (unknown card types, out-of-grid positions, duplicate ids) | Done | low | Home Page |  | 2026-10-21 | other |
| NDC-2354 | An open Headquarters page keeps showing old numbers after the user loses Headquarters access | Done | low | Home Page |  | 2026-10-21 | other |
| NDC-2356 | Resizing a Headquarters card with the keyboard moves the card instead | Done | low | Home Page |  | 2026-10-21 | other |
| NDC-2366 | A ticket with a due date cannot be closed before that date | Done | high | Tickets | Sprint 13 | 2026-10-21 | other |
| NDC-2367 | Ticket Status and Tickets dashboards give different ticket counts for the same department | Done | medium | Dashboards | Sprint 13 | 2026-10-21 | other |
| NDC-2368 | Tickets dashboard shows record ids instead of product and account names | Done | medium | Dashboards | Sprint 13 | 2026-10-21 | other |
| NDC-2369 | Synced Desk ticket fields, including new custom fields, are hidden from report builders | Done | medium | Data Sources & Import | Sprint 12 | 2026-10-21 | other |
| NDC-2370 | "Analytics dashboard" element in the Desk dashboard builder never lists any dashboard | Done | medium | Dashboards | Sprint 12 | 2026-10-21 | other |
| NDC-2371 | A paused Desk table is reported as up to date, so reports show old numbers with no warning | Done | medium | Data Sources & Import | Sprint 12 | 2026-10-21 | other |
| NDC-2372 | Data Sources page shows wrong connection and sync states in a second workspace | Done | low | Data Sources & Import | Sprint 12 | 2026-10-21 | other |
| NDC-2373 | In Arabic, Desk table names on Data Sources stay in English and numbers mix two digit styles | Done | low | Localization | Sprint 13 | 2026-10-21 | other |
| NDC-2374 | Green "OK" status labels on Data Sources are too low in contrast to read | Done | low | Accessibility | Sprint 12 | 2026-10-21 | other |
| NDC-2375 | Import From Desk: "Next" stays disabled on the Fields step with no explanation | Done | low | Data Sources & Import | Sprint 12 | 2026-10-21 | other |
| NDC-2378 | Ticket Priority and Channel show raw lowercase values such as "urgent" and "email" | Done | low |  |  | 2026-10-21 | other |
| NDC-2379 | A support plan shows as not in use for about 15 seconds after a contract starts using it | Done | low |  |  | 2026-10-21 | other |
| NDC-2380 | Tag and canned reply delete dialogs say the delete is permanent, but deleted items go to the Recycle Bin | Done | low |  |  | 2026-10-21 | other |
| NDC-2393 | CRM - Desk Integration / Unlink does not stop the sync: the next change links the pair again by email | Done | high | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2394 | CRM - Desk Integration / Handshake Mode is still offered while the sync is paused | Done | medium | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2395 | CRM - Desk Integration / Failure Log reasons show raw record ids instead of record names | Done | medium | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2396 | CRM - Desk Integration / The settings API saves invalid field mappings | Done | medium | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2397 | CRM - Desk Integration / Settings save without row_version is accepted, so the lost-update check can be skipped | Done | medium | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2398 | CRM - Desk Integration / Sync History has no "failed" count | Done | medium | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2400 | CRM - Desk Integration / Desk contact list shows raw sync values "synced" / "needs_attention" | Done | low | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2401 | CRM - Desk Integration / Pause with a long reason fails with a server error (HTTP 500) | Done | low | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2402 | CRM - Desk Integration / Customer statistics answer 200 for a contact that does not exist | Done | low | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2403 | CRM - Desk Integration / Sync creates a Desk contact without its mandatory Last name | Done | medium | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2404 | CRM - Desk Integration / Handshake Mode does not match requesters by phone | Done | medium | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2405 | CRM - Desk Integration / Changing the delete preference applies to a delete made earlier | Done | medium | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2406 | CRM - Desk Integration / A Desk contact deleted by the integration is not in the recycle bin and cannot be restored | Done | high | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2407 | CRM - Desk Integration / With "No access" the CRM pane is still offered and hangs on "Loading…" | Done | low | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2408 | CRM - Desk Integration / The CRM pane error "Could not load this section." has no Retry | Done | low | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2409 | CRM - Desk Integration / Integration settings changes are not in the Audit Log | Done | low | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2410 | CRM - Desk Integration / "Lock CRM-owned fields on the contract" does not stop edits in Desk | Done | medium | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-1952 | Desk: SLA and business hours | In Progress | high | SLA & Business Hours |  | 2026-10-05 | other |
| NDC-1956 | Desk: Reports | In Progress | high | Reports |  | 2026-10-05 | other |
| NDC-1992 | Multi-brand and custom domain | In Progress | low | Desk Settings | Sprint 13 | 2026-10-05 | other |
| NDC-1999 | Email extras: Cc backup, pause mail fetching | In Progress | medium | Email Channel |  | 2026-10-05 | other |
| NDC-2196 | A department-scoped agent can read another department's ticket and its comments through the ticket detail API | In Progress | high | Tickets |  | 2026-10-07 | other |
| NDC-2219 | Modules and Fields / A CRM Admin profile gives module and field administration inside Desk | In Progress | urgent | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2222 | Modules and Fields / A saved field's data type can be changed | In Progress | high | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2230 | Modules and Fields / Field dependency rules (SHOW / REQUIRE) are saved but not applied | In Progress | high | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2231 | Modules and Fields / Conditional visibility is not applied on the record form | In Progress | high | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2232 | Modules and Fields / Department storage has no effect on records | In Progress | high | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2235 | Modules and Fields / Standard modules offer Delete, and five row-menu items do nothing | In Progress | high | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2238 | Modules and Fields / Module save has no lost-update protection | In Progress | medium | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2241 | Modules and Fields / Layout save has no lost-update protection | In Progress | medium | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2247 | Modules and Fields / Record API stores values for fields that do not exist | In Progress | medium | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2248 | Modules and Fields / Recycle Bin "Delete forever" fails for every Desk item with no message | In Progress | medium | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2251 | Modules and Fields / Web Tabs placeholder says "inside the CRM" | In Progress | low | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2260 | Modules and Fields / Rollup summary accepts a relation that does not point at the module | In Progress | low | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2261 | Modules and Fields / Layout API accepts Required + Read-only on the same field | In Progress | low | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2262 | Modules and Fields / Quick-create trigger dialog shows a raw "{{module}}" placeholder | In Progress | low | Modules & Fields | Sprint 13 | 2026-10-12 | other |
| NDC-2267 | SLA and Escalation: user stories for the functions not built yet | In Progress | medium | SLA & Business Hours |  | 2026-10-14 | other |
| NDC-2268 | Desk new Requirements | In Progress | high |  | Sprint 13 | 2026-10-14 | other |
| NDC-2303 | A department given Read-only or Restricted access to a shared ticket can still edit the ticket's fields | In Progress | high | Access Control |  | 2026-10-19 | other |
| NDC-2305 | A profile created under a parent profile gets none of the parent's permissions | In Progress | high | Access Control |  | 2026-10-19 | other |
| NDC-2351 | Closing a ticket counts the automatic "ticket closed" email as the agent's first response and as an outgoing response | In Progress | medium | Home Page |  | 2026-10-21 | other |
| NDC-2352 | Headquarters First Response Time does not match the tickets' first response times | In Progress | low | Home Page |  | 2026-10-21 | other |
| NDC-2355 | Unassigning a ticket with only owner_id returns a 500 error | In Progress | low | Home Page |  | 2026-10-21 | other |
| NDC-2377 | Sending a reply that the mail server rejects returns an error, but the reply is still saved on the ticket | In Progress | low |  |  | 2026-10-21 | other |
| NDC-2387 | Modules and Fields / A required field can still be set to read-only for a profile, so its users cannot create records | In Progress | high | Modules & Fields |  | 2026-10-21 | other |
| NDC-2399 | CRM - Desk Integration / No notice to the admin when the initial sync finishes | In Progress | low | Desk Integrations | Sprint 13 | 2026-10-22 | other |
| NDC-2637 | Activities / Rescheduling a call with "log a missed call" fails: "One or more fields in the payload are read-only." | In Progress | high | Activities | Sprint 13 | 2026-10-26 | other |
| NDC-2638 | Activities / A task saved without a status has no status and never shows in Open, My Open or Overdue | In Progress | high | Activities | Sprint 13 | 2026-10-26 | other |
| NDC-2639 | Activities / Priority, call status and direction show raw keys ("highest", "scheduled", "outbound") | In Progress | low | Activities | Sprint 13 | 2026-10-26 | other |
| NDC-2640 | Activities / A completed call is read-only on its page but can still be edited through the API | In Progress | medium | API & Platform, Activities | Sprint 13 | 2026-10-26 | other |
| NDC-2641 | Activities / Completed Time is set by the browser: the API leaves it empty and lets clients backdate it | In Progress | medium | API & Platform, Activities | Sprint 13 | 2026-10-26 | other |
| NDC-2642 | Activities / Call duration accepts any text ("abc", "-1", "99:99") | In Progress | low | API & Platform, Activities | Sprint 13 | 2026-10-26 | other |
| NDC-2643 | Activities / Add Task / Call / Event drawer fields and reminder options have no accessible names | In Progress | low | Accessibility, Activities | Sprint 13 | 2026-10-26 | other |
| NDC-2644 | Ticket Replies / "Save draft" keeps the draft only in this browser; nothing is saved on the server | In Progress | medium | Tickets | Sprint 13 | 2026-10-26 | other |
| NDC-2660 | Ticket History / Creation row shows "department_id" and the raw department id instead of the department name | In Progress | low | Tickets |  | 2026-10-27 | other |
| NDC-2661 | Tickets / Save shows "Permission denied." although the ticket is created — users save again and create duplicates | In Progress | high | Tickets |  | 2026-10-27 | other |
| NDC-2662 | Workflow Rules / Create rules whose condition uses Is Overdue, Execution Time, Recent Comment or thread/comment counts write no "Workflow rule ran" row in Ticket History | In Progress | urgent | Workflow Rules |  | 2026-10-27 | other |
| NDC-1955 | Desk: Help Center and self-service | Ready for Deployment | high | Help Center | Sprint 13 | 2026-10-05 | other |
| NDC-1974 | Blueprints (guided ticket process) | Ready for Deployment | low | Blueprint |  | 2026-10-05 | other |
| NDC-1991 | Knowledge Base advanced: review, translations, feedback, import | Ready for Deployment | low | Knowledge Base | Sprint 13 | 2026-10-05 | other |
| NDC-2008 | Activities: table view, more views, bulk update, several reminders, click-to-call | Ready for Deployment | medium | Activities | Sprint 13 | 2026-10-05 | other |
| NDC-2010 | Migration from other help desks | Ready for Deployment | medium | Import & Export | Sprint 13 | 2026-10-05 | other |
| NDC-2012 | Sandbox, backup restore, data archive | Ready for Deployment | low | Backup | Sprint 13 | 2026-10-05 | other |
| NDC-2170 | Malformed rating links show a raw server error page with the server version | Ready for Deployment | low | Customer Happiness |  | 2026-10-07 | other |
| NDC-2184 | A scheduled reply to an address that does not exist is reported as "Sent" | Ready for Deployment | medium | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2185 | Scheduled-reply notifications do not say which ticket or why a reply was not sent | Ready for Deployment | medium | Scheduled Replies |  | 2026-10-07 | other |
| NDC-2204 | Workflow Rules / Owner Assignment › Roles lists CRM profiles instead of Desk's roles | Ready for Deployment | urgent | Workflow Rules | Sprint 13 | 2026-10-11 | other |
| NDC-2205 | Workflow Rules / On Edit and On Field Changed rules fire on newly created tickets | Ready for Deployment | urgent | Workflow Rules | Sprint 13 | 2026-10-11 | other |
| NDC-2376 | A ticket shared with another department stays "not found" for that department for about half a minute | Ready for Deployment | low |  |  | 2026-10-21 | other |
| NDC-2390 | Email Templates and Notifications: user stories for the functions not built yet | Ready for Deployment | medium |  |  | 2026-10-21 | other |
| NDC-2495 | Data Administration: user stories for the functions not built yet | Ready for Deployment | medium |  | Sprint 13 | 2026-10-24 | other |
| NDC-2512 | Import / Records are imported with an empty required field or a value longer than the field allows | Ready for Deployment | high |  | Sprint 13 | 2026-10-24 | other |
| NDC-2513 | Import / Imported tickets are not linked to their contact — the email is saved as text | Ready for Deployment | high |  | Sprint 13 | 2026-10-24 | other |
| NDC-2514 | Sandboxes / Creating a sandbox never finishes and stays on "Creating · Finishing" | Ready for Deployment | high |  | Sprint 13 | 2026-10-24 | other |
| NDC-2515 | Import / Review says all rows will import, then every row with an existing unique value fails | Ready for Deployment | medium |  | Sprint 13 | 2026-10-24 | other |
| NDC-2516 | Recycle Bin / Deleted products and contracts are listed as "(no name)" | Ready for Deployment | medium |  | Sprint 13 | 2026-10-24 | other |
| NDC-2517 | Recycle Bin / Empty Bin deletes everything after one confirmation | Ready for Deployment | low |  | Sprint 13 | 2026-10-24 | other |
| NDC-1965 | Collision warning | Ready For Test | high | Tickets | Sprint 13 | 2026-10-05 | other |
| NDC-1986 | Workflow triggers on customer reply, agent reply and rating | Ready For Test | high | Templates & Workflow | Sprint 13 | 2026-10-05 | other |
| NDC-1990 | Help Center (customer portal) | Ready For Test | high | Help Center | Sprint 13 | 2026-10-05 | other |

## Strays (not in Desk module)

| id | name | state | priority | labels | cycle | created | kind | other modules |
|---|---|---|---|---|---|---|---|---|
| NDC-1598 | [Enhancement] Modules and Fields / Field Listing page is missing a layout filter | Done | low | Modules & Fields |  | 2026-09-13 | gap list | CRM |
| NDC-2176 | CRM web forms (Zoho CRM parity) + shared web form builder for Desk and CRM | Done | high | Web Forms | Sprint 11 | 2026-10-07 | gap list | CRM |
| NDC-2195 | Desk integration: small API and sync gaps found in the 7 October run | Done | low | Desk Integrations | Sprint 11 | 2026-10-07 | gap list | Omnichannel |
| NDC-2321 | Timeline / Workflow field update and blueprint entry are missing from the record Timeline; assignment shows as "System" | Done | low | Workflow Rules, Blueprint, Assignment Rules | Sprint 13 | 2026-10-20 | gap list | CRM |
| NDC-2738 | Chat routing rule "KSA" never matches because the department is named "KSA Operation", and two more rule gaps | Done | medium | Chat Routing |  | 2026-10-29 | gap list | Omnichannel |
| NDC-1488 | Web Form | Bug | low | Web Forms |  | 2026-09-08 | bug | CRM |
| NDC-2488 | Bot builder and Agents wizard show English text, internal ids and mixed digit systems in the Arabic UI | Bug | low | Custom Actions |  | 2026-10-24 | bug | Omnichannel |
| NDC-2510 | Workflow Rules / A Task action with an invalid status is logged as Fired but creates no task and shows no error | Bug | medium |  |  | 2026-10-24 | bug | CRM |
| NDC-2511 | Workflow Rules / Rules that run on a date field leave no entry in the Audit Log when they run | Bug | low |  |  | 2026-10-24 | bug | CRM |
| NDC-2537 | Webhooks / Cloud metadata address is not blocked, and blueprint / review webhooks accept internal URLs | Bug | urgent | Review Process, Workflow Rules, Blueprint | Sprint 13 | 2026-10-25 | bug | CRM |
| NDC-2562 | No limit on departments per brand widget | Bug | high |  | Sprint 13 | 2026-10-26 | bug | Omnichannel |
| NDC-2577 | Chat routing rule can send chats to a department | Bug | high |  | Sprint 13 | 2026-10-26 | bug | Omnichannel |
| NDC-2748 | Chat routed by the "NDC Round Robin" rule is never marked Missed when nobody in the department is online | Bug | high | Chat Routing |  | 2026-10-29 | bug | Omnichannel |
| NDC-1467 | Internal Chatting in the Organization (Omni Channel) | Backlog | medium | Internal Chat |  | 2026-09-08 | other | Omnichannel |
| NDC-1473 | UI/UX Enhancements for the Omni Channel | Backlog | none | UI/UX |  | 2026-09-08 | other | Omnichannel |
| NDC-1479 | Email Channel | Backlog | medium | Email Channel |  | 2026-09-08 | other | CRM |
| NDC-1480 | Omni Channel Chat | Backlog | medium | Conversations |  | 2026-09-08 | other | CRM |
| NDC-1667 | Social Module — Brands, Feeds and Social-to-Ticket Conversion | Backlog | medium | Social Channels |  | 2026-09-15 | other |  |
| NDC-2263 | Help Center extras: auto-invite, submission files, comments, dashboard | Backlog | low |  |  | 2026-10-13 | other |  |
| NDC-2264 | Help Center single sign-on: SAML and social sign-in | Backlog | low |  |  | 2026-10-13 | other |  |
| NDC-2265 | Help Center code customization: themes, layout, HTML, CSS, JavaScript | Backlog | low |  |  | 2026-10-13 | other |  |
| NDC-2493 | know user if came from any channel | Backlog | high |  | Sprint 13 | 2026-10-24 | other | Omnichannel |
| NDC-2535 | Modules and Fields Settings / Layout Rules and Validation Rules | Backlog | none |  |  | 2026-10-25 | other |  |
| NDC-2702 | Profiles / The new built-in "AI Agent" profile can be renamed | Backlog | medium | Access Control | Sprint 13 | 2026-10-27 | other | CRM |
| NDC-2723 | Chats send visitors to CRM as Contacts linked to their agency, like Zoho SalesIQ | Backlog | high |  | Sprint 14 | 2026-10-29 | other | Omnichannel, CRM |
| NDC-1806 | Case Feedback filters offer operators and departments that have no feedback | Cancelled | low | Feedback |  | 2026-09-24 | other | Omnichannel |
| NDC-140 | CRM / Disabled layouts still appear in the module's accessible layouts list | Done | high | Modules & Fields | Dev - Sprint 2 | 3 June - 7 June | 2026-06-15 | other | CRM |
| NDC-732 | Category fields cannot be file or dropdown — Payment Card's Card Type and Account Type are free text | Done | medium | Vault Items | Sprint 9 | 2026-08-06 | other | Vault |
| NDC-882 | Limited-privilege QA vault account cannot sign in, blocking all extension sharing tests | Done | high | Vault Extension | Sprint 10 | 2026-08-11 | other | Vault |
| NDC-932 | My Profile in the account panel opens nothing | Done | medium | Navigation & Shell |  | 2026-08-15 | other | Analytics |
| NDC-944 | Support agent invents a booking status for a reference that does not exist | Done | urgent | AI Agent |  | 2026-08-15 | other | Omnichannel |
| NDC-1065 | Operators can no longer see their own department's conversations, only ones assigned to them | Done | high | Access Control |  | 2026-08-17 | other | Omnichannel |
| NDC-1130 | The keyboard covers the field you are typing into — password on sign-in, Description, contact Email | Done | high | UI/UX |  | 2026-08-17 | other | Mobile APP |
| NDC-1211 | Automation Execution Order / Blueprint fires before its correct order | Done | urgent | Automation Execution Order |  | 2026-08-22 | other | CRM |
| NDC-1230 | Modules and Fields: Field Properties / The Controlling Field dropdown in Conditional Visibility does not list the current layout's fields | Done | medium | Modules & Fields |  | 2026-08-25 | other | CRM |
| NDC-1295 | Pipelines / A stage deleted from the module's layout still appears in the pipeline's available stages list and fails with a 422 when selected | Done | medium | Pipelines |  | 2026-08-30 | other | CRM |
| NDC-1308 | Pipelines / Stage Probability is shared across all layouts rather than being set per layout | Done | high | Pipelines |  | 2026-08-30 | other | CRM |
| NDC-1326 | Blueprints / Creating a blueprint on the Stage field does not ask which pipeline it applies to | Done | high | Blueprint |  | 2026-08-31 | other | CRM |
| NDC-1328 | Blueprints / After-transition Task, Call and Meeting actions show Contact Name and Related To as record IDs instead of record names | Done | high | Blueprint |  | 2026-08-31 | other | CRM |
| NDC-1335 | Modules and Fields / Saving a layout fails with "Failed to update options for Subform" when the layout has no subform — a 404 on a non-existent field | Done | urgent | Modules & Fields |  | 2026-09-01 | other | CRM |
| NDC-1337 | Field Permissions / Permissions are not enforced from either the Field Permissions tab or the layout builder — every field stays readable and writable | Done | urgent | Modules & Fields |  | 2026-09-01 | other | CRM |
| NDC-1422 | Login History / Login History labels a phone-browser sign-in as channel "Mobile", so it cannot be told apart from a mobile-app session | Done | low | Login History |  | 2026-09-06 | other | CRM |
| NDC-1436 | Actions / A field update from Workflow Rules, Approval Process or Blueprint writes an address field as plain text and erases its subfields | Done | high | Workflow Rules |  | 2026-09-07 | other | CRM |
| NDC-1437 | Actions / A Workflow Rule field update can overwrite read-only fields — auto number and formula results — that the record API refuses | Done | high | Workflow Rules |  | 2026-09-07 | other | CRM |
| NDC-1514 | Audience sizes can be read by an account that is denied the whole outbound feature | Done | medium | Audience Builder |  | 2026-09-08 | other | Omnichannel |
| NDC-1515 | Actions / Create record action in Workflow rules or Create record custom actions doesn't specify which layout to create the record in. | Done | high | Workflow Rules |  | 2026-09-08 | other | CRM |
| NDC-1518 | Import / "Update existing only" does not offer a Target layout, unlike the other two operations | Done | high | Import & Export |  | 2026-09-09 | other | CRM |
| NDC-1519 | Import / "Match records on" appears above Target layout, and its warning says the module has no unique field rather than the layout | Done | low | Import & Export |  | 2026-09-09 | other | CRM |
| NDC-1541 | Review Process / "Re-evaluate against other processes" cannot do anything, since a module and layout can have only one review process | Done | high | Review Process |  | 2026-09-09 | other | CRM |
| NDC-1585 | Assignment Rule / Importing records with matching criteria doesn't assign it to the configured users in the selected assignment rule. | Done | urgent | Assignment Rules |  | 2026-09-10 | other | CRM |
| NDC-1586 | Modules and Fields / Formula field does not offer other fields in the layout to use. | Done | medium | Modules & Fields |  | 2026-09-10 | other | CRM |
| NDC-1588 | Modules and Fields / Default layout is not marked and there is no option to set a layout to default. | Done | high | Modules & Fields |  | 2026-09-10 | other | CRM |
| NDC-1609 | A WhatsApp account needing re-authentication is shown as verification incomplete with the wrong remedy | Done | medium | WhatsApp Channel |  | 2026-09-13 | other | Omnichannel |
| NDC-1645 | Approval Process (US-A1) / The Approval Status field is fully editable in the layout builder — its approval states can be renamed, deleted or added to | Done | high | Approval Process |  | 2026-09-14 | other | CRM |
| NDC-1666 | Web Forms — Feedback Widget and Advanced Web Form | Done | medium | Web Forms |  | 2026-09-15 | other |  |
| NDC-1668 | Knowledge Base Article Review, Publishing and Visibility Controls | Done | medium | Knowledge Base |  | 2026-09-15 | other |  |
| NDC-1670 | Customer Happiness Rating | Done | medium | Customer Happiness |  | 2026-09-15 | other |  |
| NDC-1696 | Blueprint / Approval Status is offered as an option in During transaction section. | Done | high | Blueprint |  | 2026-09-16 | other | CRM |
| NDC-1697 | Automation Execution Order / Editing a field while a record is rejected in Review Process triggers the Approval Process (if it meets the criteria), forcing the record to be released from Review Process and forces Workflow Rules to apply as well. | Done | urgent | Automation Execution Order |  | 2026-09-16 | other | CRM |
| NDC-1788 | Work Queue / Filter offers only Status and Priority — every other layout field is unavailable | Done | high | Work Queue |  | 2026-09-22 | other | CRM |
| NDC-1823 | Lead Conversion / "Create a new Deal for this Contacts" Option, offers Probability and Expected Revenue fields as editable fields instead of being read-only fields managed by the system itself and the user can never fill it with value. | Done | medium | Lead Conversion |  | 2026-09-24 | other | CRM |
| NDC-1863 | Modules and Fields / Deleting a field and trying to save the layout returns 400 Bad Request. | Done | urgent | Modules & Fields |  | 2026-09-30 | other | CRM |
| NDC-2039 | Tickets Module and Tasks Module dashboards show 0 although tickets exist | Done | high | Dashboards | Sprint 11 | 2026-10-06 | other | Analytics |
| NDC-2054 | Export shows the department id instead of its name in the applied filters | Done | low | Dashboards | Sprint 11 | 2026-10-06 | other | Analytics |
| NDC-2055 | Open Tickets is labelled "Today" but counts all open tickets | Done | low | Dashboards | Sprint 13 | 2026-10-06 | other | Analytics |
| NDC-2069 | Desk integration: user stories for the functions not built yet | Done | medium | Desk Integrations | Sprint 13 | 2026-10-06 | other | Omnichannel |
| NDC-2110 | Custom Views / Clone (and Delete view) in the picker row menu (dropdown layout) does nothing | Done | medium | Custom Views | Sprint 11 | 2026-10-06 | other | CRM |
| NDC-2131 | Custom Views / Arabic: header layout picker accessible name stays 'Layout'; 'records' untranslated | Done | low | Custom Views | Sprint 13 | 2026-10-06 | other | CRM |
| NDC-2173 | Workflow Rules / The Name column is too narrow, so long rule names break mid-word into a tall vertical stack | Done | low | Workflow Rules |  | 2026-10-07 | other | CRM |
| NDC-2193 | Attended rule: a chat handled only by the bot ends without a ticket and without a Skipped row | Done | high | Desk Integrations | Sprint 13 | 2026-10-07 | other | Omnichannel |
| NDC-2194 | Ticket deleted in Desk: the end-of-chat transcript push fails silently and the chat keeps a dead ticket chip | Done | high | Desk Integrations | Sprint 11 | 2026-10-07 | other | Omnichannel |
| NDC-2281 | Modules and Fields - Records Listing Page / Owner filter lists both CRM users and Desk agents | Done | urgent | Modules & Fields | Sprint 13 | 2026-10-15 | other | CRM |
| NDC-2282 | Deals – Kanban View / Duplicate unlabeled Layout picklist and unlabeled Pipeline picklist in the toolbar | Done | medium | Kanban View, Modules & Fields, Custom Views | Sprint 13 | 2026-10-15 | other | CRM |
| NDC-2286 | A failed department transfer still saves an empty department, leaving the chat with no department and no operator | Done | low | Chat Routing |  | 2026-10-17 | other | Omnichannel |
| NDC-2298 | Assignment Rule / An assignment rule limited to the API channel still assigns owners to imported leads | Done | urgent | Assignment Rules | Sprint 13 | 2026-10-19 | other | CRM |
| NDC-2302 | Import / Import with "Trigger automation" off still runs the workflow once the review is approved | Done | medium | Review Process, Import & Export | Sprint 13 | 2026-10-19 | other | CRM |
| NDC-2308 | Approval Process / Approver "Record Owner" ignores the owner set by the assignment rule on import | Done | high | Approval Process, Assignment Rules | Sprint 13 | 2026-10-20 | other | CRM |
| NDC-2314 | Google Sheet / Contacts rows are rejected because Street and Country are treated as required, although no address subfield is required | Done | high | Import & Export |  | 2026-10-20 | other | CRM |
| NDC-2315 | Google Sheet / Uploading a wrong service account key replaces the working key and breaks the connection | Done | medium | Import & Export |  | 2026-10-20 | other | CRM |
| NDC-2322 | Workflow Rules / A rule with exactly 25 conditions is refused ("this one has 26") | Done | low | Workflow Rules | Sprint 13 | 2026-10-20 | other | CRM |
| NDC-2323 | Workflow Rules / Pending scheduled actions still run on a converted lead | Done | medium | Workflow Rules | Sprint 13 | 2026-10-20 | other | CRM |
| NDC-2324 | Agent removed from a brand keeps reading and writing that brand's chats for about a minute | Done | high | Conversations, Access Control, Brand Isolation | Sprint 12 | 2026-10-20 | other | Omnichannel |
| NDC-2325 | Agents of every brand see the bots of a deleted brand when brand isolation is on | Done | medium | Chatbot, Brand Isolation | Sprint 12 | 2026-10-20 | other | Omnichannel |
| NDC-2326 | A department still used by a widget can be removed from its brand while brand isolation is on | Done | medium | Web Widget, Brand Isolation | Sprint 12 | 2026-10-20 | other | Omnichannel |
| NDC-2328 | Only the owner can use global search; admins and agents get an error shown as "No results" | Done | high | Search, Brand Isolation | Sprint 13 | 2026-10-20 | other | Omnichannel |
| NDC-2331 | Canned reply saved with a brand that does not match its department; the brand is silently dropped | Done | low | API & Platform, Brand Isolation | Sprint 12 | 2026-10-20 | other | Omnichannel |
| NDC-2333 | Web widget API returns brand and department names as null, and the single-widget call drops its departments | Done | low | Web Widget, API & Platform, Brand Isolation | Sprint 12 | 2026-10-20 | other | Omnichannel |
| NDC-2334 | Blueprint + Approval Process / Editing a deal in a blueprint starts an approval and drops the deal out of the blueprint | Done | high | Approval Process, Blueprint | Sprint 13 | 2026-10-21 | other | CRM |
| NDC-2339 | Moving an agent to an unknown department fails with 409 but still removes all their departments | Done | medium | Access Control, Brand Isolation | Sprint 12 | 2026-10-21 | other | Omnichannel |
| NDC-2340 | A department that still has open chats and is used by a widget can be deleted, and its id stays on the brand and widget | Done | medium | Conversations, Brand Isolation | Sprint 12 | 2026-10-21 | other | Omnichannel |
| NDC-2357 | Bots report is empty for supervisors and agents, even for their own department | Done | medium | Reports | Sprint 13 | 2026-10-21 | other | Omnichannel |
| NDC-2383 | Modules and Fields / Layout builder Save is silently lost when the layout save is slow (e.g. after adding a Rollup Summary) | Done | high | Modules & Fields |  | 2026-10-21 | other | CRM |
| NDC-2391 | Workflow Rules / A condition on Lead Owner never matches | Done | medium | Workflow Rules | Sprint 13 | 2026-10-21 | other | CRM |
| NDC-2411 | Assignment Rules / A suspended member is not skipped and the fallback user never gets the record | Done | medium | Assignment Rules | Sprint 13 | 2026-10-22 | other | CRM |
| NDC-2414 | Profiles / The Desk Administrator profile gives view-all on CRM records | Done | medium | Access Control | Sprint 13 | 2026-10-22 | other | CRM |
| NDC-2419 | Assignment Rules / Rules fire on import and API but no longer set the owner | Done | high | Assignment Rules, Import & Export | Sprint 13 | 2026-10-22 | other | CRM |
| NDC-2421 | Workflow Rules / Field Update silently lost when several records are saved at the same moment (rule still logged as Fired) | Done | high | Workflow Rules, Blueprint | Sprint 13 | 2026-10-22 | other | CRM |
| NDC-2422 | Assignment Rules / "Online status" availability does not skip a member who is not online | Done | medium | Assignment Rules | Sprint 13 | 2026-10-22 | other | CRM |
| NDC-2423 | Modules and Fields / Layout builder Save doesn't persist field changes (validation regex, Mark as Unique) | Done | high | Modules & Fields, Record Forms | Sprint 13 | 2026-10-22 | other | CRM |
| NDC-2427 | Chatbot "Talk to an agent" card keeps the chat in Sales instead of the configured Support department | Done | medium | Custom Actions |  | 2026-10-22 | other | Omnichannel |
| NDC-2436 | Custom Actions page shows endpoint paths with the slash at the wrong end in Arabic | Done | low | Custom Actions |  | 2026-10-22 | other | Omnichannel |
| NDC-2444 | Custom password categories are never used — the form always shows Web Account fields | Done | high |  |  | 2026-10-23 | other | Vault |
| NDC-2464 | Chatbot AI Agent invents flights, prices and baggage without running a search | Done | high | Custom Actions |  | 2026-10-24 | other | Omnichannel |
| NDC-2466 | Chatbot AI Agent tells the customer a colleague will help but never transfers the chat | Done | high | Custom Actions |  | 2026-10-24 | other | Omnichannel |
| NDC-2540 | Blueprint / Webhook actions are never sent (After transition and SLA escalation) | Done | high | Blueprint | Sprint 13 | 2026-10-25 | other | CRM |
| NDC-2563 | Add a channel to a switched-off brand | Done | high |  | Sprint 13 | 2026-10-26 | other | Omnichannel |
| NDC-2566 | A separate department name that visitors see | Done | high |  | Sprint 13 | 2026-10-26 | other | Omnichannel |
| NDC-2570 | A canned reply can belong to several departments | Done | high |  | Sprint 13 | 2026-10-26 | other | Omnichannel |
| NDC-2572 | Visitor routing by visitor email or department | Done | high |  | Sprint 13 | 2026-10-26 | other | Omnichannel |
| NDC-2583 | A new department is saved switched on, or says why not | Done | medium |  | Sprint 13 | 2026-10-26 | other | Omnichannel |
| NDC-2590 | Routing selection settings can link a department to a brand without the department-manage permission | Done | high | Chat Routing, Access Control |  | 2026-10-26 | other | Omnichannel |
| NDC-2600 | Every operator sees every department's department-level message templates | Done | high | WhatsApp Templates, Access Control |  | 2026-10-26 | other | Omnichannel |
| NDC-2605 | A tenant admin can enter another tenant's WhatsApp Business Account id and silence that tenant's template and quality updates | Done | high | WhatsApp Channel |  | 2026-10-26 | other | Omnichannel |
| NDC-2614 | Some settings lists show "empty" when the user lacks permission instead of saying access is denied (tags, login history, storage, storage requests, conversation layout) | Done | high | UI/UX, Access Control |  | 2026-10-26 | other | Omnichannel |
| NDC-2615 | If a department or smart routing rule fails to load in its edit form, saving overwrites it with blank defaults (a Private department becomes public, a rule matches every chat) | Done | high | Chat Routing, UI/UX |  | 2026-10-26 | other | Omnichannel |
| NDC-2634 | Portals / The customer portal link opens an nginx 404 page | Done | high | Customers | Sprint 13 | 2026-10-26 | other | CRM |
| NDC-2645 | Export / "All fields" exports every field defined on the module, including other layouts' fields and fields not used on any layout | Done | medium | Import & Export | Sprint 13 | 2026-10-26 | other | CRM |
| NDC-2650 | Layouts / Layout access saved through the API is silently ignored (assignments endpoint 500 / 405) | Done | low | Modules & Fields | Sprint 13 | 2026-10-26 | other | CRM |
| NDC-2652 | Chatbot Transfer card can pick the hand-off department from a variable (e.g. a custom action's response field) | Done | high | Chatbot |  | 2026-10-26 | other | Omnichannel |
| NDC-2705 | Review Process / Import (Excel channel ticked): imported lead is held | Done | medium | Review Process | Sprint 13 | 2026-10-28 | other | CRM |
| NDC-2706 | Workflow Rules / After a review approval, the On Edit workflow doesn't run for a mass-updated lead | Done | medium | Workflow Rules | Sprint 13 | 2026-10-28 | other | CRM |
| NDC-2707 | Blueprint / A record approved by an approval process doesn't enter its blueprint | Done | medium | Blueprint | Sprint 13 | 2026-10-28 | other | CRM |
| NDC-2711 | Records API / Creating a record on a deleted layout answers 403 "Permission denied" instead of "not found" | Done | low | API & Platform | Sprint 13 | 2026-10-28 | other | CRM |
| NDC-2712 | Web Forms / The spam trap field is ignored: a filled trap still creates a lead | Done | medium | Web Forms | Sprint 13 | 2026-10-28 | other | CRM |
| NDC-2734 | Bot closes the chat when nobody in the target department is online instead of marking it Missed | Done | high | Chatbot |  | 2026-10-29 | other | Omnichannel |
| NDC-2750 | Visitor phone number is not pushed to the CRM contact | Done | medium | CRM Integration |  | 2026-10-29 | other | Omnichannel, CRM |
| NDC-1273 | CRM field mapping accepts non-existent module, layout and field references without validation | In Progress | medium | CRM Integration |  | 2026-08-28 | other | Omnichannel |
| NDC-1630 | Modules and Fields / A new module's record form shows no fields until the layout is saved once, even the required Name field is not shown | In Progress | high | Modules & Fields |  | 2026-09-14 | other |  |
| NDC-1659 | Recycle Bin / Configuration entities should not be listed — Users, Profiles, Org Units, Layouts, Modules, TeamSpace and Pipelines cannot be meaningfully restored | In Progress | high | Recycle Bin |  | 2026-09-15 | other |  |
| NDC-1669 | CRM Integration — Contacts, Accounts and Products Sync | In Progress | medium | CRM Integration |  | 2026-09-15 | other |  |
| NDC-1772 | Instagram account and visitors are shown only as numeric ids because the username is never fetched | In Progress | medium | Instagram Channel |  | 2026-09-18 | other | Omnichannel |
| NDC-2420 | Blueprint / Workflow rules run after some transitions but not after transitions with required fields | In Progress | urgent | Workflow Rules, Blueprint | Sprint 13 | 2026-10-22 | other | CRM |
| NDC-2470 | AI Agent does not use its FAQ entries or knowledge base when answering in the chatbot | In Progress | medium | Custom Actions |  | 2026-10-24 | other | Omnichannel |
| NDC-2471 | AI Agent refuses to check the wallet balance although the wallet action is assigned to it | In Progress | medium | Custom Actions |  | 2026-10-24 | other | Omnichannel |
| NDC-2487 | Arabic UI cuts off the start of English agent names and puts punctuation on the wrong side | In Progress | low | Custom Actions |  | 2026-10-24 | other | Omnichannel |
| NDC-2490 | Cancel throws away unsaved edits without asking, in the bot card panel and the agent wizard | In Progress | low | Custom Actions |  | 2026-10-24 | other | Omnichannel |
| NDC-2491 | AI agent Edit page has no inactivity auto-close setting, although the wizard says it can be overridden there | In Progress | medium | Custom Actions |  | 2026-10-24 | other | Omnichannel |
| NDC-2525 | Vault: help-desk ticket required before access is granted (Tavi Desk) | In Progress | high |  |  | 2026-10-24 | other | Vault |
| NDC-2651 | A Desk article that failed AI indexing is never re-indexed after it is fixed | In Progress | medium | Desk Integrations | Sprint 13 | 2026-10-26 | other | Omnichannel |
| NDC-2659 | Blueprint / Portal access is not sent automatically after «قبول التسجيل» (N02 never runs after the transition) | In Progress | urgent | Workflow Rules, Blueprint | Sprint 13 | 2026-10-27 | other | CRM |
| NDC-2663 | Omnichannel review sweep — AI agent runtime over the widget (5 to fix) | In Progress | medium | AI Agent |  | 2026-10-27 | other | Omnichannel |
| NDC-2670 | Omnichannel review sweep — Department / hierarchy / supervisor isolation & engagement (5 to fix) | In Progress | medium | Access Control |  | 2026-10-27 | other | Omnichannel |
| NDC-2674 | Omnichannel review sweep — Inbound pipeline, channel adapters & webhooks (4 to fix, 1 decision) | In Progress | medium | WhatsApp Channel |  | 2026-10-27 | other | Omnichannel |
| NDC-2692 | Omnichannel review sweep — WhatsApp phone identity, onboarding & channel config (6 to fix) | In Progress | medium | WhatsApp Channel |  | 2026-10-27 | other | Omnichannel |
| NDC-2714 | Assignment Rule / Imported record gets no owner after the rule is saved again and shows the importer as owner | In Progress | urgent | Assignment Rules | Sprint 13 | 2026-10-28 | other | CRM |
| NDC-2726 | Actions - Workflow / Records created by Create Record / Create Connected Record actions don't take the owner of the record that triggered the workflow | In Progress | high | Workflow Rules | Sprint 13 | 2026-10-29 | other | CRM |
| NDC-2728 | Actions - Workflow / Actions page doesn't offer all the action types available inside a workflow rule | In Progress | high | Workflow Rules | Sprint 13 | 2026-10-29 | other | CRM |
| NDC-2729 | Blueprint / Create Task, Meeting, Call and other create-record actions in After Transition Actions allow another module, duplicate owner settings, "Value" defaults and a text-only Related record | In Progress | urgent | Blueprint | Sprint 13 | 2026-10-29 | other | CRM |
| NDC-2730 | Blueprint / A workflow can change the blueprint-locked field and send the lead back to an earlier stage; blueprint doesn't show after approval until the page is refreshed | In Progress | urgent | Blueprint | Sprint 13 | 2026-10-29 | other | CRM |
| NDC-2731 | Workflow Rules list / A rule with several conditions, each with its own action, shows only 1 in the Actions column | In Progress | urgent | Workflow Rules | Sprint 13 | 2026-10-29 | other | CRM |
| NDC-2732 | Web Forms / Embedded web form (iframe) doesn't load — form shows as not available | In Progress | high |  | Sprint 13 | 2026-10-29 | other | CRM |
| NDC-2733 | Removing and re-adding an operator's only department role leaves a "Whole account" Associate role that can't be removed | In Progress | high |  | Sprint 13 | 2026-10-29 | other | Omnichannel |
| NDC-2736 | 67 of 100 NDC operators have a pending department grant and will not see their department's chats | In Progress | high | Access Control |  | 2026-10-29 | other | Omnichannel |
| NDC-2549 | Zoho bot import converts the "Add Ticket" card | Ready For Test | high |  | Sprint 13 | 2026-10-26 | other | Omnichannel |
| NDC-2550 | Criteria Router can check the visitor's channel | Ready For Test | high |  | Sprint 13 | 2026-10-26 | other | Omnichannel |
| NDC-2575 | Spammer block approval on messaging channels | Ready For Test | high |  | Sprint 13 | 2026-10-26 | other | Omnichannel |
| NDC-2578 | Workflows with webhooks on chat events | Ready For Test | high |  | Sprint 13 | 2026-10-26 | other | Omnichannel |
| NDC-2588 | A VIP "wait for the best operator" chat can be stuck in the queue forever and hold up its department | Ready For Test | high | Chat Routing, Message Queue |  | 2026-10-26 | other | Omnichannel |
| NDC-2589 | A department whose only online members cannot handle chats is treated as staffed, so the chat waits forever instead of being missed | Ready For Test | high | Chat Routing |  | 2026-10-26 | other | Omnichannel |
| NDC-2604 | A scheduled campaign ignores the creator's department and brand scope and sends to the whole tenant | Ready For Test | high | Broadcasts & Campaigns, Access Control |  | 2026-10-26 | other | Omnichannel |
| NDC-2701 | Hierarchy / In role mode, a Manager in another department can see a user's leads | Ready For Test | high | Access Control | Sprint 13 | 2026-10-27 | other | CRM |
| NDC-2724 | Chats send visitors to CRM as Contacts linked to their agency, like Zoho SalesIQ | Ready For Test | high |  | Sprint 14 | 2026-10-29 | other | Omnichannel, CRM |
| NDC-2025 | Email channel in Omnichannel | Todo | high | Email Channel | Sprint 13 | 2026-10-05 | other | Omnichannel |
