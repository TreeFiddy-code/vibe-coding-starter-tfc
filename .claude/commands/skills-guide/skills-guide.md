---
description: Reference guide for when to use which skill/command
---

# Skills Reference Guide

Quick reference for choosing the right skill for your task.

## Session Lifecycle

| When | Skill | Purpose |
|------|-------|---------|
| Starting a session | `/startup` | Port cleanup, load context, check status |
| Ending a session | `/learn` | Capture learnings to CLAUDE.local.md |
| Before major work | `/context-prime` | Deep dive into project structure |

## Development Tasks

| When | Skill | Purpose |
|------|-------|---------|
| Writing new code | `/aw` | "Always Works" - comprehensive testing |
| Debugging errors | `/debug <error>` | Systematic debugging methodology |
| Refactoring | `/refactor-code` | Safe code improvement process |
| Understanding code | `/analyze/explain` | Detailed code explanation |
| Exploring a folder | `/analyze/explore-directory` | Deep dive into directory |

## Git & Version Control

| When | Skill | Purpose |
|------|-------|---------|
| Ready to commit | `/git-commit` | Conventional commits with emoji |
| Creating a PR | `/git-create-pr` | Full PR workflow |
| Checking status | `/git-status` | Detailed git state |
| Reviewing a PR | `/gh-pr-review` | Structured PR review |

## Documentation

| When | Skill | Purpose |
|------|-------|---------|
| Documenting API | `/docs/document-api` | Generate API docs |
| Architecture docs | `/docs/document-architecture` | System architecture |
| Updating docs | `/update-docs` | Sync docs with code changes |

## Problem Solving

| When | Skill | Purpose |
|------|-------|---------|
| Complex decisions | `/ultrathink <problem>` | Deep multi-angle analysis |
| Architecture choices | `/analyze/explore-architecture` | Architectural analysis |
| Generating options | `/analyze/generate-code-variations` | Multiple implementations |

## Quality & Validation

| When | Skill | Purpose |
|------|-------|---------|
| Before PR/deploy | `/validate` | Full CI validation suite |
| After changes | `/aw` | Ensure changes work |

## Project Management

| When | Skill | Purpose |
|------|-------|---------|
| Tracking tasks | `/todo` | Manage todos.md |
| Changelog updates | `/add-to-changelog` | Update CHANGELOG.md |
| Release process | `/release` | Version release workflow |

## Quick Decision Tree

```
Starting work?
  └─> /startup

Got an error?
  └─> /debug <error description>

Need to understand code?
  └─> /analyze/explain

Making changes?
  └─> Write code, then /aw to verify

Ready to commit?
  └─> /git-commit

Complex problem?
  └─> /ultrathink <problem>

Ending session?
  └─> /learn (if you learned something)
```

## Tips

1. **Always start with `/startup`** - prevents port conflicts and loads context
2. **Use `/ultrathink` for big decisions** - don't rush architectural choices
3. **Run `/validate` before PRs** - catch issues before review
4. **End sessions with `/learn`** - build persistent knowledge
5. **Use `/debug` systematically** - don't randomly try fixes
