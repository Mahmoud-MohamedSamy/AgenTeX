# Draft — NOT filed (waiting for review)

## What the check found (22 Nov 2026, NDC-Staging, ticket #6375, blueprint "Tickets from Mail" 82eee361)

- Live (published) version is **v2** (3 Nov). None of its 4 transitions has a condition (`before.visibilityCriteria` = null).
- The conditions (Language = english, Channel = phone / chat / web) exist only in **draft v3** (saved 15 Nov, never published).
- `GET …/blueprint-state` returns `criteria: null` for all 4 transitions, so "Shown when" has nothing to show. That part works as designed (NDC-3056, Done 17 Nov).
- What the popup still doesn't tell the agent:
  1. **Why** a step can't be run. "Move to On Hold" has no condition but is limited to the ticket owner (`allowOwner: true`), and the ticket has no owner. The popup only says "The ticket may not meet its conditions yet, or only its owners can run it." It does not say which one applies, or who can run it.
  2. A step with no condition says nothing ("Shown when: none" / "Anyone can run it").
  3. Close Ticket and Reopen Ticket are **common transitions** (from any state), but they are drawn as from the current state: "Reopened → Close Ticket" in your screenshot, "Open → Reopen Ticket" now. The blueprint stores them as Open → Closed and On Hold → Reopened. Nothing marks them as "from any state".

## Proposed bug

**Title:** Blueprint | View configured actions doesn't state the conditions to unlock each transition from the current status

**Summary**
On a ticket in a blueprint, the "View configured actions" popup lists each transition from the current status, but it doesn't say what has to be true before an agent can run it. For a locked step it shows one generic line, "The ticket may not meet its conditions yet, or only its owners can run it.", without saying which of the two applies or who can run it. For a step with no condition it says nothing.

**Steps to Reproduce**
1. On NDC-Staging, open ticket #6375 (blueprint "Tickets from Mail", status Open).
2. Click **View configured actions**.
3. Look at "Steps from Open" → **Move to On Hold**.

**Expected Result**
- Every step from the current status says what unlocks it:
  - its condition ("Shown when: …"), or "No condition" when there is none;
  - who can run it (for example "Only the ticket owner", or named users/roles).
- A locked step says which requirement isn't met (for example "Only the ticket owner can run this step. This ticket has no owner.").
- Common transitions are marked "From any status" instead of being drawn from the current status.

**Actual Result**
- Move to On Hold has no condition and is limited to the ticket owner. The popup says only "You can't run this step now. The ticket may not meet its conditions yet, or only its owners can run it."
- No step says "No condition" or who can run it.
- Common transitions Close Ticket and Reopen Ticket are drawn from the current status ("Reopened → Close Ticket → Closed" in the reported screenshot, "Open → Reopen Ticket → Reopened" now). The blueprint stores them as Open → Closed and On Hold → Reopened.

**Note**
- The live (published) version of this blueprint has no conditions. The conditions set on 15 Nov (Language = english, Channel = phone/chat/web) are in an unpublished draft (v3), so "Shown when" correctly shows nothing. Related: NDC-3056 (Done).
- Zoho Desk was not checked live for this.

**Environment:** staging-desk.taviportal.com (NDC-Staging), Microsoft Edge, Windows 10, 22 Nov 2026.

**Attachments:** 6375-popup-user.png (reported), 6375-popup-owner-now.png (re-check as owner).

**Fields (proposed):** state Bug · label Blueprint · module Desk · cycle Sprint 17 · priority Medium · assignees MahmoudMohamed, mfathy, Hegazy · relates to NDC-3056.
