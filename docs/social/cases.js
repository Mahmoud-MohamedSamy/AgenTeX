// [id, priority, area, title, steps[], expected, test type]
module.exports = [
// A · Portal, brands, onboarding
["A-01","P0","A · Portal, brands, onboarding","First sign-in creates the portal",["Sign in to Social with a new tenant user","Open Social for the first time"],"Portal created and named after the company; user is Portal Owner + Portal Admin; brand set-up screen shown","Functional"],
["A-02","P1","A · Portal, brands, onboarding","No module opens without a channel",["New portal, no channel","Open Posts, Inbox, Monitor, Reports, Connections, Collaborate by menu and by direct URL"],"Each shows the brand set-up screen; nothing errors or shows another tenant's data","Functional"],
["A-03","P0","A · Portal, brands, onboarding","First channel creates the first brand",["Connect one Facebook Page"],"Brand created automatically, named after the page; Home opens with Brand Health","Functional"],
["A-04","P0","A · Portal, brands, onboarding","Add another brand (admin only)",["Brand switcher › Add another brand","Pick channels, Add"],"New brand listed in the switcher; at least one channel required; Brand Admin / User do not see the option","Functional"],
["A-05","P0","A · Portal, brands, onboarding","One channel per network type per brand",["Brand already has a Facebook Page","Try to connect a second Facebook Page to the same brand"],"Refused with a clear message pointing to a new brand; first page unchanged","Negative"],
["A-06","P1","A · Portal, brands, onboarding","Brand switcher scopes all data",["Two brands with posts, interactions and reports","Switch brand on every module"],"Every list, count and report shows only the selected brand","Functional"],
["A-07","P1","A · Portal, brands, onboarding","Edit brand information",["Settings › Brand Information › Edit name, image, description, time zone","Save, reload"],"Values saved; switcher shows new name and image; audit log entry for time zone","Functional"],
["A-08","P1","A · Portal, brands, onboarding","Brand name validation",["Save brand with empty name, 256+ chars, emoji, Arabic, HTML tags"],"Empty refused; max length enforced; Arabic and emoji kept; HTML shown as text","Negative"],
["A-09","P0","A · Portal, brands, onboarding","Delete brand",["Brand with drafts, scheduled posts, published posts","Settings › Delete Brand › confirm"],"Brand gone; its scheduled posts never publish; posts already on the networks untouched; confirmation required","Functional"],
["A-10","P1","A · Portal, brands, onboarding","Brand limit per plan",["Tenant on a plan with N brands","Try to add brand N+1"],"Blocked with upgrade / add-on message","Negative"],
["A-11","P2","A · Portal, brands, onboarding","Delete portal",["Free / trial tenant","Portal Info › Delete Portal"],"Confirmation; all brands and data removed; paid tenant does not get the option","Functional"],
["A-12","P2","A · Portal, brands, onboarding","User in two portals",["Invite a user to portal A and B","Switch via My Portals"],"Each portal shows only its own brands","Functional"],

// B · Channels
["B-01","P0","B · Channels","Connect Facebook Page (OAuth)",["Settings › Social Channels › Connect Facebook","Log in, pick a page where you are admin, Add"],"Channel listed with page name and picture; token stored encrypted; last 30 days imported","Functional"],
["B-02","P0","B · Channels","Connect Instagram Professional",["Connect via Facebook, then directly via Instagram (two brands)"],"Both work; direct login shows no Stories stats; personal account refused with a message","Functional"],
["B-03","P0","B · Channels","Connect X",["Connect X, authorize"],"Channel listed","Functional"],
["B-04","P0","B · Channels","Connect LinkedIn Page and Profile",["Connect LinkedIn, pick page and profile"],"Both listed as separate channel types","Functional"],
["B-05","P1","B · Channels","Connect other networks in scope",["Connect each network chosen for v1 (YouTube, GBP, TikTok, Threads, Bluesky app password, Mastodon server, Pinterest, WhatsApp, Telegram bot token)"],"Each connects using its own method; wrong Bluesky app password / bot token gives a clear error","Functional"],
["B-06","P1","B · Channels","User cancels OAuth",["Start Connect, cancel on the network's page"],"Returns to Social with no channel added and no error page","Negative"],
["B-07","P1","B · Channels","Account with no admin pages",["Connect Facebook with a user who manages no page"],"Message explains no pages were found and why","Negative"],
["B-08","P0","B · Channels","Expired token → reconnect",["Expire / revoke the token on the network","Wait for the check"],"Channel marked 'needs reconnecting'; Brand Health alert; email to admins; Reconnect restores it without losing data","Functional"],
["B-09","P0","B · Channels","Disconnect channel",["Channel with drafts, scheduled, pending-approval posts, inbox items, monitor columns","Disconnect › confirm"],"Channel's drafts / scheduled / pending posts removed (multi-channel posts keep other channels); inbox history, columns, rules and cards removed; scheduled reports drop its cards","Functional"],
["B-10","P1","B · Channels","Only admins manage channels",["As User and Limited Publisher open Social Channels"],"Connect / Reconnect / Disconnect hidden; API calls refused 403","Security"],
["B-11","P1","B · Channels","Channel limit per plan",["Plan allows N channel types","Try to connect a network outside the plan"],"Network shown disabled with upgrade message","Negative"],
["B-12","P2","B · Channels","Same page in two portals",["Connect the same Facebook Page in two tenants"],"Both work independently; no data crosses tenants","Integration"],

// C · Roles & permissions
["C-01","P0","C · Roles & permissions","Invite a team member",["Brand Members › Invite: email, role, channels, approver"],"Email sent; user joins with that role and only those channels","Functional"],
["C-02","P1","C · Roles & permissions","Invite validation",["Invalid email, existing member, empty role, no seats left"],"Each refused with a specific message","Negative"],
["C-03","P0","C · Roles & permissions","Portal Admin invite to several brands",["All Members › Invite as Portal Admin"],"User sees every brand and settings","Functional"],
["C-04","P0","C · Roles & permissions","Limited Publisher cannot publish",["Sign in as Limited Publisher","Compose a post"],"Only Save Draft and Send for Approval; API publish refused 403","Security"],
["C-05","P0","C · Roles & permissions","Channel-level access",["User allowed only on X","Open composer, Inbox, Reports"],"Only X selectable and visible everywhere; API calls for other channels refused","Security"],
["C-06","P1","C · Roles & permissions","Each of the 7 permissions off",["Custom role with one permission off at a time (Publishing, Messages, Comment/Reply, Advanced Reports, Leads Data, AI, Inbox)"],"Matching feature hidden or read-only, exactly as in the plan's permission table; API agrees with UI","Security"],
["C-07","P1","C · Roles & permissions","Create / edit / delete custom role",["Create role, assign, change permissions while user is signed in","Delete role in use"],"Changes apply on next action; deleting a role in use asks for a replacement role","Functional"],
["C-08","P1","C · Roles & permissions","Remove member from brand",["Member with scheduled posts and monitor columns","Remove"],"Access lost at once; scheduled posts still publish; their monitor columns deleted","Functional"],
["C-09","P1","C · Roles & permissions","Deactivate and reactivate",["Deactivate member, try to sign in","Reactivate"],"No access while deactivated; reactivation re-sends invite","Functional"],
["C-10","P2","C · Roles & permissions","Transfer portal ownership",["Portal Info › Edit › new owner (a Portal Admin)"],"Ownership moves; non-admin users not offered","Functional"],
["C-11","P1","C · Roles & permissions","Drafts ownership rules",["Drafts by Portal Admin, Brand Admin, User","Each role tries to edit the others' drafts"],"Matches rules: only creator + Portal Admins; Brand Admin edits Brand Admin/User drafts; ownership moves to last editor","Security"],
["C-12","P2","C · Roles & permissions","Client member (if agency in scope)",["Invite client","Client signs in"],"Sees Home, Posts, Collaborate, shared reports only; cannot tag team members","Security"],

// D · Composer
["D-01","P0","D · Composer","Publish now to one channel",["New Post, pick Facebook, text, Publish Now"],"Post on Facebook within seconds; appears in Published with permalink","Functional"],
["D-02","P0","D · Composer","Publish to several channels",["Pick Facebook, X, LinkedIn, Instagram with an image","Publish Now"],"Published on all four; one post record with a result per channel","Functional"],
["D-03","P0","D · Composer","Customize content per network",["Customize Content › change caption for X and hashtags for Instagram","Publish"],"Each network gets its own text; original text used for the rest","Functional"],
["D-04","P0","D · Composer","Character limit per network",["Type 281 chars with X selected; 2,201 with Instagram; 3,001 LinkedIn"],"Counter turns red; publish blocked naming the network; other networks fine","Negative"],
["D-05","P1","D · Composer","Media count limits",["Attach 5 images with X; 11 with Instagram; 2 videos anywhere"],"Blocked with per-network message","Negative"],
["D-06","P1","D · Composer","Media spec validation",["Image > network max size, wrong format (BMP to IG), video too long, wrong aspect ratio"],"Validation before publish names the rule broken","Negative"],
["D-07","P1","D · Composer","Network preview",["Compose with link and image on a screen > 1380 px"],"Preview per network resembles the network's layout; hidden on narrow screens","UI"],
["D-08","P1","D · Composer","Link preview",["Paste a URL"],"Preview card fetched (title, description, image); can be removed and restored; none for Instagram / GBP","Functional"],
["D-09","P1","D · Composer","@mentions",["Type @ on X, Facebook, LinkedIn","Pick a suggestion, publish"],"Mention is a real tag on the network; Facebook max 10","Functional"],
["D-10","P2","D · Composer","Hashtag suggestions and groups",["Type #","Insert a saved hashtag group"],"Top 10 past hashtags by engagement; group inserted; Instagram 30-hashtag limit enforced","Functional"],
["D-11","P1","D · Composer","First comment",["Add first comment on Facebook, LinkedIn, Instagram post"],"Comment posted right after the post; option hidden for X / GBP","Functional"],
["D-12","P1","D · Composer","Poll",["Poll on X with 2–4 options and duration","Try 1 option, 5 options, option > 25 chars, poll + image on X"],"Valid poll published; invalid ones blocked","Functional"],
["D-13","P2","D · Composer","Thread composer",["Write 900 chars for X, split into thread","Publish all at once, then with interval"],"Posts published in order as a thread; max 15 parts","Functional"],
["D-14","P2","D · Composer","Location and alt text",["Add location (FB/IG) and alt text per image"],"Both visible on the published post","Functional"],
["D-15","P2","D · Composer","Network-specific fields",["GBP button/event/offer; YouTube title, visibility, Shorts; Pinterest board, title, link; LinkedIn document"],"Each published with its fields; required fields enforced (GBP event title, start before end)","Functional"],
["D-16","P1","D · Composer","Close composer keeps a draft",["Type content, close the window"],"Draft saved (or a confirm asks); nothing lost","Functional"],
["D-17","P1","D · Composer","Empty / whitespace post",["Publish with no text and no media; only spaces"],"Blocked","Negative"],
["D-18","P1","D · Composer","Special content",["Arabic text, emoji, line breaks, RTL + LTR mixed, URLs with Arabic"],"Published exactly as typed on every network","i18n"],
["D-19","P2","D · Composer","Max 30 channels per post",["Select 31 channels across brands"],"31st blocked","Negative"],
["D-20","P2","D · Composer","Duplicate post refused by network",["Publish the same text twice to X quickly"],"Second goes to Failed with the network's reason","Negative"],

// E · Scheduling
["E-01","P0","E · Scheduling","Schedule a post",["Schedule 10 min ahead"],"Listed in Scheduled and calendar; publishes at the time (±1 min)","Functional"],
["E-02","P1","E · Scheduling","Schedule in the past",["Pick a past date/time"],"Blocked","Negative"],
["E-03","P0","E · Scheduling","Time zone",["Brand TZ Cairo, user TZ UTC","Schedule 09:00 in the shown TZ"],"Publishes at the intended instant; all screens show the user's chosen TZ; DST handled","Functional"],
["E-04","P1","E · Scheduling","Edit / reschedule / delete scheduled",["Change text and time","Delete another"],"Changes apply; deleted post never publishes","Functional"],
["E-05","P1","E · Scheduling","Repeat weekly",["Repeat every Tuesday until a date"],"Publishes each Tuesday, stops after the end date","Functional"],
["E-06","P2","E · Scheduling","Repeat monthly on day 31",["Monthly day 31, 'last day of month' vs 'when available'"],"February/30-day months follow the chosen option; max 6 months","Edge"],
["E-07","P1","E · Scheduling","Queue slots (CustomQ)",["Admin sets slots Mon 09:00, 13:00","Add 3 posts to queue"],"Posts take next free slots in order; one post per slot; max 25 slots/day","Functional"],
["E-08","P2","E · Scheduling","Changing slots keeps queued posts",["Delete a slot that has a queued post"],"Queued post keeps its time","Edge"],
["E-09","P1","E · Scheduling","Pause and resume brand",["Pause Posts with a team message","Let a scheduled time pass","Resume"],"Banner shown; nothing publishes while paused; passed posts go to Unpublished › Unattempted; later ones publish; team notified","Functional"],
["E-10","P2","E · Scheduling","Best-time suggestion (SmartQ)",["Brand with ≥7 days history vs new brand"],"Suggestions with % reach; none for new brand with an explanation","Functional"],
["E-11","P1","E · Scheduling","Calendar drag to reschedule",["Drag a scheduled post to another day"],"New date saved; published posts cannot be dragged","Functional"],

// F · Bulk scheduler
["F-01","P0","F · Bulk scheduler","Upload valid CSV",["Download sample, fill 20 rows, upload, review, Schedule"],"20 scheduled posts created with correct times, text, links, media","Functional"],
["F-02","P1","F · Bulk scheduler","XLS / XLSX",["Upload the same rows as .xlsx and .xls"],"Same result","Functional"],
["F-03","P0","F · Bulk scheduler","Row errors",["Rows with bad date format, time < 1 h ahead, bad channel, non-public image URL, text over limit"],"Rows marked 'with errors' with the reason; fix, move to draft or delete; good rows unaffected","Negative"],
["F-04","P1","F · Bulk scheduler","350 row limit",["Upload 351 rows"],"Refused with the limit","Negative"],
["F-05","P2","F · Bulk scheduler","CSV quoting and line breaks",["Channels in quotes, \\n in text, commas inside text, UTF-8 Arabic"],"Parsed correctly","Edge"],
["F-06","P1","F · Bulk scheduler","Bulk with approval on",["Approval toggle on during upload"],"All posts go to Approvals, none scheduled directly","Functional"],
["F-07","P2","F · Bulk scheduler","Wrong file type / empty file",["Upload .pdf, empty CSV, header only"],"Clear refusal","Negative"],

// G · Approvals
["G-01","P0","G · Approvals","Send for approval",["Limited Publisher sends a scheduled post"],"Status Yet to Review; all approvers emailed + notified; post not published","Functional"],
["G-02","P0","G · Approvals","Approve",["Approver approves (keep schedule / publish now / add to queue)"],"Post follows the chosen option; sender notified","Functional"],
["G-03","P0","G · Approvals","Reject needs reason",["Reject without reason, then with reason"],"Without: blocked; with: Rejected, sender sees reason, can edit and resubmit","Functional"],
["G-04","P1","G · Approvals","Status transitions",["Toggle Yet to Review ⇄ Under Review","Try to change Approved / Rejected"],"Only the allowed transitions work; Approved and Rejected final (UI + API)","Negative"],
["G-05","P1","G · Approvals","Time Elapsed",["Pending post passes its scheduled time"],"Status Time Elapsed; can still be approved and rescheduled","Functional"],
["G-06","P1","G · Approvals","Edit approved post",["Edit an approved, not yet published post"],"Goes back to approval","Functional"],
["G-07","P1","G · Approvals","Approver rules",["Try to make an approver who lacks publishing on all channels"],"Refused","Negative"],
["G-08","P2","G · Approvals","Bulk approve / reject",["Select 200, then 201 pending posts"],"200 processed; 201 refused","Edge"],
["G-09","P1","G · Approvals","Multi-brand post",["Send a cross-brand post for approval"],"Refused (single-brand only)","Negative"],
["G-10","P2","G · Approvals","Two approvers at once",["Two approvers act on the same post at the same time"],"First wins; second sees the updated status, no double publish","Edge"],

// H · Posts views
["H-01","P0","H · Posts, calendar, drafts","Published list",["Open Posts › Published per channel"],"Date, content, engagement, interactions; sort by date / likes / comments","Functional"],
["H-02","P1","H · Posts, calendar, drafts","Published post actions",["Delete (not Instagram), Edit (where network allows), Copy URL, Edit as New Post"],"Each works on the network; unsupported actions hidden","Functional"],
["H-03","P0","H · Posts, calendar, drafts","Failed posts",["Force a failure (revoked token, bad media)"],"Post in Unpublished › Failed with the network's reason; Retry and Reschedule work; failure email sent","Functional"],
["H-04","P1","H · Posts, calendar, drafts","Drafts",["Save, edit (Update draft), schedule, publish, delete a draft"],"Each works; drafts never publish by themselves","Functional"],
["H-05","P1","H · Posts, calendar, drafts","Calendar views and colours",["Month / week / day; posts in each state"],"Correct colours (scheduled, failed, published, draft); notes and events can be added","UI"],
["H-06","P2","H · Posts, calendar, drafts","Calendar filters",["Filter by type, status, creator, network, schedule type"],"Only matching items","Functional"],
["H-07","P1","H · Posts, calendar, drafts","Post details and stats",["Open a published post"],"Content, comments, per-network stats, short-link clicks","Functional"],
["H-08","P2","H · Posts, calendar, drafts","Export posts",["Export scheduled + drafts as CSV and PDF"],"Files have the listed fields; CSV re-imports in Bulk Scheduler","Functional"],
["H-09","P2","H · Posts, calendar, drafts","Native posts not shown",["Post directly on Facebook"],"Not in the calendar (as designed); appears in Published list only if the design says so","Functional"],

// I · Media, links, AI
["I-01","P1","I · Media, links, AI","Media library upload",["Upload image ≤36 MB, video ≤5 GB, then over the limits"],"Within limits stored and reusable; over-limit refused","Functional"],
["I-02","P2","I · Media, links, AI","Image editor",["Crop to preset, add text, filter, save"],"Edited copy attached; original kept","Functional"],
["I-03","P2","I · Media, links, AI","Cloud pickers / stock library",["Attach from Google Drive / WorkDrive and stock search"],"File attached; stock credit added to caption","Integration"],
["I-04","P1","I · Media, links, AI","Link shortener",["Auto-shorten on; paste a URL; publish"],"Short link in post; redirects; clicks counted","Functional"],
["I-05","P1","I · Media, links, AI","UTM tags",["Enable UTM with source = network","Publish to FB and X"],"Each link gets the right utm_source; max 6 parameters; campaign ≤20 chars","Functional"],
["I-06","P2","I · Media, links, AI","AI compose",["Generate a post with tone + Arabic language","Use credits until exhausted"],"Text added to compose; credits shown and decremented; clear message when exhausted; hidden without permission","Functional"],

// J · Publishing engine
["J-01","P0","J · Publishing engine","Many posts at the same minute",["Schedule 50 posts for one minute across brands"],"All publish within the agreed window; none duplicated","Performance"],
["J-02","P0","J · Publishing engine","Network rate limit",["Exceed a network's posting limit (e.g. Facebook 40/24 h in a test page)"],"Extra posts fail or wait with a clear reason; others unaffected","Negative"],
["J-03","P0","J · Publishing engine","Network outage / timeout",["Block the network API during a scheduled publish"],"Retries per policy; final Failed state with reason; no duplicate post when the network was slow but succeeded","Reliability"],
["J-04","P1","J · Publishing engine","Worker restart",["Restart the publishing service while posts are due"],"Due posts publish once after restart","Reliability"],
["J-05","P1","J · Publishing engine","Partial multi-channel failure",["One of 3 channels fails"],"Two published, one Failed; retry only the failed one","Functional"],

// K · Inbox
["K-01","P0","K · Inbox","Interactions arrive",["Comment on a FB post, DM the page, mention on X, GBP review"],"Each appears in Inbox within the agreed delay, with correct type and channel","Functional"],
["K-02","P0","K · Inbox","Reply from Inbox",["Reply to a comment and to a DM"],"Reply posted on the network; shown in the thread","Functional"],
["K-03","P0","K · Inbox","Threading: new message within 24 h of close",["Close an interaction","User messages again within 24 h"],"Same interaction reopens","Functional"],
["K-04","P0","K · Inbox","Threading: after 24 h",["Interaction Open, message after 24 h","Interaction Closed, message after 24 h"],"Open: added to same one; Closed: new interaction, old one not replyable","Functional"],
["K-05","P1","K · Inbox","Own comments ignored",["Brand comments on its own post"],"No interaction created","Functional"],
["K-06","P1","K · Inbox","Reply and Close",["Turn setting on, reply to comment and to DM"],"Comment closes at once; DM closes after 24 h rule","Functional"],
["K-07","P0","K · Inbox","Status, priority, assignee",["Change each; filter by each"],"Saved, logged in Activity, filters work","Functional"],
["K-08","P1","K · Inbox","Custom view",["Create view (channel + status + assignee), share and pin"],"Shared members see it; counts right","Functional"],
["K-09","P1","K · Inbox","Saved replies",["Create one (280 chars max), insert in a reply","Try 281 chars"],"Inserted; over-limit refused","Functional"],
["K-10","P0","K · Inbox","Automation rule: assign by keyword",["Rule: content contains 'refund' → assign A, priority High","Send matching and non-matching comments"],"Only matching one assigned with High; Activity shows the rule","Functional"],
["K-11","P1","K · Inbox","Automation: ANY vs ALL and each condition",["Rules using each of the 13 conditions with ANY and ALL"],"Matches exactly as defined","Functional"],
["K-12","P1","K · Inbox","Automation: each action",["Rules for each action incl. round robin, auto reply, private reply, archive, spam, alert with delay"],"Each action runs once per interaction","Functional"],
["K-13","P1","K · Inbox","Archive, spam, mute, delete",["Apply each, then open the system views"],"Items in Archived / Spam; muted user creates no new items or notifications","Functional"],
["K-14","P2","K · Inbox","Auto-spam keywords and auto-archive",["Set keyword list; set auto-archive 90 days (time-shifted data)"],"Matching items to Spam; old closed items archived","Functional"],
["K-15","P1","K · Inbox","Private reply to comment",["Reply privately to an FB comment; try twice; try after 7 days"],"One private reply only; refused after 7 days","Negative"],
["K-16","P1","K · Inbox","WhatsApp 24 h window",["Reply after 24 h with free text, then with an approved template"],"Free text blocked; template sent","Negative"],
["K-17","P2","K · Inbox","Interaction user info and history",["Edit user email/phone; open History"],"Saved; history shows all past interactions with that user","Functional"],
["K-18","P1","K · Inbox","Inbox hidden without permission",["User role (no Inbox) opens Inbox URL and API"],"Hidden in UI; API 403","Security"],
["K-19","P2","K · Inbox","Two agents reply at once",["Two agents reply to the same interaction"],"Both replies posted or second warned; no lost reply","Edge"],

// L · Messages
["L-01","P1","L · Messages","DM list and reply",["Open Messages; filter by channel; reply with text, image, audio"],"Thread shown; reply delivered; attachment limits enforced (25 MB FB/IG)","Functional"],
["L-02","P1","L · Messages","Network rules",["Try to start a DM on Facebook; on X to a user who blocks DMs"],"Not allowed with a clear message","Negative"],

// M · Monitor & Live Stream
["M-01","P1","M · Monitor & Live Stream","Add columns",["Add X keyword, FB visitor posts, IG hashtag columns"],"Columns fill with matching posts; already-added types marked","Functional"],
["M-02","P1","M · Monitor & Live Stream","Column limit per plan",["Add column 6 on a 5-column plan"],"Blocked with message","Negative"],
["M-03","P1","M · Monitor & Live Stream","Delete and reorder rules",["Creator deletes; other user tries; reorder by drag"],"Only admin/creator delete (removes for all); order is per user","Security"],
["M-04","P2","M · Monitor & Live Stream","X filters",["Language, exclude retweets, has media, user, place"],"Column narrows correctly; filters absent on other networks","Functional"],
["M-05","P1","M · Monitor & Live Stream","Actions on monitored item",["Like, reply, retweet, Add to CRM, Convert to Ticket, Discuss"],"Each works","Functional"],
["M-06","P1","M · Monitor & Live Stream","Live Stream",["Like and comment on brand posts from a test account"],"Items appear in real time with actions; respects brand notification settings","Functional"],

// N · Connections
["N-01","P2","N · Connections","Connections created and views",["Users interact with the brand"],"Listed in All / Recently / Most engaged; filters work","Functional"],
["N-02","P2","N · Connections","Profile panel and notes",["Open a connection, add a note with file"],"Contact, history, CRM / Desk info, note saved for the team","Functional"],

// O · Collaborate & notifications
["O-01","P1","O · Collaborate & notifications","Discuss a post",["Discuss a draft with visibility Team, then Custom Share","@tag a member"],"Only allowed members see it; tagged member notified (in-app + email)","Functional"],
["O-02","P2","O · Collaborate & notifications","Discussion limits",["Attach 11 images"],"Blocked at 10","Negative"],
["O-03","P1","O · Collaborate & notifications","Email notifications",["Trigger: post published, post failed, channel disconnected, @mention, approval request"],"One email per event to the configured members; links open the right item","Functional"],
["O-04","P2","O · Collaborate & notifications","Social notifications per member",["Assign comment notifications to member A only"],"Only A gets them","Functional"],
["O-05","P2","O · Collaborate & notifications","Team notifications",["User joins, posts paused, report shared"],"Each appears in Team Notifications","Functional"],

// P · Reports
["P-01","P0","P · Reports","Brand Health",["Open Home after 30 days of data"],"Followers, new followers, posts, reach, engagement per channel match the network's own insights (± agreed tolerance)","Functional"],
["P-02","P0","P · Reports","Network report numbers",["Compare Summary / Audience / Posts & Engagement with Facebook Insights, X analytics, LinkedIn analytics for the same range"],"Numbers match within tolerance; lifetime vs time-series explained","Data"],
["P-03","P1","P · Reports","Date range per plan",["Pick a range beyond the plan limit"],"Limited with message","Negative"],
["P-04","P1","P · Reports","No data before connection",["Range before the channel was connected"],"Empty state, not zeros presented as data","Edge"],
["P-05","P1","P · Reports","Export, email, schedule",["Export card PDF/PNG; email with password; schedule weekly"],"Files correct; password works; scheduled mail arrives","Functional"],
["P-06","P2","P · Reports","Bulk CSV 90 days",["Export 90 then 91 days"],"91 refused","Edge"],
["P-07","P2","P · Reports","Custom dashboard",["Create dashboard, add cards from 3 networks, share"],"Saved and visible to shared members","Functional"],
["P-08","P2","P · Reports","Hashtag report",["Compare 4 hashtags, try a 5th"],"4 compared; 5th blocked","Functional"],
["P-09","P1","P · Reports","Report time zone",["Check the day boundary of a daily chart"],"Uses the documented zone (Zoho: GMT); label shows it","Edge"],

// Q · CRM integration
["Q-01","P0","Q · TAVI CRM integration","Add social user as new lead",["Live Stream / Monitor › Add to CRM › Add as lead, choose layout, fill fields"],"Lead created in TAVI CRM with the social profile link and source = channel; required CRM fields enforced","Integration"],
["Q-02","P0","Q · TAVI CRM integration","Associate with existing contact",["Add to CRM › Associate to Existing, search, pick"],"Social profile linked to that contact; no duplicate created","Integration"],
["Q-03","P0","Q · TAVI CRM integration","Auto lead rule",["Rule: X mention containing 'demo' → add as Lead","Mention brand with and without the keyword"],"Only the matching one creates a lead; rule off stops it","Integration"],
["Q-04","P1","Q · TAVI CRM integration","CRM info in Social",["Open a linked connection"],"CRM owner, status, notes shown; Lead/Contact badge in Live Stream","Integration"],
["Q-05","P1","Q · TAVI CRM integration","CRM permissions respected",["Social user without CRM create rights adds a lead; user without Leads Data permission"],"Refused / records hidden","Security"],
["Q-06","P1","Q · TAVI CRM integration","Inbox rule on CRM contact",["Rule: CRM Contact is known → assign VIP team"],"Known contacts routed; unknown not","Integration"],
["Q-07","P2","Q · TAVI CRM integration","CRM record deleted",["Delete the linked lead in CRM, open the connection in Social"],"Link shown as removed; Add to CRM offered again; no error","Edge"],

// R · Desk integration
["R-01","P0","R · TAVI Desk integration","Convert to ticket",["Convert a FB comment to a ticket in department D"],"Ticket created in TAVI Desk (channel Social, contact linked); ticket number shown and opens the ticket","Integration"],
["R-02","P0","R · TAVI Desk integration","Auto ticket rule with keyword",["Rule: FB message with 'broken' → department D"],"Matching messages create tickets in D; others do not","Integration"],
["R-03","P0","R · TAVI Desk integration","Append interval",["Interval 12 h; user replies at 1 h and at 13 h"],"First reply joins the same ticket; second makes a new ticket","Integration"],
["R-04","P1","R · TAVI Desk integration","Desk rules run on the ticket",["Desk assignment / SLA / workflow rules for channel Social"],"Rules apply as for any new ticket","Integration"],
["R-05","P1","R · TAVI Desk integration","Desk info in Social",["Open the connection"],"Tickets, owner, response and resolution times shown","Integration"],
["R-06","P2","R · TAVI Desk integration","Agent reply from Desk",["Agent replies on the ticket"],"Behaviour as designed (reply sent to the network, or Social only) and documented","Integration"],

// S · Settings
["S-01","P1","S · Settings & audit log","Audit log events",["Create role, invite, change TZ, pause posts, reconnect channel, delete brand"],"Each logged with who, what, when; only Portal Admins can open it","Functional"],
["S-02","P2","S · Settings & audit log","Audit log retention",["Entries older than 1 month"],"Follows the agreed retention","Edge"],
["S-03","P2","S · Settings & audit log","Hashtag groups limits",["Create 11th group; 31 tags in a group"],"Blocked at 10 groups / 30 tags","Negative"],
["S-04","P2","S · Settings & audit log","Publishing groups",["Create a group of channels across brands, use it in compose"],"All its channels selected","Functional"],

// T · API
["T-01","P1","T · API","Auth and tenant isolation",["Call every endpoint without token, with another tenant's brand_id, with an expired token"],"401 / 403 with error codes; never another tenant's data","Security"],
["T-02","P1","T · API","Create / update / delete schedule and draft",["POST, GET, PUT, DELETE schedules and drafts"],"Same rules and validation as the UI (limits, roles, approval)","API"],
["T-03","P1","T · API","Validation endpoint",["POST /posts/validate with over-limit text and media"],"Lists every broken rule per network","API"],
["T-04","P2","T · API","Pagination and fields",["List published posts with cursor and limit"],"No duplicates or gaps across pages","API"],
["T-05","P1","T · API","Approval status by API",["Move status by API including illegal transitions"],"Same state machine as UI","API"],

// U · Security
["U-01","P0","U · Security","Tokens never exposed",["Inspect UI network traffic, API responses, logs, exports"],"Network access tokens never returned or logged; stored encrypted","Security"],
["U-02","P0","U · Security","Tenant isolation",["Change portal / brand / post IDs in URLs and API calls"],"403 / 404; no cross-tenant read or write","Security"],
["U-03","P1","U · Security","XSS through social content",["Comment / DM / username with <script> and HTML on the network"],"Shown as text in Inbox, Monitor, Live Stream, reports, exports","Security"],
["U-04","P1","U · Security","Webhook / callback authenticity",["Send a forged network webhook"],"Rejected (signature check)","Security"],
["U-05","P2","U · Security","OAuth state / CSRF",["Replay or tamper the OAuth callback"],"Rejected; no channel attached to the wrong brand","Security"],

// V · Performance
["V-01","P1","V · Performance","Inbox with large volume",["Brand with 50k interactions"],"List and filters load within the agreed time; scrolling smooth","Performance"],
["V-02","P2","V · Performance","Reports load",["1-year range, 5 channels"],"Loads within the agreed time","Performance"],
["V-03","P2","V · Performance","Media upload",["Upload 1 GB video"],"Progress shown; resumable or clear failure","Performance"],

// W · UI, i18n, a11y, compatibility
["W-01","P1","W · UI, i18n, a11y","Arabic UI and RTL",["Switch UI to Arabic; walk composer, Inbox, calendar, reports"],"Fully translated; layout mirrored; dates and numbers formatted","i18n"],
["W-02","P2","W · UI, i18n, a11y","Keyboard and screen reader",["Use composer, Inbox and approvals with keyboard only"],"All actions reachable; focus visible; labels read","a11y"],
["W-03","P2","W · UI, i18n, a11y","Browsers and sizes",["Chrome, Edge, Firefox, Safari; 1366 px, 1920 px, tablet"],"No broken layout; composer preview rules hold","Compatibility"],
["W-04","P2","W · UI, i18n, a11y","Dark mode",["Switch theme"],"All screens readable","UI"],
["W-05","P2","W · UI, i18n, a11y","Messages and empty states",["Visit every module empty, loading and with error"],"Clear wording, no raw codes","UI"],

// X · End-to-end journeys
["X-01","P0","X · End-to-end journeys","Campaign week",["Admin connects FB, IG, X, LinkedIn","Limited Publisher drafts 5 posts for the week and sends for approval","Approver approves 4, rejects 1 with reason","Publisher fixes and resubmits; approved","All publish on time; reports show the posts"],"Whole flow works with correct notifications at each step","E2E"],
["X-02","P0","X · End-to-end journeys","Complaint to ticket to closure",["Customer comments a complaint on FB","Auto rule creates Desk ticket; Inbox assigns agent","Agent replies; ticket solved","Customer writes again after 13 h"],"New ticket per append interval; inbox thread rules hold; history consistent across Social and Desk","E2E"],
["X-03","P0","X · End-to-end journeys","Lead from social to deal",["Prospect mentions the brand with 'demo' on X","Auto lead created in CRM","Sales owner converts lead, creates deal","Social connection shows CRM status"],"Lead source = X; CRM status visible in Social; CRM reports count it","E2E"],
["X-04","P1","X · End-to-end journeys","Token expiry during the week",["Scheduled posts for 3 days","Token expires on day 2","Admin reconnects on day 3"],"Day-2 posts Failed with reason + email; after reconnect future posts publish; Retry works for failed","E2E"],
["X-05","P1","X · End-to-end journeys","Bulk month plan",["Upload 120-row XLSX for next month with approval","Approver bulk-approves","Calendar shows all"],"All 120 publish as planned","E2E"]
];
