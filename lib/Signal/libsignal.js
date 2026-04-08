"use strict"

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k
    var desc = Object.getOwnPropertyDescriptor(m, k)
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k] } }
    }
    Object.defineProperty(o, k2, desc)
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k
    o[k2] = m[k]
}))

var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v })
}) : function(o, v) {
    o["default"] = v
})

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
}
Object.defineProperty(exports, "__esModule", { value: true })

const libsignal = __importStar(require("@neelegirly/libsignal"))
const WASignalGroup_1 = require("./WASignalGroup")
const Utils_1 = require("../Utils")
const WABinary_1 = require("../WABinary")

function makeLibSignalRepository(auth, logger, pnFromLIDUSync) {
    const normalizeMappingJid = (jid = '') => String(jid || '').trim().replace(/:\d+(?=@)/, '')
    const getAddressUserAndDevice = (id = '') => {
        const raw = String(id || '').trim()
        if (!raw) {
            return { user: '', device: '0' }
        }
        const parts = raw.split('.')
        if (parts.length === 1) {
            return { user: parts[0], device: '0' }
        }
        const device = String(parts.pop() || '0')
        return { user: parts.join('.'), device: device || '0' }
    }
    const jidUserPart = (jid = '') => normalizeMappingJid(jid).split('@')[0] || ''
    const withDevice = (jid = '', reference = '') => {
        const normalized = normalizeMappingJid(jid)
        if (!normalized || !normalized.includes('@')) {
            return normalized
        }
        if (/:\d+(?=@)/.test(String(jid || ''))) {
            return normalized
        }
        const decoded = reference ? WABinary_1.jidDecode(reference) : null
        if (!decoded?.device && decoded?.device !== 0) {
            return normalized
        }
        const [local, domain = ''] = normalized.split('@')
        return `${local}:${decoded.device}@${domain}`
    }
    const unique = (values = []) => Array.from(new Set(values.filter(Boolean)))
    const sessionAddressCache = new Map()
    const invalidateSessionAddressCache = () => {
        sessionAddressCache.clear()
    }
    const hasExplicitDevice = (jid = '') => {
        const decoded = WABinary_1.jidDecode(String(jid || '').trim())
        return typeof decoded?.device === 'number'
    }
    const lidMapping = {
        async storeLIDPNMappings(mappings = []) {
            const lidUpdates = {}
            const pnUpdates = {}
            for (const entry of mappings || []) {
                const lid = normalizeMappingJid(entry?.lid)
                const pn = normalizeMappingJid(entry?.pn)
                if (!/@lid$/i.test(lid) || !/@(s\.whatsapp\.net|c\.us)$/i.test(pn)) {
                    continue
                }
                lidUpdates[lid] = { lid, pn, updatedAt: Date.now() }
                pnUpdates[pn] = { lid, pn, updatedAt: Date.now() }
            }
            if (!Object.keys(lidUpdates).length && !Object.keys(pnUpdates).length) {
                return false
            }
            await auth.keys.set({
                ...(Object.keys(lidUpdates).length ? { 'lid-mapping': lidUpdates } : {}),
                ...(Object.keys(pnUpdates).length ? { 'pn-mapping': pnUpdates } : {})
            })
            return true
        },
        async getPNForLID(lid = '') {
            const normalizedLid = normalizeMappingJid(lid)
            if (!/@lid$/i.test(normalizedLid)) {
                return null
            }
            const { [normalizedLid]: mapping } = await auth.keys.get('lid-mapping', [normalizedLid])
            return normalizeMappingJid(mapping?.pn || '') || null
        },
        async getLIDForPN(pn = '') {
            const normalizedPn = normalizeMappingJid(pn)
            if (!/@(s\.whatsapp\.net|c\.us)$/i.test(normalizedPn)) {
                return null
            }
            const { [normalizedPn]: mapping } = await auth.keys.get('pn-mapping', [normalizedPn])
            const cachedLid = normalizeMappingJid(mapping?.lid || '')
            if (cachedLid) {
                return cachedLid
            }
            if (typeof pnFromLIDUSync === 'function') {
                try {
                    const fetched = await pnFromLIDUSync([normalizedPn])
                    const resolved = normalizeMappingJid(fetched?.[0]?.lid || '')
                    if (resolved) {
                        await lidMapping.storeLIDPNMappings([{ lid: resolved, pn: normalizedPn }])
                        return resolved
                    }
                } catch (error) {
                    logger?.debug?.({ error, pn: normalizedPn }, 'failed to fetch PN->LID mapping via usync')
                }
            }
            return null
        },
        async getLIDsForPNs(pns = []) {
            const results = []
            for (const rawPn of pns || []) {
                const normalizedPn = normalizeMappingJid(rawPn)
                if (!normalizedPn) {
                    continue
                }
                const lid = await lidMapping.getLIDForPN(normalizedPn)
                if (lid) {
                    results.push({ pn: normalizedPn, lid })
                }
            }
            return results
        }
    }
    const resolveMappedSessionIds = async (id = '') => {
        const { user, device } = getAddressUserAndDevice(id)
        if (!user) {
            return []
        }
        const resolved = []
        const mappedPn = await lidMapping.getPNForLID(`${user}@lid`)
        if (mappedPn) {
            const pnUser = jidUserPart(mappedPn)
            if (pnUser) {
                resolved.push(`${pnUser}.${device || '0'}`)
                if ((device || '0') !== '0') {
                    resolved.push(`${pnUser}.0`)
                }
            }
        }
        const mappedLid = await lidMapping.getLIDForPN(`${user}@s.whatsapp.net`)
        if (mappedLid) {
            const lidUser = jidUserPart(mappedLid)
            if (lidUser) {
                resolved.push(`${lidUser}.${device || '0'}`)
                if ((device || '0') !== '0') {
                    resolved.push(`${lidUser}.0`)
                }
            }
        }
        return unique(resolved.filter((candidate) => candidate !== id))
    }
    const getSessionAddressIdsForJid = async (jid = '', type = 'msg') => {
        const normalized = normalizeMappingJid(jid)
        if (!normalized || !normalized.includes('@')) {
            return []
        }
        if (type !== 'msg' || hasExplicitDevice(jid)) {
            return [jidToSignalProtocolAddress(String(jid || '').trim()).toString()]
        }
        const relatedJids = [normalized]
        if (/@lid$/i.test(normalized)) {
            const mappedPn = await lidMapping.getPNForLID(normalized)
            if (mappedPn) {
                relatedJids.push(mappedPn)
            }
        }
        else if (/@(s\.whatsapp\.net|c\.us)$/i.test(normalized)) {
            const mappedLid = await lidMapping.getLIDForPN(normalized)
            if (mappedLid) {
                relatedJids.push(mappedLid)
            }
        }
        const sessionUsers = unique(relatedJids.map((value) => jidUserPart(value)).filter(Boolean))
        if (!sessionUsers.length) {
            return [jidToSignalProtocolAddress(normalized).toString()]
        }
        const cacheKey = sessionUsers.slice().sort().join('|')
        const cached = sessionAddressCache.get(cacheKey)
        if (cached?.length) {
            return [...cached]
        }
        const candidateIds = []
        for (const user of sessionUsers) {
            for (let device = 0; device <= 99; device += 1) {
                candidateIds.push(`${user}.${device}`)
            }
        }
        const existing = candidateIds.length
            ? await auth.keys.get('session', candidateIds)
            : {}
        const orderedIds = candidateIds.filter((candidateId) => !!existing?.[candidateId])
        const finalIds = orderedIds.length
            ? orderedIds
            : [jidToSignalProtocolAddress(normalized).toString()]
        sessionAddressCache.set(cacheKey, finalIds)
        return [...finalIds]
    }
    const toSignalId = (jid = '') => {
        const normalized = String(jid || '').trim()
        if (!normalized || !normalized.includes('@')) {
            return ''
        }
        return jidToSignalProtocolAddress(normalized).toString()
    }
    const buildSessionCandidates = (jid = '', reference = '') => {
        const normalized = normalizeMappingJid(jid)
        if (!normalized || !normalized.includes('@')) {
            return []
        }
        return unique([
            toSignalId(withDevice(normalized, reference)),
            toSignalId(normalized)
        ])
    }
    const storage = signalStorage(auth, { resolveMappedSessionIds, invalidateSessionAddressCache })
    return {
        lidMapping,
        async migrateSession(fromJid, toJid) {
            const normalizedFrom = normalizeMappingJid(fromJid)
            const normalizedTo = normalizeMappingJid(toJid)
            if (!normalizedFrom || !normalizedTo || normalizedFrom === normalizedTo) {
                return false
            }
            const fromCandidates = buildSessionCandidates(normalizedFrom, normalizedTo)
            const toCandidates = buildSessionCandidates(normalizedTo, normalizedFrom)
            const existing = await auth.keys.get('session', unique([...fromCandidates, ...toCandidates]))
            const sourceId = fromCandidates.find((candidate) => !!existing?.[candidate])
            if (!sourceId) {
                return false
            }
            const updates = {}
            for (const candidate of toCandidates) {
                if (candidate && candidate !== sourceId && !existing?.[candidate]) {
                    updates[candidate] = existing[sourceId]
                }
            }
            if (Object.keys(updates).length > 0) {
                await auth.keys.set({ 'session': updates })
                invalidateSessionAddressCache()
            }
            if (/@lid$/i.test(normalizedTo) && /@(s\.whatsapp\.net|c\.us)$/i.test(normalizedFrom)) {
                await lidMapping.storeLIDPNMappings([{ lid: normalizedTo, pn: normalizedFrom }])
            } else if (/@lid$/i.test(normalizedFrom) && /@(s\.whatsapp\.net|c\.us)$/i.test(normalizedTo)) {
                await lidMapping.storeLIDPNMappings([{ lid: normalizedFrom, pn: normalizedTo }])
            }
            return true
        },
        decryptGroupMessage({ group, authorJid, msg }) {
            const senderName = jidToSignalSenderKeyName(group, authorJid)
            const cipher = new WASignalGroup_1.GroupCipher(storage, senderName)
            return cipher.decrypt(msg)
        },
        async processSenderKeyDistributionMessage({ item, authorJid }) {
            const builder = new WASignalGroup_1.GroupSessionBuilder(storage)
            const senderName = jidToSignalSenderKeyName(item.groupId, authorJid)
            const senderMsg = new WASignalGroup_1.SenderKeyDistributionMessage(null, null, null, null, item.axolotlSenderKeyDistributionMessage)
            const { [senderName]: senderKey } = await auth.keys.get('sender-key', [senderName])
            if (!senderKey) {
                await storage.storeSenderKey(senderName, new WASignalGroup_1.SenderKeyRecord())
            }
            await builder.process(senderName, senderMsg)
        },
        async decryptMessage({ jid, type, ciphertext }) {
            const signalIds = await getSessionAddressIdsForJid(jid, type)
            let lastError
            for (const signalId of signalIds) {
                const { user, device } = getAddressUserAndDevice(signalId)
                const addr = new libsignal.ProtocolAddress(user, Number(device || '0'))
                const session = new libsignal.SessionCipher(storage, addr)
                try {
                    switch (type) {
                        case 'pkmsg':
                            return await session.decryptPreKeyWhisperMessage(ciphertext)
                        case 'msg':
                            return await session.decryptWhisperMessage(ciphertext)
                    }
                }
                catch (error) {
                    lastError = error
                }
            }
            throw lastError || new Error('Failed to decrypt message')
        },
        async encryptMessage({ jid, data }) {
            const addr = jidToSignalProtocolAddress(jid)
            const cipher = new libsignal.SessionCipher(storage, addr)
            const { type: sigType, body } = await cipher.encrypt(data)
            const type = sigType === 3 ? 'pkmsg' : 'msg'
            return { type, ciphertext: Buffer.from(body, 'binary') }
        },
        async encryptGroupMessage({ group, meId, data }) {
            const senderName = jidToSignalSenderKeyName(group, meId)
            const builder = new WASignalGroup_1.GroupSessionBuilder(storage)
            const { [senderName]: senderKey } = await auth.keys.get('sender-key', [senderName])
            if (!senderKey) {
                await storage.storeSenderKey(senderName, new WASignalGroup_1.SenderKeyRecord())
            }
            const senderKeyDistributionMessage = await builder.create(senderName)
            const session = new WASignalGroup_1.GroupCipher(storage, senderName)
            const ciphertext = await session.encrypt(data)
            return {
                ciphertext,
                senderKeyDistributionMessage: senderKeyDistributionMessage.serialize(),
            }
        },
        async injectE2ESession({ jid, session }) {
            const cipher = new libsignal.SessionBuilder(storage, jidToSignalProtocolAddress(jid))
            await cipher.initOutgoing(session)
            invalidateSessionAddressCache()
        },
        jidToSignalProtocolAddress(jid) {
            return jidToSignalProtocolAddress(jid).toString()
        },
        async validateSession(jid) {
            try {
                const addr = jidToSignalProtocolAddress(jid)
                const session = await storage.loadSession(addr.toString())
                if (!session) {
                    return { exists: false, reason: 'no session' }
                }
                if (typeof session.haveOpenSession === 'function' && !session.haveOpenSession()) {
                    return { exists: false, reason: 'no open session' }
                }
                return { exists: true }
            } catch (_error) {
                return { exists: false, reason: 'validation error' }
            }
        },
    }
}

