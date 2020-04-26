import {Ast} from "./ast"
import {Tokenizer} from "./token"

test("two channels parse", () => {
    const mml = `
@foo <- abcdefgo2<ab#4
      abcdeefga8

@1<-acbcdedgo2>ab#4
      abcdeebbfga38
`
    const song = new Ast(new Tokenizer(mml)).parse()
    expect(song.channels.size).toBe(2)

    const foo = song.channels.get("foo")!
    expect(foo.name).toBe("foo")
    expect(foo.notes).toHaveLength(18)

    const c1 = song.channels.get("1")!
    expect(c1.name).toBe("1")
    expect(c1.notes).toHaveLength(21)
})
