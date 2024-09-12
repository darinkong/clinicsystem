# 社区门诊系统

### 介绍 📖

本项目是一款专为社区门诊设计的轻量级管理系统，基于 Vue 3、TypeScript、Pinia、Element Plus 和 ECharts 实现。系统提供了病患信息管理、日程提醒、健康数据可视化等功能，能够满足日常的社区门诊工作需求，并通过简洁的界面和高效的数据管理提升医护人员的工作效率。项目采用本地存储技术，保证数据的持久化与快速响应，适合轻量化的前端应用场景。

### 项目功能 🔨

- 使用 **Vue 3** 和 **TypeScript** 构建现代化前端架构
- 集成 **Pinia** 作为状态管理，确保数据同步与管理
- 使用 **Element Plus** 提供简洁、高效的 UI 组件
- 使用 **ECharts** 实现健康数据的可视化，支持心率、血压、体温等数据的展示
- 支持病患信息的增删改查（CRUD）功能
- 提供日程提醒功能，帮助医生及时跟进病患预约
- 实现了本地存储（localStorage）功能，确保数据持久化管理
- 使用 **Vue Router** 实现动态路由，支持根据病患 ID 生成个性化数据展示页面
- 系统设计轻量、易用，便于后续扩展和功能迭代

### 项目技术栈 📚

- **Vue 3**：前端框架，用于构建用户界面
- **TypeScript**：增强代码的类型安全
- **Pinia**：Vue 3 的状态管理库，用于管理全局数据状态
- **Element Plus**：Vue 3 的 UI 组件库，提供丰富的表单和交互组件
- **ECharts**：用于绘制数据可视化图表，展示健康数据
- **Vue Router**：用于管理前端路由，实现动态路由和页面跳转

### 安装使用步骤 📔

#### Clone

```bash
# GitHub
git clone https://github.com/darinkong/clinicsystem.git
```

pnpm install
pnpm dev
pnpm serve

# 开发环境

pnpm build:dev

# 测试环境

pnpm build:test

# 生产环境

pnpm build:pro

# eslint 检测代码

pnpm lint:eslint

# prettier 格式化代码

pnpm lint:prettier

# stylelint 格式化样式

pnpm lint:stylelint

# 提交代码（提交前会自动执行 lint:lint-staged 命令）

pnpm commit


 
 
