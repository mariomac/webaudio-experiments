import * as Tone from 'tone';
import {Tokenizer} from "./mml/token";
import {Ast} from "./mml/ast";
import {ToneExporter} from "./mml/export";

document.getElementById("play")!.onclick = () => {
    const ta = document.getElementById("mmlstring")! as HTMLTextAreaElement
    const mmldesc = ta.value
    console.log(mmldesc)

    var synth = new Tone.PolySynth()
        .toDestination()

    const song = new ToneExporter()
        .export(new Ast(new Tokenizer(mmldesc)).parse())
    console.log(song)
    let parts = new Array<Tone.Part>()
    for (let channel of Object.values(song)) {
        //Song.Song[Song.Song.length] = undefined //insert end of song mark
        parts.push(new Tone.Part(function (time, event) {
            //the events will be given to the callback with the time they occur
            synth.triggerAttackRelease(event.note, event.duration, time)
        }, channel))
    }

//start the part at the beginning of the Transport's timeline
    Tone.Transport.bpm.value = 180
    parts.forEach(it => {
        it.start()
    })
    Tone.Transport.start()
}
