window.LF_RM = (function () {
const GH = 'https://github.com/Tencent/LoopForge';
const pr = n => ({ label: 'PR #' + n, url: GH + '/pull/' + n });
const is = n => ({ label: '#' + n, url: GH + '/issues/' + n });
const dis = n => ({ label: 'Discussion #' + n, url: GH + '/discussions/' + n });
const doc = (label, path) => ({ label, url: GH + '/blob/v0.4.0/' + path });

const ui = {
  zh: {
    title: 'LoopForge · 路线图',
    desc: 'LoopForge 公开路线图：已经上线了什么、正在开发什么、接下来计划做什么。',
    try: '观看演示',
    kick: '公开路线图',
    h: 'LoopForge 正在做什么，<br>下一步去哪里。', em: '下一步去哪里',
    sub: '我们希望 AI 不只帮一个人写代码，而是成为整个研发团队的交付方式：产品、开发和测试围绕同一条需求协作，每一步谁负责、怎么执行、凭什么验收都清清楚楚，每一次交付都让流程、角色和知识变得更好。',
    version: '当前版本', past: '历史版本', pick: '切换版本', latest: '最新', pre: '预发布',
    released: (d, pre) => d + (pre ? ' 预发布' : ' 发布'), updated: d => '状态更新于 ' + d, notes: '发布记录',
    status: {
      planned: ['计划中', '评估中，尚未排期'],
      progress: ['进行中', '下一个版本要做的事情'],
      done: ['已上线', v => v + ' 的主要更新'],
    },
    detail: '包含内容', area: '方向', state: '进度', owner: '负责人', links: '关联', close: '关闭',
    cta: { h: '想要的能力，<br>还不在路线图上？', em: '还不在路线图上', sub: '在 GitHub 提交功能建议，或者参与一个已立项的 Issue。路线图会随讨论和 PR 进展持续更新。', ask: '提交功能建议', issues: '查看全部 Issue' },
    foot: 'LoopForge 由腾讯开源，遵循 MIT 协议',
  },
  en: {
    title: 'LoopForge · Roadmap',
    desc: 'The public LoopForge roadmap: what has shipped, what is in progress and what is planned next.',
    try: 'Watch demo',
    kick: 'Public roadmap',
    h: 'What LoopForge is building,<br>and where it goes next.', em: 'where it goes next',
    sub: 'We want AI to be how a whole engineering team delivers, not just how one person writes code: product, engineering and QA work on the same requirement, it is always clear who owns each step, how it runs and what proves it is done, and every delivery leaves the process, roles and knowledge better than before.',
    version: 'Current release', past: 'Past release', pick: 'Switch release', latest: 'Latest', pre: 'Pre-release',
    released: (d, pre) => (pre ? 'pre-release ' : 'released ') + d, updated: d => 'status as of ' + d, notes: 'Release notes',
    status: {
      planned: ['Planned', 'Under evaluation, not yet scheduled'],
      progress: ['In progress', 'Planned for the next release'],
      done: ['Shipped', v => 'Highlights of ' + v],
    },
    detail: 'What it covers', area: 'Area', state: 'Status', owner: 'Owner', links: 'Links', close: 'Close',
    cta: { h: 'Missing something<br>you need?', em: 'you need', sub: 'Open a feature request on GitHub or join an issue that is already on the board. The roadmap is updated as discussions and pull requests move.', ask: 'Request a feature', issues: 'Browse issues' },
    foot: 'LoopForge is open-sourced by Tencent under the MIT License',
  },
};

const areas = {
  delivery: { color: '#008DCC', zh: '研发交付', en: 'Delivery' },
  assets:   { color: '#526CE8', zh: '资产与改进', en: 'Assets & RSI' },
  access:   { color: '#8A4ED9', zh: '外部接入', en: 'Integrations' },
  platform: { color: '#3BB273', zh: '平台底座', en: 'Platform' },
};

const items = {
  /* ---------- planned ---------- */
  lifecycle: { a: 'delivery',
    zh: { title: '需求全流程与人工待办', desc: '需求从草稿、澄清、分派走到验收；需要人处理的事项按需求聚合成待办。',
      details: ['需求可以交给人、单个 Agent、小队或 SOP 处理', '待办覆盖补信息、确认方案、环境授权、代码评审、业务验收和失败接管', '处理时可以批准、打回、改派，或从原步骤继续', '运行完成、PR 合入、业务验收分别留档'] },
    en: { title: 'Requirement lifecycle and human inbox', desc: 'Requirements move from draft to sign-off, and everything that needs a person is grouped per requirement.',
      details: ['Hand a requirement to a person, an agent, a squad or an SOP', 'Covers missing info, plan approval, environment access, code review, business sign-off and failure takeover', 'Approve, send back, reassign or resume from the same step', 'Run completion, merge and sign-off are recorded separately'] } },
  squads: { a: 'delivery',
    zh: { title: '多 Agent 小队', desc: '把需求指派给预配置的小队，由协调 Agent 拆分子任务、调整分工，人可以随时介入。',
      details: ['在项目群聊里召集人员和 Agent', '多个 Agent 在独立工作树中并行改代码，由指定角色集成和回归', '人可以确认计划、暂停、改派或接手', '验证有效的分工可以沉淀为 SOP'] },
    en: { title: 'Multi-agent squads', desc: 'Assign a requirement to a squad; a coordinator agent splits the work and people can step in at any time.',
      details: ['Bring people and agents together in a project chat', 'Agents change code in parallel worktrees, one role integrates and runs regression', 'Approve the plan, pause, reassign or take over', 'Squads that work well can be saved as SOPs'] } },
  sopPlus: { a: 'delivery', refs: [is(460)],
    zh: { title: 'SOP 进阶与事件触发 Loop', desc: 'SOP 支持条件分支、节点调试和检查点续跑；流程可以由工单和 CI 事件触发。',
      details: ['参数、条件分支、并行依赖和产物约定', '失败打回、节点重试、从检查点继续', '按时间、工单和 CI 事件触发，提供 Loop 模板', '定时任务的成果归因与统计'] },
    en: { title: 'Advanced SOPs and event-driven loops', desc: 'Branching, node debugging and resume-from-checkpoint in SOPs; flows triggered by tickets and CI.',
      details: ['Parameters, conditions, parallel dependencies and artifact contracts', 'Send back on failure, retry a node, resume from a checkpoint', 'Time, ticket and CI triggers with reusable loop templates', 'Outcome attribution and stats for scheduled jobs'] } },
  assets: { a: 'assets',
    zh: { title: '团队资产版本化', desc: '角色、Skill、MCP、规范、测试门禁和 SOP 按项目统一维护，支持版本、回退和跨项目复用。',
      details: ['对话、小队和 SOP 引用同一份资产', '发布前做依赖检查和影响范围分析', '运行记录实际使用的资产、提交、模型和环境', '项目模板预配常用角色、环境和测试'] },
    en: { title: 'Versioned team assets', desc: 'Roles, skills, MCP servers, rules, gates and SOPs managed per project with versions, rollback and cross-project reuse.',
      details: ['Chats, squads and SOPs share the same asset', 'Dependency and impact checks before publishing', 'Runs record the exact assets, commit, model and environment', 'Project templates with common roles, environments and tests'] } },
  im: { a: 'access', refs: [is(884)],
    zh: { title: 'IM 与工单系统双向协作', desc: '在群聊里 @机器人生成需求，进度和待办回到原话题；同步 TAPD、Jira 的状态和交付结果。' },
    en: { title: 'Two-way IM and ticketing', desc: 'Mention the bot in a group chat to draft a requirement and get progress back in the thread; sync status with TAPD and Jira.' } },
  pool: { a: 'platform', refs: [is(117), is(951)],
    zh: { title: '多机执行池', desc: '编排与执行解耦，团队服务器加入执行池横向扩容，按环境、凭据和负载分派任务，排队原因可见。' },
    en: { title: 'Multi-machine runner pool', desc: 'Orchestration decoupled from execution; team servers join a pool and tasks are placed by environment, credentials and load.' } },
  /* ---------- in progress ---------- */
  rsi: { a: 'assets', people: ['Robert0622', 'newexploreor'], refs: [is(171), dis(1105)],
    zh: { title: 'RSI Loop', desc: '把真实失败和人工修正沉淀为回归集，对流程改动做对照验证后再发布。' },
    en: { title: 'RSI loop', desc: 'Turn real failures and human fixes into a regression set, and verify process changes before rolling them out.' } },
  approvals: { a: 'delivery', refs: [pr(1070)],
    zh: { title: '审批绑定交付物', desc: '审批与具体产物绑定，验证节点作为流程的通过关口。' },
    en: { title: 'Approvals bound to artifacts', desc: 'Approvals are tied to concrete artifacts, and verification nodes gate the flow.' } },
  workspaces: { a: 'delivery', refs: [pr(1046), pr(1042), pr(1026)],
    zh: { title: '个人对话工作区', desc: '每个人拥有独立的对话工作区，支持发送偏好和按模型配置推理强度。' },
    en: { title: 'Personal chat workspaces', desc: 'A private chat workspace for everyone, with send preferences and per-model reasoning effort.' } },
  cnb: { a: 'access', refs: [pr(1035), pr(1066)],
    zh: { title: 'CNB 与 Forgejo', desc: '支持 CNB 和 Forgejo 的仓库接入与 PR 交付。' },
    en: { title: 'CNB and Forgejo', desc: 'Repository access and pull request delivery on CNB and Forgejo.' } },
  gitlab: { a: 'access', people: ['crispinhu27'], refs: [is(128)],
    zh: { title: 'GitLab 与 Gogs', desc: '支持 GitLab，以及通过 Git SSH 接入 Gogs 等仓库。' },
    en: { title: 'GitLab and Gogs', desc: 'GitLab support, plus Gogs and other hosts over Git SSH.' } },
  cliLogin: { a: 'access', refs: [is(1041), pr(1016), pr(1021)],
    zh: { title: 'CLI 订阅登录', desc: '直接使用 Claude Code、Antigravity 等已有订阅登录，自动协调凭据刷新。' },
    en: { title: 'Sign in with CLI subscriptions', desc: 'Use existing Claude Code and Antigravity subscriptions, with coordinated credential refresh.' } },
  creds: { a: 'platform', refs: [pr(1015), pr(1043), pr(1033)],
    zh: { title: '统一凭据管理', desc: '按主机配置 Git 凭据，SOP 节点和 MCP 服务器按需申请平台凭据。' },
    en: { title: 'Unified credentials', desc: 'Per-host Git credentials, with SOP nodes and MCP servers requesting platform credentials on demand.' } },
  /* ---------- shipped in v0.4.1-rc.1 (v0.4.0...v0.4.1-rc.1) ---------- */
  creds41: { a: 'platform', refs: [pr(1015), pr(1043), pr(1033), pr(1072), pr(1032)],
    zh: { title: '统一凭据管理', desc: '按主机配置 HTTPS Git 凭据，MCP 服务器、市场条目和 SOP 节点按需使用平台凭据。' },
    en: { title: 'Unified credentials', desc: 'Per-host HTTPS Git credentials, with MCP servers, market items and SOP nodes using platform credentials on demand.' } },
  sshTrust: { a: 'platform', refs: [pr(1131), pr(1136)],
    zh: { title: '平台 SSH 主机信任', desc: '平台统一管理受信任的 SSH 主机密钥，并分发到各执行机。' },
    en: { title: 'Platform SSH host trust', desc: 'Trusted SSH host keys are managed by the platform and distributed to every runner.' } },
  workspaces41: { a: 'delivery', refs: [pr(1046), pr(1042), pr(1026), pr(1096), pr(1127)],
    zh: { title: '个人对话工作区', desc: '每个人拥有独立的对话工作区，可按需刷新仓库上下文，并按对话恢复模型、推理强度和发送偏好。' },
    en: { title: 'Personal chat workspaces', desc: 'A private chat workspace for everyone, with on-demand repository context and per-conversation model, reasoning effort and send preferences.' } },
  cliLogin41: { a: 'access', refs: [is(1041), pr(1016), pr(1021), pr(1132)],
    zh: { title: 'CLI 订阅登录与托管更新', desc: '执行机支持 Antigravity 订阅登录并协调凭据刷新；托管更新扩展到六种 Agent CLI。' },
    en: { title: 'CLI subscription login and managed updates', desc: 'Runners sign in with Antigravity subscriptions and coordinate credential refresh; managed updates now cover six agent CLIs.' } },
  schedTokens: { a: 'delivery', refs: [pr(1123)],
    zh: { title: '定时任务 Token 统计', desc: '每次定时执行记录 Token 用量，并在仪表盘上汇总。' },
    en: { title: 'Token usage for scheduled jobs', desc: 'Each scheduled execution records its token usage, with totals on the dashboard.' } },
  /* ---------- shipped in v0.4.0 (v0.3.8...v0.4.0) ---------- */
  sandbox: { a: 'delivery', refs: [pr(947), doc('Docs', 'docs/conversation-workspaces.md')],
    zh: { title: '对话工作区跑在沙箱里', desc: '每个对话工作区在独立沙箱中打开，Agent 自己管理 Git 分支和提交。' },
    en: { title: 'Chat workspaces in sandboxes', desc: 'Each chat workspace opens in its own sandbox, and the agent owns its Git branch and commits.' } },
  clarify: { a: 'delivery', refs: [pr(965)],
    zh: { title: '直接创建需求并在对话中澄清', desc: '不必先走 SOP，可以直接创建需求，在对话里和 Agent 一起澄清。' },
    en: { title: 'Create and clarify requirements in chat', desc: 'Create a requirement directly and clarify it with an agent in a chat, without starting an SOP first.' } },
  mrNode: { a: 'delivery', refs: [pr(967), pr(974)],
    zh: { title: 'SOP 增加 MR 节点', desc: '内置代码交付 SOP 增加 MR 节点；项目 SOP 可以绑定到指定工作区运行。' },
    en: { title: 'MR step in delivery SOPs', desc: 'Built-in code delivery SOPs gain an MR step, and project SOPs can bind to a specific workspace.' } },
  schedHistory: { a: 'delivery', refs: [pr(958), pr(966), pr(546)],
    zh: { title: '定时任务执行历史', desc: '定时任务有了执行历史和会话模式，每个任务保留独立对话；无人值守运行更稳定，优先使用保存者的 Key。' },
    en: { title: 'Scheduled job history', desc: 'Execution history and session mode for scheduled jobs, one conversation per job, more reliable unattended runs using the saver\'s key first.' } },
  cliAuth: { a: 'access', refs: [pr(972), pr(183), pr(468)],
    zh: { title: 'CLI 鉴权、安装与诊断', desc: '执行机上管理 CLI 鉴权与维护；对话因缺少 CLI 失败时一键安装，并能导出单轮诊断。' },
    en: { title: 'CLI auth, install and diagnostics', desc: 'Manage CLI authentication on runners, install a missing CLI from a failed chat, and export per-turn diagnostics.' } },
  sshRepos: { a: 'access', refs: [pr(207)],
    zh: { title: 'SSH 仓库', desc: '支持 SSH 仓库，每个主机可以配置独立的用户密钥。' },
    en: { title: 'SSH repositories', desc: 'Use SSH repositories with a separate user key per host.' } },
};

/* Board snapshot as of each release, newest first; the first one is shown by default. */
const releases = [
  { v: 'v0.4.1-rc.1', date: '2026-11-20', updated: '2026-11-20', pre: true,
    planned: ['lifecycle', 'squads', 'sopPlus', 'assets', 'im', 'pool'],
    progress: ['rsi', 'approvals', 'cnb', 'gitlab'],
    done: ['creds41', 'sshTrust', 'workspaces41', 'cliLogin41', 'schedTokens'] },
  { v: 'v0.4.0', date: '2026-11-17', updated: '2026-11-18',
    planned: ['lifecycle', 'squads', 'sopPlus', 'assets', 'im', 'pool'],
    progress: ['rsi', 'approvals', 'workspaces', 'cnb', 'gitlab', 'cliLogin', 'creds'],
    done: ['sandbox', 'clarify', 'mrNode', 'schedHistory', 'cliAuth', 'sshRepos'] },
];

return { ui, areas, items, releases, GH };
})();
