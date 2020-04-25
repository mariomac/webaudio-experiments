import * as Song from './song'
import {printLine} from "tslint/lib/verify/lines";

// https://pages.mtu.edu/~suits/notefreqs.html
// octaves --> notes
const frequencies = [
    {},
    {},
    {},
    {}, // only octave 4 atm
    {
        'c':261.63,
        'd':293.66,
        'e':329.63,
        'f':349.23,
        'g':392.00,
        'a':440,
        'b':493.88,
    },
]

class Player {
    private readonly ctx : AudioContext
    private readonly gain: GainNode
    constructor() {
        this.ctx = new AudioContext()
        this.gain = this.ctx.createGain()
        this.gain.connect(this.ctx.destination)
    }

    public playNote(o: number, p: string) {
        new OscillatorNode(ctx, {

        })
        const on = this.ctx.createOscillator()
        //const gain = this.ctx.createGain()
        //gain.connect(this.ctx.destination)
        // @ts-ignore
        on.frequency.value = frequencies[o][p]
        on.connect(this.gain)
        const ct = this.ctx.currentTime
        this.gain.gain.setValueAtTime(0, ct)
        this.gain.gain.linearRampToValueAtTime(0.8, ct + 0.05)
        this.gain.gain.linearRampToValueAtTime(0.6, ct + 0.1)
        this.gain.gain.linearRampToValueAtTime(0.6, ct + 0.2)
        this.gain.gain.linearRampToValueAtTime(0, ct + 0.25)
        on.start(ct)
        on.stop(ct+0.4)

        const a: number = 0o3333
    }
}

function playAudio() {
    const player = new Player()
    const player2 = new Player()

    setTimeout(() => {
        player.playNote(4, 'c')
        player2.playNote(4, 'b')
    }, 0)
    setTimeout(() => {
        player.playNote(4, 'd')
        player2.playNote(4, 'a')
    }, 500)
    setTimeout(() => {
        player.playNote(4, 'e')
        player2.playNote(4, 'e')
    }, 1000)
    setTimeout(() => {player.playNote(4, 'f')}, 1500)
    setTimeout(() => {player.playNote(4, 'g')}, 2000)
    setTimeout(() => {player.playNote(4, 'a')}, 2500)
    setTimeout(() => {player.playNote(4, 'b')}, 3000)
}

document.documentElement.onmousedown = () => {
    playAudio()
}


//document.querySelector('audio').onplay =  addEventListener("click", play)

