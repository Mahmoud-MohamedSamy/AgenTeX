---
name: claude-notifications-setup
description: Desktop + phone notifications for Claude Code set up 11 Nov 2026 — Stop/Notification hooks call ~/.claude/hooks/notify.ps1; inputNeededNotifEnabled on
metadata:
  node_type: memory
  type: reference
  originSessionId: 04ded75c-bd23-4280-b008-e2e83d97f4b6
  modified: 2026-11-11T10:27:36.059Z
---

Set up 11 Nov 2026 in user settings (`~/.claude/settings.json`), so it applies to every project. User confirmed the desktop notification works.

- **Script:** `C:\Users\Dell\.claude\hooks\notify.ps1` shows a Windows balloon notification with a sound. `-Kind done` gives "Claude finished – <folder>". `-Kind input` gives "Claude needs you – <folder>" plus the hook's `message`.
- **Hooks:** `Stop` runs the script with `-Kind done`, and `Notification` runs it with `-Kind input`. Both run through `powershell.exe -NoProfile -ExecutionPolicy Bypass -File ...` with `async: true` and `timeout: 20`.
- **Phone:** `inputNeededNotifEnabled: true` (push when a prompt or question is waiting) and `agentPushNotifEnabled: true` (already on). Both need the Claude mobile app.
- **Backup** of settings from before the hooks were added: `~/.claude/settings.json.bak-notify`.

**How to apply:** to change wording or sound, edit notify.ps1. To turn notifications off, use `/hooks` or remove the hooks from settings.json. If a notification stops appearing, check Windows Focus Assist and the notification permission for "Windows PowerShell".
