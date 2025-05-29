import React from 'react';
import Section from './components/layout/Section';
import Event from './components/elements/Event';
import Achievement from './components/elements/Achievement';
import Tag from './components/elements/Tag';
import List from './components/elements/List';
import Divider from './components/elements/Divider';
import ThemeProvider from './theme/ThemeProvider';
import Typography from './components/elements/Typography';
import Contact from './components/elements/Contact';
import { FaTrophy, FaEnvelope, FaPhone, FaGithub, FaHome } from 'react-icons/fa';
import { RiWechatFill } from "react-icons/ri";
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="cv-container">
        <div className="flex justify-between items-start gap-8 mb-4">
          <div className="flex-grow">
            <Typography variant="name" className='mb-1'>
              CornWorld
            </Typography>
            
            <Typography variant="tagline" className="mb-1">
              全栈开发工程师
            </Typography>

            <Contact.Root>
              <Contact.Item icon={<FaEnvelope />} href="mailto:job@corn.im">
                job@corn.im
              </Contact.Item>
              {/* <Contact.Item icon={<FaPhone />}>
                +86 XXX-XXXX-3800
              </Contact.Item> */}
              <Contact.Item icon={<FaGithub />} href="https://github.com/CornWorld">
                CornWorld
              </Contact.Item>
              <Contact.Item icon={<FaHome />} href="https://corn.li">
                Corn.Li
              </Contact.Item>
              
            </Contact.Root>
          </div>
          <div className="flex-shrink-0">
            <img
              src="/images/Globe_High.png"
              alt="CornWorld's photo"
              className="w-26 h-26 rounded-full object-cover border-[var(--color-cv-accent)]"
            />
          </div>
        </div>

        <Section title="技术能力">
          <List>
            <List.Item>熟悉 HTML / CSS / JS / TS 等前端开发语言；熟悉 TSX / Nestjs / Nextjs / Expressjs 框架/生态，尝试参与多个相关开源项目</List.Item>
            <List.Item>简单学习 OS 内核相关公开课，独立完成 MIT6.S081 (xv6-labs)</List.Item>
            <List.Item>熟练使用 Docker 等容器化技术，曾接触过 K3s / Rancher 等容器编排生态</List.Item>
            <List.Item>Minecraft 10 年玩家，常年游玩 Java 版(1.6-)，涉及模组生存 / 起床战争等玩法</List.Item>
            <List.Item>4 年使用 MCSM 经验，高版本 Forge 服 <a href='https://lsc.ungine.cn/'>文明之海 (lsc.ungine.cn)</a> 服主</List.Item>
          </List>
        </Section>

        <div className="cv-columns columns-2">
          <div className="w-3/5">
          <Section title="实习经历">
              <Event
                title="腾讯 WXG 微信小店 前端开发"
                organization="电商治理方向"
                icon={<RiWechatFill className='text-[#1AAD19] text-2xl'/>}
                date="2025.3 - 至今"
                location='广州，电商产品部'
              >
                <List>
                  <List.Item>完成 C 端群送礼场景中的 10+ 状态交易投诉流程页面</List.Item>
                  <List.Item>使用 Nest.js 为内部工单系统添加 LLM 客诉分析板块</List.Item>
                  <List.Item>基于 Babel 收集调用 Node.js 代码片上下文， 基于 LLM 能力生成可用的 Jest.js 单元测试，自动测试并评审更改代码</List.Item>
                </List>
              </Event>

            </Section>
            <Section title="项目一览">
              <Event
                title="DoveDesktop 前端桌面模拟器"
                organization="个人项目"
                date="2024.10 - 至今"
              >
                <List>
                  <List.Item marker={<FaGithub />} href="https://github.com/CornWorld/dove-desktop">
                    CornWorld/dove-desktop
                  </List.Item>
                  <List.Item>还原 Plasma Breeze 主题 视觉与交互体验的桌面环境模拟器</List.Item>
                  <List.Item>支持窗口管理，实现了任务栏、桌面图标等核心功能组件</List.Item>
                  <List.Item>技术栈： <span className='text-sm'>Solid(TSX) / React(TSX) & Zustand & SCSS & Emotion</span></List.Item>
                </List>
              </Event>

              <Divider />

              <Event
                title="VanBlog 全栈个人博客系统"
                organization="主要维护者"
                date="2022.05 - 至今"
                location="3.2K+ Stars"
              >
                <List>
                  <List.Item marker={<FaGithub />} href="https://github.com/mereithhh/vanblog">
                    mereithhh/vanblog
                  </List.Item>
                  <List.Item>基于 Next.js 与 Nest.js 的现代化全栈博客系统，内置管理面板、流量统计、图床及评论系统，Lighthouse 接近满分</List.Item>
                  <List.Item>负责下一代版本开发，累计提交 53 次上万行代码，重写多个包</List.Item>
                  <List.Item>技术栈：<span className='text-sm'>Next.js / Nest.js / React / Docker / Caddy</span></List.Item>
                </List>
              </Event>

              <Divider />

              {/* <Event
                title="cdMir 软件镜像下载站"
                organization="个人项目"
                date="2022.11 - 至今"
              >
                <List>
                  <List.Item marker={<FaGithub />} href="https://github.com/HadTeam/cdMir">
                    HadTeam/cdMir
                  </List.Item>
                  <List.Item>使用 React + SemantiUI 开发的软件镜像下载站</List.Item>
                  <List.Item>使用 Service Worker 优化缓存，目前性能极佳，Lighthouse 96+</List.Item>
                  <List.Item>技术栈：<span className='text-sm'>React(TSX) & SemanticUI & Node.js</span></List.Item>
                </List>
              </Event>

              <Divider /> */}

              <Event
                title="DreamCat 博客主题"
                organization="主要维护者"
                date="2021.2 - 至今"
                location="280+ Stars"
              >
                <List>
                  <List.Item marker={<FaGithub />} href="https://github.com/LychApe/DreamCat">
                    LychApe/DreamCat
                  </List.Item>
                  <List.Item>使用 PHP + MDUI + JQuery 开发的 Typecho 博客主题</List.Item>
                  <List.Item>审计代码、修复错误，优化前端兼容性与性能</List.Item>
                  <List.Item>技术栈：<span className='text-sm'>PHP & CSS3</span></List.Item>
                </List>
              </Event>
            </Section>
          </div>

          <div className="w-2/5 space-y-4">
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

            <Section title="个人能力">
              <div className='mb-1'>
                <Tag>持续学习</Tag>
                <Tag>分析挖掘信息</Tag>
                <Tag>适应需求</Tag>
              </div>
              <Divider />

              <div>
                <Tag>React</Tag>
                <Tag>Typescript & TSX</Tag>
                <Tag>Git & Github</Tag>
                <Tag>MUI</Tag>
                <Tag>Bootstrap</Tag>
                <Tag>Semantic</Tag>
                <Tag>Tailwind</Tag>
                <Tag>MCer</Tag>
              </div>
            </Section>

            <Section title="教育经历">
              <Event
                title="本科 数据科学与大数据技术"
                organization="某公办二本学院"
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
