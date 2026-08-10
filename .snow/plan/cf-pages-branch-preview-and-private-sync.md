# 多版本路由管理:CF Pages Git Integration + 分支预览 + 私有源码仓库

## Context(项目性质与研究结论)

**项目性质**:`alta-cv-react` 是个人简历静态站(Vite + React 19 + TS + Tailwind 4),已部署到 CF Pages(project=`cv`)。repo 为 public,无 GitHub Actions。

**研究结论**:

1. **"一个 branch 一个 URL" 是 CF Pages 原生能力,无需自建路由。**
   - push 到非 `main` 分支 → 唯一预览 URL:`<hash>.cv.pages.dev`(随机 hex)
   - 稳定别名:`<branch>.cv.pages.dev`(如 `frontend-ver.cv.pages.dev`)
   - `main` → 生产 `cv.pages.dev`。预览带 `noindex`,不污染 SEO。

2. **使用 CF Git Integration 而非 GitHub Actions** —— 更简单:
   - CF 通过 GitHub App 直连 private repo,`push` 即自动构建部署,**零 Token 零 Action 零代码**。
   - 支持 private repo + pnpm(自动检测 `pnpm-lock.yaml`)。
   - 构建在 CF 服务器上进行,与 `wrangler pages deploy` 输出一致。
   - 唯一的 Action:`sync-public.yml`(main → public 镜像同步,需 1 个 PAT)。

3. **"分支不 public"**:GitHub 无单分支私有。路径:
   - 新建 **private 源码仓库**(所有分支,CF Git Integration 连这里)
   - 当前 public repo 保留为**镜像**(仅 `main`,由唯一一个 Action 同步)

## 检查结果

- `gh` CLI:✅ 已认证 CornWorld,scope 含 `repo`。可直接 `gh repo create` + `gh secret set`。

## 仓库拓扑

```
┌─────────────────────────────────┐   sync main only (1 Action)   ┌──────────────────────────────┐
│  CornWorld/alta-cv-react-private │ ────────────────────────────▶ │  CornWorld/alta-cv-react       │
│  (新建 private · 源码仓库)        │    GitHub Action              │  (当前 repo · public · 镜像)   │
│                                 │                                │                              │
│  · 所有分支 (main + dev + ...)   │                                │  · 仅 main                    │
│  · sync-public.yml (唯一 Action) │                                │  · 只读,仅供公开查阅            │
│  · 无需 CF token                │                                │  · 无 CF Git Integration       │
│  · 无需 deploy workflow         │                                │  · 无 workflow                 │
└─────────────────────────────────┘                                └──────────────────────────────┘
           │
           │ GitHub App (CF Git Integration · 零 Token)
           ▼
┌──────────────────────┐
│  Cloudflare Pages    │
│  project: cv         │
│  Build cmd: pnpm build│
│  Output dir: dist    │
│  main → cv.pages.dev │
│  branch → <hash>.cv.pages.dev │
└──────────────────────┘
```

## Phases

### Phase 1:创建 private 源码仓库 + 重配本地 remote

- **Goal**:建立 private source + public mirror 双仓库拓扑,本地工作目录指向 private。
- **工具**:`gh` CLI(已认证)。
- **Steps**:
  - [ ] **1.1** `gh repo create CornWorld/alta-cv-react-private --private --clone=false`
  - [ ] **1.2** `git remote add private git@github.com:CornWorld/alta-cv-react-private.git`
  - [ ] **1.3** `git push private --all`(把 main + ospp 分支全部推入 private)
  - [ ] **1.4** 重命名远程:`git remote rename origin public-mirror`(当前 public 变镜像 remote),`git remote rename private origin`(private 变默认 remote)
  - [ ] **1.5** 验证:`git remote -v` → origin=private,public-mirror=旧 public
- **Done when**:`git push origin` 推到 private;GitHub 上 private repo 可见所有分支;public 仓库不变。

### Phase 2:CF Pages Git Integration 连接 private repo

