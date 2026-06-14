import { useState } from "react";

const THEMES = {
  dark: {
    bg:"#0c0f14", surface:"#131720", surface2:"#0c0f14",
    border:"#1e2535", borderHi:"#2a3040",
    text:"#dde3ed", textHi:"#f0f4ff", textMid:"#b0bcc8",
    textLo:"#6b7280", textMute:"#4a5568", textDead:"#2a3040",
    fretStr:"#334155", fretBar:"#1e2535", fretHi:"#475569", fretMark:"#2a3040",
    scrollBg:"#1a1f2a", scrollTh:"#2a3040",
    badge:"#451a03",
  },
  light: {
    bg:"#f5f6f8", surface:"#ffffff", surface2:"#f0f2f5",
    border:"#dde1e9", borderHi:"#c8cdd8",
    text:"#1a2030", textHi:"#0a0c12", textMid:"#2d3748",
    textLo:"#4a5568", textMute:"#6b7280", textDead:"#c8cdd8",
    fretStr:"#c8cdd8", fretBar:"#dde1e9", fretHi:"#9aa3b2", fretMark:"#c8cdd8",
    scrollBg:"#f0f2f5", scrollTh:"#c8cdd8",
    badge:"#fef3c7",
  },
};

// ─── Music Theory ─────────────────────────────────────────────────────────────

const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const addSemi = (note, n) => NOTES[(NOTES.indexOf(note) + n + 120) % 12];

// ─── Exotic Scale Definitions ─────────────────────────────────────────────────
// Groups organised by character/flavour. Each scale: triad base + build steps.

