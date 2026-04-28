"use strict"

Object.defineProperty(exports, "__esModule", { value: true })

const WABinary_1 = require("../WABinary")
const Protocols_1 = require("./Protocols")

class USyncQuery {
    constructor() {
        this.protocols = []
        this.users = []
        this.context = 'interactive'
        this.mode = 'query'
    }
    withMode(mode) {
        this.mode = mode
        return this
    }
    withContext(context) {
        this.context = context
        return this
    }
    withUser(user) {
        this.users.push(user)
        return this
    }
    parseUSyncQueryResult(result) {
        if (!result || result.attrs?.type !== 'result') {
            return
        }
        const protocolMap = Object.fromEntries(this.protocols.map((p) => [p.name, p.parser]))
        const queryResult = { list: [], sideList: [] }
        const usyncNode = WABinary_1.getBinaryNodeChild(result, 'usync')
        const listNode = usyncNode ? WABinary_1.getBinaryNodeChild(usyncNode, 'list') : undefined
        if (listNode?.content && Array.isArray(listNode.content)) {
            for (const node of listNode.content) {
                const id = node?.attrs?.jid
                if (!id) continue
                const data = Array.isArray(node?.content)
                    ? Object.fromEntries(node.content.map((content) => {
                        const protocol = content.tag
                        const parser = protocolMap[protocol]
                        const v = parser ? parser(content) : null
                        return [protocol, v]
                    }).filter(([, b]) => b !== null))
                    : {}
                queryResult.list.push({ ...data, id })
            }
        }
        //TODO: implement side list
        //const sideListNode = getBinaryNodeChild(usyncNode, 'side_list')
        return queryResult
    }
    withLIDProtocol() {
    	this.protocols.push(new Protocols_1.USyncLIDProtocol()) 
        return this
    }
    withDeviceProtocol() {
        this.protocols.push(new Protocols_1.USyncDeviceProtocol())
        return this
    }
    withContactProtocol() {
        this.protocols.push(new Protocols_1.USyncContactProtocol())
        return this
    }
    withStatusProtocol() {
        this.protocols.push(new Protocols_1.USyncStatusProtocol())
        return this
    }
    withBotProfileProtocol() {
    	this.protocols.push(new Protocols_1.USyncBotProfileProtocol())
        return this
    }
    withDisappearingModeProtocol() {
        this.protocols.push(new Protocols_1.USyncDisappearingModeProtocol())
        return this
    }
    withUsernameProtocol() {
        this.protocols.push(new Protocols_1.USyncUsernameProtocol())
        return this
    }
}

module.exports = {
  USyncQuery
}
