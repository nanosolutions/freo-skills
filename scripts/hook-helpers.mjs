// Shared plumbing for the freo-publish plugin hooks. Hooks must never break the agent's
// session: every failure (no network, bad input, slow server) is swallowed silently.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const BASE_URL = 'https://freo.cloud'; // replaced by `php artisan freo:skill-export`

export async function readHookEvent() {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8').trim();
    return raw ? JSON.parse(raw) : {};
}

/** Context for the model (not shown to the user as an error). */
export function emitContext(hookEventName, message) {
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName, additionalContext: message } }));
}

export function installedVersion() {
    const root = process.env.CLAUDE_PLUGIN_ROOT ?? join(import.meta.dirname, '..');
    return JSON.parse(readFileSync(join(root, '.claude-plugin', 'plugin.json'), 'utf8')).version;
}

/** Numeric semver compare: -1, 0, 1. */
export function compareVersions(a, b) {
    const pa = String(a).split('.').map(Number);
    const pb = String(b).split('.').map(Number);
    for (let i = 0; i < 3; i++) {
        if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) < (pb[i] ?? 0) ? -1 : 1;
    }
    return 0;
}

export async function runHook(fn) {
    try {
        await fn();
    } catch {
        // Never interrupt the session over a hint.
    }
}
