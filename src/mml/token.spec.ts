import {Tokenizer, Token} from './token'

test("tokenizer with two channels", () => {
    const mml = `

@0 <- abcdefgo1<ab4#
      abcdeefghwa3322

@troloro<-abcdedgo1<ab4#
	abcdeebbfghwa3322
`
    const tok = new Tokenizer(mml)
    const tokens: Token[] = []
    while (tok.next()) {
        tokens.push(tok.token())
    }
    expect(tokens).toStrictEqual([
        {type: 'channel', content: "@0"},
        {type: 'arrow', content: "<-"},
        {type: 'string', content: "abcdefgo1<ab4#"},
        {type: 'string', content: "abcdeefghwa3322"},
        {type: 'channel', content: "@troloro"},
        {type: 'arrow', content: "<-"},
        {type: 'string', content: "abcdedgo1<ab4#"},
        {type: 'string', content: "abcdeebbfghwa3322"},
    ])

})