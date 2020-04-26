type Pitch = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
type Halftone = '+' | '-'

interface Note {
    pitch?: Pitch // if no pitch, it's a silence
    halftone?: Halftone
    length: number // as a divisor. 1 == whole note
    octave?: number
    tuplet?: number
}

interface ChannelStatus {
    octave: number
}

const minOctave = 1
const maxOctave = 8
const defaultOctave = 4
const minLength = 1
const maxLength = 64
const defaultLength = 4

export class TabException {
    public readonly token: string
    public position: number
    public readonly message: string

    constructor(token: string, position: number, message: string) {
        this.token = token;
        this.position = position;
        this.message = message;
    }
}

const tokenizer = new RegExp('^(' +
    "(([a-zA-Z])([+\\-#]?)(\\d*))" + // note, octave, silence...
    '|([<>])' + // increase/decrease octave
    '|\\s+|\\|' + // spaces or vertical bars are ignored
    '|(\\{[^\\{}]*}\\d+)' + // anything into brackets followed by a number: tuplet
    ')')

export function parse(tab: string): Note[] {
    return parseSubString(tab, {octave: defaultOctave})
}

function parseSubString(tab: string, status: ChannelStatus): Note[] {
    const notes: Note[] = []
    const wholeTab = tab
    let index = 0
    while (tab.length > 0) {
        const match = tokenizer.exec(tab)
        if (match == null) {
            throw new TabException(tab[0], index, 'unexpected character')
        }
        tab = tab.substr(match[0].length)
        const token = match[0]
        switch (token[0].toLowerCase()) {
            case 'o':
                parseOctave(index, token, status)
                break
            case 'r':
                notes.push(parseSilence(index, token))
                break
            case 'a':
            case 'b':
            case 'c':
            case 'd':
            case 'e':
            case 'f':
            case 'g':
                notes.push(parseNote(index, token, status))
                break
            case '<':
                if (status.octave <= minOctave) {
                    throw new TabException(token, index, `can't decrease octave below ${minOctave}`)
                }
                status.octave--
                break
            case '>':
                if (status.octave >= maxOctave) {
                    throw new TabException(token, index, `can't increase octave over ${minOctave}`)
                }
                status.octave++
                break
            case '{':
                try {
                    notes.concat(parseTuplet(token, status))
                } catch (ex) {
                    if (ex instanceof TabException) {
                        // increase the index for proper indication
                        ex.position += index
                    }
                    // and rethrow
                    throw ex
                }
                break
            case ' ':
            case '\t':
            case '\n':
                // just ignore
                break
            default:
                throw new TabException(token, index, "unknown token")
        }
        index += token.length
    }
    return notes
}

const tuplet =  /^\{(.*)}(\d+)$/
function parseTuplet(token: string, status: ChannelStatus): Note[] {
    const sm = tuplet.exec(token)
    try {
        const notes = parseSubString(sm![1], status)
        const nTuple: number = parseInt(sm![2], 10)
        for (let i = 0 ; i < notes.length ; i++) {
            notes[i].tuplet = nTuple
        }
        return notes
    } catch(ex) {
        if (ex instanceof TabException) {
            ex.position++
        }
        throw ex
    }
}

function parseSilence(index: number, token: string): Note {
    if (token.length == 1) {
        return { length: defaultLength }
    }
    const n = token.substring(1)
    if (!/^\d+$/.test(n)) {
        throw new TabException(token, index+1, "silence must be an R followed by a number")
    }
    return {length: parseInt(n, 10) }
}

const pitches = new Map<string,Pitch>([
    ['a', 'A'], ['A', 'A'],
    ['b', 'B'], ['B', 'B'],
    ['c', 'C'], ['C', 'C'],
    ['d', 'D'], ['D', 'D'],
    ['e', 'E'], ['E', 'E'],
    ['f', 'F'], ['F', 'F'],
    ['g', 'G'], ['G', 'G'],
])

const note = /^([+\-#]?)(\d*)$/
function parseNote(index: number, token: string, status: ChannelStatus): Note {
    const sm = note.exec(token.substring(1))
    const n: Note = {
        pitch: pitches.get(token.substring(0, 1)),
        length: defaultLength,
        octave: status.octave,
    }
    if (sm == null || sm.length === 0) {
        return n
    }
    // note halftone
    if (sm[1].length > 0) {
        switch (sm[1]) {
            case '+':
            case '#':
                n.halftone = '+'
                break
            case '-':
                n.halftone = '-'
                break
        }
    }
    // note length
    if (sm[2].length > 0) {
        n.length = parseInt(sm[2])
        if (n.length < minLength || n.length > maxLength) {
            throw new TabException(token, index, `note length must be between ${minLength} and ${maxLength}`)
        }
    }
    return n
}

function parseOctave(index: number, token: string, status: ChannelStatus) {
    if (!/^[Oo]\d+$/.test(token)) {
        throw new TabException(token, index+1,
            `Octave must have a number between ${minOctave} and ${maxOctave}`)
    }
    const o = parseInt(token.substring(1), 10)
    if (o < minOctave || o > maxOctave) {
        throw new TabException(token, index,
            `Octave must have a number between ${minOctave} and ${maxOctave}`)
    }
    status.octave = o
}
