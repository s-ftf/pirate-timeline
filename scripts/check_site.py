#!/usr/bin/env python3
"""Check generated HTML, metadata, and local asset links without fetching external sites."""

import argparse
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urljoin, urlsplit


CSS_URL = re.compile(r"url\(\s*[\"']?([^\"')]+)")


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = Counter()
        self.references = []
        self.canonical = []
        self.metadata = {}
        self.ids = Counter()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags[tag] += 1
        if attrs.get("id"):
            self.ids[attrs["id"]] += 1
        for attribute in ("src", "href"):
            if attrs.get(attribute):
                self.references.append(attrs[attribute])
        self.references.extend(CSS_URL.findall(attrs.get("style", "")))
        if tag == "link" and "canonical" in attrs.get("rel", "").split():
            self.canonical.append(attrs.get("href"))
        if tag == "meta":
            key = attrs.get("property", attrs.get("name"))
            self.metadata[key] = attrs.get("content")


def main():
    repository = Path(__file__).resolve().parents[1]
    config = json.loads(subprocess.check_output([
        "ruby", "-rjson", "-ryaml", "-e",
        "puts JSON.generate(YAML.load_file(ARGV.fetch(0)))",
        str(repository / "_config.yml"),
    ], text=True))
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("site_directory", type=Path)
    parser.add_argument("--baseurl", default=config.get("baseurl", ""))
    parser.add_argument("--url", default=config["url"])
    args = parser.parse_args()

    root = args.site_directory.resolve()
    baseurl = "/" + args.baseurl.strip("/") if args.baseurl.strip("/") else ""
    origin = args.url.rstrip("/")
    errors = []
    checked = 0

    def check_reference(reference, page_url, source):
        nonlocal checked
        if reference.startswith("#"):
            return
        destination = urlsplit(urljoin(page_url, reference))
        if destination.scheme not in {"http", "https"} or destination.netloc != urlsplit(origin).netloc:
            return
        path = unquote(destination.path)
        if baseurl and path != baseurl and not path.startswith(baseurl + "/"):
            errors.append(f"{source}: link escapes the site's baseurl: {reference}")
            return
        target = (root / path[len(baseurl):].lstrip("/")).resolve()
        if not target.is_relative_to(root):
            errors.append(f"{source}: link escapes the output directory: {reference}")
            return
        if target.is_dir():
            target /= "index.html"
        checked += 1
        if not target.is_file():
            errors.append(f"{source}: missing local target: {reference}")

    pages = sorted(root.rglob("*.html"))
    if not (root / "index.html").is_file() or not (root / "404.html").is_file():
        errors.append("The generated site must contain index.html and 404.html.")
    for page in pages:
        relative = page.relative_to(root).as_posix()
        web_path = "/" + (relative[:-10] if relative.endswith("index.html") else relative)
        page_url = origin + baseurl + web_path
        document = PageParser()
        document.feed(page.read_text(encoding="utf-8"))
        if any(document.tags[tag] != 1 for tag in ("html", "head", "body")):
            errors.append(f"{relative}: expected one html, head, and body element")
        for identifier, count in document.ids.items():
            if count > 1:
                errors.append(f"{relative}: duplicate id: {identifier}")
        if document.canonical != [page_url] or document.metadata.get("og:url") != page_url:
            errors.append(f"{relative}: incorrect canonical or Open Graph URL; expected {page_url}")
        for key in ("og:image", "twitter:image"):
            image = document.metadata.get(key, "")
            if not image.startswith(origin + baseurl + "/"):
                errors.append(f"{relative}: invalid {key} URL: {image}")
            else:
                check_reference(image, page_url, relative)
        for reference in document.references:
            if reference.startswith("#") and len(reference) > 1 and unquote(reference[1:]) not in document.ids:
                errors.append(f"{relative}: missing bookmark target: {reference}")
            check_reference(reference, page_url, relative)

    for css in root.rglob("*.css"):
        relative = css.relative_to(root).as_posix()
        css_url = origin + baseurl + "/" + relative
        for reference in CSS_URL.findall(css.read_text(encoding="utf-8")):
            check_reference(reference, css_url, relative)

    if errors:
        for error in errors[:20]:
            print(error)
        if len(errors) > 20:
            print(f"... and {len(errors) - 20} more errors")
        raise SystemExit(1)
    print(f"PASS: {len(pages)} pages, metadata, and {checked} local links/assets (baseurl={baseurl!r}).")


if __name__ == "__main__":
    main()
