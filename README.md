<div align="center">

# @neelify/baileys

### Die WhatsApp Web API, die alles kann
### Smart Queue · QR-Code · Message ID · LID · TypeScript

[![Version](https://img.shields.io/badge/Version-2.2.1-ff69b4?style=for-the-badge&logo=github)](https://github.com/neelify/baileys)
[![Baileys API](https://img.shields.io/badge/Baileys_API-1.7.2-9b59b6?style=for-the-badge)](https://github.com/neelify/baileys)
[![npm](https://img.shields.io/npm/v/@neelify/baileys?style=for-the-badge&color=ff69b4&logo=npm)](https://www.npmjs.com/package/@neelify/baileys)
[![Downloads](https://img.shields.io/npm/dw/@neelify/baileys?style=for-the-badge&color=ff69b4&logo=npm)](https://www.npmjs.com/package/@neelify/baileys)
[![License](https://img.shields.io/github/license/neelify/baileys?style=for-the-badge&color=ff69b4)](LICENSE)
[![Node](https://img.shields.io/badge/Node-16+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)

---

<p align="center">
  <img src="https://files.catbox.moe/phppor.JPG" width="720" alt="Neelify Baileys Header" />
</p>

| Paket | Baileys API | Highlights |
|-------|-------------|------------|
| **@neelify/baileys v2.2.1** | **1.7.2** | Upstream-Updates · QR-Code · Message ID · npm Update-Check |

[**Installation**](#installation) · [**Quickstart**](#quickstart) · [**Features**](#features) · [**Migration**](#namespace-migration) · [**Changelog**](#changelog)

</div>

---

## Installation

```bash
npm install @neelify/baileys@latest
```

```bash
yarn add @neelify/baileys@latest
```

```bash
pnpm add @neelify/baileys@latest
```

## Quickstart

```typescript
import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} from '@neelify/baileys'

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    browser: ['Neelify Bot', 'Chrome', '1.0.0']
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) startBot()
    }

    if (connection === 'open') {
      console.log('Connected to WhatsApp')
    }
  })
}

startBot().catch(console.error)
```

## Features

- Smart Message Queue mit Retry, Prioritaeten und Monitoring
- LID-kompatible Pairing- und User-IDs
- Verbessertes History Sync / Device Props Verhalten
- QR-Flow und Message-ID-Verhalten bleiben absichtlich stabil
- CommonJS-first, kompatibel mit bestehenden Integrationen

## Namespace Migration

| Alt | Neu |
|-----|-----|
| `@neelegirl/baileys` | `@neelify/baileys` |
| `@neelegirl/libsignal` | `@neelify/libsignal` |
| `wa-api` / `baapi` | `@neelify/wa-api` |

## Wichtige Hinweise

- Dieses Projekt ist nicht offiziell mit WhatsApp verbunden.
- Kein Spam, kein Missbrauch, keine automatisierte Ueberwachung.
- Kritische Kernbereiche bleiben unveraendert:
  - Message-ID Signatur `NEELE`
  - QR Pairing Event-Logik
  - Low-Level WAProto Keys

## Changelog

### 2.2.1

- README bereinigt und auf den finalen `@neelify/*` Namespace fokussiert
- Entfernt: lange numerierte Platzhalter-Bloecke
- Doku-Links und Installationsbeispiele konsolidiert

### 2.2.0

- Namespace-Migration auf `@neelify/*`
- Upstream- und Kompatibilitaetsanpassungen

---

<div align="center">

Stay kawaii, stay connected.

</div>

