"use strict"

Object.defineProperty(exports, "__esModule", { value: true })

const WABinary_1 = require("../../WABinary")

class USyncUsernameProtocol {
    constructor() {
        this.name = 'username'
    }
    getQueryElement() {
        return {
            tag: 'username',
            attrs: {}
        }
    }
    getUserElement() {
        return null
    }
    parser(node) {
        if (node.tag === 'username') {
            WABinary_1.assertNodeErrorFree(node)
            return typeof node.content === 'string' ? node.content : null
        }
        return null
    }
}

module.exports = {
  USyncUsernameProtocol
}
