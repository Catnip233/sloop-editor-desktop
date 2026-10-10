# SLOOP Editor Desktop

<img src="app/sloop-icon.png" width="128" alt="SLOOP Editor 图标">

只是想让 SLOOP 网页编辑器用起来更方便一点。

平时使用时，我觉得每次打开网页不太方便，所以用 Electron 把它封装成了桌面 App。下载后像普通软件一样打开，就可以使用编辑器，网页资源也已经放在本地。

**我只是做了搬运和桌面封装，编辑器的核心功能、界面与设备通信逻辑都来自原项目。感谢原作者的开发和开源分享。**

## 感谢原作者

- **[isod89 / sloop-fm1](https://github.com/isod89/sloop-fm1)**：SLOOP 固件和网页编辑器，本项目直接使用其编辑器源码。
- **[Leo Kuroshita（@kurogedelic）](https://github.com/kurogedelic) / [Hügelton Instruments](https://hugelton.com)**：Felucca 原作者，SLOOP 所基于的项目。

如果你觉得这个软件有用，欢迎去原项目点个 Star，支持真正完成这些功能的作者。

这是一个非官方桌面封装，与原作者及 M-VAVE 没有官方关联。

## 下载与使用

从 **[Releases](https://github.com/Catnip233/sloop-editor-desktop/releases)** 下载安装包。最新云端构建也可在 **[GitHub Actions](https://github.com/Catnip233/sloop-editor-desktop/actions/workflows/build.yml)** 的 Artifacts 中下载（需要登录 GitHub）。

- Windows：`Setup.exe` 为安装版，`Portable.exe` 为免安装版。
- macOS：`arm64.dmg` 适用于 Apple Silicon，`x64.dmg` 适用于 Intel Mac；以实际发布的附件为准。

1. 用 USB 数据线连接运行兼容 SLOOP 固件的 FM-1。
2. 打开 SLOOP Editor，点击左下角 **connect**。
3. 连接成功后即可编辑。

日常编辑不需要联网。固件安装链接会在默认浏览器中打开原项目的在线页面。这是硬件编辑器，需要配合 FM-1 使用。

Windows 包没有商业代码签名；Mac 包没有 Apple Developer 签名和公证，首次打开可能遇到系统提示。Mac 的真实硬件连接仍待测试。

## 本地构建

需要 Node.js 24 和 pnpm 11.25.0。Windows 包建议在 Windows 构建，macOS 包在 macOS 构建；仓库也提供 GitHub Actions 云端打包流程。

```sh
pnpm install --frozen-lockfile
node node_modules/electron/install.js
pnpm run check
pnpm start
```

生成安装包：

```sh
# Windows x64：安装版和免安装版
pnpm run dist

# Mac Apple Silicon
pnpm exec electron-builder --mac --arm64 --publish never

# Mac Intel
pnpm exec electron-builder --mac --x64 --publish never
```

产物位于 `dist/`。

## 来源与许可证

本项目使用的上游版本：[`fa9ce5742f4aea9484e7c129dd81079d07e7321f`](https://github.com/isod89/sloop-fm1/tree/fa9ce5742f4aea9484e7c129dd81079d07e7321f)。

代码遵循 **GPL-3.0-only**，保留原项目署名与许可证。详见 [LICENSE](LICENSE) 和 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)，字体许可证位于 `app/`。

桌面封装增加了应用窗口、MIDI 权限处理、安装包配置和圆角应用图标；编辑器中的固件安装链接改为指向原项目的完整网址。
