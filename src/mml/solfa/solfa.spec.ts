import {parse, TabException} from './solfa'

test('correct tab parse', () => {
    expect(parse("a16{abc}3b32co3a<b#3c-")).not.toBeNull()
})


describe('parse tab with exceptions', () => {
    test.each `
        description | inputTab | errPosition 
        ${"invalid chars"} | ${"z56"} | ${0}
        ${"length after halftone"} | ${"O5cde#88"} | ${4}
		${"octave without number"} | ${"cBaO"} | ${4}
		${"octave below minimum"} | ${"<<<<"} | ${3}
		${"octave over maximum"} | ${"o6>>>"} | ${4}
		${"wrong octave"} | ${"o99"} | ${0}
		${"wrong octave 0"} | ${"o0"} | ${0}
		${"two halftones"} | ${"A<<b--"} | ${5}
		${"wrong note length 0"} | ${"o5a0"} | ${2}
		${"wrong note length 1000"} | ${"O5a1000"} | ${2}
		${"invalid characters at the end"} | ${"abcde!!!"} | ${5}
		${"invalid notes"} | ${"abcdedgo2>ab#4abcdeebbfghwa38"} | ${24}
    `(
        '$description: should return error at position $errPosition',
        ({inputTab, errPosition}) => {
            let ex : TabException
            try {
                parse(inputTab)
            } catch(exc) {
                expect(exc).toBeInstanceOf(TabException)
                ex = exc
            }
            expect(ex!.position).toBe(errPosition)
        }
    )
})