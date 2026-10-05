![Pirate Chain Logo](assets/img/site/featured-image.png)

# Pirate Chain Timeline

This repository is an open-source timeline of the history for the Pirate Chain network. This is open-source, please improve this page by submitting a PR

live timeline: [https://s-ftf.github.io/pirate-timeline/](https://s-ftf.github.io/pirate-timeline/)

## Run locally

Use Ruby 3.4.10 (also specified in `.ruby-version`) and the Bundler version
recorded in `Gemfile.lock`. Run this setup once from the repository root:

```sh
gem install bundler -v 4.0.22 --user-install
bundle config set --local path vendor/bundle
bundle install
```

Each time you want to preview the site, run:

```sh
bundle exec jekyll serve --livereload --baseurl ""
```

Open <http://localhost:4000>. Keep the terminal open while editing; changes to
milestones and assets rebuild the site and refresh the browser. Press Ctrl+C
to stop. Restart the server after editing `_config.yml`.
Run `bundle install` again whenever `Gemfile` or `Gemfile.lock` changes.

The site uses one `_config.yml` for deployment and local previews. The
`--baseurl ""` option overrides the GitHub Pages project path for the preview,
and `jekyll serve` automatically uses the local server's URL.

For a production build and a check of local links and metadata, run:

```sh
JEKYLL_ENV=production bundle exec jekyll build --destination _site-production
python3 scripts/check_site.py _site-production
```

The preview uses `_site`; the production check uses `_site-production` so it
can run while the preview is open without replacing its generated pages.
If the preview loses styles after a build into `_site`, stop the server with
Ctrl+C and run the preview command again to rebuild it with local settings.

The GitHub Actions build check verifies production and root asset paths.

## Deploy or configure a fork

A local commit saves your work. Push it to the GitHub Pages publishing branch
(`main` here) to update the hosted site. Publishing uses GitHub's existing
Pages setup; the build-check workflow only validates the site.

For a different repository, update these three values in `_config.yml`:

```yaml
url: "https://YOUR-USERNAME.github.io"
baseurl: "/YOUR-REPOSITORY"
repo: "https://github.com/YOUR-USERNAME/YOUR-REPOSITORY"
```

`url` is the site's origin, without a trailing slash; `baseurl` is its path,
without a trailing slash. For a site at the domain root, use `baseurl: ""`.
For a custom domain, set `url` to that domain's HTTPS origin. The shared
templates use these settings for assets, page metadata, and the repository
link; the local preview command stays the same.

In the new repository, enable **Settings → Pages → Deploy from a branch**
and select **main** and **/(root)**. Follow
[GitHub's publishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
for the full setup; a custom domain also needs its Pages and DNS settings.

The README's file and directory links are relative, so GitHub resolves them
within the repository and branch being viewed. Update the **live timeline**
link at the top manually for a fork's deployment: GitHub renders this README
as Markdown and does not substitute values from `_config.yml`.

***

## How to add a new post

1. Upload an image to [`assets/img/posts/`](assets/img/posts/). On GitHub, open that directory and choose **Add file → Upload files**.

2. Create a new Markdown file in [`_milestones/`](_milestones/). On GitHub, open that directory and choose **Add file → Create new file**.

3. Enter a filename which _MUST_ be the date in YYYY-MM-DD format, followed by the Title and .md extension. For example, `2018-08-29-The-Title.md`

4. Enter the post content in markdown syntax. You can click "preview" to see how your content will appear. When satisfied, commit the changes.

5. Push local commits to the publishing branch, or merge your PR into that branch on GitHub. GitHub Pages will rebuild the website, which can take a few minutes.

***

Example post:

filename: [2018-08-29-The-Idea.md](_milestones/2018-08-29-The-Idea.md)
```YAML
---
date: 2018-08-29 00:00:00
---

### The Idea

A question gets asked in the ask-jl777 channel in the Komodo Discord, which started the discussion. [[link]](https://discordapp.com/channels/412898016371015680/455851625915875338/484319952849993748)

[![The Idea](assets/img/posts/The-Idea-is-Born-in-KMD-768x516.png)](assets/img/posts/The-Idea-is-Born-in-KMD-768x516.png)

```

NOTES
* The date in YYYY-MM-DD format is required in the frontmatter (between the `---`). Adding HH:MM:SS will allow you to sort multiple milestones on the same date by adding 1 second to each post.
* Each post should start with the title as a H3 (`###`) directly after the frontmatter.
* Images should be enclosed in a link so users can expand the images by clicking on them

***

For reference on markdown syntax, please visit 
[markdown cheet sheet](https://www.markdownguide.org/cheat-sheet/)
