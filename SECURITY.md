# Security Policy

## Supported versions

Security fixes are applied to the latest code on `main`. If tagged releases exist, the most recent release is also considered supported.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Report them privately using [GitHub Security Advisories](https://github.com/GunnarKarlsson/speedhare-website/security/advisories/new):

1. Go to the repository’s **Security** tab.
2. Choose **Advisories** → **New draft security advisory** (or use the link above).
3. Include a clear description, steps to reproduce, affected versions if known, and any suggested fix.

We aim to acknowledge reports promptly, typically within a few days. After triage, we will work with you on a fix and coordinated disclosure when appropriate.

## Scope

This repository is the public speedhare website (`https://speedhare.io`): a Vite + React frontend that displays Hong Kong road race results from `https://api.speedhare.io` and is deployed as static files.

The site shows runner names and finishing data taken from official, publicly downloadable result files.

In scope:

- Cross-site scripting or HTML injection in the speedhare UI
- Open redirects or abuse of client-side routing / outbound links
- Secrets or credentials committed to this repository
- Supply-chain issues in this repo’s npm dependencies that affect the built site
- Compromised or unexpected behavior in the site’s CI or deploy workflows

Out of scope for this repository:

- The speedhare API, data pipeline, or result-file processing
- Accuracy or completeness of organizer-published race results
- Third-party outages (GitHub, npm, AWS, DNS)
- Social-engineering against Bahn Labs or speedhare accounts

If you are unsure whether a finding belongs here, report it privately through the advisory form above and we will route it.
