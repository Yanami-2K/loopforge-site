#!/usr/bin/env python3
"""Regenerate blog/feed.xml from blog/posts.json. Run after adding or editing a post: python3 blog/build_feed.py"""
import json
import os
from datetime import datetime, timezone
from email.utils import format_datetime
from xml.sax.saxutils import escape

SITE = 'https://loopforge.cn'
HERE = os.path.dirname(os.path.abspath(__file__))

posts = sorted(json.load(open(os.path.join(HERE, 'posts.json'), encoding='utf-8')), key=lambda p: p['date'], reverse=True)
rfc = lambda d: format_datetime(datetime.strptime(d, '%Y-%m-%d').replace(hour=8, tzinfo=timezone.utc))
mime = {'.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.gif': 'image/gif'}

items = []
for p in posts:
    url = f"{SITE}/blog/{p['slug']}/"
    cover = f"{SITE}/blog/{p['cover']}"
    size = os.path.getsize(os.path.join(HERE, p['cover']))
    items.append(f"""  <item>
   <title>{escape(p['title'])}</title>
   <link>{url}</link>
   <guid isPermaLink="true">{url}</guid>
   <pubDate>{rfc(p['date'])}</pubDate>
   <dc:creator>{escape(p['author'])}</dc:creator>
   <description>{escape(p['summary'])}</description>
   <enclosure url="{cover}" length="{size}" type="{mime[os.path.splitext(cover)[1]]}"/>
  </item>""")

feed = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
 <channel>
  <title>LoopForge 博客</title>
  <link>{SITE}/blog/</link>
  <atom:link href="{SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
  <description>LoopForge 上手教程、团队落地实践与社区案例。</description>
  <language>zh-CN</language>
  <lastBuildDate>{rfc(posts[0]['date'])}</lastBuildDate>
  <image><url>{SITE}/favicon.svg</url><title>LoopForge 博客</title><link>{SITE}/blog/</link></image>
{chr(10).join(items)}
 </channel>
</rss>
"""
open(os.path.join(HERE, 'feed.xml'), 'w', encoding='utf-8').write(feed)
print(f'wrote feed.xml with {len(posts)} posts')
