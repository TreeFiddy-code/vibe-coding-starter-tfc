# Local Session Notes (Not Version Controlled)

## Known Issues & Solutions

### Port 6006 Already In Use

**Problem:** When starting `npm run dev`, the error `EADDRINUSE: address already in use :::6006` appears.

**Solution:** Kill the process using port 6006 before starting the dev server:

```bash
# Windows - Find and kill process on port 6006
netstat -ano | findstr :6006
taskkill //F //PID <PID_NUMBER>

# Or use this one-liner (PowerShell):
# Get-NetTCPConnection -LocalPort 6006 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

**Root Cause:** Previous dev server sessions may not have been properly terminated, leaving zombie Node.js processes holding the port.

**Prevention:** Always stop the dev server properly with Ctrl+C. If the terminal was closed without stopping, the process remains.

## Session Startup

**Use `/startup` at the beginning of each session.** This skill automatically:
- Checks and clears port 6006
- Reads this file for context
- Reviews git status
- Reports environment readiness

See `/skills-guide` for all available commands.

## Project-Specific Notes

- Dev server runs on port 6006 (configured in package.json)
- Use Playwright MCP for browser verification
- Always run `mcp__ide__getDiagnostics` before completing tasks