const SCALE_GROUPS = [
  {
    group: "Modified Major / Classical",
    color: "#F59E0B",
    dark: "#451a03",
    scales: [
      {
        id: "harmonic_major",
        name: "Harmonic Major",
        triadType: "Major",
        triadIntervals: [0, 4, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root — your home base. The Harmonic Major starts like a normal major scale but with one crucial twist coming up." },
          { semi:4,  iname:"3",   desc:"Major 3rd — bright and familiar. This is still a major triad at heart." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — solid foundation. Major triad complete." },
          { semi:2,  iname:"2",   desc:"Major 2nd — same as the major scale so far. Nothing unusual yet." },
          { semi:5,  iname:"4",   desc:"Perfect 4th — still matches the major scale." },
          { semi:8,  iname:"b6",  desc:"Minor 6th — HERE is the twist. The major scale has a natural 6th. Flattening it to b6 creates an augmented 2nd between the 5th and 6th, giving this scale its dramatic, slightly 'wrong' quality. It's the note that separates Harmonic Major from plain major." },
          { semi:11, iname:"7",   desc:"Major 7th — the leading tone is back, same as major. That b6 surrounded by natural intervals is what makes this scale so distinctive — dissonant but not chaotic." },
        ],
      },
      {
        id: "lydian_b7",
        name: "Lydian b7",
        triadType: "Major",
        triadIntervals: [0, 4, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. Lydian b7 (also called Lydian Dominant) is one of the most useful exotic scales — major character on top, dominant tension underneath." },
          { semi:4,  iname:"3",   desc:"Major 3rd — bright, confident." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — major triad complete." },
          { semi:2,  iname:"2",   desc:"Major 2nd — standard." },
          { semi:6,  iname:"#4",  desc:"Augmented 4th (#4 / b5) — Lydian's signature floating quality. That raised 4th gives it a dreamy, cinematic feel." },
          { semi:9,  iname:"6",   desc:"Major 6th — still bright and open." },
          { semi:10, iname:"b7",  desc:"Minor 7th — HERE the dominant character comes in. The combination of #4 and b7 is what makes this scale so powerful: dreamy Lydian brightness on top of dominant tension underneath. It appears as Mode IV of the melodic minor scale." },
        ],
      },
      {
        id: "lydian_minor",
        name: "Lydian Minor",
        triadType: "Major",
        triadIntervals: [0, 4, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. Lydian Minor is a hybrid — the raised 4th of Lydian combined with the darker upper register of natural minor. Otherworldly and cinematic." },
          { semi:4,  iname:"3",   desc:"Major 3rd — still a major triad, still fundamentally bright." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — solid foundation." },
          { semi:2,  iname:"2",   desc:"Major 2nd — same start as Lydian." },
          { semi:6,  iname:"#4",  desc:"Augmented 4th — the Lydian floating quality. Same as Lydian so far." },
          { semi:8,  iname:"b6",  desc:"Minor 6th — this is where it diverges from Lydian. Instead of the bright natural 6th, we drop to b6. Suddenly much darker." },
          { semi:10, iname:"b7",  desc:"Minor 7th — a b7 completes the picture. A major triad with #4, b6 and b7 — bright beginning, dark ending. Used in film scores for that unsettling-but-majestic sound." },
        ],
      },
      {
        id: "prometheus",
        name: "Prometheus",
        triadType: "Major",
        triadIntervals: [0, 4, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. The Prometheus scale was used by composer Alexander Scriabin and has a mystic, otherworldly sound. Six notes — a hexatonic scale." },
          { semi:4,  iname:"3",   desc:"Major 3rd — starts bright, which makes the incoming strangeness more jarring." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — major triad complete. Familiar so far." },
          { semi:2,  iname:"2",   desc:"Major 2nd — stepwise motion from root." },
          { semi:6,  iname:"#4",  desc:"Augmented 4th — the Lydian lift. Things are starting to sound otherworldly." },
          { semi:9,  iname:"6",   desc:"Major 6th — still relatively bright." },
          { semi:10, iname:"b7",  desc:"Minor 7th — the 7th is flattened, completing the six-note Prometheus scale. Notice there is no perfect 4th and no major 7th. That gap between the 3rd and #4 is what gives it its mystical, unresolved quality." },
        ],
      },
    ],
  },
  {
    group: "Middle Eastern / Byzantine",
    color: "#EF4444",
    dark: "#450a0a",
    scales: [
      {
        id: "byzantine",
        name: "Byzantine",
        triadType: "Major",
        triadIntervals: [0, 4, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. The Byzantine scale has an unmistakably exotic, dramatic character — augmented 2nds in two places give it its tension-filled, Middle Eastern sound." },
          { semi:4,  iname:"3",   desc:"Major 3rd — starts strong and bright like a major scale." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — major triad complete." },
          { semi:1,  iname:"b2",  desc:"Flat 2nd — first exotic twist. A half step above the root, creating immediate tension. This is the first augmented 2nd gap when you move from b2 to 3 — a full 3 semitones, that's what sounds 'Arabic'." },
          { semi:5,  iname:"4",   desc:"Perfect 4th — a moment of stability after the tension of the b2." },
          { semi:8,  iname:"b6",  desc:"Minor 6th — second augmented 2nd gap. The jump from 5 to b6 is another 3-semitone leap. Two augmented 2nds in one scale is what makes Byzantine so dramatic." },
          { semi:11, iname:"7",   desc:"Major 7th — the leading tone creates a strong pull back to the root. Byzantine is essentially a double harmonic major scale — the same intervals in two halves." },
        ],
      },
      {
        id: "persian",
        name: "Persian",
        triadType: "Diminished",
        triadIntervals: [0, 4, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. The Persian scale is one of the most dissonant and dramatic exotic scales — dense with half-steps and augmented intervals. Ancient, mysterious, genuinely unsettling." },
          { semi:4,  iname:"3",   desc:"Major 3rd — starts with a bright major 3rd, which makes the incoming tension more shocking." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — familiar major triad so far. The exotic character is entirely in the upper tones." },
          { semi:1,  iname:"b2",  desc:"Flat 2nd — a crushing half step above the root. Same as Phrygian, but Persian takes things much further." },
          { semi:5,  iname:"4",   desc:"Perfect 4th — the augmented 2nd between b2 and 3 and again between b2 and 4 creates the Persian tension." },
          { semi:8,  iname:"b6",  desc:"Minor 6th — the gap from 5 to b6 (augmented 2nd territory). Getting darker." },
          { semi:11, iname:"7",   desc:"Major 7th — rather than b7, the Persian scale uses a natural 7th. This creates intense tension between the b6 and 7, a tritone plus a semitone stacked together. Persian contains both a tritone and multiple augmented seconds." },
        ],
      },
      {
        id: "phrygian_dominant",
        name: "Phrygian Dominant",
        triadType: "Major",
        triadIntervals: [0, 4, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. Phrygian Dominant is Mode V of the Harmonic Minor scale — it's the scale used in flamenco, Middle Eastern music, and metal. Also called the Spanish Gypsy scale." },
          { semi:4,  iname:"3",   desc:"Major 3rd — dominant/major character, which creates the tension with the incoming b2." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — major triad complete." },
          { semi:1,  iname:"b2",  desc:"Flat 2nd — THE defining note. The major 3rd and flat 2nd together create that quintessential Flamenco / Middle Eastern sound. The augmented 2nd between b2 and 3 is what you hear in Spanish guitar." },
          { semi:5,  iname:"4",   desc:"Perfect 4th — a moment of resolve after the dramatic b2." },
          { semi:8,  iname:"b6",  desc:"Minor 6th — dark, same as Phrygian." },
          { semi:10, iname:"b7",  desc:"Minor 7th — completes the picture. Phrygian Dominant = Phrygian mode (b2, b3, b6, b7) but with a raised 3rd. It's that raised 3rd against the b2 that creates the iconic sound." },
        ],
      },
      {
        id: "mixolydian_b2",
        name: "Mixolydian b2",
        triadType: "Major",
        triadIntervals: [0, 4, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. Mixolydian b2 is Mode V of the Harmonic Minor scale — essentially a dominant 7th chord with an exotic flat 2nd. Very useful in jazz and fusion over altered dominant chords." },
          { semi:4,  iname:"3",   desc:"Major 3rd — dominant character established." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — major triad complete." },
          { semi:1,  iname:"b2",  desc:"Flat 2nd — the exotic twist. Same as Phrygian's defining note, but over a major triad rather than minor. This creates that sharp clash between the bright major 3rd and the dark flat 2nd." },
          { semi:5,  iname:"4",   desc:"Perfect 4th — familiar and stable after the b2 tension." },
          { semi:9,  iname:"6",   desc:"Major 6th — brighter than you might expect given the b2. That contrast is part of the appeal." },
          { semi:10, iname:"b7",  desc:"Minor 7th — the dominant colour. So Mixolydian b2 = a standard dominant 7th scale but with b2 instead of natural 2. Extremely effective in jazz improv over V7 chords in minor keys." },
        ],
      },
    ],
  },
  {
    group: "Hungarian / Gypsy",
    color: "#8B5CF6",
    dark: "#2e1065",
    scales: [
      {
        id: "hungarian_minor",
        name: "Hungarian Minor",
        triadType: "Minor",
        triadIntervals: [0, 3, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. The Hungarian Minor scale (also called Gypsy Minor) has two augmented 2nds and a raised 4th — dark, dramatic, and deeply emotional. The sound of Eastern European folk music." },
          { semi:3,  iname:"b3",  desc:"Minor 3rd — dark minor character, the foundation." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — minor triad complete." },
          { semi:2,  iname:"2",   desc:"Major 2nd — same as natural minor so far." },
          { semi:6,  iname:"#4",  desc:"Augmented 4th (#4) — first major deviation. The jump from b3 to #4 is an augmented 2nd — 3 semitones. That leap is the signature sound of this scale. It's the note that makes it 'Gypsy'." },
          { semi:8,  iname:"b6",  desc:"Minor 6th — darker than natural minor's b6, which it shares. The jump from #4 to b6 is another augmented 2nd. Two of these in one scale creates an intense, dramatic quality." },
          { semi:11, iname:"7",   desc:"Major 7th — unusual in a minor scale. Natural minor uses b7. The raised 7th here creates strong leading-tone tension back to the root, and combined with the b6 forms a tritone — pure Hungarian Minor character." },
        ],
      },
      {
        id: "romanian_minor",
        name: "Romanian Minor",
        triadType: "Minor",
        triadIntervals: [0, 3, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. The Romanian Minor scale is closely related to Hungarian Minor but with a natural 6th instead of b6. Slightly less dark, more modal and floating — folk music of Eastern Europe." },
          { semi:3,  iname:"b3",  desc:"Minor 3rd — minor triad character." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — minor triad complete." },
          { semi:2,  iname:"2",   desc:"Major 2nd — same as Dorian so far." },
          { semi:6,  iname:"#4",  desc:"Augmented 4th — the Gypsy twist. The augmented 2nd leap from b3 to #4 is the same as Hungarian Minor. This is the signature interval of the Romanian scale." },
          { semi:9,  iname:"6",   desc:"Natural 6th — HERE is the key difference from Hungarian Minor. Instead of b6, Romanian Minor uses a natural 6th (same as Dorian). This makes it less dark, more open and modal." },
          { semi:10, iname:"b7",  desc:"Minor 7th — same as Dorian and natural minor. So Romanian Minor = Dorian with a raised 4th. Or: Lydian b7 with b3. The #4 over a minor triad is its defining feature." },
        ],
      },
    ],
  },
  {
    group: "Neapolitan",
    color: "#06B6D4",
    dark: "#082f49",
    scales: [
      {
        id: "neapolitan_minor",
        name: "Neapolitan Minor",
        triadType: "Minor",
        triadIntervals: [0, 3, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. The Neapolitan Minor scale comes from classical Italian music. Its characteristic sound comes from the flattened 2nd — the 'Neapolitan' note that gives it an immediately Spanish/Italian flavour." },
          { semi:3,  iname:"b3",  desc:"Minor 3rd — dark minor quality at the base." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — minor triad complete." },
          { semi:1,  iname:"b2",  desc:"Flat 2nd — the Neapolitan signature. A half step above the root, creating immediate exotic tension. In classical harmony, the 'Neapolitan chord' is built on this flattened 2nd degree." },
          { semi:5,  iname:"4",   desc:"Perfect 4th — a stable anchor after the b2 tension." },
          { semi:8,  iname:"b6",  desc:"Minor 6th — deepens the dark, dramatic character." },
          { semi:11, iname:"7",   desc:"Major 7th — the leading tone. Neapolitan Minor is essentially Harmonic Minor with a flat 2nd. The combination of b2 and major 7th creates maximum tension across the scale." },
        ],
      },
      {
        id: "neapolitan_major",
        name: "Neapolitan Major",
        triadType: "Minor",
        triadIntervals: [0, 3, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. Despite its name, Neapolitan Major is built on a minor triad. The 'major' refers to the upper structure. It has a curious, bittersweet quality — minor at the bottom, major brightness above." },
          { semi:3,  iname:"b3",  desc:"Minor 3rd — minor quality at the base. Don't let the name confuse you — it starts minor." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — minor triad complete." },
          { semi:1,  iname:"b2",  desc:"Flat 2nd — the Neapolitan hallmark. Same as Neapolitan Minor. That half-step crunch against the root is instantly recognisable." },
          { semi:5,  iname:"4",   desc:"Perfect 4th — stable mid-point." },
          { semi:9,  iname:"6",   desc:"Natural 6th — HERE is the departure from Neapolitan Minor. The major 6th makes the upper part of the scale brighter. Minor foundation, major feeling on top — the bittersweet duality." },
          { semi:11, iname:"7",   desc:"Major 7th — completes the brightness in the upper register. Neapolitan Major = Neapolitan Minor with a raised 6th. That contrast between b2 and natural 6 / major 7 gives it a highly emotional, film-score quality." },
        ],
      },
    ],
  },
  {
    group: "Japanese / Asian",
    color: "#10B981",
    dark: "#052e16",
    scales: [
      {
        id: "hirajoshi",
        name: "Hirajoshi",
        triadType: "Minor",
        triadIntervals: [0, 3, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. The Hirajoshi scale is a traditional Japanese pentatonic scale, used in koto music. Five notes, wide intervals, and a uniquely sparse, contemplative sound. Very different from Western pentatonics." },
          { semi:3,  iname:"b3",  desc:"Minor 3rd — minor quality, but remember: with only 5 notes there's plenty of space between them. The ear notices those gaps." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — minor triad complete. The Hirajoshi triad is your anchor." },
          { semi:2,  iname:"2",   desc:"Major 2nd — a whole step above root. In the pentatonic context this creates a wide melodic leap when you jump to b3." },
          { semi:8,  iname:"b6",  desc:"Minor 6th — the final note. Notice what's missing: no 4th, no 7th. Five notes with large, uneven intervals create the characteristic 'floating' Japanese sound. The b6 is a whole step above the 5th, leaving an empty space where the 6th and 7th would be." },
        ],
      },
    ],
  },
  {
    group: "Scriabin / Mystic",
    color: "#EC4899",
    dark: "#500724",
    scales: [
      {
        id: "scriabin",
        name: "Scriabin",
        triadType: "Major",
        triadIntervals: [0, 4, 7],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. The Scriabin scale (also called the Mystic scale) was Scriabin's 'mystic chord' laid out as a scale. Six notes built entirely from 4ths — an almost otherworldly, floating sound." },
          { semi:4,  iname:"3",   desc:"Major 3rd — starts with conventional brightness." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — major triad complete." },
          { semi:6,  iname:"#4",  desc:"Augmented 4th (tritone from root) — the first overtly 'wrong' note. The raised 4th over the major 3rd gives the Lydian floating quality, but the Scriabin scale takes it further." },
          { semi:10, iname:"b7",  desc:"Minor 7th — dominant colour creeping in." },
          { semi:2,  iname:"9",   desc:"Major 9th (same pitch as 2nd) — adds an airy, upper-register quality. The Scriabin/Mystic chord stacks the intervals R, #4, b7, 3, 6, 9 as fourths. As a scale: R, 2, 3, #4, 6, b7. Six notes, no perfect 4th, no 5th — suspended between earth and air." },
          { semi:9,  iname:"6",   desc:"Major 6th — the final tone. Scriabin is essentially Prometheus with the notes reordered. Both lack a perfect 4th and 5th. The absence of those 'grounding' intervals is why it sounds so unmoored and mystical." },
        ],
      },
      {
        id: "half_whole_dim",
        name: "Half-Whole Diminished",
        triadType: "Diminished",
        triadIntervals: [0, 3, 6],
        buildSteps: [
          { semi:0,  iname:"R",   desc:"Root. The Half-Whole Diminished scale (also called the Dominant Diminished) alternates half and whole steps starting with a half step. Eight notes — symmetrical, repeating every 3 semitones." },
          { semi:3,  iname:"b3",  desc:"Minor 3rd — diminished triad begins." },
          { semi:6,  iname:"b5",  desc:"Diminished 5th — triad complete. Already deeply unstable." },
          { semi:1,  iname:"b2",  desc:"Flat 2nd — a half step above root. The H-W pattern starts here: half step first." },
          { semi:4,  iname:"3",   desc:"Major 3rd — now you have both b3 AND natural 3 in the same scale. That clash is deliberate and creates intense tension." },
          { semi:7,  iname:"5",   desc:"Perfect 5th — adds even more conflict. You now have b5 AND natural 5 coexisting." },
          { semi:9,  iname:"6",   desc:"Major 6th — a half step above the 5." },
          { semi:10, iname:"b7",  desc:"Minor 7th — the dominant character. Eight notes, alternating H-W, used in jazz over dominant 7b9 chords. The symmetry means you can shift the pattern up a minor 3rd and land on the same scale — there are only three unique H-W diminished scales." },
        ],
      },
    ],
  },
];

const ALL_SCALES = SCALE_GROUPS.flatMap(g => g.scales.map(s => ({ ...s, color: g.color, dark: g.dark, group: g.group })));

// ─── Fretboard ────────────────────────────────────────────────────────────────

const OPEN_STRINGS = ["E","A","D","G","B","E"];
const FRET_COUNT = 12;

function Fretboard({ root, activeIntervals, accentColor, T }) {
  const semiMap = {};
  activeIntervals.forEach(a => { semiMap[a.semi] = a; });
  const displayStrings = [...OPEN_STRINGS].reverse();

  return (
    <div style={{ overflowX:"auto", paddingBottom:"4px" }}>
      <div style={{ minWidth:"660px" }}>
        <div style={{ display:"flex", marginLeft:"38px", marginBottom:"4px" }}>
          {[0,...Array.from({length:FRET_COUNT},(_,i)=>i+1)].map(fret => (
            <div key={fret} style={{
              width:fret===0?"34px":"48px", textAlign:"center",
              fontSize:"10px", flexShrink:0,
              color:[3,5,7,9,12].includes(fret)?T.fretHi:T.fretBar,
              fontWeight:[3,5,7,9,12].includes(fret)?"700":"400",
              fontFamily:"'JetBrains Mono',monospace",
            }}>{fret===0?"Open":fret}</div>
          ))}
        </div>

        {displayStrings.map((openNote, di) => {
          const isOuter = di===0||di===5;
          return (
            <div key={di} style={{ display:"flex", alignItems:"center", marginBottom:"3px" }}>
              <div style={{ width:"34px", textAlign:"right", paddingRight:"6px", fontSize:"10px", color:T.fretHi, fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>{openNote}</div>
              {Array.from({length:FRET_COUNT+1},(_,fret) => {
                const note = addSemi(openNote, fret);
                const semi = (NOTES.indexOf(note) - NOTES.indexOf(root) + 12) % 12;
                const info = semiMap[semi];
                const isActive = !!info;
                const isNew = info?.isNew;
                const isTriad = info?.isTriad;
                return (
                  <div key={fret} style={{ width:fret===0?"34px":"48px", height:"28px", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:"50%", left:0, right:0, height:isOuter?"1px":"2px", background:T.fretStr, transform:"translateY(-50%)" }}/>
                    {fret>0 && <div style={{ position:"absolute", top:0, bottom:0, right:0, width:fret===12?"3px":"1.5px", background:fret===12?T.fretHi:T.fretBar }}/>}
                    {isActive && (
                      <div style={{
                        position:"relative", zIndex:2,
                        width:"22px", height:"22px", borderRadius:"50%",
                        background: isNew ? accentColor : isTriad ? `${accentColor}cc` : `${accentColor}55`,
                        border: isNew ? `2px solid #fff` : isTriad ? `1.5px solid ${accentColor}` : `1px solid ${accentColor}88`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:"7px", fontWeight:"700", color:"#fff",
                        fontFamily:"'JetBrains Mono',monospace",
                        boxShadow: isNew ? `0 0 10px ${accentColor}` : "none",
                        transition:"all 0.3s ease",
                      }}>
                        {info.iname==="R" ? "R" : info.iname}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        <div style={{ display:"flex", marginLeft:"82px", marginTop:"3px" }}>
          {Array.from({length:FRET_COUNT},(_,i)=>i+1).map(fret => (
            <div key={fret} style={{ width:"48px", textAlign:"center", flexShrink:0 }}>
              {[3,5,7,9].includes(fret) && <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:T.fretMark,margin:"0 auto" }}/>}
              {fret===12 && <div style={{ display:"flex",gap:"5px",justifyContent:"center" }}>
                <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:T.fretMark }}/>
                <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:T.fretMark }}/>
              </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function ExoticScaleBuilder() {
  const [selectedScaleId, setSelectedScaleId] = useState("harmonic_major");
  const [selectedRoot,    setSelectedRoot]    = useState("A");
  const [step,            setStep]            = useState(0);
  const [showGroups,      setShowGroups]      = useState(false);
  const [isDark,          setIsDark]          = useState(false);

  const T = isDark ? THEMES.dark : THEMES.light;

  const scale = ALL_SCALES.find(s => s.id === selectedScaleId);
  const steps = scale.buildSteps;
  const triadCount = scale.triadIntervals.length;

  const visibleCount = triadCount + step;
  const visibleSteps = steps.slice(0, visibleCount);

  const activeIntervals = visibleSteps.map((s, i) => ({
    semi: s.semi,
    iname: s.iname,
    isTriad: i < triadCount,
    isNew: i === visibleCount - 1 && step > 0,
  }));

  const currentStep = visibleSteps[visibleCount - 1];
  const isTriadPhase = step === 0;
  const isDone = visibleCount >= steps.length;
  const addedCount = step;

  const handleScaleSelect = (id) => { setSelectedScaleId(id); setStep(0); setShowGroups(false); };
  const handleRootSelect  = (root) => { setSelectedRoot(root); setStep(0); };
  const advance = () => { if (!isDone) setStep(s => s+1); };
  const reset   = () => setStep(0);

  const progressPct = isDone ? 100 : Math.round((visibleCount / steps.length) * 100);
  const nonTriadSteps = steps.length - triadCount;

  return (
    <div style={{
      minHeight:"100vh", background:T.bg, color:T.text,
      fontFamily:"'DM Sans',sans-serif", padding:"24px 18px 48px",
      transition:"background 0.2s, color 0.2s",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing:border-box; }
        button { cursor:pointer; font-family:inherit; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn  { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
        .nav-btn:hover:not(:disabled) { filter:brightness(1.1); }
        .nav-btn:disabled { opacity:0.3; cursor:not-allowed; }
        ::-webkit-scrollbar { height:5px; background:${T.scrollBg}; }
        ::-webkit-scrollbar-thumb { background:${T.scrollTh}; border-radius:3px; }
      `}</style>

      <div style={{ maxWidth:"860px", margin:"0 auto" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom:"24px", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"12px" }}>
          <div>
            <div style={{ display:"flex", alignItems:"baseline", gap:"10px", marginBottom:"4px" }}>
              <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(24px,5vw,36px)", fontWeight:"700", margin:0, color:T.textHi, letterSpacing:"-0.5px" }}>
                Exotic Scale Builder
              </h1>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"#F59E0B", background:T.badge, padding:"2px 7px", borderRadius:"4px", letterSpacing:"1px" }}>UNLOCK THE GUITAR</span>
            </div>
            <p style={{ color:T.textMute, fontSize:"13px", margin:0 }}>
              15 exotic scales from around the world. Start with the triad. Add intervals one by one. Understand what makes each one unique.
            </p>
          </div>
          <button onClick={() => setIsDark(d=>!d)} style={{
            flexShrink:0, padding:"8px 14px", borderRadius:"20px",
            border:`1.5px solid ${T.border}`, background:T.surface, color:T.textMid,
            fontSize:"13px", display:"flex", alignItems:"center", gap:"6px",
            transition:"all 0.15s", whiteSpace:"nowrap",
          }}>
            <span style={{ fontSize:"16px" }}>{isDark?"☀️":"🌙"}</span>
            <span style={{ fontSize:"11px", fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.5px" }}>{isDark?"Light":"Dark"}</span>
          </button>
        </div>

        {/* ── Root + Scale Selector ── */}
        <div style={{ background:T.surface, borderRadius:"14px", padding:"18px", border:`1px solid ${T.border}`, marginBottom:"12px" }}>

          {/* Root */}
          <div style={{ marginBottom:"16px" }}>
            <SL T={T}>ROOT NOTE</SL>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
              {NOTES.map(n => (
                <button key={n} onClick={() => handleRootSelect(n)} style={{
                  padding:"6px 11px", borderRadius:"7px", fontSize:"12px",
                  fontWeight:"700", fontFamily:"'JetBrains Mono',monospace",
                  border: selectedRoot===n ? `2px solid ${scale.color}` : `2px solid ${T.border}`,
                  background: selectedRoot===n ? `${scale.color}20` : T.surface2,
                  color: selectedRoot===n ? scale.color : T.textMute,
                  transition:"all 0.12s", minWidth:"38px",
                }}>{n}</button>
              ))}
            </div>
          </div>

          {/* Scale picker */}
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
              <SL T={T} style={{ marginBottom:0 }}>SCALE</SL>
              <button onClick={() => setShowGroups(v=>!v)} style={{ background:"none", border:"none", color:T.textMute, fontSize:"11px", fontFamily:"'JetBrains Mono',monospace", cursor:"pointer" }}>
                {showGroups ? "▾ collapse" : "▸ expand all"}
              </button>
            </div>

            {/* Current scale badge */}
            <div style={{ padding:"10px 14px", borderRadius:"9px", border:`1.5px solid ${scale.color}`, background:`${scale.color}15`, marginBottom:"10px", display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:scale.color, flexShrink:0, boxShadow:`0 0 8px ${scale.color}` }}/>
              <span style={{ fontSize:"14px", fontWeight:"700", color:scale.color }}>{scale.name}</span>
              <span style={{ fontSize:"11px", color:T.textMute, marginLeft:"auto" }}>{scale.group}</span>
            </div>

            {/* Group tabs */}
            {showGroups && SCALE_GROUPS.map(grp => (
              <div key={grp.group} style={{ marginBottom:"12px" }}>
                <div style={{ fontSize:"10px", fontFamily:"'JetBrains Mono',monospace", color:grp.color, letterSpacing:"1px", marginBottom:"7px", display:"flex", alignItems:"center", gap:"6px" }}>
                  <span style={{ width:"6px",height:"6px",borderRadius:"50%",background:grp.color,display:"inline-block",flexShrink:0 }}/>
                  {grp.group.toUpperCase()}
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
                  {grp.scales.map(s => {
                    const active = selectedScaleId===s.id;
                    return (
                      <button key={s.id} onClick={() => handleScaleSelect(s.id)} style={{
                        padding:"6px 12px", borderRadius:"7px", fontSize:"12px",
                        fontWeight: active?"700":"400",
                        border: active ? `1.5px solid ${grp.color}` : `1.5px solid ${T.border}`,
                        background: active ? `${grp.color}18` : T.surface2,
                        color: active ? grp.color : T.textMute,
                        transition:"all 0.12s",
                      }}>{s.name}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div style={{ marginBottom:"12px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"5px" }}>
            <span style={{ fontSize:"11px", color:T.textMute, fontFamily:"'JetBrains Mono',monospace" }}>
              {isTriadPhase ? `${scale.triadType} triad` : `${addedCount} of ${nonTriadSteps} intervals added`}
            </span>
            <span style={{ fontSize:"11px", color:isDone?scale.color:T.textMute, fontFamily:"'JetBrains Mono',monospace" }}>
              {isDone ? "✓ scale complete" : `${progressPct}%`}
            </span>
          </div>
          <div style={{ height:"4px", background:T.border, borderRadius:"2px", overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:"2px", width:`${progressPct}%`, background:scale.color, transition:"width 0.4s ease", boxShadow:isDone?`0 0 8px ${scale.color}`:"none" }}/>
          </div>
        </div>

        {/* ── Interval legend ── */}
        <div style={{ background:T.surface, borderRadius:"12px", padding:"14px 16px", border:`1px solid ${T.border}`, marginBottom:"12px" }}>
          <SL T={T}>INTERVALS IN PLAY</SL>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
            {steps.map((s, i) => {
              const visible = i < visibleCount;
              const isTriad = i < triadCount;
              const isNewlyAdded = visible && i===visibleCount-1 && step>0;
              return (
                <div key={i} style={{
                  padding:"5px 10px", borderRadius:"6px",
                  border: visible
                    ? isNewlyAdded ? `1.5px solid ${scale.color}`
                    : isTriad ? `1px solid ${scale.color}88`
                    : `1px solid ${scale.color}55`
                    : `1px solid ${T.border}`,
                  background: visible
                    ? isNewlyAdded ? `${scale.color}25`
                    : isTriad ? `${scale.color}12`
                    : `${scale.color}08`
                    : T.surface2,
                  opacity: visible ? 1 : 0.35,
                  transition:"all 0.3s ease",
                  animation: isNewlyAdded ? "popIn 0.25s ease" : "none",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:"2px",
                }}>
                  <span style={{
                    fontSize:"11px", fontWeight:"700", fontFamily:"'JetBrains Mono',monospace",
                    color: visible ? (isNewlyAdded ? scale.color : isTriad ? `${scale.color}cc` : `${scale.color}88`) : T.textDead,
                  }}>{s.iname}</span>
                  <span style={{ fontSize:"9px", color:visible?T.textLo:T.textDead, fontFamily:"'JetBrains Mono',monospace" }}>
                    {addSemi(selectedRoot, s.semi)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Fretboard ── */}
        <div style={{ background:T.surface, borderRadius:"14px", padding:"18px", border:`1px solid ${T.border}`, marginBottom:"12px" }}>
          <Fretboard root={selectedRoot} activeIntervals={activeIntervals} accentColor={scale.color} T={T} />
        </div>

        {/* ── Explanation card ── */}
        <div style={{ background:T.surface, borderRadius:"14px", padding:"18px 20px", border:`1px solid ${scale.color}33`, marginBottom:"16px", animation:"fadeUp 0.25s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
            <div style={{ padding:"4px 10px", borderRadius:"20px", background:`${scale.color}20`, border:`1px solid ${scale.color}55`, fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", fontWeight:"700", color:scale.color }}>
              {isTriadPhase
                ? `${selectedRoot} ${scale.triadType} triad: ${scale.triadIntervals.map(i => addSemi(selectedRoot, i)).join(" – ")}`
                : `+ ${currentStep.iname} (${addSemi(selectedRoot, currentStep.semi)})`
              }
            </div>
            {!isTriadPhase && (
              <span style={{ fontSize:"11px", color:T.textMute }}>note {visibleCount} of {steps.length}</span>
            )}
          </div>
          <p style={{ fontSize:"14px", lineHeight:"1.8", color:T.textMid, margin:0 }}>
            {isTriadPhase
              ? `Your ${scale.triadType.toLowerCase()} triad is the foundation. Before you can understand what makes this scale exotic, you need these three notes locked in. They're your reference points — everything else will be measured against them.`
              : currentStep.desc
            }
          </p>
          {isDone && (
            <div style={{ marginTop:"12px", paddingTop:"12px", borderTop:`1px solid ${scale.color}22`, fontSize:"13px", color:scale.color, fontStyle:"italic" }}>
              ✓ {scale.name} complete — {steps.map(s => addSemi(selectedRoot, s.semi)).join(" · ")}
            </div>
          )}
        </div>

        {/* ── Nav buttons ── */}
        <div style={{ display:"flex", gap:"10px" }}>
          <button className="nav-btn" onClick={reset} style={{ padding:"12px 20px", borderRadius:"10px", border:`1.5px solid ${T.border}`, background:T.surface2, color:T.textMute, fontSize:"13px", fontWeight:"600", transition:"all 0.12s" }}>↺ Reset</button>
          <button className="nav-btn" onClick={() => setStep(s => Math.max(0,s-1))} disabled={step===0} style={{ padding:"12px 18px", borderRadius:"10px", border:`1.5px solid ${T.border}`, background:T.surface2, color:T.textLo, fontSize:"13px", fontWeight:"600", transition:"all 0.12s" }}>← Back</button>
          <button className="nav-btn" onClick={advance} disabled={isDone} style={{ flex:1, padding:"12px", borderRadius:"10px", border:`1.5px solid ${scale.color}`, background:`${scale.color}15`, color:scale.color, fontSize:"14px", fontWeight:"700", transition:"all 0.12s" }}>
            {isDone
              ? `${scale.name} complete ✓`
              : isTriadPhase
              ? `Add first interval →`
              : `Add ${steps[visibleCount]?.iname} →`
            }
          </button>
        </div>

        <div style={{ textAlign:"center", marginTop:"24px", color:T.border, fontSize:"11px", fontFamily:"'JetBrains Mono',monospace" }}>
          unlocktheguitar.net
        </div>
      </div>
    </div>
  );
}

function SL({ children, style, T }) {
  return (
    <div style={{ fontSize:"10px", color:T.textMute, letterSpacing:"1.5px", marginBottom:"8px", fontFamily:"'JetBrains Mono',monospace", fontWeight:"600", ...style }}>
      {children}
    </div>
  );
}