const jidToSignalProtocolAddress = (jid) => {
    const { user, device } = WABinary_1.jidDecode(jid)
    return new libsignal.ProtocolAddress(user, device || 0)
}

const jidToSignalSenderKeyName = (group, user) => {
    return new WASignalGroup_1.SenderKeyName(group, jidToSignalProtocolAddress(user)).toString()
}

function signalStorage({ creds, keys }, helpers = {}) {
    const { resolveMappedSessionIds, invalidateSessionAddressCache } = helpers
    return {
        loadSession: async (id) => {
            const { [id]: sess } = await keys.get('session', [id])
            if (sess) {
                return libsignal.SessionRecord.deserialize(sess)
            }
            const fallbackIds = typeof resolveMappedSessionIds === 'function' ? await resolveMappedSessionIds(id) : []
            if (fallbackIds.length) {
                const fallbackSessions = await keys.get('session', fallbackIds)
                for (const fallbackId of fallbackIds) {
                    if (fallbackSessions?.[fallbackId]) {
                        return libsignal.SessionRecord.deserialize(fallbackSessions[fallbackId])
                    }
                }
            }
        },
        storeSession: async (id, session) => {
            await keys.set({ 'session': { [id]: session.serialize() } })
            if (typeof invalidateSessionAddressCache === 'function') {
                invalidateSessionAddressCache()
            }
        },
        isTrustedIdentity: () => {
            return true
        },
        loadPreKey: async (id) => {
            const keyId = id.toString()
            const { [keyId]: key } = await keys.get('pre-key', [keyId])
            if (key) {
                return {
                    privKey: Buffer.from(key.private),
                    pubKey: Buffer.from(key.public)
                }
            }
        },
        removePreKey: (id) => keys.set({ 'pre-key': { [id]: null } }),
        loadSignedPreKey: () => {
            const key = creds.signedPreKey
            return {
                privKey: Buffer.from(key.keyPair.private),
                pubKey: Buffer.from(key.keyPair.public)
            }
        },
        loadSenderKey: async (keyId) => {
            const { [keyId]: key } = await keys.get('sender-key', [keyId])
            if (key) {
                return new WASignalGroup_1.SenderKeyRecord(key)
            }
        },
        storeSenderKey: async (keyId, key) => {
            await keys.set({ 'sender-key': { [keyId]: key.serialize() } })
        },
        getOurRegistrationId: () => (creds.registrationId),
        getOurIdentity: () => {
            const { signedIdentityKey } = creds
            return {
                privKey: Buffer.from(signedIdentityKey.private),
                pubKey: Utils_1.generateSignalPubKey(signedIdentityKey.public),
            }
        }
    }
}

module.exports = {
  makeLibSignalRepository
}
