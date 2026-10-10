# SLOOP Editor Desktop

<img src="app/sloop-icon.png" width="128" alt="SLOOP Editor icon">

An unofficial offline Windows desktop wrapper for the [SLOOP FM-1 web editor](https://github.com/isod89/sloop-fm1), built with Electron. 一个可离线运行的 SLOOP FM-1 Windows 桌面编辑器。

Includes a Windows x64 installer and portable executable, local editor resources, and Web MIDI/SysEx support. This is a hardware editor, not a software synthesizer. The editor interface follows upstream; the desktop icon uses an iOS-style rounded design.

## Use

1. Connect the M-VAVE FM-1 directly with a USB data cable.
2. Close other MIDI applications and browser tabs that may be using it.
3. Start SLOOP Editor and press **Connect**.
4. Approve MIDI/SysEx access if Windows or Chromium asks.

## Development

Prerequisites: Windows 10/11 x64, Node.js 24 and pnpm 11.25.0. Packages are generated in `dist/`.

```powershell
pnpm install --frozen-lockfile
node node_modules/electron/install.js
pnpm run check
pnpm start
pnpm run dist
```

The app loads the editor from local packaged files and opens external links in
the system browser. Node.js integration is disabled in the editor window.

If GitHub downloads time out, set ELECTRON_MIRROR to
https://npmmirror.com/mirrors/electron/ before installing the runtime; the
download is checked against the checksums bundled with the Electron package.
For packaging, ELECTRON_BUILDER_BINARIES_MIRROR can be set to
https://npmmirror.com/mirrors/electron-builder-binaries/.

## Ableton Live / MIDI port sharing

The user has successfully connected this editor and Ableton Live simultaneously on their Windows setup. Compatibility can depend on the MIDI driver and application state. If a connection fails, close other MIDI applications and retry to check for port contention; changing MIDI channels does not resolve port ownership.

The upstream Disconnect action does not explicitly close the MIDI ports. Fully exit the editor when another application needs the device. Changing MIDI channels does not resolve port ownership.

用户已在自己的 Windows 环境中实测 Live 与编辑器可以同时连接。如果偶发连接失败，可退出其他 MIDI 程序后重试，排查临时端口占用；无需默认更改接线。

## Validation and limitations

Validated: offline UI startup, Web MIDI availability, SysEx permission and device enumeration including a `Felucca` input. Simultaneous connection with Ableton Live is user-confirmed on one Windows setup. Hardware parameter writes, backup restore and firmware flashing have not been independently validated. Windows executables are unsigned and may show an unknown-publisher warning.

## Upstream and license

Source: [isod89/sloop-fm1](https://github.com/isod89/sloop-fm1), revision `fa9ce5742f4aea9484e7c129dd81079d07e7321f`.

SLOOP is based on Felucca by Leo Kuroshita (@kurogedelic), Hügelton Instruments. This is an independent desktop wrapper, not an official M-VAVE or Hügelton release.

Code is licensed under **GPL-3.0-only**. See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Font licenses are included in `app/`. The desktop icon was adapted from the user-supplied logo. The bundled editor's firmware installer link was changed to an absolute URL.
