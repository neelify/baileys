<div align="center">

# ðŸŒ¸ @neelify/baileys ðŸŒ¸

### *Die WhatsApp Web API, die alles kann*  
### *Smart Queue Â· QR-Code Â· Message ID Â· LID Â· TypeScript*

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

| ðŸ“¦ Paket | ðŸŽ¯ Baileys API | âœ¨ Highlights |
|----------|----------------|----------------|
| **@neelify/baileys v2.0.2** | **1.7.2** | Upstream-Updates Â· QR-Code Â· Message ID Â· Update-Check von npm |

**âœ¨ v2.0.2** Â· README Glow-Up Â· Kompatibel mit Baileys **1.7.2** Â· QR & Message ID unverÃ¤ndert Â· Update-PrÃ¼fung via npm-Registry

[**Installation**](#-installation) Â· [**Quickstart**](#-quickstart-guide) Â· [**Features**](#-neue-features-in-version-200) Â· [**Dokumentation**](#-dokumentation) Â· [**Support**](#-support--community)

</div>

---

## ðŸ“‹ Inhaltsverzeichnis

- [âœ¨ Warum @neelify/baileys?](#-warum-neelifybaileys)
- [ðŸš€ Installation](#-installation)
- [ðŸ“– Quickstart Guide](#-quickstart-guide)
- [âœ¨ Neue Features in Version 2.0.2](#-neue-features-in-version-202)
- [ðŸ’¡ Grundlegende Verwendung](#-grundlegende-verwendung)
- [ðŸŽ¯ Erweiterte Features](#-erweiterte-features)
- [ðŸ“š Dokumentation](#-dokumentation)
- [âš ï¸ Wichtige Hinweise](#ï¸-wichtige-hinweise)
- [ðŸ’¬ Support & Community](#-support--community)

---

## âœ¨ Warum @neelify/baileys?

<div align="center">

### ðŸŒŸ **Zauberhafte Vorteile** ðŸŒŸ

</div>

| Feature | Beschreibung | Status |
|---------|-------------|--------|
| ðŸ§  **Leichtgewichtig** | Keine Browser- oder Selenium-Monster nÃ¶tig! | âœ… |
| ðŸŒˆ **WebSocket-Magie** | Direkt, schnell & stabil | âœ… |
| ðŸ’– **Multi-Device** | VollstÃ¤ndige UnterstÃ¼tzung | âœ… |
| ðŸ§© **LID-Kompatibel** | Linked ID Erkennung & Nutzung | âœ… |
| ðŸ§· **TypeScript** | Saubere Typen, DX zum Verlieben | âœ… |
| ðŸ”„ **Auto-Updates** | Automatische Update-PrÃ¼fung | âœ… |
| ðŸ“± **QR-Code** | SchÃ¶ne QR-Code-Anzeige | âœ… |
| ðŸŽ¯ **Message ID** | Verbesserte Message-ID-Generierung | âœ… |
| ðŸš€ **Smart Queue** | Intelligente Nachrichten-Warteschlange | âœ… **NEU!** |

---

## ðŸš€ Installation

### ðŸ“¦ Mit npm

```bash
npm install @neelify/baileys@latest
```

### ðŸ“¦ Mit yarn

```bash
yarn add @neelify/baileys@latest
```

### ðŸ“¦ Bleeding-Edge (GitHub)

```bash
npm install github:neelify/baileys
# oder
yarn add github:neelify/baileys
```

### ðŸ“¥ Import

```typescript
// ES Modules
import makeWASocket, { 
  useMultiFileAuthState, 
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
  createSmartMessageQueue // ðŸ†• NEU!
} from '@neelify/baileys'

// CommonJS
const { 
  default: makeWASocket, 
  useMultiFileAuthState,
  createSmartMessageQueue 
} = require('@neelify/baileys')
```

---

## ðŸ“– Quickstart Guide

### ðŸŽ¯ **FÃ¼r AnfÃ¤nger: Dein erster Bot in 5 Minuten**

```typescript
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from '@neelify/baileys'
import { Boom } from '@hapi/boom'

async function startBot() {
  // 1ï¸âƒ£ Auth-State laden/speichern
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
  
  // 2ï¸âƒ£ Neueste WhatsApp-Version holen
  const { version } = await fetchLatestBaileysVersion()
  
  // 3ï¸âƒ£ Socket erstellen
  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true, // QR-Code im Terminal anzeigen
    browser: ['Neele Bot', 'Chrome', '1.0.0']
  })
  
  // 4ï¸âƒ£ Credentials speichern wenn sie sich Ã¤ndern
  sock.ev.on('creds.update', saveCreds)
  
  // 5ï¸âƒ£ Verbindungs-Updates verarbeiten
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    
    if (connection === 'close') {
      const shouldReconnect = 
        (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      
      console.log('ðŸ”Œ Verbindung geschlossen, reconnect:', shouldReconnect)
      if (shouldReconnect) {
        startBot() // Automatisch neu verbinden
      }
    } else if (connection === 'open') {
      console.log('âœ… Verbunden mit WhatsApp!')
    }
  })
  
  // 6ï¸âƒ£ Nachrichten empfangen
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    
    const jid = m.key.remoteJid!
    const text = m.message.conversation || m.message.extendedTextMessage?.text || ''
    
    // Einfacher Echo-Bot
    if (text.toLowerCase() === 'hallo') {
      await sock.sendMessage(jid, { 
        text: 'ðŸŒ¸ Hallo! Ich bin ein Neele-Bot! âœ¨' 
      })
    }
  })
}

// Bot starten
startBot().catch(console.error)
```

### ðŸŽ¨ **Was passiert hier?**

1. **`useMultiFileAuthState`**: Speichert deine WhatsApp-Session, damit du nicht jedes Mal den QR-Code scannen musst
2. **`fetchLatestBaileysVersion`**: Holt die neueste WhatsApp-Version automatisch
3. **`makeWASocket`**: Erstellt die Verbindung zu WhatsApp
4. **`connection.update`**: Event fÃ¼r Verbindungsstatus (QR-Code, Verbindung, etc.)
5. **`messages.upsert`**: Event fÃ¼r neue Nachrichten

---

## âœ¨ Neue Features in Version 2.0.2

### ðŸ†• **Was ist neu?**
**Kompatibel mit Baileys API 1.7.2** Â· **Update-Check von npm-Registry** (1Ã— pro Prozess) Â· **Message ID & QR-Code unverÃ¤ndert**

<div align="center">

| ðŸŽ¯ Feature | ðŸ“ Beschreibung | ðŸš€ Status |
|-----------|----------------|-----------|
| **ðŸ”„ Upstream-Updates** | validate-connection, Defaults & Pairing aus Backup Baileys | âœ… **Neu** |
| **ðŸ” LID in Pairing** | Linked ID (lid) in configureSuccessfulPairing & me | âœ… **Neu** |
| **ðŸ“¤ historySyncConfig** | VollstÃ¤ndiges DeviceProps in generateRegistrationNode | âœ… **Neu** |
| **ðŸŒ getWebInfo** | Desktop-Check fÃ¼r syncFullHistory (browser[1] === 'Desktop') | âœ… **Neu** |
| **âš™ï¸ Defaults** | enableAutoSessionRecreation, enableRecentMessageCache, shouldSyncHistoryMessage | âœ… **Neu** |
| **ðŸš€ Smart Message Queue** | Intelligente Queue mit Auto-Retry & PrioritÃ¤ten | âœ… |
| **ðŸŽ¨ QR-Anzeige** | SchÃ¶ne QR-Code-Box Â· unverÃ¤ndert | âœ… |
| **ðŸŽ¯ Message ID** | Message-ID-Generierung Â· unverÃ¤ndert | âœ… |
| **ðŸ“¦ WhatsApp Version** | [2, 3000, 1032141294] Â· Basiert auf @neelify/baileys 7.0.0-rc.9 | âœ… |

</div>

### ðŸ”¥ **Neue Funktionen**

#### ðŸš€ **`createSmartMessageQueue()`** - Intelligente Nachrichten-Warteschlange â­ **NEU!**

Die ultimative LÃ¶sung fÃ¼r zuverlÃ¤ssiges Nachrichtenversenden mit automatischen Retries, PrioritÃ¤ten und Rate-Limiting!

```typescript
import { createSmartMessageQueue } from '@neelify/baileys'

// Queue erstellen
const queue = createSmartMessageQueue(sock, {
  maxRetries: 3,           // Max. 3 Retry-Versuche
  retryDelay: 1000,        // 1 Sekunde Basis-Delay
  maxConcurrent: 5,        // Max. 5 gleichzeitige Nachrichten
  onSuccess: (message) => {
    console.log('âœ… Nachricht erfolgreich gesendet!')
  },
  onError: (message, error) => {
    console.error('âŒ Nachricht fehlgeschlagen:', error)
  }
})

// Nachrichten zur Queue hinzufÃ¼gen
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
- âœ… **Automatische Retries** mit Exponential Backoff
- âœ… **PrioritÃ¤ts-System** (high > normal > low)
- âœ… **Rate-Limiting** durch maxConcurrent
- âœ… **Error-Handling** mit Callbacks
- âœ… **Queue-Statistiken** fÃ¼r Monitoring
- âœ… **Pause/Resume** fÃ¼r flexible Kontrolle

#### 1. **`onWhatsApp()`** - PrÃ¼fe ob Nummer auf WhatsApp ist

```typescript
const [result] = await sock.onWhatsApp('491234567890@s.whatsapp.net')
if (result?.exists) {
  console.log(`âœ… ${result.jid} ist auf WhatsApp!`)
}
```

#### 2. **`executeUSyncQuery()`** - USync-Queries ausfÃ¼hren

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
  console.log('âœ… Key-Bundle ist gÃ¼ltig')
} catch (error) {
  console.log('âš ï¸ Key-Bundle ungÃ¼ltig, Pre-Keys werden hochgeladen')
}
```

#### 4. **`rotateSignedPreKey()`** - Signed Pre-Key rotieren

```typescript
await sock.rotateSignedPreKey()
console.log('âœ… Signed Pre-Key wurde rotiert')
```

### ðŸ”„ **Automatische Update-PrÃ¼fung**

Bei jedem Start wird automatisch geprÃ¼ft, ob eine neue Version verfÃ¼gbar ist:

```
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘  ðŸ”” NEUES UPDATE VERFÃœGBAR! ðŸ””        â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘  @neelify/baileys                    â•‘
â•‘  Aktuelle Version: 1.6.6               â•‘
â•‘  Neue Version:     1.7.0                â•‘
â•‘                                        â•‘
â•‘  Bitte aktualisiere:                  â•‘
â•‘  npm install @neelify/baileys@latest â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
```

---

## ðŸ’¡ Grundlegende Verwendung

### ðŸ“± **Nachrichten senden**

```typescript
// Text-Nachricht
await sock.sendMessage(jid, { text: 'Hallo! ðŸŒ¸' })

// Mit Quote (Antwort)
await sock.sendMessage(jid, { 
  text: 'Das ist eine Antwort!' 
}, { 
  quoted: originalMessage 
})

// Mit ErwÃ¤hnung
await sock.sendMessage(jid, {
  text: '@491234567890 Hallo!',
  mentions: ['491234567890@s.whatsapp.net']
})
```

### ðŸ–¼ï¸ **Medien senden**

```typescript
// Bild
await sock.sendMessage(jid, {
  image: { url: './bild.jpg' },
  caption: 'SchÃ¶nes Bild! ðŸŒ¸'
})

// Video
await sock.sendMessage(jid, {
  video: { url: './video.mp4' },
  caption: 'Mein Video! ðŸŽ¬'
})

// GIF (als Video mit gifPlayback Flag)
await sock.sendMessage(jid, {
  video: { url: './animation.mp4' },
  gifPlayback: true,
  caption: 'Kawaii GIF! âœ¨'
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

### ðŸ‘¥ **Gruppen**

```typescript
// Gruppe erstellen
const group = await sock.groupCreate('Meine Gruppe', [
  '491234567890@s.whatsapp.net',
  '499876543210@s.whatsapp.net'
])

// Teilnehmer hinzufÃ¼gen
await sock.groupParticipantsUpdate(
  group.id,
  ['491111111111@s.whatsapp.net'],
  'add'
)

// Gruppenname Ã¤ndern
await sock.groupUpdateSubject(group.id, 'Neuer Gruppenname')

// Gruppenbeschreibung Ã¤ndern
await sock.groupUpdateDescription(group.id, 'Neue Beschreibung')

// Gruppen-Einstellungen Ã¤ndern
await sock.groupSettingUpdate(group.id, 'announcement') // Nur Admins kÃ¶nnen schreiben
await sock.groupSettingUpdate(group.id, 'not_announcement') // Alle kÃ¶nnen schreiben
```

### ðŸ“Š **Umfragen (Polls)**

```typescript
await sock.sendMessage(jid, {
  poll: {
    name: 'Was ist deine Lieblingsfarbe?',
    values: ['Rot', 'Blau', 'GrÃ¼n', 'Gelb'],
    selectableCount: 1 // Anzahl der auswÃ¤hlbaren Optionen
  }
})
```

### â­ **Reaktionen**

```typescript
// Reaktion hinzufÃ¼gen
await sock.sendMessage(jid, {
  react: {
    text: 'â¤ï¸',
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

## ðŸŽ¯ Erweiterte Features

### ðŸš€ **Smart Message Queue - Praktisches Beispiel**

```typescript
import { createSmartMessageQueue } from '@neelify/baileys'

// Queue fÃ¼r Bulk-Messaging erstellen
const bulkQueue = createSmartMessageQueue(sock, {
  maxRetries: 5,
  retryDelay: 2000,
  maxConcurrent: 3, // Nicht zu viele gleichzeitig
  onSuccess: (msg) => {
    console.log(`âœ… Gesendet an ${msg.jid}`)
  },
  onError: (msg, err) => {
    console.error(`âŒ Fehler bei ${msg.jid}:`, err.message)
  }
})

// Viele Nachrichten hinzufÃ¼gen
const recipients = [
  '491234567890@s.whatsapp.net',
  '499876543210@s.whatsapp.net',
  '491111111111@s.whatsapp.net'
]

for (const jid of recipients) {
  await bulkQueue.add({
    jid,
    message: { text: 'Wichtige AnkÃ¼ndigung! ðŸ“¢' },
    priority: 'high'
  })
}

// Statistik prÃ¼fen
setInterval(() => {
  const stats = bulkQueue.getStats()
  console.log(`Queue: ${stats.pending} pending, ${stats.processing} processing, ${stats.failed} failed`)
}, 5000)
```

### ðŸ’  **LID-KompatibilitÃ¤t (Linked ID)**

LID sorgt dafÃ¼r, dass Benutzer auch Ã¼ber gerÃ¤teÃ¼bergreifende IDs korrekt erkannt werden:

```typescript
import { jidDecode, jidEncode, isLidUser } from '@neelify/baileys'

// PrÃ¼fe ob es eine LID ist
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

### ðŸ” **Sichere Sender-ID-Extraktion**

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

### ðŸ“¥ **Medien herunterladen**

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
    console.log('âœ… Bild gespeichert!')
  }
})
```

### ðŸ”„ **Nachrichten bearbeiten**

```typescript
// Nachricht bearbeiten
const sentMessage = await sock.sendMessage(jid, { text: 'UrsprÃ¼nglicher Text' })

// SpÃ¤ter bearbeiten
await sock.sendMessage(jid, {
  text: 'Bearbeiteter Text',
  edit: sentMessage.key
})
```

### ðŸ—‘ï¸ **Nachrichten lÃ¶schen**

```typescript
// FÃ¼r alle lÃ¶schen
await sock.sendMessage(jid, { delete: message.key })

// Nur fÃ¼r mich lÃ¶schen (via chatModify)
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

### ðŸ“Œ **Nachrichten anpinnen**

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

### ðŸ“ **Standort senden**

```typescript
await sock.sendMessage(jid, {
  location: {
    degreesLatitude: 52.520008,
    degreesLongitude: 13.404954
  }
})
```

### ðŸ“‡ **Kontakt teilen**

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

### ðŸ”„ **Nachrichten weiterleiten**

```typescript
await sock.sendMessage(jid, {
  forward: originalMessage
})
```

---

## ðŸ“š Dokumentation

### ðŸŽ§ **Events (Event-Handler)**

```typescript
// Verbindungs-Updates
sock.ev.on('connection.update', (update) => {
  if (update.qr) {
    console.log('ðŸ“± QR-Code:', update.qr)
  }
  if (update.connection === 'open') {
    console.log('âœ… Verbunden!')
  }
})

// Neue Nachrichten
sock.ev.on('messages.upsert', ({ messages, type }) => {
  console.log('ðŸ“¥ Neue Nachricht:', messages[0])
})

// Nachrichten-Updates (z.B. gelesen, gelÃ¶scht)
sock.ev.on('messages.update', (updates) => {
  updates.forEach(({ key, update }) => {
    if (update.status) {
      console.log('ðŸ“Š Status Update:', update.status)
    }
  })
})

// Credentials-Update (wichtig fÃ¼r Session-Speicherung!)
sock.ev.on('creds.update', saveCreds)

// Kontakte-Update
sock.ev.on('contacts.update', (updates) => {
  updates.forEach(update => {
    console.log('ðŸ‘¤ Kontakt-Update:', update)
  })
})

// Gruppen-Updates
sock.ev.on('groups.update', (updates) => {
  updates.forEach(update => {
    console.log('ðŸ‘¥ Gruppen-Update:', update)
  })
})

// Presence-Update (online, offline, typing)
sock.ev.on('presence.update', ({ id, presences }) => {
  console.log('ðŸŸ¢ Presence:', id, presences)
})
```

### ðŸ”§ **Socket-Konfiguration**

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
  
  // VollstÃ¤ndige Historie synchronisieren
  syncFullHistory: false,
  
  // Logger (optional)
  logger: pino({ level: 'silent' }),
  
  // Message-Store (fÃ¼r Retry & Poll-Votes)
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

### ðŸ’¾ **Session-Speicherung**

```typescript
import { useMultiFileAuthState, BufferJSON } from '@neelify/baileys'
import { readFileSync, writeFileSync } from 'fs'

// Option 1: Multi-File (einfach, empfohlen fÃ¼r Entwicklung)
const { state, saveCreds } = await useMultiFileAuthState('./auth_info')

// Option 2: Single-File (fÃ¼r Produktion)
import { useSingleFileAuthState } from '@neelify/baileys'

const { state, saveCreds } = await useSingleFileAuthState('./auth.json')

// Option 3: Custom (fÃ¼r Datenbanken)
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

### ðŸ—„ï¸ **Message Store (fÃ¼r Retry & Poll-Votes)**

```typescript
import { makeInMemoryStore } from '@neelify/baileys'

// In-Memory Store (fÃ¼r Entwicklung)
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

## âš ï¸ Wichtige Hinweise

### ðŸš¨ **Disclaimer**

> âš ï¸ **WICHTIG**: Dieses Projekt steht in **keiner offiziellen Verbindung** zu WhatsApp.
> 
> - âœ–ï¸ **Kein Spam** oder Massennachrichten
> - âœ–ï¸ **Kein Missbrauch** fÃ¼r unethische Zwecke  
> - âœ–ï¸ **Keine Stalkerware** oder automatisierte Ãœberwachung
> - âœ”ï¸ **Verantwortungsvoller Gebrauch** wird erwartet
> 
> Die Entwickler:innen Ã¼bernehmen **keine Verantwortung** fÃ¼r den Gebrauch.

### ðŸ”’ **Sicherheit**

- **Nie** deine Auth-Dateien Ã¶ffentlich teilen
- **Immer** `.gitignore` fÃ¼r Auth-Ordner verwenden
- **RegelmÃ¤ÃŸig** Backups erstellen
- **Sichere** PasswÃ¶rter fÃ¼r deine Server verwenden

### ðŸ’¡ **Best Practices**

1. **Session-Speicherung**: Immer `useMultiFileAuthState` oder Ã¤hnliches verwenden
2. **Error-Handling**: Immer try-catch fÃ¼r wichtige Operationen
3. **Rate-Limiting**: Nicht zu viele Nachrichten auf einmal senden (nutze Smart Queue!)
4. **Logging**: Logger fÃ¼r Debugging verwenden
5. **Updates**: RegelmÃ¤ÃŸig auf Updates prÃ¼fen

---

## ðŸ’¬ Support & Community

<div align="center">

### ðŸŒ¸ **Made with Love by @neelify** ðŸŒ¸

[![GitHub](https://img.shields.io/badge/GitHub-@neelify-pink?style=for-the-badge&logo=github)](https://github.com/neelify)
[![Email](https://img.shields.io/badge/Email-Support-pink?style=for-the-badge&logo=gmail)](mailto:neelehoven@gmail.com)

**â­ Wenn dir dieses Projekt gefÃ¤llt, gib ihm ein Star auf GitHub! â­**

</div>

---

## ðŸ“ Changelog

### Version 2.0.2 (Aktuell) ðŸŽ‰

- ðŸ“– **README Glow-Up** â€“ Version 2.0.2, Badges & Changelog
- ðŸ”” **Update-Check** â€“ Liest Version von **npm-Registry** (registry.npmjs.org), nur 1Ã— pro Prozess
- âœ¨ Semver-Vergleich fÃ¼r â€žUpdate verfÃ¼gbarâ€œ nur bei wirklich neuerer Version
- ðŸŽ¨ **QR-Code** & **Message ID** â€“ unverÃ¤ndert
- ðŸ”„ Kompatibel mit **Baileys API 1.7.2**

### Version 2.0.1

- ðŸ”„ Upstream aus Backup Baileys Â· LID in Pairing Â· historySyncConfig Â· getWebInfo Â· Defaults

### Version 2.0.0

- ðŸ”„ Upstream aus Backup Baileys â€“ validate-connection, Defaults & Pairing angeglichen
- ðŸ” LID in Pairing Â· ðŸ“¤ historySyncConfig Â· ðŸŒ getWebInfo Â· âš™ï¸ Defaults
- ðŸŽ¨ QR-Code & Message ID unverÃ¤ndert Â· WhatsApp-Version [2, 3000, 1032141294]

### Version 1.1.2

- ðŸ“– README Glow-Up, Baileys API 1.7.2 Badge
- ðŸš€ Smart Message Queue, Auto-Update-PrÃ¼fung
- ðŸŽ¨ QR-Code-Anzeige Â· Message ID unverÃ¤ndert

### Version 1.7.1

- ðŸ“– README Glow-Up, Smart Message Queue, Auto-Update-Check
- ðŸŽ¨ QR-Anzeige, Message ID System

### Version 1.7.0

- ðŸš€ **Smart Message Queue** eingefÃ¼hrt
- âœ¨ Auto-Update-Check, QR-Anzeige, Message ID System

### Version 1.6.6

- âœ¨ **Automatische Update-PrÃ¼fung** hinzugefÃ¼gt
- ðŸŽ¨ **Verbesserte QR-Code-Anzeige** mit Version-Info
- ðŸ”„ **WhatsApp-Version** aktualisiert auf [2, 3000, 1032141294]
- ðŸš€ **Basiert auf** @neelify/baileys 7.0.0-rc.9
- ðŸ› ï¸ **Verbesserte Socket-StabilitÃ¤t**
- ðŸ” **Verbesserte Pre-Key-Verwaltung**

### Version 1.6.5

- ðŸ†• Neue Funktionen: `onWhatsApp()`, `executeUSyncQuery()`
- ðŸ” `digestKeyBundle()` und `rotateSignedPreKey()` hinzugefÃ¼gt
- ðŸ’Ž WAM Buffer Support

---

<div align="center">

### âœ¨ *MÃ¶ge dein Bot so bezaubernd sein wie ein Anime-MÃ¤dchen mit Glitzeraugen* âœ¨

**ðŸŒ¸ Stay kawaii, stay connected! ðŸŒ¸**

[â¬†ï¸ Nach oben](#-neelifybaileys)

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

1. `package.json` Name und Dependency-Namespace prüfen.
2. Alle `require(...)` und `import ... from ...` Referenzen auf neue Scopes prüfen.
3. README-Install-Befehle und Snippets aktualisieren.
4. NPM-Badges auf den neuen Scope umstellen.
5. Alle GitHub-Links auf den neuen Namespace umstellen.
6. Export-Map validieren (`exports` in package.json).
7. Smoke-Test ausführen (`node -e "require('./lib/index.js')"`).
8. `npm pack --dry-run` ausführen und Tarball-Liste prüfen.
9. Finalen Publish mit korrektem Scope durchführen.

### Namespace Sanity Checks

```bash
# 1) Prüfen, ob altes Branding noch im Source ist
rg -n --glob "!node_modules/**" "@neelify|@whiskeysockets|neelify|WhiskeySockets" .
```

```bash
# 2) Prüfen, ob neue Namespace-Referenzen gesetzt sind
rg -n --glob "!node_modules/**" "@neelify/baileys|@neelify/libsignal|@neelify/wa-api" .
```

```bash
# 3) Smoke Import
node -e "require('./lib/index.js'); console.log('ok')"
```

### CJS Compatibility Notes

- Dieses Paket bleibt CommonJS-first.
- `main` und `module` zeigen beide auf `lib/index.js`.
- `exports` unterstützt den Package-Einstieg sowie `./lib/*` und `./WAProto/*`.

### Wichtig: Unveränderte kritische Bereiche

Die folgenden Bereiche bleiben absichtlich unangetastet:

- Message-ID Signatur `NEELE`
- QR-Code Event-/Pairing-Logik
- Low-Level WAProto Keys
- Funktional kritische interne Konstanten

### Troubleshooting

#### `Error: Cannot find module '@neelify/libsignal'`

- Stelle sicher, dass `@neelify/libsignal` in `dependencies` enthalten ist.
- Prüfe, ob dein Package Manager den neuen Scope korrekt auflöst.
- Führe ggf. eine saubere Neuinstallation aus:

```bash
rm -rf node_modules package-lock.json
npm install
```

#### `npm publish` schlägt mit Scope-Fehler fehl

- Prüfe den Scope in `name` (`@neelify/baileys`).
- Prüfe `publishConfig.access = public`.
- Prüfe NPM-Berechtigungen für den Scope.

#### README-Badges zeigen alte Daten

- Ersetze alle Badge-URLs auf den `@neelify/*` Scope.
- Prüfe NPM-Badge links auf Tippfehler.

### Release Checklist (Namespace)

- [ ] `name` ist `@neelify/baileys`
- [ ] `dependencies` zeigen auf `@neelify/libsignal`
- [ ] README nutzt `@neelify/baileys` in allen Snippets
- [ ] Keine alten Scope-Strings im Source
- [ ] `npm pack --dry-run` ist sauber
- [ ] Version wurde erhöht

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

### Hinweis für Integratoren

Wenn du zuvor harte String-Vergleiche auf alte Scope-Namen verwendet hast (z.B. Telemetrie, Logger, Health-Checks), aktualisiere diese auf `@neelify/*`, damit Monitoring und Build-Checks sauber bleiben.

---
