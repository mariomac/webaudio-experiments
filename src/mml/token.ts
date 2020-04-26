type TokenType = 'channel' | 'arrow' | 'string'

const tokens = /(@\w+)|(<-)|\S+|\|+/

export class Tokenizer {
    rest: string // input that is is still not read
    last: string // last read token
    col: number // TODO position of the last read token
    row: number

    constructor(input: string) {
        this.rest = input;
    }

    next(): boolean {
        if (this.eof()) {
            return false
        }
        const match = tokens.exec(this.rest)
        if (match == null) {
            this.rest = ""
            this.last = ""
            return false
        }
        this.last = match[0]
        this.rest = this.rest.substring(match.index + this.last.length)
        return true
    }

    eof(): boolean {
        return this.rest == null || this.rest.length === 0
    }

    token(): Token {
        return parseToken(this.last)
    }
}

export interface Token {
    type: TokenType
    content: string
}

const channel = /^@\w+$/
const arrow = '<-'

function parseToken(content: string): Token {
    const ch = channel.exec(content)
    if (ch != null) {
        return {type: 'channel', content}
    }
    if (content === arrow) {
       return {type: 'arrow', content}
    }
    // TODO: verify the correct format of the string
    return {type: "string", content}
}
