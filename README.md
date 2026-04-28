<div align="center">

# 🌸 @neelegirly/baileys 🌸

### *Die WhatsApp Web API mit sauberem Neelegirly-Glow-up*
### *QR Branding · Wrapper-Aware Update Notify · LID · Smart Queue*

[![Version](https://img.shields.io/badge/Version-2.2.19-ff69b4?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@neelegirly/baileys)
[![wa-api](https://img.shields.io/badge/wa--api-1.8.4-c77dff?style=for-the-badge)](https://www.npmjs.com/package/@neelegirly/wa-api)
[![libsignal](https://img.shields.io/badge/libsignal-1.0.28-f4a261?style=for-the-badge)](https://www.npmjs.com/package/@neelegirly/libsignal)
[![Node](https://img.shields.io/badge/Node-16+-4caf50?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![npm](https://img.shields.io/npm/v/%40neelegirly%2Fbaileys?style=for-the-badge&color=ff69b4&logo=npm)](https://www.npmjs.com/package/@neelegirly/baileys)

<p align="center">
  <img src="https://files.catbox.moe/5bqumy.jpeg" width="780" alt="@neelegirly/baileys Hero" />
</p>

<p align="center"><sub>2026 Glow-Up Edition · frische WA-API- und USync-Patches · Companion-Stack auf <strong>2.2.19 / 1.8.4 / 1.0.28</strong></sub></p>

[**Installation**](#-installation) · [**Quickstart**](#-quickstart) · [**Highlights**](#-highlights) · [**QR Branding**](#-qr-branding--update-status) · [**Migration**](#-namespace-migration) · [**Release Notes**](#-release-notes-2219)

</div>

---

Neelegirlys Variante von Baileys ist die WhatsApp-Web-Basis für stabile Bots, schöne QR-Flows und einen sauber gepinnten Multi-Session-Stack. Die Library bleibt nah an Baileys, aber mit fokussiertem Branding, Update-Notify und Begleit-Ökosystem für `@neelegirly/wa-api`.

> Hinweis: Dieses Projekt ist nicht offiziell mit WhatsApp, Meta oder Baileys-Upstream verbunden.

---

## ✨ Highlights

| Feature | Beschreibung | Status |
| --- | --- | --- |
| 💖 Multi-Device API | WhatsApp Web auf Node.js mit Event-Flow | ✅ |
| 📷 QR Branding | Header/Footer + Wrapper-/Versionskontext direkt im QR-Flow | ✅ |
| 🔔 Wrapper-Aware Update Notify | Status für Baileys **und** optionalen Wrapper-Kontext | ✅ |
| 🚀 Smart Queue | Retries, Prioritäten und Bulk-Sending für produktive Setups | ✅ |
| 🧷 LID / Session-Fokus | passend für moderne Multi-Device-/Linked-ID-Flows | ✅ |
| 🎀 Neelegirly Scope | sauber auf `@neelegirly/*` ausgerichtet | ✅ |

---

## 🆕 Was sich in `v2.2.19` geändert hat

- ✅ Aktuelle Baileys-Upstream-Fixes vom 24./25. April 2026 sauber übernommen
- ✅ AB-Props-Query nutzt wieder den aktuellen `abt`/Protocol-1-Flow
- ✅ Username-Felder in Contacts, Gruppenmetadaten, Message Keys und USync ergänzt
- ✅ App-State-Sync robuster bei fehlenden Keys, Snapshot-Retry und Reconnects
- ✅ Call-Events, Album-Messages und History/Media-Streaming erweitert

---

## 📦 Kompatibilität

| Paket | Empfohlene Version |
| --- | --- |
| `@neelegirly/baileys` | `2.2.19` |
| `@neelegirly/wa-api` | `1.8.4` |
| `@neelegirly/libsignal` | `1.0.28` |

---

## 🚀 Installation

### npm

```bash
npm install @neelegirly/baileys@2.2.19 @neelegirly/libsignal@1.0.28 --save-exact
```

### yarn

```bash
yarn add @neelegirly/baileys@2.2.19 @neelegirly/libsignal@1.0.28 --exact
```

### pnpm

```bash
pnpm add @neelegirly/baileys@2.2.19 @neelegirly/libsignal@1.0.28 --save-exact
```

> Für den kompletten Neelegirly-Stack passt dazu `@neelegirly/wa-api@1.8.4`.

---

## ⚡ Quickstart

```ts
import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  Browsers
} from '@neelegirly/baileys'

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    version,
    browser: Browsers.ubuntu('Chrome'),
    printQRInTerminal: true
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      console.log('Verbunden 💖')
      return
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode
      const isLoggedOut = statusCode === DisconnectReason.loggedOut

      if (!isLoggedOut) start().catch(console.error)
    }
  })
}

start().catch(console.error)
```

> Direktes `sock.ev.on('creds.update', saveCreds)` ist für kleine Demos okay. In produktiven Multi-Session-Setups sollten Credential-Saves gebündelt oder debounced werden.

---

## 🧩 Companion Stack

| Paket | Rolle |
|------|-------|
| `@neelegirly/baileys 2.2.19` | Socket, Events, Messaging |
| `@neelegirly/libsignal 1.0.28` | Signal-Protokoll-Komponente |
| `@neelegirly/wa-api 1.8.4` | Lifecycle-, Session- und Update-Wrapper |

---

## 🩷 QR Branding & Update Status

Beim QR-Scan werden automatisch Markenzeilen oberhalb und unterhalb des QR-Codes ausgegeben. Die Ausgabe liest Versionen dynamisch aus `package.json`, verarbeitet Update-Status robust und kann zusätzlich Wrapper-Kontext aus `@neelegirly/wa-api` darstellen.

Typische Anzeige:

- `Baileys Update-Status: up to date (2.2.19)`
- `Wrapper Update-Status: up to date (1.8.4)`
- Bei echten Updates werden kompakte Hinweise auf `latest` eingeblendet

Wenn kein Wrapper-Kontext vorhanden ist, bleibt die Anzeige sauber bei Baileys. Kein unnötiges Drama, nur QR. ✨

---

## 🔄 Update-Check

- Quelle 1: npm Registry (`registry.npmjs.org`)
- Quelle 2: GitHub Releases (`neelegirly/baileys`) als Fallback
- Fehler und Timeouts werden abgefangen, ohne den Prozess zu stoppen
- Semver-Vergleich wird numerisch ausgewertet
- Wrapper-Status kann über die von `@neelegirly/wa-api` gesetzten Umgebungsvariablen übernommen werden

Wenn du direkt prüfen willst:

```ts
import { checkNpmVersion } from '@neelegirly/baileys'

const info = await checkNpmVersion('@neelegirly/baileys', '2.2.19', {
  githubRepo: 'neelegirly/baileys'
})

console.log(info)
```

---

## 🌐 Namespace-Migration

Wenn du vom Upstream kommst, nutze den Neelegirly-Scope:

```diff
- import makeWASocket from '@whiskeysockets/baileys'
+ import makeWASocket from '@neelegirly/baileys'
```

---

## 📝 Release Notes `2.2.19`

- 🔧 Upstream-Änderungen vom 24./25. April 2026 portiert, ohne QR-/Update-Notify- oder Message-ID-Handling umzubauen
- 🧩 Username-USync und Inbound-Username-Felder für Kontakte, Gruppen und Message Keys ergänzt
- 🛡️ App-State-Sync und libsignal-LID/PN-Typen robuster gemacht
- 🖼️ Album-Message-Sending und erweiterte Call-Event-Typen ergänzt
- 🔗 Companion-Stack auf `2.2.19 / 1.8.4 / 1.0.28` aktualisiert
