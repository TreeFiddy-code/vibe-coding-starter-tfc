---
description: Initialize session with port cleanup, context loading, and status check
---

# Session Startup Routine

Initialize a new development session with all necessary checks and context loading.

## Execution Steps

### 1. Port Cleanup (Windows)

Check if port 6006 is in use and kill any zombie processes:

```bash
# Check if port 6006 is in use
netstat -ano | findstr :6006
```

If processes are found, kill them:
```bash
# Kill the process (replace <PID> with actual PID from above)
taskkill //F //PID <PID>
```

### 2. Read Session Notes

Read the local session notes file for known issues and project-specific context:

```bash
# Read CLAUDE.local.md if it exists
```

Key things to look for:
- Known issues and their solutions
- Project-specific notes
- Previous session learnings

### 3. Check Git Status

Understand the current state of the repository:

```bash
# Check current branch and status
git status

# View recent commits for context
git log --oneline -5
```

### 4. Read Core Documentation

- Read `CLAUDE.md` for project instructions
- Read `README.md` for project overview
- Check `package.json` for available scripts

### 5. Verify Dev Environment

Confirm the development server can start:

```bash
# Verify port is free
netstat -ano | findstr :6006 || echo "Port 6006 is free and ready"
```

### 6. Report Status

After completing all checks, provide a summary:

```
## Session Ready

- Port 6006: [Free/Cleared]
- Branch: [current branch name]
- Uncommitted changes: [yes/no]
- Known issues reviewed: [yes/no]
- Ready to proceed: [yes/no]
```

## Troubleshooting

### Port Still In Use After Kill

If the port remains in use after killing the process:

1. Wait 5 seconds and check again
2. Look for parent processes that may respawn
3. Check if multiple PIDs are using the port
4. As last resort, restart the terminal

### CLAUDE.local.md Not Found

If the local notes file doesn't exist:
1. Create it with basic structure
2. Add any known issues discovered during session
3. Update it before ending session with `/learn`

## Important

This routine should be run at the START of every session before any development work begins. If the user doesn't invoke this command, prompt them to do so.
