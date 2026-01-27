Follow these instructions carefully and do not deviate from them.

## **MANDATORY:** Session Startup Handshake

**At the START of every session, a startup handshake MUST occur:**

### How It Works:
1. **User says:** "start", "startup", `/startup`, or similar
2. **Claude runs:** The `/startup` skill which performs all initialization

### If User Doesn't Initiate:
If the user's first message is NOT a startup command, Claude MUST respond:
> "Before we begin, let me run the startup routine to ensure everything is ready. Running `/startup`..."

Then immediately invoke the `/startup` skill.

### What `/startup` Does:
- Checks and clears port 6006 if blocked
- Reads `CLAUDE.local.md` for known issues and session notes
- Reviews recent git history for context
- Verifies dev environment is ready
- Reports status summary

**This handshake is NON-NEGOTIABLE. Every session starts this way.**

## Available Skills Reference

For a complete guide on when to use which skill, run `/skills-guide` or see:
`.claude/commands/skills-guide/skills-guide.md`

### Most Common Skills:
| Skill | When to Use |
|-------|-------------|
| `/startup` | Beginning of every session |
| `/debug <error>` | When encountering errors |
| `/git-commit` | When ready to commit changes |
| `/validate` | Before PRs or deployments |
| `/ultrathink <problem>` | Complex decisions |
| `/learn` | End of session to capture learnings |

## Project Overview & Structure

Comprehensive guide to the folder structure and organization of the project, including all main directories, key files, and their purposes.

@.cursor/rules/project-structure.mdc

## Tech Stack & Dependencies

Complete listing of the tech stack, frameworks, libraries, and dependencies used throughout the project, with version information and usage patterns.

@.cursor/rules/tech-stack-dependencies.mdc

## TypeScript Code Style Guide

TypeScript conventions including parameter passing patterns, type safety rules, import organization, functional programming practices, and documentation standards.

@.cursor/rules/typescript-style.mdc

## Next.js

Expert guidance on React, Next.js App Router, and related technologies including code structure, naming conventions, React best practices, UI styling, forms, metadata, error handling, accessibility, and security.

@.cursor/rules/nextjs.mdc

## UI Components from Shadcn UI

Guidelines for using Shadcn UI components from the shared UI library, including usage, import conventions, and best practices for composing user interfaces.

@.cursor/rules/ui-components.mdc

## Tailwind CSS Styling Practices

Tailwind CSS conventions covering class organization, responsive design, color system usage, layout patterns, design system integration, and styling best practices.

@.cursor/rules/tailwind-styling.mdc

## Landing Page Components Rule

Instructions for building public-facing pages using landing page components, including component sources, documentation references, structure examples, and implementation best practices.

@.cursor/rules/landing-components.mdc

## Self-Improvement

Guidelines for continuously improving rules based on emerging code patterns, including analysis processes, rule updates, quality checks, and documentation maintenance.

@.cursor/rules/self-improve.mdc

## Git & Version Control

- Add and commit automatically whenever an entire task is finished
- Use descriptive commit messages that capture the full scope of changes

## Retrieving library documentation by using Context 7

When the user requests code examples, setup or configuration steps, or library/API documentation, use the context7 mcp server to get the information.

## Verifying features in the browser

Use the Playwright MCP server to verify features in the browser.
Check for console errors and ensure the implemented functionality is working as expected.

## **EXTREMELY IMPORTANT:** Code Quality Checks

**ALWAYS follow these instructions before completing a task.**

Automatically use the IDE's built-in diagnostics tool to check for linting and type errors:
   - Run `mcp__ide__getDiagnostics` to check all files for diagnostics
   - Fix any linting or type errors before considering the task complete
   - Do this for *each* file you create or edit

This is a CRITICAL step that must NEVER be skipped when working on any code-related task.
