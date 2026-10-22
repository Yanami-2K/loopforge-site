# LoopForge 社区介绍页 · Community intro page

**在线访问 / Live:** https://loopforge.cn/

这是 [Tencent/LoopForge](https://github.com/Tencent/LoopForge) 的**非官方**社区介绍页。首页是一页一屏的翻页介绍（滚轮、方向键或触摸滑动翻页，手机上改为顺序滚动，遵守 `prefers-reduced-motion`）：平台、为什么、经验变流程、门禁打回、共享上下文、投入与交付、人在环上、智能评测、部署。中英文案在 `site/content.js`，场景与翻页逻辑在 `site/flow.js`，样式在 `site/site.css`。每页右侧是 HTML/CSS 绘制的示意界面：SOP 节点、门禁命令、评测维度与权重与平台一致，需求、数字和对话为示例数据（看板与评测页标注“示例数据”）；真实界面请看 `demo/` 录制预览。旧的 Local 分段故事保留在 `local.html`，不再作为平台的主体介绍。

**平台真实前端录制预览:** https://loopforge.cn/demo/ 。`demo/` 直接复制上游 `web/` 中的前端（来源基线见 `LF_RECORDINGS.meta`），只适配 `/demo/` 静态资源路径并接入内存回放层。接口数据来自一个只装公共目录、无模型/Git凭据的独立本地实例；脚本与审批运行及产物是真实录制，Agent SOP 的配置来自平台公共模板的真实项目副本。未录制的写操作默认拒绝，审批演示只在浏览器切换录制状态，不发网络请求、不执行脚本。无需登录或 API Key，请勿输入凭据。

重新打包：`python3 build-demo.py --source /path/to/LoopForge/web --capture /path/to/local/capture [--esbuild /path/to/esbuild]`。脚本把前端合并为带内容哈希的 `lf.<hash>.js` / `lf.<hash>.css`，英文词典 `i18n-en.<hash>.js` 只在英文模式加载，并更新首页 `<!--demo-prefetch-->` 区块；传入 esbuild 时压缩，装了 Pillow 时缩小 logo。原始录制文件可能包含登录请求，不能提交；打包仅保留成功 GET 响应，并移除敏感字段和本地运行路径。初始版本不包含工作区 VS Code、实时模型运行或任意修改保存能力。

原 `playground/` 是手工模拟，已不作为平台预览入口。LoopForge 以 [MIT 协议](https://github.com/Tencent/LoopForge/blob/main/LICENSE) 开源。

An **unofficial** community intro page for [Tencent/LoopForge](https://github.com/Tencent/LoopForge), focused on the self-hosted platform. The original Local story is retained at `local.html`.

`demo/` bundles the upstream Web UI with recorded responses from a clean local instance: browse SOPs, their designer, requirements, runs and real script-generated artifacts. Approval switches between recorded states in memory; unsupported writes are denied. No model calls, credentials or server are required. The preview does not include the workspace VS Code or arbitrary execution. `playground/` redirects to this real-UI preview. LoopForge is [MIT licensed](https://github.com/Tencent/LoopForge/blob/main/LICENSE).

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

MIT, see [LICENSE](LICENSE). `dash/index.html` © Tencent, MIT. `site/fonts/`: Inter Tight and Geist Mono, SIL Open Font License 1.1 (`site/fonts/OFL-*.txt`).
