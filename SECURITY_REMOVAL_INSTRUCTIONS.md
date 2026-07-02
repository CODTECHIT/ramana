## Remove sensitive files from Git index and optionally purge history

Follow these steps locally (PowerShell) to remove the checked-in secrets and build artifacts, then purge history if needed.

1) Remove files from the index (keep local copies):

```powershell
git rm --cached .env
git rm --cached server/.env
git rm -r --cached .next
git rm -r --cached server/dist
git commit -m "chore: remove sensitive env files and build artifacts from repo"
git push origin HEAD
```

2) (Optional, to purge history) Use BFG Repo-Cleaner or git-filter-repo. Example with BFG:

```powershell
# Download BFG jar, then:
java -jar bfg.jar --delete-files .env --delete-files server/.env
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

Or using `git-filter-repo` (recommended):

```powershell
git clone --mirror <repo_url> repo.git
cd repo.git
git filter-repo --invert-paths --paths .env --paths server/.env --paths .next --paths server/dist
git push --force
```

3) Rotate all secrets immediately (recommended):
- Rotate MongoDB user password and update connection URI in your deployment's secret store.
- Rotate Cloudinary API secret and update config in hosting platform.
- Rotate SMTP credentials and any payment provider keys (Razorpay).
- Regenerate JWT secrets used by authentication.

4) Add/update documentation:
- Keep `server/.env.example` and `.env.example` in the repo with placeholders.
- Ensure `.gitignore` contains `.env` and `server/.env` (already present).

5) Prevent recurrence:
- Add a pre-commit hook or a CI check that fails when `.env` or other sensitive filenames are staged.

If you want, I can run the git index removal commands for you (apply changes to repo files only), or produce a small pre-commit hook file to add to the repo. Tell me which step to run next.
