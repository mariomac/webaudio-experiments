type Pitch = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
type Halftone = '+' | '-'

interface Note {
    pitch?: Pitch
    halftone?: Halftone
    length: number // as a divisor. 1 == whole note
    octave: number
}

interface ChannelStatus {
    octave: 4
}

const minOctave = 1
const maxOctave = 8
const defaultOctave = 4
const minLength = 1
const maxLength = 64
const defaultLength = 4

class TabException {
    tab: string
    position: number
    message: string

    constructor(tab: string, position: number, message: string) {
        this.tab = tab;
        this.position = position;
        this.message = message;
    }
}

const tokenizer = new RegExp('^(' +
    '(([a-zA-Z])([+\-#]?)(\d*))' + // note, octave, silence...
    '|([<>])' + // increase/decrease octave
    '|\s+|\|' + // spaces or vertical bars are ignored
    '|(\{[^\{}]*}\d+)' + // anything into brackets followed by a number: tuplet
    +')').compile()

function parse(tab: string): Note[] {
    return parseSubString(tab, {octave: defaultOctave})
}

function parseSubString(tab: string, status: ChannelStatus): Note[] {
    const notes: Note[] = []
    const wholeTab = tab
    let index = 0
    while (tab.length > 0) {
        const match = tokenizer.exec(tab)
        if (match == null) {
            throw new TabException(wholeTab, index, `unexpected character '${tab[0]}'`)
        }
        tab = tab.substr(match.input.length)
        const token = match.input
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
                notes.push(parseNote(index, token))
                break
            case '<':
                if (status.octave <= minOctave) {
                    throw new TabException(tab, index, `can't decrease octave below ${minOctave}`)
                }
                status.octave--
                break
            case '>':
                if (status.octave >= maxOctave) {
                    throw new TabException(tab, index, `can't increase octave over ${minOctave}`)
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
                throw new TabException(tab, index, "unknown char ${tab[0]}")
        }
        index += token.length
    }
    return notes
}

function parseOctave(index: number, token: string, status: ChannelStatus) {

}

function parseSilence(index: number, token: string): Note {

}

function parseNote(index: number, token: string): Note {


}

function parseTuplet(token: string, status: ChannelStatus): Note[] {


}


/*

var tuplet = regexp.MustCompile('^\{(.*)}(\d+)$')

func parseTuplet(token []byte, c *channel) ([]Note, error) {
	sm := tuplet.FindSubmatch(token)
	if sm == nil {
		panic(fmt.Sprintf("wrong format for tuplet: %q! this is a bug", string(token)))
	}

	tNotes, err := parseSubstring(sm[1], c)
	if err != nil {
		return nil, err
	}

	nTuple, err := strconv.Atoi(string(sm[2]))
	if err != nil {
		return nil, fmt.Errorf("tuple needs a proper number suffix: %w", err)
	}

	for i := range tNotes {
		tNotes[i].Tuplet = uint(nTuple)
	}

	return tNotes, nil
}

func parseSilence(token []byte) (Note, error) {
	n := Note{Pitch: Silence}
	if len(token) == 1 {
		n.Length = defaultLength
		return n, nil
	}
	length, err := strconv.Atoi(string(token[1:]))
	if err != nil {
		return n, fmt.Errorf("wrong format for silence: %q. It must be an 'R' followed by a number", string(token))
	}
	n.Length = uint(length)
	return n, nil
}

var note = regexp.MustCompile('^([+\-#]?)(\d*)$')

func parseNote(token []byte, c *channel) (Note, error) {
	sm := note.FindSubmatch(token[1:])
	if sm == nil {
		panic(fmt.Sprintf("wrong format for note: %q! this is a bug", string(token)))
	}
	n := Note{
		Pitch:    getPitch(token[0]),
		Length:   defaultLength,
		Octave:   c.Octave,
		Halftone: NoHalftone,
	}
	// read Length
	if len(sm[2]) > 0 {
		l, err := strconv.Atoi(string(sm[2]))
		if err != nil {
			panic(fmt.Sprintf("wrong length for note: %q! this is a bug. Err: %s",
				string(token), err.Error()))
		}
		if l < minLength || l > maxLength {
			return Note{}, fmt.Errorf(
				"wrong note length: %d. Must be in range %d to %d", l, minLength, maxLength)
		}
		n.Length = uint(l)
	}
	// read halftone
	if len(sm[1]) > 0 {
		switch sm[1][0] {
		case '+', '#':
			n.Halftone = Sharp
		case '-':
			n.Halftone = Flat
		default:
			panic(fmt.Sprintf("wrong halftone '%c'! this is a bug", sm[1][0]))
		}
	}
	return n, nil
}

func parseOctave(token []byte, c *channel) error {
	i, err := strconv.Atoi(string(token[1:]))
	if err != nil {
		return err
	}
	if i < minOctave || i > maxOctave {
		return fmt.Errorf("octave value must be 1 to 8")
	}
	c.Octave = uint(i)
	return nil
}

var pitches = [8]Pitch{A, B, C, D, E, F, G}

func getPitch(c byte) Pitch {
	if c >= 'A' && c <= 'Z' {
		return pitches[c-'A']
	}
	if c >= 'a' && c <= 'z' {
		return pitches[c-'a']
	}
	panic(fmt.Sprintf("pitch can't be '%c'! this is a bug", c))
}

 */