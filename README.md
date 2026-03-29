<div align="center">

# 🌸 @neelify/baileys 🌸

### *Die WhatsApp Web API, die alles kann*  
### *Smart Queue · QR-Code · Message ID · LID · TypeScript*

[![Version](https://img.shields.io/badge/Version-2.0.2-ff69b4?style=for-the-badge&logo=github)](https://github.com/neelify/baileys)
[![Baileys API](https://img.shields.io/badge/Baileys_API-1.7.2-9b59b6?style=for-the-badge)](https://github.com/neelify/baileys)
[![npm](https://img.shields.io/npm/v/@neelify/baileys?style=for-the-badge&color=ff69b4&logo=npm)](https://www.npmjs.com/package/@neelify/baileys)
[![Downloads](https://img.shields.io/npm/dw/@neelify/baileys?style=for-the-badge&color=ff69b4&logo=npm)](https://www.npmjs.com/package/@neelify/baileys)
[![License](https://img.shields.io/github/license/neelify/baileys?style=for-the-badge&color=ff69b4)](LICENSE)
[![Node](https://img.shields.io/badge/Node-16+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)

---

<p align="center">
  <img src="https://files.catbox.moe/ru1msl.jpeg" width="720" alt="Neele Baileys Header" />
</p>

| 📦 Paket | 🎯 Baileys API | ✨ Highlights |
|----------|----------------|----------------|
| **@neelify/baileys v2.0.2** | **1.7.2** | Upstream-Updates · QR-Code · Message ID · Update-Check von npm |

**✨ v2.0.2** · README Glow-Up · Kompatibel mit Baileys **1.7.2** · QR & Message ID unverändert · Update-Prüfung via npm-Registry

[**Installation**](#-installation) · [**Quickstart**](#-quickstart-guide) · [**Features**](#-neue-features-in-version-200) · [**Dokumentation**](#-dokumentation) · [**Support**](#-support--community)

</div>

---

## 📋 Inhaltsverzeichnis

- [✨ Warum @neelify/baileys?](#-warum-neelifybaileys)
- [🚀 Installation](#-installation)
- [📖 Quickstart Guide](#-quickstart-guide)
- [✨ Neue Features in Version 2.0.2](#-neue-features-in-version-202)
- [💡 Grundlegende Verwendung](#-grundlegende-verwendung)
- [🎯 Erweiterte Features](#-erweiterte-features)
- [📚 Dokumentation](#-dokumentation)
- [⚠️ Wichtige Hinweise](#️-wichtige-hinweise)
- [💬 Support & Community](#-support--community)

---

## ✨ Warum @neelify/baileys?

<div align="center">

### 🌟 **Zauberhafte Vorteile** 🌟

</div>

| Feature | Beschreibung | Status |
|---------|-------------|--------|
| 🧠 **Leichtgewichtig** | Keine Browser- oder Selenium-Monster nötig! | ✅ |
| 🌈 **WebSocket-Magie** | Direkt, schnell & stabil | ✅ |
| 💖 **Multi-Device** | Vollständige Unterstützung | ✅ |
| 🧩 **LID-Kompatibel** | Linked ID Erkennung & Nutzung | ✅ |
| 🧷 **TypeScript** | Saubere Typen, DX zum Verlieben | ✅ |
| 🔄 **Auto-Updates** | Automatische Update-Prüfung | ✅ |
| 📱 **QR-Code** | Schöne QR-Code-Anzeige | ✅ |
| 🎯 **Message ID** | Verbesserte Message-ID-Generierung | ✅ |
| 🚀 **Smart Queue** | Intelligente Nachrichten-Warteschlange | ✅ **NEU!** |

---

## 🚀 Installation

### 📦 Mit npm

```bash
npm install @neelify/baileys@latest
```

### 📦 Mit yarn

```bash
yarn add @neelify/baileys@latest
```

### 📦 Bleeding-Edge (GitHub)

```bash
npm install github:neelify/baileys
# oder
yarn add github:neelify/baileys
```

### 📥 Import

```typescript
// ES Modules
import makeWASocket, { 
  useMultiFileAuthState, 
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
  createSmartMessageQueue // 🆕 NEU!
} from '@neelify/baileys'

// CommonJS
const { 
  default: makeWASocket, 
  useMultiFileAuthState,
  createSmartMessageQueue 
} = require('@neelify/baileys')
```

---

## 📖 Quickstart Guide

### 🎯 **Für Anfänger: Dein erster Bot in 5 Minuten**

```typescript
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from '@neelify/baileys'
import { Boom } from '@hapi/boom'

async function startBot() {
  // 1️⃣ Auth-State laden/speichern
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
  
  // 2️⃣ Neueste WhatsApp-Version holen
  const { version } = await fetchLatestBaileysVersion()
  
  // 3️⃣ Socket erstellen
  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true, // QR-Code im Terminal anzeigen
    browser: ['Neele Bot', 'Chrome', '1.0.0']
  })
  
  // 4️⃣ Credentials speichern wenn sie sich ändern
  sock.ev.on('creds.update', saveCreds)
  
  // 5️⃣ Verbindungs-Updates verarbeiten
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    
    if (connection === 'close') {
      const shouldReconnect = 
        (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      
      console.log('🔌 Verbindung geschlossen, reconnect:', shouldReconnect)
      if (shouldReconnect) {
        startBot() // Automatisch neu verbinden
      }
    } else if (connection === 'open') {
      console.log('✅ Verbunden mit WhatsApp!')
    }
  })
  
  // 6️⃣ Nachrichten empfangen
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    
    const jid = m.key.remoteJid!
    const text = m.message.conversation || m.message.extendedTextMessage?.text || ''
    
    // Einfacher Echo-Bot
    if (text.toLowerCase() === 'hallo') {
      await sock.sendMessage(jid, { 
        text: '🌸 Hallo! Ich bin ein Neele-Bot! ✨' 
      })
    }
  })
}

// Bot starten
startBot().catch(console.error)
```

### 🎨 **Was passiert hier?**

1. **`useMultiFileAuthState`**: Speichert deine WhatsApp-Session, damit du nicht jedes Mal den QR-Code scannen musst
2. **`fetchLatestBaileysVersion`**: Holt die neueste WhatsApp-Version automatisch
3. **`makeWASocket`**: Erstellt die Verbindung zu WhatsApp
4. **`connection.update`**: Event für Verbindungsstatus (QR-Code, Verbindung, etc.)
5. **`messages.upsert`**: Event für neue Nachrichten

---

## ✨ Neue Features in Version 2.0.2

### 🆕 **Was ist neu?**
**Kompatibel mit Baileys API 1.7.2** · **Update-Check von npm-Registry** (1× pro Prozess) · **Message ID & QR-Code unverändert**

<div align="center">

| 🎯 Feature | 📝 Beschreibung | 🚀 Status |
|-----------|----------------|-----------|
| **🔄 Upstream-Updates** | validate-connection, Defaults & Pairing aus Backup Baileys | ✅ **Neu** |
| **🔐 LID in Pairing** | Linked ID (lid) in configureSuccessfulPairing & me | ✅ **Neu** |
| **📤 historySyncConfig** | Vollständiges DeviceProps in generateRegistrationNode | ✅ **Neu** |
| **🌐 getWebInfo** | Desktop-Check für syncFullHistory (browser[1] === 'Desktop') | ✅ **Neu** |
| **⚙️ Defaults** | enableAutoSessionRecreation, enableRecentMessageCache, shouldSyncHistoryMessage | ✅ **Neu** |
| **🚀 Smart Message Queue** | Intelligente Queue mit Auto-Retry & Prioritäten | ✅ |
| **🎨 QR-Anzeige** | Schöne QR-Code-Box · unverändert | ✅ |
| **🎯 Message ID** | Message-ID-Generierung · unverändert | ✅ |
| **📦 WhatsApp Version** | [2, 3000, 1032141294] · Basiert auf @neelify/baileys 7.0.0-rc.9 | ✅ |

</div>

### 🔥 **Neue Funktionen**

#### 🚀 **`createSmartMessageQueue()`** - Intelligente Nachrichten-Warteschlange ⭐ **NEU!**

Die ultimative Lösung für zuverlässiges Nachrichtenversenden mit automatischen Retries, Prioritäten und Rate-Limiting!

```typescript
import { createSmartMessageQueue } from '@neelify/baileys'

// Queue erstellen
const queue = createSmartMessageQueue(sock, {
  maxRetries: 3,           // Max. 3 Retry-Versuche
  retryDelay: 1000,        // 1 Sekunde Basis-Delay
  maxConcurrent: 5,        // Max. 5 gleichzeitige Nachrichten
  onSuccess: (message) => {
    console.log('✅ Nachricht erfolgreich gesendet!')
  },
  onError: (message, error) => {
    console.error('❌ Nachricht fehlgeschlagen:', error)
  }
})

// Nachrichten zur Queue hinzufügen
await queue.add({
  jid: '491234567890@s.whatsapp.net',
  message: { text: 'Wichtige Nachricht!' },
  priority: 'high' // 'low' | 'normal' | 'high'
})

// Queue-Statistiken abrufen
const stats = queue.getStats()
console.log(`Pending: ${stats.pending}, Processing: ${stats.processing}, Failed: ${stats.failed}`)

// Queue pausieren/fortsetzen
queue.pause()  // Pausiert die Verarbeitung
queue.resume() // Setzt die Verarbeitung fort

// Queue leeren
queue.clear()
```

**Features der Smart Queue:**
- ✅ **Automatische Retries** mit Exponential Backoff
- ✅ **Prioritäts-System** (high > normal > low)
- ✅ **Rate-Limiting** durch maxConcurrent
- ✅ **Error-Handling** mit Callbacks
- ✅ **Queue-Statistiken** für Monitoring
- ✅ **Pause/Resume** für flexible Kontrolle

#### 1. **`onWhatsApp()`** - Prüfe ob Nummer auf WhatsApp ist

```typescript
const [result] = await sock.onWhatsApp('491234567890@s.whatsapp.net')
if (result?.exists) {
  console.log(`✅ ${result.jid} ist auf WhatsApp!`)
}
```

#### 2. **`executeUSyncQuery()`** - USync-Queries ausführen

```typescript
import { USyncQuery, USyncContactProtocol } from '@neelify/baileys'

const query = new USyncQuery()
  .withContactProtocol()
  .withUser(new USyncUser().withPhone('+491234567890'))

const result = await sock.executeUSyncQuery(query)
console.log('Kontakt-Info:', result)
```

#### 3. **`digestKeyBundle()`** - Key-Bundle validieren

```typescript
try {
  await sock.digestKeyBundle()
  console.log('✅ Key-Bundle ist gültig')
} catch (error) {
  console.log('⚠️ Key-Bundle ungültig, Pre-Keys werden hochgeladen')
}
```

#### 4. **`rotateSignedPreKey()`** - Signed Pre-Key rotieren

```typescript
await sock.rotateSignedPreKey()
console.log('✅ Signed Pre-Key wurde rotiert')
```

### 🔄 **Automatische Update-Prüfung**

Bei jedem Start wird automatisch geprüft, ob eine neue Version verfügbar ist:

```
╔════════════════════════════════════════╗
║  🔔 NEUES UPDATE VERFÜGBAR! 🔔        ║
╠════════════════════════════════════════╣
║  @neelify/baileys                    ║
║  Aktuelle Version: 1.6.6               ║
║  Neue Version:     1.7.0                ║
║                                        ║
║  Bitte aktualisiere:                  ║
║  npm install @neelify/baileys@latest ║
╚════════════════════════════════════════╝
```

---

## 💡 Grundlegende Verwendung

### 📱 **Nachrichten senden**

```typescript
// Text-Nachricht
await sock.sendMessage(jid, { text: 'Hallo! 🌸' })

// Mit Quote (Antwort)
await sock.sendMessage(jid, { 
  text: 'Das ist eine Antwort!' 
}, { 
  quoted: originalMessage 
})

// Mit Erwähnung
await sock.sendMessage(jid, {
  text: '@491234567890 Hallo!',
  mentions: ['491234567890@s.whatsapp.net']
})
```

### 🖼️ **Medien senden**

```typescript
// Bild
await sock.sendMessage(jid, {
  image: { url: './bild.jpg' },
  caption: 'Schönes Bild! 🌸'
})

// Video
await sock.sendMessage(jid, {
  video: { url: './video.mp4' },
  caption: 'Mein Video! 🎬'
})

// GIF (als Video mit gifPlayback Flag)
await sock.sendMessage(jid, {
  video: { url: './animation.mp4' },
  gifPlayback: true,
  caption: 'Kawaii GIF! ✨'
})

// Audio/Sprachnachricht
await sock.sendMessage(jid, {
  audio: { url: './audio.ogg' },
  mimetype: 'audio/ogg',
  ptt: true // Push-to-Talk (Sprachnachricht)
})

// Dokument
await sock.sendMessage(jid, {
  document: { url: './dokument.pdf' },
  mimetype: 'application/pdf',
  fileName: 'Wichtiges Dokument.pdf'
})

// Sticker
await sock.sendMessage(jid, {
  sticker: { url: './sticker.webp' }
})
```

### 👥 **Gruppen**

```typescript
// Gruppe erstellen
const group = await sock.groupCreate('Meine Gruppe', [
  '491234567890@s.whatsapp.net',
  '499876543210@s.whatsapp.net'
])

// Teilnehmer hinzufügen
await sock.groupParticipantsUpdate(
  group.id,
  ['491111111111@s.whatsapp.net'],
  'add'
)

// Gruppenname ändern
await sock.groupUpdateSubject(group.id, 'Neuer Gruppenname')

// Gruppenbeschreibung ändern
await sock.groupUpdateDescription(group.id, 'Neue Beschreibung')

// Gruppen-Einstellungen ändern
await sock.groupSettingUpdate(group.id, 'announcement') // Nur Admins können schreiben
await sock.groupSettingUpdate(group.id, 'not_announcement') // Alle können schreiben
```

### 📊 **Umfragen (Polls)**

```typescript
await sock.sendMessage(jid, {
  poll: {
    name: 'Was ist deine Lieblingsfarbe?',
    values: ['Rot', 'Blau', 'Grün', 'Gelb'],
    selectableCount: 1 // Anzahl der auswählbaren Optionen
  }
})
```

### ⭐ **Reaktionen**

```typescript
// Reaktion hinzufügen
await sock.sendMessage(jid, {
  react: {
    text: '❤️',
    key: message.key
  }
})

// Reaktion entfernen (leerer String)
await sock.sendMessage(jid, {
  react: {
    text: '',
    key: message.key
  }
})
```

---

## 🎯 Erweiterte Features

### 🚀 **Smart Message Queue - Praktisches Beispiel**

```typescript
import { createSmartMessageQueue } from '@neelify/baileys'

// Queue für Bulk-Messaging erstellen
const bulkQueue = createSmartMessageQueue(sock, {
  maxRetries: 5,
  retryDelay: 2000,
  maxConcurrent: 3, // Nicht zu viele gleichzeitig
  onSuccess: (msg) => {
    console.log(`✅ Gesendet an ${msg.jid}`)
  },
  onError: (msg, err) => {
    console.error(`❌ Fehler bei ${msg.jid}:`, err.message)
  }
})

// Viele Nachrichten hinzufügen
const recipients = [
  '491234567890@s.whatsapp.net',
  '499876543210@s.whatsapp.net',
  '491111111111@s.whatsapp.net'
]

for (const jid of recipients) {
  await bulkQueue.add({
    jid,
    message: { text: 'Wichtige Ankündigung! 📢' },
    priority: 'high'
  })
}

// Statistik prüfen
setInterval(() => {
  const stats = bulkQueue.getStats()
  console.log(`Queue: ${stats.pending} pending, ${stats.processing} processing, ${stats.failed} failed`)
}, 5000)
```

### 💠 **LID-Kompatibilität (Linked ID)**

LID sorgt dafür, dass Benutzer auch über geräteübergreifende IDs korrekt erkannt werden:

```typescript
import { jidDecode, jidEncode, isLidUser } from '@neelify/baileys'

// Prüfe ob es eine LID ist
if (isLidUser(someJid)) {
  console.log('Das ist eine LID!')
}

// JID dekodieren
const decoded = jidDecode('491234567890@s.whatsapp.net')
console.log(decoded) // { user: '491234567890', server: 's.whatsapp.net' }

// JID encodieren
const encoded = jidEncode('491234567890', 's.whatsapp.net')
console.log(encoded) // '491234567890@s.whatsapp.net'
```

### 🔐 **Sichere Sender-ID-Extraktion**

```typescript
import { jidDecode } from '@neelify/baileys'

function getSenderId(message: any) {
  const participant = message?.key?.participant || message?.participant
  const lid = participant || message?.key?.remoteJid
  
  if (lid) {
    const decoded = jidDecode(lid)
    return decoded?.user 
      ? `${decoded.user}@${decoded.server}` 
      : lid
  }
  
  return 'unknown'
}

sock.ev.on('messages.upsert', ({ messages }) => {
  const sender = getSenderId(messages[0])
  console.log('Nachricht von:', sender)
})
```

### 📥 **Medien herunterladen**

```typescript
import { downloadMediaMessage } from '@neelify/baileys'
import { writeFile } from 'fs/promises'

sock.ev.on('messages.upsert', async ({ messages }) => {
  const m = messages[0]
  
  if (m.message?.imageMessage) {
    // Medien als Buffer herunterladen
    const buffer = await downloadMediaMessage(
      m,
      'buffer',
      {},
      { logger: sock.logger }
    )
    
    // Speichern
    await writeFile('./downloaded-image.jpg', buffer)
    console.log('✅ Bild gespeichert!')
  }
})
```

### 🔄 **Nachrichten bearbeiten**

```typescript
// Nachricht bearbeiten
const sentMessage = await sock.sendMessage(jid, { text: 'Ursprünglicher Text' })

// Später bearbeiten
await sock.sendMessage(jid, {
  text: 'Bearbeiteter Text',
  edit: sentMessage.key
})
```

### 🗑️ **Nachrichten löschen**

```typescript
// Für alle löschen
await sock.sendMessage(jid, { delete: message.key })

// Nur für mich löschen (via chatModify)
await sock.chatModify({
  clear: {
    messages: [{
      id: message.key.id,
      fromMe: true,
      timestamp: message.messageTimestamp
    }]
  }
}, jid)
```

### 📌 **Nachrichten anpinnen**

```typescript
// Nachricht anpinnen (24 Stunden)
await sock.sendMessage(jid, {
  pin: {
    type: 1, // 0 = entfernen, 1 = anpinnen
    time: 86400, // Sekunden (24h)
    key: message.key
  }
})
```

### 📍 **Standort senden**

```typescript
await sock.sendMessage(jid, {
  location: {
    degreesLatitude: 52.520008,
    degreesLongitude: 13.404954
  }
})
```

### 📇 **Kontakt teilen**

```typescript
const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Max Mustermann
TEL;type=CELL;type=VOICE;waid=491234567890:+49 123 4567890
END:VCARD`

await sock.sendMessage(jid, {
  contacts: {
    displayName: 'Max Mustermann',
    contacts: [{ vcard }]
  }
})
```

### 🔄 **Nachrichten weiterleiten**

```typescript
await sock.sendMessage(jid, {
  forward: originalMessage
})
```

---

## 📚 Dokumentation

### 🎧 **Events (Event-Handler)**

```typescript
// Verbindungs-Updates
sock.ev.on('connection.update', (update) => {
  if (update.qr) {
    console.log('📱 QR-Code:', update.qr)
  }
  if (update.connection === 'open') {
    console.log('✅ Verbunden!')
  }
})

// Neue Nachrichten
sock.ev.on('messages.upsert', ({ messages, type }) => {
  console.log('📥 Neue Nachricht:', messages[0])
})

// Nachrichten-Updates (z.B. gelesen, gelöscht)
sock.ev.on('messages.update', (updates) => {
  updates.forEach(({ key, update }) => {
    if (update.status) {
      console.log('📊 Status Update:', update.status)
    }
  })
})

// Credentials-Update (wichtig für Session-Speicherung!)
sock.ev.on('creds.update', saveCreds)

// Kontakte-Update
sock.ev.on('contacts.update', (updates) => {
  updates.forEach(update => {
    console.log('👤 Kontakt-Update:', update)
  })
})

// Gruppen-Updates
sock.ev.on('groups.update', (updates) => {
  updates.forEach(update => {
    console.log('👥 Gruppen-Update:', update)
  })
})

// Presence-Update (online, offline, typing)
sock.ev.on('presence.update', ({ id, presences }) => {
  console.log('🟢 Presence:', id, presences)
})
```

### 🔧 **Socket-Konfiguration**

```typescript
const sock = makeWASocket({
  // Auth-State (wichtig!)
  auth: state,
  
  // WhatsApp-Version (automatisch oder manuell)
  version: [2, 3000, 1032141294],
  
  // Browser-Info
  browser: ['Mein Bot', 'Chrome', '1.0.0'],
  // Oder vordefinierte Browser:
  // browser: Browsers.macOS('Desktop')
  // browser: Browsers.ubuntu('Server')
  // browser: Browsers.iOS('Mobile')
  
  // QR-Code im Terminal anzeigen
  printQRInTerminal: true,
  
  // Online beim Verbinden markieren
  markOnlineOnConnect: true,
  
  // Vollständige Historie synchronisieren
  syncFullHistory: false,
  
  // Logger (optional)
  logger: pino({ level: 'silent' }),
  
  // Message-Store (für Retry & Poll-Votes)
  getMessage: async (key) => {
    // Hole Nachricht aus deinem Store
    return await yourMessageStore.get(key)
  },
  
  // Group-Metadata-Cache (empfohlen!)
  cachedGroupMetadata: async (jid) => {
    // Hole aus Cache
    return await groupCache.get(jid)
  },
  
  // Custom Upload Hosts
  customUploadHosts: [],
  
  // Retry-Konfiguration
  maxMsgRetryCount: 5,
  retryRequestDelayMs: 250,
  
  // Query-Timeout
  defaultQueryTimeoutMs: 60000,
  
  // QR-Timeout
  qrTimeout: 60000
})
```

### 💾 **Session-Speicherung**

```typescript
import { useMultiFileAuthState, BufferJSON } from '@neelify/baileys'
import { readFileSync, writeFileSync } from 'fs'

// Option 1: Multi-File (einfach, empfohlen für Entwicklung)
const { state, saveCreds } = await useMultiFileAuthState('./auth_info')

// Option 2: Single-File (für Produktion)
import { useSingleFileAuthState } from '@neelify/baileys'

const { state, saveCreds } = await useSingleFileAuthState('./auth.json')

// Option 3: Custom (für Datenbanken)
const authFile = './auth.json'

const { state, saveCreds } = {
  state: {
    creds: JSON.parse(
      readFileSync(authFile, { encoding: 'utf-8' }),
      BufferJSON.reviver
    ),
    keys: {
      get: async (type, ids) => {
        // Hole Keys aus deiner DB
      },
      set: async (data) => {
        // Speichere Keys in deiner DB
      }
    }
  },
  saveCreds: async () => {
    const creds = state.creds
    writeFileSync(authFile, JSON.stringify(creds, BufferJSON.replacer, 2))
  }
}
```

### 🗄️ **Message Store (für Retry & Poll-Votes)**

```typescript
import { makeInMemoryStore } from '@neelify/baileys'

// In-Memory Store (für Entwicklung)
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent' }) })

// Aus Datei laden
store.readFromFile('./baileys_store.json')

// Socket binden
store.bind(sock.ev)

// Alle 10 Sekunden speichern
setInterval(() => {
  store.writeToFile('./baileys_store.json')
}, 10_000)

// In Socket-Config verwenden
const sock = makeWASocket({
  getMessage: async (key) => {
    return store.loadMessage(key.remoteJid!, key.id!)
  }
})
```

---

## ⚠️ Wichtige Hinweise

### 🚨 **Disclaimer**

> ⚠️ **WICHTIG**: Dieses Projekt steht in **keiner offiziellen Verbindung** zu WhatsApp.
> 
> - ✖️ **Kein Spam** oder Massennachrichten
> - ✖️ **Kein Missbrauch** für unethische Zwecke  
> - ✖️ **Keine Stalkerware** oder automatisierte Überwachung
> - ✔️ **Verantwortungsvoller Gebrauch** wird erwartet
> 
> Die Entwickler:innen übernehmen **keine Verantwortung** für den Gebrauch.

### 🔒 **Sicherheit**

- **Nie** deine Auth-Dateien öffentlich teilen
- **Immer** `.gitignore` für Auth-Ordner verwenden
- **Regelmäßig** Backups erstellen
- **Sichere** Passwörter für deine Server verwenden

### 💡 **Best Practices**

1. **Session-Speicherung**: Immer `useMultiFileAuthState` oder ähnliches verwenden
2. **Error-Handling**: Immer try-catch für wichtige Operationen
3. **Rate-Limiting**: Nicht zu viele Nachrichten auf einmal senden (nutze Smart Queue!)
4. **Logging**: Logger für Debugging verwenden
5. **Updates**: Regelmäßig auf Updates prüfen

---

## 💬 Support & Community

<div align="center">

### 🌸 **Made with Love by @neelify** 🌸

[![GitHub](https://img.shields.io/badge/GitHub-@neelify-pink?style=for-the-badge&logo=github)](https://github.com/neelify)
[![Email](https://img.shields.io/badge/Email-Support-pink?style=for-the-badge&logo=gmail)](mailto:neelehoven@gmail.com)

**⭐ Wenn dir dieses Projekt gefällt, gib ihm ein Star auf GitHub! ⭐**

</div>

---

## 📝 Changelog

### Version 2.0.2 (Aktuell) 🎉

- 📖 **README Glow-Up** – Version 2.0.2, Badges & Changelog
- 🔔 **Update-Check** – Liest Version von **npm-Registry** (registry.npmjs.org), nur 1× pro Prozess
- ✨ Semver-Vergleich für „Update verfügbar“ nur bei wirklich neuerer Version
- 🎨 **QR-Code** & **Message ID** – unverändert
- 🔄 Kompatibel mit **Baileys API 1.7.2**

### Version 2.0.1

- 🔄 Upstream aus Backup Baileys · LID in Pairing · historySyncConfig · getWebInfo · Defaults

### Version 2.0.0

- 🔄 Upstream aus Backup Baileys – validate-connection, Defaults & Pairing angeglichen
- 🔐 LID in Pairing · 📤 historySyncConfig · 🌐 getWebInfo · ⚙️ Defaults
- 🎨 QR-Code & Message ID unverändert · WhatsApp-Version [2, 3000, 1032141294]

### Version 1.1.2

- 📖 README Glow-Up, Baileys API 1.7.2 Badge
- 🚀 Smart Message Queue, Auto-Update-Prüfung
- 🎨 QR-Code-Anzeige · Message ID unverändert

### Version 1.7.1

- 📖 README Glow-Up, Smart Message Queue, Auto-Update-Check
- 🎨 QR-Anzeige, Message ID System

### Version 1.7.0

- 🚀 **Smart Message Queue** eingeführt
- ✨ Auto-Update-Check, QR-Anzeige, Message ID System

### Version 1.6.6

- ✨ **Automatische Update-Prüfung** hinzugefügt
- 🎨 **Verbesserte QR-Code-Anzeige** mit Version-Info
- 🔄 **WhatsApp-Version** aktualisiert auf [2, 3000, 1032141294]
- 🚀 **Basiert auf** @neelify/baileys 7.0.0-rc.9
- 🛠️ **Verbesserte Socket-Stabilität**
- 🔐 **Verbesserte Pre-Key-Verwaltung**

### Version 1.6.5

- 🆕 Neue Funktionen: `onWhatsApp()`, `executeUSyncQuery()`
- 🔐 `digestKeyBundle()` und `rotateSignedPreKey()` hinzugefügt
- 💎 WAM Buffer Support

---

<div align="center">

### ✨ *Möge dein Bot so bezaubernd sein wie ein Anime-Mädchen mit Glitzeraugen* ✨

**🌸 Stay kawaii, stay connected! 🌸**

[⬆️ Nach oben](#-neelifybaileys)

</div>



---

## Namespace Migration Reference

Diese Referenz dokumentiert die Umstellung auf die neue Namespace-Struktur innerhalb eines einzelnen Projektordners.

### Mapping Matrix

| Alt | Neu | Hinweis |
|-----|-----|---------|
| `@neelify/baileys` | `@neelify/baileys` | Hauptpaket |
| `@neelify/baileys` | `@neelify/baileys` | Branding-/Import-Umstellung |
| `@neelify/libsignal` | `@neelify/libsignal` | Signal-Dependency |
| `wa-api` / `baapi` | `@neelify/wa-api` | Companion Namespace |

### Companion Namespace Packages

```bash
npm install @neelify/baileys @neelify/wa-api @neelify/libsignal
```

```bash
yarn add @neelify/baileys @neelify/wa-api @neelify/libsignal
```

### Namespace Quick Imports

```js
const baileys = require('@neelify/baileys')
```

```js
const libsignal = require('@neelify/libsignal')
```

```js
// Beispiel: WA API Companion Namespace
// (falls in deinem Projekt verwendet)
const waApiNamespace = '@neelify/wa-api'
console.log('Companion namespace:', waApiNamespace)
```

### Migration Checklist (Step-by-Step)

1. `package.json` Name und Dependency-Namespace pr�fen.
2. Alle `require(...)` und `import ... from ...` Referenzen auf neue Scopes pr�fen.
3. README-Install-Befehle und Snippets aktualisieren.
4. NPM-Badges auf den neuen Scope umstellen.
5. Alle GitHub-Links auf den neuen Namespace umstellen.
6. Export-Map validieren (`exports` in package.json).
7. Smoke-Test ausf�hren (`node -e "require('./lib/index.js')"`).
8. `npm pack --dry-run` ausf�hren und Tarball-Liste pr�fen.
9. Finalen Publish mit korrektem Scope durchf�hren.

### Namespace Sanity Checks

```bash
# 1) Pr�fen, ob altes Branding noch im Source ist
rg -n --glob "!node_modules/**" "@neelify|@whiskeysockets|neelify|WhiskeySockets" .
```

```bash
# 2) Pr�fen, ob neue Namespace-Referenzen gesetzt sind
rg -n --glob "!node_modules/**" "@neelify/baileys|@neelify/libsignal|@neelify/wa-api" .
```

```bash
# 3) Smoke Import
node -e "require('./lib/index.js'); console.log('ok')"
```

### CJS Compatibility Notes

- Dieses Paket bleibt CommonJS-first.
- `main` und `module` zeigen beide auf `lib/index.js`.
- `exports` unterst�tzt den Package-Einstieg sowie `./lib/*` und `./WAProto/*`.

### Wichtig: Unver�nderte kritische Bereiche

Die folgenden Bereiche bleiben absichtlich unangetastet:

- Message-ID Signatur `NEELE`
- QR-Code Event-/Pairing-Logik
- Low-Level WAProto Keys
- Funktional kritische interne Konstanten

### Troubleshooting

#### `Error: Cannot find module '@neelify/libsignal'`

- Stelle sicher, dass `@neelify/libsignal` in `dependencies` enthalten ist.
- Pr�fe, ob dein Package Manager den neuen Scope korrekt aufl�st.
- F�hre ggf. eine saubere Neuinstallation aus:

```bash
rm -rf node_modules package-lock.json
npm install
```

#### `npm publish` schl�gt mit Scope-Fehler fehl

- Pr�fe den Scope in `name` (`@neelify/baileys`).
- Pr�fe `publishConfig.access = public`.
- Pr�fe NPM-Berechtigungen f�r den Scope.

#### README-Badges zeigen alte Daten

- Ersetze alle Badge-URLs auf den `@neelify/*` Scope.
- Pr�fe NPM-Badge links auf Tippfehler.

### Release Checklist (Namespace)

- [ ] `name` ist `@neelify/baileys`
- [ ] `dependencies` zeigen auf `@neelify/libsignal`
- [ ] README nutzt `@neelify/baileys` in allen Snippets
- [ ] Keine alten Scope-Strings im Source
- [ ] `npm pack --dry-run` ist sauber
- [ ] Version wurde erh�ht

### Beispiel: Minimaler Runtime Test

```js
const { default: makeWASocket, Browsers } = require('@neelify/baileys')

console.log('Browsers helper exists:', !!Browsers)
console.log('Socket factory exists:', typeof makeWASocket === 'function')
```

### Beispiel: Event Probe

```js
function attachProbe(sock) {
  sock.ev.on('connection.update', (u) => {
    if (u.qr) console.log('QR emitted')
    if (u.connection) console.log('Connection state:', u.connection)
  })
}
```

### Example Compatibility Matrix

| Runtime | Status |
|---------|--------|
| Node 16 | Supported |
| Node 18 | Supported |
| Node 20 | Supported |

### Hinweis f�r Integratoren

Wenn du zuvor harte String-Vergleiche auf alte Scope-Namen verwendet hast (z.B. Telemetrie, Logger, Health-Checks), aktualisiere diese auf `@neelify/*`, damit Monitoring und Build-Checks sauber bleiben.

---