- **Goal**:CF 直连 private repo,每次 push 自动构建并部署,main→生产,其他→预览 URL。
- **说明**:这个 Phase 大部分在 CF Dashboard 操作,无需写代码。
- **Steps**:
  - [ ] **2.1** 登录 CF Dashboard → Workers & Pages → 进入项目 `cv` → Settings → Git Integration。
  - [ ] **2.2** 连接 private repo `CornWorld/alta-cv-react-private`(CF 安装 GitHub App,授权访问 private repo)。
  - [ ] **2.3** 配置构建:
    - **Production branch**:`main`
    - **Build command**:`pnpm build`
    - **Build output directory**:`dist`
    - **Root directory**:(留空,即仓库根目录)
  - [ ] **2.4** CF 自动检测 `pnpm-lock.yaml`,使用 pnpm 安装(确认 CF 构建日志中显示 pnpm)。
  - [ ] **2.5** 断开 public repo 的 Git Integration(如果之前连过):CF Dashboard → Settings → Git → Disconnect。
  - [ ] **2.6** push 测试:local push 到 private repo → 观察 CF Dashboard → Deployments 出现新构建。
- **Done when**:push main → cv.pages.dev 更新;push `frontend-ver` → `<hash>.cv.pages.dev` + `frontend-ver.cv.pages.dev` 出现。

### Phase 3:唯一 Action — main 自动同步到 public 镜像 + 清理 public

- **Goal**:private main 自动同步到 public mirror;public repo 干净无部署。
- **文件**:`.github/workflows/sync-public.yml`(在 private repo 中,这是整个项目唯一的 Workflow 文件)。
- **Steps**:
  - [ ] **3.1** 确认 public 仓库没有 `.github/workflows/`(当前不存在,保持)。
  - [ ] **3.2** 确认 CF Dashboard → project `cv` → Git Integration **只连 private repo**(Phase 2 已做)。
  - [ ] **3.3** 创建 PAT:
    - GitHub Settings → Fine-grained tokens → 仅选 public repo `CornWorld/alta-cv-react` → Permissions: `Contents: Read and write` → 复制 token。
  - [ ] **3.4** `gh secret set PUBLIC_REPO_PAT --repo CornWorld/alta-cv-react-private`
  - [ ] **3.5** 在 private repo 新建 `sync-public.yml`,push + 验证 main 自动同步。
  - [ ] **3.6** 可选:public repo → Settings → Branches → main 设分支保护(禁止直接 push)。
- **Done when**:push main 到 private → public main 自动同步;public repo 无任何 workflow;CF 只从 private repo 构建。

**sync-public.yml**(整个项目唯一的 Workflow):
```yaml
name: Sync main to public mirror
on:
  push:
    branches: [main]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Push main to public mirror
        env:
          PAT: ${{ secrets.PUBLIC_REPO_PAT }}
        run: |
          git push https://x-access-token:${PAT}@github.com/CornWorld/alta-cv-react.git main
```

## 总结:极简方案

| 组件 | 方案 | Secret 数量 |
|------|------|------------|
| 分支部署(全分支 → URL) | CF Git Integration | 0 |
| main → public 镜像同步 | GitHub Action | 1 (PUBLIC_REPO_PAT) |
| **总计** | | **1** |

没有 deploy.yml,没有 CLUDFLARE_API_TOKEN,没有 CLOUDFLARE_ACCOUNT_ID。三个 Phase 下来,private repo 里只有一个 `sync-public.yml`。

## Risks & Mitigations

| 风险 | 影响 | 缓解 |
|------|------|------|
| CF Git Integration pnpm 检测失败 | 构建失败 | `.nvmrc` 指定 Node 版本;CF 支持 `pnpm-lock.yaml` 自动切换 |
| 双仓库 main 分叉 | 镜像不一致 | sync fast-forward 确保线性;public 设分支保护 |
| ospp-* 分支触发 CF 预览 | 无关内容部署 | 删除或排除 |
| PAT 泄露 | public 被改写 | 细粒度 PAT,仅单仓库 Contents write |
| public repo CF 集成残留 | public 也被构建 | Phase 2.5 断开,Phase 3.2 确认 |

## Rollback Strategy

- **Phase 1**:`gh repo delete` → rename remotes 回到现状。代码无损。
- **Phase 2**:CF Dashboard 断开 Git Integration → 回退到手动 `pnpm deploy`。
- **Phase 3**:撤销 PAT → 同步中断 → 手动 `git push public-mirror main` 对齐。

## Completion Summary

**Status**:(执行后填写)
**Phases**: /3

### Results
(执行后填写)

### Deviations
(执行后填写)

### Verification
- [ ] Phase 1:origin→private,public-mirror→旧 public;private repo 含所有分支
- [ ] Phase 2:push main → cv.pages.dev;push 其他分支 → `<hash>.cv.pages.dev` + `<branch>.cv.pages.dev`
- [ ] Phase 3:push main 到 private → public main 自动同步;public 无 workflow 无 CF 连接
