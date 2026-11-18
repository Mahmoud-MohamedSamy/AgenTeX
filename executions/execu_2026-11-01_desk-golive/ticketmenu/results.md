# Ticket ⋮ menu: every action vs Zoho (16 Nov 2026)

NDC-Staging owner, QA tickets "QA GL TM …" in Marketing (all deleted and purged). Zoho Desk: test org TechEgySolutions as admin MA, tickets #108–#110 + contact (deleted and purged). Raw: ticketmenu/raw/*.json, shots evidence/raw/tm, evidence/raw/ztm.

| Action | TAVI (clicked from the ⋮ menu) | Zoho (live) | Verdict |
|---|---|---|---|
| Move | Dialog says the ticket arrives Open and unassigned unless you pick someone; moved to Customer Support, owner cleared | Move submenu › dept › "Move Ticket #108?"; owner (admin, member of Tech) **also cleared** | PASS, same as Zoho (affects NDC-2952 / C6) |
| Share | Shared with HR (full), "Shared with HR" chip | Share Ticket dialog with departments | PASS |
| Merge | Same-contact tickets only; field-by-field master screen; child closed with "merged into" + Unmerge | Merge from list view; same master screen; child to Recycle Bin, "cannot undo" | PASS (TAVI unmerge = extra) |
| Apply Macro | QA macro applied, private comment added | Menu item; "Macros aren't created yet!" | PASS |
| Recalculate Skills | "The skills already match the criteria. Nothing changed." | Not in this org's menu (skills off) | PASS (H-08 earlier) |
| Assign by Skills | "The ticket has no active skills of its department." | Not in this org's menu | PASS (H-09 earlier) |
| Follow | Follow / unfollow work (toasts, followers list); label stays "Follow" with a tick | Follow ↔ "Un-Follow" | PASS (label differs only) |
| Mark as Unread | "Marked as unread.", list card bold | Menu item; stays on ticket | PASS |
| Mark as Spam | Confirm (+ optional contact spam), spam banner, Not Spam works | Confirm; spam ticket blocks conversation, menu = Not Spam / Delete; shares revoked | **FAIL TM-2** (reply/comment allowed, share kept) |
| Archive / Unarchive | Works on an Open ticket, no confirm | No manual archive in Zoho | known NDC-2950 (C4) |
| Clone | Opens form, **Status empty + required**, Save refused until picked | Clone form has Status = Open | **FAIL TM-1** |
| Change Layout | Works (1 transient 503 "desk service temporarily unavailable", 3 retries OK) | No layout switch (Edit has none) | PASS (TAVI extra) |
| Print | Options dialog, print page with properties + conversation | Not in ticket menu | PASS (extra) |
| Put on / Release legal hold | Placed, chip shown, menu flips; hand delete still allowed (by design, dialog says so) | None | PASS (extra) |
| Copy link | Ticket URL copied, "Link copied." | Not in menu | PASS (extra) |
| Copy rating link | Happiness off → "Customer Happiness is off, so there is no rating link." | Not in menu | PASS (extra) |
| Delete | Confirm → Recycle Bin, restore works | Same confirm text, Recycle Bin | PASS |

Filed 16 Nov: TM-1 = NDC-3072 (evidence/annotated/TM-1-clone-status-vs-zoho.png), TM-2 = NDC-3073 (TM-2-spam-reply-vs-zoho.png). NDC-2952 rechecked live in Zoho: owner always cleared on move → same as TAVI.
