# Project Ninteimoto - Intro Demo

这是一个沉浸式的项目展示页面（Landing Page），旨在展示 "Project Ninteimoto" 的核心概念、游戏机制、美术设定以及技术实现。

本项目基于 **Next.js 16** 构建，结合了 **Three.js** 3D 场景渲染与 **Framer Motion** 交互动画，打造流畅的视觉体验。

## ✨ 特性 (Features)

- 🎮 **沉浸式 3D 场景**: 使用 React Three Fiber 渲染的 "Sakura Classroom" 和 "Sentient Sphere" 场景。
- 🎬 **多媒体展示**: 集成了视频背景、角色语音试听 (Audio Visualization) 和概念美术画廊。
- ⚡ **高性能动画**: 深度集成了 Framer Motion 实现平滑的滚动和组件进入动画。
- 🎨 **现代 UI 设计**: 基于 Tailwind CSS 和 Radix UI 构建的响应式界面，支持深色/科技风格。
- 📱 **完全响应式**: 适配桌面端和移动端设备的浏览体验。

## 🛠 技术栈 (Tech Stack)

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **语言**: TypeScript
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **3D 渲染**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) / [Drei](https://github.com/pmndrs/drei)
- **UI 组件**: [Radix UI](https://www.radix-ui.com/)
- **包管理**: pnpm

## 🚀 快速开始 (Getting Started)

### 1. 克隆项目
```bash
git clone https://github.com/your-username/project-intro-demo.git
cd project-intro-demo
```

### 2. 安装依赖
本项目推荐使用 `pnpm`，因为包含 `pnpm-lock.yaml`。

```bash
# 使用 pnpm (推荐)
pnpm install

# 或者使用 npm
npm install
```

### 3. 运行开发服务器

```bash
pnpm dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可预览。

## 📂 项目结构 (Project Structure)

```bash
├── app/                  # Next.js App Router 页面路由
├── components/           # React 组件
│   ├── ui/               # 基础 UI 组件 (Button, Card 等)
│   ├── sakura-classroom/ # 3D 教室场景组件
│   ├── concept-section   # 概念展示区块
│   └── ...               # 其他功能区块
├── public/               # 静态资源
│   ├── audio/            # 语音和背景音乐
│   ├── images/           # 图片资源
│   └── videos/           # 演示视频
└── lib/                  # 工具函数和公共配置
```

## 📦 部署 (Deployment)

推荐使用 [Vercel](https://vercel.com/new) 进行部署，这是 Next.js 的官方部署平台，拥有最佳的兼容性。

1. 将代码推送到 GitHub。
2. 在 Vercel 中导入该仓库。
3. 点击部署即可（无需额外配置）。

或者构建静态文件：

```bash
pnpm build
```

## 📄 License

[MIT](LICENSE)
