# LoopForge 开源版使用文档（零基础全功能手册）

> 本手册面向所有使用 **LoopForge** 的团队成员（包括完全没有编程基础的产品、设计、运营与测试同学，以及负责搭建环境的研发与管理员）。
>
> - **在线阅读（带多级目录导航与中英切换）**：打开官网 [`/docs/`](index.html)
> - **快速上手路径**：先看 [认识 LoopForge](01-getting-started/01-what-is-loopforge.md) → [安装与启动](01-getting-started/00-install.md) → [3 分钟免配置体验](01-getting-started/05-try-without-key.md) → [配置模型 API Key](01-getting-started/06-configure-api-key.md) → [发起第一个任务](01-getting-started/07-first-conversation.md)

---

## 文档目录

### 一、快速开始

- [认识 LoopForge](01-getting-started/01-what-is-loopforge.md) — 无需编程基础。用日常语言描述你要做的事，让 AI 团队在云端沙箱里按标准流程完成方案设计、编码实现、自动化测试与交付。
- [核心概念白话词典](01-getting-started/02-core-concepts.md) — 在开始操作前，花 2 分钟了解页面上最常出现的 10 个词。你可以把整套系统想象成一家分工明确的「AI 软件工坊」。
- [界面布局与导航速览](01-getting-started/03-interface-tour.md) — 登录 LoopForge 后，整个界面由「左侧全局图标栏」「中间二级面板」和「右侧主工作区」三部分组成，干净清爽、不会迷路。
- **10 分钟上手实操**
  - [安装与启动](01-getting-started/00-install.md) — 用 Git、Docker 和三行命令把开源版装到自己的电脑或云服务器上，并分清平台安装和 Local 工作流安装。
  - [账号注册与首次登录](01-getting-started/04-account-and-login.md) — 无论你是访问同事搭建好的团队网址，还是自己用 Docker 启动服务，只需 1 分钟即可完成登录并进入默认体验项目。
  - [第一步：3 分钟免配置体验](01-getting-started/05-try-without-key.md) — 不用申请模型 API Key，也不用绑定 GitHub 仓库。点击首页的「一键体验」，亲手走完一次「脚本执行 → 人工审批 → 产物交付」的真实流程。
  - [第二步：配置模型 API Key](01-getting-started/06-configure-api-key.md) — 当你希望和 Main Bot 自由聊天、让 AI 撰写文档或编写代码时，需要在「个人配置」中填入对应执行器的 API Key。
  - [第三步：发起第一个任务](01-getting-started/07-first-conversation.md) — 配好模型 API Key 后，回到 AI 工作台。用日常语言向 Main Bot 交代一件事，体验「对话生成文档」与「确认卡片创建需求」。

### 二、日常工作区指南

- **AI 工作台与对话协作**
  - [发起对话、排队与实时引导](02-workspace/01-ai-workbench.md) — AI 工作台是团队每天待得最久的地方。它不仅支持单人问答，还支持产品、设计、研发在同一个共享会话里围绕 Main Bot 协同推进任务。
  - [输入框工具栏与权限模式](02-workspace/02-toolbar-and-permissions.md) — 聊天输入框底部有一排紧凑的控制按钮，用来决定「这次任务在哪个项目做、用哪个模型引擎、想多深、以及做修改前要不要先问过你」。
  - [7×24 云端沙箱与产物抽屉](02-workspace/03-cloud-workspace-and-artifacts.md) — 在 LoopForge 中，AI 写代码、跑脚本都在独立的 Docker 云端沙箱里完成，不会弄乱你的电脑；生成的所有文档和报告都能在右侧抽屉一键预览。
- **需求、审批与运行跟踪**
  - [需求列表与看板管理](02-workspace/04-requirements-and-board.md) — 所有的任务单、缺陷修复和对话改代码记录都会汇总在「需求列表」中。你可以用列表或拖拽看板掌控全局进度。
  - [待我确认（人工审批门禁）](02-workspace/05-human-approvals.md) — LoopForge 坚持「关键节点由人把关」。当任何一条自动化流程跑到人工审批节点时，都会停在「待我确认」等你做出决定。
  - [运行记录、在线工作区与 AI 评测](02-workspace/06-runs-and-evaluation.md) — 每一条启动过的 SOP 流程都会在「运行记录」中留下完整档案。你可以查看节点拓扑、在内置 VS Code 工作区浏览代码、体验前端预览，或发起 0–100 分 AI 智能评测。
  - [SOP 暂停介入、局部重跑与恢复](02-workspace/07-run-recovery-and-rerun.md) — 任务跑偏了想中途插手？某个节点失败了不想从头重来？刚刚改了 SOP 画布想直接用上？一文搞懂 LoopForge 的 5 种运行控制与重跑机制。

### 三、流程编排与自动化

