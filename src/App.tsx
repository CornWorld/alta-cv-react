import Section from "./components/layout/Section";
import Event from "./components/elements/Event";
import Achievement from "./components/elements/Achievement";
import Tag from "./components/elements/Tag";
import List from "./components/elements/List";
import Divider from "./components/elements/Divider";
import SideProject from "./components/elements/SideProject";
import ThemeProvider from "./theme/ThemeProvider";
import Typography from "./components/elements/Typography";
import Contact from "./components/elements/Contact";
import {
  FaTrophy,
  FaEnvelope,
  FaPhone,
  FaGithub,
  FaHome,
} from "react-icons/fa";
import { RiWechatFill } from "react-icons/ri";
import "./App.css";
import PrintUrl from "./components/elements/PrintUrl";

function App() {
  return (
    <ThemeProvider>
      <div className="cv-container">
        <PrintUrl />
        <div className="flex justify-between items-start gap-8 mb-4">
          <div className="flex-grow">
            <Typography variant="name" className="mb-1">
              CornWorld
            </Typography>

            <Typography variant="tagline" className="mb-1">
              全栈开发工程师 | 擅长与 Agent 协作治理，将 Agent 融入工具链
            </Typography>

            <Contact.Root>
              <Contact.Item icon={<FaEnvelope />} href="mailto:job@corn.im">
                job@corn.im
              </Contact.Item>
              <Contact.Item icon={<FaPhone />}>
                +86 XXX-XXXX-3800
              </Contact.Item>
              <Contact.Item icon={<FaHome />} href="https://corn.im">
                Corn.Im
              </Contact.Item>
              <Contact.Item
                icon={<FaGithub />}
                href="https://github.com/CornWorld"
              >
                CornWorld
              </Contact.Item>
            </Contact.Root>
          </div>
          <div className="flex-shrink-0">
            <img
              src="./images/Globe_High.png"
              alt="CornWorld's photo"
              className="w-26 h-26 rounded-full object-cover border-[var(--color-cv-accent)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 cv-layout-grid gap-[var(--cv-column-gap)]">
          <div className="cv-layout-main">
            <Section title="实习经历">
              {/* 内部平台名等仍脱敏；公司信息保留 */}
              <Event
                title="腾讯 WXG 微信小店 电商治理 全栈开发"
                icon={
                  <RiWechatFill className="text-[#1AAD19] text-2xl" />
                }
                date="2025.03 - 至今"
                location="广州，电商产品部"
              >
                <Event
                  title="电商数据基建 · 商品基建"
                  organization="质量门禁 & Agent 排障"
                  date="2025.05 - 至今"
                  inlineMeta
                >
                  <List>
                    <List.Item>
                      AI 介入编码后产出提速，但人工 Review 难以逐行覆盖，曾因字段漏初始化致线上小程序白屏。遂搭建提交前
                      WXML/TS AST 质量门禁（
                      <strong>覆盖 18 页面实测约 0.36 秒</strong>
                      ），并整理开源为
                      <a
                        href="https://github.com/CornWorld/prettier-plugin-mp"
                        className="break-keep"
                      >
                        prettier-plugin-mp
                      </a>
                    </List.Item>
                    <List.Item>
                      编写排障 SOP，通过 MCP 聚合代码库、监控与网关日志，生成初步根因判断。上线
                      6 个月，首次定位命中率 67%，同期全链路 MTTR ⬇32%
                    </List.Item>
                  </List>
                </Event>

                <Divider />

                <Event
                  title="内部 AI 开发平台"
                  organization="把锁在网页编辑器里的 AI 开发流程，接回标准 Git 工作流"
                  date="2026.06 - 2026.07"
                  inlineMeta
                >
                  <List>
                    <List.Item>
                      网页编辑器内开发局限大：本地 Agent
                      工具链难以介入，平台自动同步还曾把开发分支改动污染进主干（万行级、须人工回滚）。
                      主动排查发现平台存储底层即为 Git
                      对象模型，遂实现客户端协议翻译层（Git remote
                      helper），将本地 git 命令转译为平台 RESTful API
                      调用，不改服务端即获得 git clone / push / pull 能力
                    </List.Item>
                    <List.Item>
                      平台 API 存在读不全、写不报错的设计问题。通过校验闭环、从各分支
                      HEAD 图遍历补全缺失对象，实现{" "}
                      <strong>58K 对象大型仓库克隆完整</strong>
                    </List.Item>
                    <List.Item>
                      官方编译器仅为浏览器 WASM 环境设计，本地无法直接运行。不
                      fork 源码，用 Node.js 模块加载 hook
                      在运行时把依赖替换为原生
                      esbuild（官方包零改动，升级可直接跟进），支持 HMR
                      热更新。
                      <strong>生产项目实测首次构建 1.6s</strong>
                      ，预览效果与线上对齐
                    </List.Item>
                    <List.Item>
                      补齐本地开发全流程：git pull 到本地 → IDE / Coding
                      Agent 开发并实时预览 → push 回平台
                    </List.Item>
                  </List>
                </Event>
              </Event>
            </Section>

            <Section title="开源项目">
              <Event
                title="VanBlog 博客系统（GitHub 3.6K stars）"
                organization="Nest.js / Next.js / Go / PocketBase / Astro"
                date="2026.06 - 2026.08"
                inlineMeta
              >
                <List>
                  <List.Item>
                    <span className="font-bold">重写背景：</span>
                    <a href="https://github.com/mereithhh/vanblog">
                      主要贡献者停更
                    </a>
                    后，自发接手，用 Go + PocketBase + Astro
                    从零重写下一代版本（后端瘦身 5012 → 1089
                    行，单测覆盖 51%，完整实现已有全部功能）
                  </List.Item>
                  <List.Item>
                    <span className="font-bold">允许用户 Agent 介入研发：</span>
                    主题或插件升级后，用户的 override 定制可能失效。
                    将按改动位置匹配 Diff 判定规则封装为 MCP
                    工具，先输出结构化报告，
                    再由用户 Coding Agent 据此核对并修复
                  </List.Item>
                  <List.Item>
                    <span className="font-bold">Agent 介入研发：</span>
                    约 5 万行项目代码 99% 由 AI 生成并保证质量。
                    建立四级质量门禁控制交付风险：开发时以项目 Rules + Skill
                    约束生成，提交前由 11 个 linter 静态扫描，
                    合入后由 AI Review 补漏，发版前人工执行全流程验收。
                    累计发现 83 处静态问题，含 6 处生产静默失败与 3 处 XSS
                    等严重问题
                  </List.Item>
                  <List.Item>
                    <span className="font-bold">生成-验证 Harness：</span>
                    设计实验环境，实现用户侧 AI 生成仿真验证流程。
                    实现 One-shot prompt 驱动内置 agent
                    从零生成含前后端的插件（PoW 防刷校验 API + 前端注入脚本）
                  </List.Item>
                </List>
              </Event>
            </Section>
          </div>

          <div className="cv-layout-side space-y-4">
            <Section title="个人项目">
              <SideProject
                title="DoveDesktop 桌面模拟器"
                repo="CornWorld/dove-desktop"
                href="https://github.com/CornWorld/dove-desktop"
                tech="Solid / React / Zustand / SCSS"
              >
                还原 KDE Plasma Breeze
                视觉与交互，支持窗口管理、任务栏等核心组件
              </SideProject>
            </Section>

            <Section title="技术能力">
              <List>
                <div>
                  <Tag>Go</Tag>
                  <Tag>TS</Tag>
                  <Tag>MCP</Tag>
                  <Tag>Harness</Tag>
                  <Tag>StateGraph</Tag>
                  <Tag>Claude Code</Tag>
                </div>
                <List.Item className="text-sm">
                  具备 Agent 评测 Harness 经验：支持 Spec 驱动、沙箱隔离、确定性评测与断点续传
                </List.Item>
                <List.Item className="text-sm">
                  搭建 AST 质量门禁，结合静态分析与类型推断，编译层拦截大模型代码幻觉与缺陷
                </List.Item>
                <List.Item className="text-sm">
                  深入落地 MCP 协议生态，开发排障 RCA Agent；落实网关鉴权、只读隔离与白名单
                </List.Item>
                <List.Item className="text-sm">
                  掌握 Agent 自反思闭环与 Sub-Agent
                  协作，实现“报错反馈-上下文注入-自愈修复”
                </List.Item>
                <List.Item className="text-sm">
                  熟悉 DAG 状态机编排，实现动态条件路由、指数退避重试（Jitter）与人机审批（HITL）
                </List.Item>
                <List.Item className="text-sm">
                  熟练 Go/TS 全栈开发与 Git 底层协议，掌握运行时 Hook，完成 MIT 6.S081 内核实验
                </List.Item>
              </List>
            </Section>

            <Section title="奖项">
              <Achievement
                icon={FaTrophy}
                title="第十五届蓝桥杯决赛 二等奖"
                description="算法竞赛，软件赛 C++ 组，大学B组"
              />
              <Achievement
                icon={FaTrophy}
                title="信息学奥赛 NOIP 二等奖"
                description="算法竞赛，2021年，全国前 66.13%"
              />
              <Achievement
                icon={FaTrophy}
                title="信息学奥赛 CSP-S 二等奖"
                description="算法竞赛，2021年，全国前 51.42%"
              />
            </Section>

            <Section title="教育经历">
              <Event
                title="本科 数据科学与大数据技术"
                organization="门头沟学院（匿名）"
                date="2023.9 - 2027.9"
                location="在读，全日制"
              />
            </Section>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
