# Rollback runbook: metalloscrap.com

## 2026-10-07

Use this when a change that just went live breaks the site and you need the previous version back.

### Versions

Every release is a git tag on GitHub: https://github.com/pratham-8123/metalloscrap/tags

| Tag | What it is |
| --- | --- |
| `v1.0.0` | The site before the redesign (blue theme, `#contact-info` QR link). |
| `v2.0.0` | The redesign: copper and charcoal theme, `/about`, `/products`, `/contact` URLs, QR to `/contact`. |
| `v2.1.0` | Form banner auto-hides after 5 s, SEO additions (robots.txt, sitemap, structured data), README and this runbook. |

### Roll back everything since a version

Run these in the repo folder. Replace `v1.0.0` with the version you want the site to look like.

```bash
git pull origin master                 # make sure you have the latest history first
git revert --no-edit v1.0.0..HEAD      # adds commits that undo every change made after v1.0.0
git push origin master                 # GitHub Actions deploys the result in about two minutes
```

`git revert` adds new commits instead of deleting old ones, so nothing is lost. To bring the newer
version back later, revert the revert commits the same way (`git log` shows their hashes).

### Undo only the last change

```bash
git revert --no-edit HEAD
git push origin master
```

### Check the rollback is live

1. On GitHub, the **Actions** tab shows a green tick for the revert commit.
2. Open https://metalloscrap.com in a private window and confirm the old version shows.
3. Optionally, check the deploy time:

   ```bash
   curl -sI https://metalloscrap.com/ | grep -i last-modified
   ```

### Things to know

- Rolling back to `v1.0.0` removes the `/contact` URL, so the new QR code shows "page not found".
  The old `#contact-info` QR code works with `v1.0.0`.
- Pushing needs the pratham-8123 token. If the revert touches `.github/workflows/`, the token also
  needs "Workflows: Read and write".
- If `git revert` stops with a conflict, run `git revert --abort` to cancel safely and ask for help.

### Tagging a new release

After a change is live and checked, tag it so it can be rolled back to later:

```bash
git tag -a v2.1.0 -m "Short description of the release"
git push origin v2.1.0                 # tags do not trigger a deploy
```
