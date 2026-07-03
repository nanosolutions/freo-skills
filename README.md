# freo-publish — the freo.cloud publishing skill (v1.12.1)

Give your AI coding agent a publish button: it turns what it just built — a report, an
HTML dashboard, a PDF, a whole static site — into an access-controlled shareable link
on [freo.cloud](https://freo.cloud).

## Install

```bash
npx skills add nanosolutions/freo-skills -g
```

Works with Claude Code, Codex, Cursor, Windsurf, opencode and 70+ other agents via the
open [Agent Skills](https://agentskills.io) standard. Then connect once — grab your
one-time setup prompt at [https://freo.cloud/skill](https://freo.cloud/skill) — and just say *"publish this"*.

The skill file contains **no secrets** (your agent claims its own scoped key), and this
repo is a read-only mirror: the canonical, always-current version is served at
[https://freo.cloud/api/skill/SKILL.md](https://freo.cloud/api/skill/SKILL.md).

Chat apps (Claude.ai, ChatGPT) don't need the skill — they connect over
[MCP](https://freo.cloud/mcp-server) with one-click OAuth.