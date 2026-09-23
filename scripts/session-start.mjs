#!/usr/bin/env node
// SessionStart (startup only): a quick, silent-on-failure check that nudges the agent when
// the plugin is out of date. One GET with a short timeout; says nothing when all is well.

import { BASE_URL, compareVersions, emitContext, installedVersion, readHookEvent, runHook } from './hook-helpers.mjs';

await runHook(async () => {
    const event = await readHookEvent();
    if (event.source && event.source !== 'startup') return;

    const res = await fetch(`${BASE_URL}/api/skill/version`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return;
    const { version: latest } = await res.json();
    const current = installedVersion();

    if (latest && compareVersions(current, latest) < 0) {
        emitContext('SessionStart',
            `freo.cloud: the freo-publish plugin is v${current}; v${latest} is available. `
            + 'If the user publishes something this session, mention once that they can update with '
            + '`/plugin marketplace update freo` (then restart).');
    }
});
