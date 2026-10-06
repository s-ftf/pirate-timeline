![Pirate Chain Logo](assets/img/site/featured-image.png)

# Pirate Chain Timeline

An open-source timeline of Pirate Chain history. Contributions are welcome via PR.

live timeline: [https://s-ftf.github.io/pirate-timeline/](https://s-ftf.github.io/pirate-timeline/)

## How to add a new post

1. Add an image to [`assets/img/posts/`](assets/img/posts/) (**Add file → Upload files** on GitHub).
2. Create a Markdown file in [`_milestones/`](_milestones/) named `YYYY-MM-DD-Title.md` (**Add file → Create new file** on GitHub).
3. Use the format below, then preview, commit, and push to `main`. GitHub Pages rebuilds automatically.

Example: [2018-08-29-The-Idea.md](_milestones/2018-08-29-The-Idea.md)

```markdown
---
date: 2018-08-29 00:00:00
title: "The Idea"
image: The-Idea-is-Born-in-KMD-768x516.png
links:
  - https://discordapp.com/channels/412898016371015680/455851625915875338/484319952849993748
  - https://satindergrewal.medium.com/pirates-of-komodo-platform-cdc991b424df
---

A question in Komodo's Discord starts the discussion.
```

Site names/icons and image alt text are automatic. Text beyond four lines gets **Show more**.
Click a milestone and share its URL. Bookmarks use the date and title, with automatic duplicate suffixes.
Adjust the time to order posts on the same date.
[Markdown cheat sheet](https://www.markdownguide.org/cheat-sheet/).

## Run locally

### Install

Requires Ruby 3.4.10. Run from the repository root:

```sh
gem install bundler -v 4.0.22 --user-install
bundle config set --local path vendor/bundle
bundle install
```

### Run

```sh
bundle exec jekyll serve --livereload --baseurl ""
```

Open <http://localhost:4000>. Press Ctrl+C to stop.

## Configure a fork

Update `_config.yml`:

```yaml
url: "https://YOUR-USERNAME.github.io"
baseurl: "/YOUR-REPOSITORY"
repo: "https://github.com/YOUR-USERNAME/YOUR-REPOSITORY"
```

Use `baseurl: ""` for a site at the domain root. Update the **live timeline** link above.
Enable **Settings → Pages → Deploy from a branch → main → /(root)**.
