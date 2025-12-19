![Pirate Chain Logo](assets/img/site/featured-image.png)

# Pirate Chain Timeline

This repository is an open-source timeline of the history for the Pirate Chain network. This is open-source, please improve this page by submitting a PR

live timeline: [https://s-ftf.github.io/pirate-timeline/](https://s-ftf.github.io/pirate-timeline/)

***

## How to add a new post

1. Upload an image to `assets/img/posts/`: [UPLOAD IMAGES](https://github.com/s-ftf/pirate-timeline/upload/main/assets/img/posts) 

2. Create a new markdown file in the `_milestones` directory: [NEW MILESTONE](https://github.com/s-ftf/pirate-timeline/new/main/_milestones)

3. Enter a filename which _MUST_ be the date in YYYY-MM-DD format, followed by the Title and .md extension. For example, `2018-08-29-The-Title.md`

4. Enter the post content in markdown syntax. You can click "preview" to see how your content will appear. When satisfied, commit the changes.

5. Once the commit is made, github will automatically rebuild the website, which can take a few minutes.

***

Example post:

filename: [2018-08-29-The-Idea.md](https://raw.githubusercontent.com/s-ftf/pirate-timeline/main/_milestones/2018-08-29-The-Idea.md)
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
