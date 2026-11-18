# LoopForge 官网 · Official website

**在线访问 / Live:** https://loopforge.cn/

这是 [Tencent/LoopForge](https://github.com/Tencent/LoopForge) 的官网。首页是一条纵向滚动的长页：首屏标题与 SOP 设计器动画 → 五个团队痛点 → 六步演进，每步都是按真实界面还原的动画（云端 7×24 工作区、共享会话与 Main Bot、带门禁可接管的 SOP、门禁自愈、定时与 Issue 自动化、工程级 RSI 复盘）→ 内嵌产品视频 → 部署 → 结尾。每段示意界面由 HTML/CSS 绘制，滚动进入视口时播放一次，可点“重播”；遵守 `prefers-reduced-motion`，`?still=1` 直接显示最终状态（用于截图）。内容依据 LoopForge 仓库与官方公众号文章《当 Coding Agent 走进研发团队》，功能名称与平台一致，需求、数字和对话为示例数据。中英文案在 `site/content.js`，页面与动画在 `site/flow.js`，样式在 `site/site.css`。旧的 Local 分段故事保留在 `local.html`。

**产品演示视频:** https://loopforge.cn/demo/ 。`demo/` 是一个独立的视频播放页（`demo/index.html` + `demo.css` + `demo.js`，视频与封面在 `demo/media/`）：80 秒产品演示，自定义播放控件，进度条上标出 10 个章节，右侧章节列表可点击跳转并随播放高亮；默认静音自动播放（遵守 `prefers-reduced-motion`），快捷键 空格/K 播放暂停、←/→ 快退快进 5 秒、M 静音、F 全屏、1–9 跳章节。中英文跟随首页的 `?lang=` / `lf-lang`。页面 CSP 为 `connect-src 'none'`，除静态文件外不发请求。视频按 H.264 1080p、`+faststart` 编码，需由支持 Range 请求的服务器提供才能拖动进度（GitHub Pages 支持；本地可用 `npx http-server`）。

原 `playground/` 是手工模拟，现在跳转到 `demo/` 演示视频。LoopForge 以 [MIT 协议](https://github.com/Tencent/LoopForge/blob/main/LICENSE) 开源。

The official website for [Tencent/LoopForge](https://github.com/Tencent/LoopForge), focused on the self-hosted platform. The original Local story is retained at `local.html`.

`demo/` is a standalone player for the 80-second product video, with custom controls, chapter markers on the timeline and a clickable chapter list that follows playback. It autoplays muted (respecting `prefers-reduced-motion`) and loads nothing but its static files (CSP `connect-src 'none'`). `playground/` redirects to it. LoopForge is [MIT licensed](https://github.com/Tencent/LoopForge/blob/main/LICENSE).

## 演示数据 / Demo data

页面里的对话、diff、审查意见、测试结果和看板数字都是为了演示编的，不是 LoopForge 真实运行的输出。`dash/` 是上游看板页面的副本，配了一份合成的 `dashboard-data.json`。

`playground/` 是纯前端模拟：SOP 的节点、类型、产物路径、打回目标、角色和指令取自上游 `migrations/seed/001_public_catalog.sql`；运行轨迹和产物内容是示例数据。不调用模型、不执行代码，除静态文件和 Google Fonts 外不发请求（页面 CSP 设了 `connect-src 'none'`），输入内容只留在当前标签页。

All conversations, diffs, review comments, test output and dashboard numbers are made up for illustration. `dash/` is a copy of the upstream dashboard page fed with synthetic `dashboard-data.json`.

`playground/` is a front-end-only simulation: SOP nodes, types, output paths, reject targets, roles and instructions come from upstream `migrations/seed/001_public_catalog.sql`; run traces and artifact bodies are demo data. It calls no model, runs no code and loads nothing beyond its static files and Google Fonts (CSP `connect-src 'none'`); input stays in the current tab.

## 本地预览 / Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

纯静态，无构建步骤。Static files only, no build step. 中文 / English: `?lang=zh` / `?lang=en`.

## 支持的 Agent / Agents shown

Claude Code、Codex、Cursor、CodeBuddy（Classic + Portable），Pi（仅 Portable，`skills install pi` + `pi install npm:pi-subagents`），命令都取自上游 README。
Claude Code, Codex, Cursor, CodeBuddy (Classic + Portable) and Pi (Portable only); commands are taken from the upstream README.

## 商标 / Trademarks

页面里的产品 Logo 只用来标明每条命令对应哪个 Agent，商标归各自所有者：Claude（Anthropic）、Codex（OpenAI）、Cursor（Anysphere）、CodeBuddy（Tencent）、Pi（Earendil / pi.dev）。前四个的单色图形取自 [LobeHub Icons](https://github.com/lobehub/lobe-icons)（MIT），Pi 的图形取自 pi.dev 的 favicon。本页与这些公司无关。

Product logos are used only to label which agent each command targets; they are trademarks of their owners: Claude (Anthropic), Codex (OpenAI), Cursor (Anysphere), CodeBuddy (Tencent), Pi (Earendil / pi.dev). The first four monochrome marks come from [LobeHub Icons](https://github.com/lobehub/lobe-icons) (MIT); the Pi mark is from pi.dev's favicon. This page is not affiliated with any of them.

## License

MIT, see [LICENSE](LICENSE). `dash/index.html` © Tencent, MIT. `site/fonts/`: Inter Tight, Geist Mono and Montserrat (600, used for the LoopForge wordmark), SIL Open Font License 1.1 (`site/fonts/OFL-*.txt`). The logo (`site/logo.svg`, `favicon.svg`) and the cyan / blue / violet palette follow the product video.