- [SOP 流程模板：选用与复制](03-automation/01-sop-templates.md) — SOP（标准作业流程）是把团队最佳交付经验固化下来的流水线蓝图。你可以直接复制平台内置的 4 条成熟模板，零基础起步。
- [流程设计器：画布编排与门禁](03-automation/02-flow-designer.md) — 点击任意一条本项目的 SOP 即可进入可视化「流程设计」画布。通过拖拽 5 类节点、设置退出码门禁与失败打回连线，像搭积木一样定义工程标准。
- [AI 定时任务与共享市场](03-automation/03-scheduled-tasks.md) — 把每天重复的巡检、需求整理、日报汇总或 GitHub Issues 自动修复交给「AI 定时任务」，到点自动在云端唤醒执行。

### 四、系统配置与扩展能力

- **账号、项目与执行环境**
  - [个人配置与 GitHub 仓库授权](04-configuration/01-personal-settings-and-github.md) — 在「设置 → 个人配置」中集中管理你的个人账号信息、GitHub 代码仓库连接以及各家编码 Agent 的执行凭据。
  - [项目配置与团队成员权限](04-configuration/02-projects-and-members.md) — 在 LoopForge 中，「项目」是需求、代码仓库、团队成员和默认 SOP 的统一边界。通过项目配置，你可以为不同产品线建立清晰的工作空间。
  - [执行机器与环境沙箱资产](04-configuration/03-runners-and-environments.md) — 默认情况下，所有任务都在平台自带的云端 Docker 沙箱里开箱即跑；如果你需要使用本地特定硬件或内网环境，也可以在「执行机器」中接入自己的电脑或服务器。
- **AI 角色、工具与数据洞察**
  - [角色定义（Agents）](04-configuration/04-roles-and-capabilities.md) — 在「设置 → 角色定义」中，把不同岗位的职责、提示词、执行器模型、产物要求和工具权限封装成可复用的专业 AI 角色。
  - [能力资产：MCP、规则与技能](04-configuration/05-mcp-rules-skills.md) — 在「设置 → 能力资产」下，通过 MCP 管理、规则管理和技能管理，为你的 AI 角色装上外接工具箱、项目红线约定与标准化技能包。
  - [Bot 通知与数据看板](04-configuration/06-bots-and-metrics.md) — 用「Bot 管理」把任务进展自动推送到企业微信，并通过「统计 / 研发效能 / 业务领域」三大看板看清每一分投入与产出。
- [平台管理、开放 API 与 Local 版](04-configuration/07-admin-api-and-local.md) — 面向团队管理员与进阶开发者：在「平台管理」中开通成员账号，在「接入指南」中获取 API Token 与 MCP 配置，或使用 LoopForge Local 在个人终端运行工作流。

### 五、常见问题与排障

- [新手常见问题与排障速查](05-faq/01-troubleshooting-and-faq.md) — 遇到黄字提醒、按钮点不动、或者找不到项目和任务时，按下面的分类找到对应现象，照着步骤点即可解决。右侧「本页目录」可以直接跳转到具体问题。

### 六、真实使用场景

- [场景总览](06-scenarios/00-overview.md) — 8 个我们自己在用、也推荐你用的场景，全部在一个演示项目里真实跑过。
- [S01 · 在云端让 AI 写个小工具](06-scenarios/01-cloud-first-tool.md) — 一句话说需求，AI 在云端工作区里写代码、跑测试。发完就可以关电脑，云端依然在跑。
- [S02 · 和同事在同一个会话里接力](06-scenarios/02-shared-session-handoff.md) — 需求讨论、实现和 Review 都在同一个会话里，接手的人直接看历史，不用重新讲背景。
- [S03 · 把好用的做法存成团队资产](06-scenarios/03-save-team-assets.md) — 用一段话让 AI 把"谁来做、按什么查、按什么顺序"存成角色、检查清单和 SOP，团队里谁都能直接复用。
- [S04 · 用 @ 调用团队资产](06-scenarios/04-mention-assets.md) — 输入 @ 选中团队的角色和检查清单，让它按团队标准办事；结论每一条都有依据。
- [S05 · 定时任务，7×24 小时自动跑](06-scenarios/05-scheduled-jobs.md) — 一句话设好定时任务，到点自动启动 SOP；关掉页面也照跑，需要人的地方停下来等你。
- [S06 · 看用量和交付](06-scenarios/06-usage-and-delivery.md) — 一个页面看清：开了多少会话、建了多少需求、跑了多少 SOP、花了多少 Token、交付了什么。
- [S07 · 在本地 IDE 里用平台](06-scenarios/07-local-ide-mcp.md) — 把本地的 Codex、Cursor、Claude Code、CodeBuddy 通过 MCP 接到 LoopForge，不开网页也能查进度、派任务。
- [S08 · 对话里理清需求，交给 SOP 跑完](06-scenarios/08-requirement-through-sop.md) — 先和 AI 把需求聊清楚，它自动建好需求单；再从同一个对话发起 SOP，在侧边栏里看着它一步步跑完。
