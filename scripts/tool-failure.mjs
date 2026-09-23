#!/usr/bin/env node
// PostToolUseFailure on the freo MCP tools: turn the common failures into a concrete next
// step for the agent, so it doesn't retry blindly or guess at what the user should do.

import { emitContext, readHookEvent, runHook } from './hook-helpers.mjs';

const HINTS = [
    [/\b401\b|unauthori[sz]ed|unauthenticated|invalid[_ ]token|expired token|re-?auth/i,
        'The freo connection is not signed in (or the session expired). Tell the user to run `/mcp`, '
        + 'pick "freo" and authenticate — no API key needed. Do not retry until they have.'],
    [/\b429\b|daily (publish )?(cap|limit)|too many/i,
        'The daily publish cap is reached. Tell the user and STOP — do not retry in a loop. '
        + 'Updating an existing document (update_document) does not count as a new publish.'],
    [/secret|credential|api key detected|findings/i,
        'The publish was blocked because the content looks like it contains a secret. Tell the user '
        + 'exactly what was found. Only resend with allow_findings if they confirm it is a deliberate '
        + 'placeholder — never publish a real credential.'],
    [/\b413\b|too large|[KM]B or smaller|payload/i,
        'The upload is over a size limit. Call whoami for the current limits (per file, images, bundle) '
        + 'and tell the user which file is too big.'],
];

await runHook(async () => {
    // Match the error only — tool_input carries the document itself, which may well say "secret".
    const event = await readHookEvent();
    if (event.is_interrupt) return;
    const text = String(event.error ?? '');
    const hint = HINTS.find(([pattern]) => pattern.test(text));

    emitContext('PostToolUseFailure', hint
        ? `freo.cloud: ${hint[1]}`
        : 'freo.cloud: the tool call failed. Read the error, fix the input if it says what is wrong; '
            + 'otherwise tell the user rather than retrying repeatedly.');
});
