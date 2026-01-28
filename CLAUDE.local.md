# Local Session Notes (Not Version Controlled)

## Git Remote Configuration

- **Push to `fork` remote** (not `origin`) for all git push operations
- `origin` = upstream repo (PageAI-Pro/vibe-coding-starter) - read-only
- `fork` = user's fork (TreeFiddy-code/vibe-coding-starter-tfc) - push here

```bash
# Always use this for pushing:
git push fork main
```

## Known Issues (Windows)

### Port 6006 Already In Use

**Problem:** `EADDRINUSE: address already in use :::6006` when starting dev server.

**Solution:**
```bash
# Find process using port 6006
netstat -ano | findstr :6006

# Kill by PID
taskkill //F //PID <PID_NUMBER>
```

**PowerShell one-liner:**
```powershell
Get-NetTCPConnection -LocalPort 6006 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

**Note:** The `/startup` skill handles this automatically.
