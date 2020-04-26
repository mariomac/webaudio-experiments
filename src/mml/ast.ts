import {Token, Tokenizer} from "./token";
import {Note, parse} from './solfa'

export interface Song {
    channels: Map<string, Channel>
}

interface Channel {
    name: string
    notes: Note[]
}

const tabRegex = /^(([a-zA-Z][+\-#]?\d*)|[<>]|\||(\{[^\{}]*}\d+))*$/

export class Ast {
    private tokenizer: Tokenizer

    constructor(t: Tokenizer) {
        this.tokenizer = t;
    }

    public parse(): Song {
        const s = {channels: new Map<string, Channel>()}
        this.tokenizer.next()
        while (!this.tokenizer.eof()) {
            const token = this.tokenizer.token()
            switch (token.type) {
                case "channel":
                    const ch = this.channelNode()
                    s.channels.set(ch.name, ch)
                    break
                default:
                    throw new SyntaxError(this.tokenizer, token, "unexpected input. I was expecting a channel ID")
            }
        }
        return s
    }

    private channelNode(): Channel {
        let last = this.tokenizer.token()
        const c: Channel = {name: last.content.substring(1), notes: []}
        if (!this.tokenizer.next()) {
            throw new SyntaxError(this.tokenizer, {type: 'string', content: ''}, "unexpected EOF")
        }
        last = this.tokenizer.token()
        if (last.type !== 'arrow') {
            throw new SyntaxError(this.tokenizer, last, "expecting an arrow <-")
        }
        if (!this.tokenizer.next()) {
            throw new SyntaxError(this.tokenizer, {type: 'string', content: ''}, "unexpected EOF")
        }
        c.notes = parse(this.tablatureNode())
        return c
    }

    private tablatureNode(): string {
        let tablature = ""
        let tok = this.tokenizer.token()
        if (tok.type !== "string" && !tabRegex.test(tok.content)) {
            throw new SyntaxError(this.tokenizer, tok, "read string doesn'tokenizer look like a tablature")
        }
        tablature = tablature.concat(tok.content)
        while (this.tokenizer.next()) {
            tok = this.tokenizer.token()
            if (tok.type !== 'string' && !tabRegex.test(tok.content)) {
                return tablature
            }
            tablature = tablature.concat(tok.content)
        }
        return tablature
    }
}

export class SyntaxError extends Error {
    row: number
    col: number
    token: Token

    constructor(t: Tokenizer, tok: Token, msg: string) {
        super(msg);
        this.row = t.row
        this.col = t.col
        this.token = tok
    }
}