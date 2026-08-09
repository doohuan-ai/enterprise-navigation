# @doohuan/enterprise-navigation

多焕 `www`、智搜货通和 API 控制台共用的 React 企业导航。包内只负责菜单结构、响应式布局、浮岛动画和移动抽屉；登录状态、用户菜单、控制台工具由宿主应用通过适配器传入。

## 安装

```bash
npm install "git+https://github.com/doohuan-ai/enterprise-navigation.git#v0.1.0"
```

使用 Bun 的项目：

```bash
bun add "git+https://github.com/doohuan-ai/enterprise-navigation.git#v0.1.0"
```

## 使用

```tsx
import {
  EnterpriseNavigation,
  type EnterpriseNavigationAuth,
} from "@doohuan/enterprise-navigation"
import "@doohuan/enterprise-navigation/styles.css"

const auth: EnterpriseNavigationAuth = {
  status: "anonymous",
  signInHref: "/login",
  registerHref: "/register",
}

export function Header() {
  return (
    <EnterpriseNavigation
      site="www"
      origins={{
        www: "https://www.doohuan.com",
        aips: "https://aips.doohuan.com",
        api: "https://api.doohuan.com",
      }}
      labels={labels}
      assets={{
        wordmarkSrc: "/logos/doohuan-wordmark.svg",
        iconSrc: "/logos/doohuan-icon.svg",
      }}
      auth={auth}
    />
  )
}
```

## 认证适配器

包不读取 Supabase、Zustand 或路由器。宿主应用负责把自己的状态转换为统一结构：

- `loading`：导航保留右侧空间，避免加载时跳动。
- `anonymous`：显示登录按钮，并在移动抽屉显示登录/注册入口。
- `authenticated`：显示宿主传入的 `desktopAuthenticated` 和 `mobileAuthenticated`。
- 控制台专属搜索、通知和设置通过 `slots.desktopActions` 注入。

这种边界确保三个站点共用一套导航行为，同时不让共享包依赖任一业务的认证 SDK。

## 开发与发布

```bash
npm install
npm run check
```

发布流程：

1. 更新版本号和变更说明。
2. 运行 `npm run check`。
3. 提交生成的 `dist/`。
4. 创建对应版本标签。
5. 两个宿主仓库升级到同一标签并完成生产验收。
