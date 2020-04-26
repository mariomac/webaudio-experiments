import {Channel, Song} from "./ast";
import {Tone} from "tone/build/esm/core/Tone";

export interface SongExporter<T> {
    export(s: Song): T
}

export interface ToneSong {
    [channel: string]: ToneNote[]
}

interface ToneNote {
    duration: string,
    note: string,
    time: number,
    velocity: number
}

export class ToneExporter implements SongExporter<ToneSong> {
    public export(s: Song): ToneSong {
        const sobj: ToneSong = {}
        s.channels.forEach((channel) => {
            sobj[channel.name] = ToneExporter.exportChannel(channel)
        })
        return sobj;
    }

    private static exportChannel(c: Channel): ToneNote[] {
        const toneNotes: ToneNote[] = []
        let sixteenths = 0
        for(let note of c.notes) {
            if (note.pitch != null) { // if not a silence
                const n : ToneNote = {
                    duration: `${note.length}n`,
                    note: note.pitch,
                    time: sixteenths/8,
                    velocity: 1
                }
                switch (note.halftone) {
                    case "+":
                        n.note += '#'
                        break
                    case "-":
                        n.note += 'b'
                        break
                }
                n.note += note.octave
                toneNotes.push(n)
            }
            let length = 16.0 / note.length
            if (note.tuplet !== undefined && note.tuplet >= 3) {
                length *= (note.tuplet-1) / note.tuplet
            }
            sixteenths += length
        }
        return toneNotes
    }
}
