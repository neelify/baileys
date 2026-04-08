<div align="center">

# 🌸 @neelegirly/baileys 🌸

### *The cutest WhatsApp Web API glow-up for Node.js*  
### *QR Branding · LID Support · Stable Sessions · Update Checks*

[![npm](https://img.shields.io/npm/v/@neelegirly/baileys?style=for-the-badge&color=ff69b4&logo=npm)](https://www.npmjs.com/package/@neelegirly/baileys)
[![wa-api](https://img.shields.io/badge/wa--api-1.7.16-c77dff?style=for-the-badge)](https://www.npmjs.com/package/@neelegirly/wa-api)
[![libsignal](https://img.shields.io/badge/libsignal-1.0.28-f4a261?style=for-the-badge)](https://www.npmjs.com/package/@neelegirly/libsignal)

<p align="center">
  <img src="https://files.catbox.moe/5bqumy.jpeg" width="420" alt="Neelegirly baileys hero" />
</p>

**🎀 Release-Stack:** `@neelegirly/baileys 2.2.17` · `@neelegirly/libsignal 1.0.28` · `@neelegirly/wa-api 1.7.16`

</div>

Neelegirly-Variante von Baileys als WhatsApp-Web-Basis fuer Node.js — gemacht fuer stabile Bots, schoene QR-Flows und einen sauber gepinnten Multi-Session-Stack.

> Hinweis: Dieses Projekt ist nicht offiziell mit WhatsApp, Meta oder Baileys-Upstream verbunden.

## ✨ Highlights

| Feature | Beschreibung | Status |
| --- | --- | --- |
| 💖 Multi-Device API | WhatsApp Web auf Node.js mit Event-Flow | ✅ |
| 📷 QR Branding | Header/Footer + Wrapper-/Versionskontext direkt im QR-Flow | ✅ |
| 🔔 Update-Checks | npm zuerst, GitHub-Fallback, semver-sicher | ✅ |
| 🧷 LID / Session-Fokus | passend fuer moderne Multi-Device-/Linked-ID-Flows | ✅ |
| 🎀 Neelegirly Scope | sauber auf `@neelegirly/*` ausgerichtet | ✅ |

## 📦 Kompatibilitaet

| Paket | Empfohlene Version |
| --- | --- |
| `@neelegirly/baileys` | `2.2.17` |
| `@neelegirly/wa-api` | `1.7.16` |
| `@neelegirly/libsignal` | `1.0.28` |

## 🚀 Installation

```bash
npm install @neelegirly/baileys@2.2.17 @neelegirly/libsignal@1.0.28 --save-exact
```

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

> Direktes `sock.ev.on('creds.update', saveCreds)` ist fuer kleine Demos okay. In produktiven Multi-Session-Setups sollten Credential-Saves gebuendelt/debounced werden, damit Session-Dateien bei vielen Updates stabil bleiben.

## 🌐 Namespace-Migration

Wenn du vom Upstream kommst, nutze den Import-Scope von Neelegirly:

```diff
- import makeWASocket from '@whiskeysockets/baileys'
+ import makeWASocket from '@neelegirly/baileys'
```

## 🩷 QR-Branding und Versionsanzeige

Beim QR-Scan werden automatisch Markenzeilen oberhalb und unterhalb des QR-Codes ausgegeben.
Die Anzeige liest Versionen dynamisch aus `package.json`, erkennt Wrapper-Kontexte und zeigt bei Bedarf einen kompakten Update-Hinweis an.

## 🔄 Update-Check

- Quelle 1: npm Registry (`registry.npmjs.org`)
- Quelle 2: GitHub Releases (`neelegirly/baileys`) als Fallback
- Fehler und Timeouts werden abgefangen, ohne den Prozess zu stoppen
- Semver-Vergleich wird numerisch ausgewertet

## 🎉 Release-Notizen

- README im Hero-/Glow-up-Stil komplett erneuert
- Stack auf `2.2.17 / 1.7.16 / 1.0.28` aktualisiert
- QR-/Versionsbranding bleibt zentral im Package verankert
