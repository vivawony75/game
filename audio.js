// Web Audio API Sound Synthesizer for Lion Safari Game
// No external assets required - 100% self-contained & CORS-safe!

class SoundController {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.tempo = 125;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopBGM();
        } else {
            this.init();
            this.startBGM();
        }
        return this.enabled;
    }

    // Short cute beep / tone helper
    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.2, pitchSlide = null) {
        if (!this.enabled || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);

            if (pitchSlide) {
                osc.frequency.exponentialRampToValueAtTime(Math.max(20, pitchSlide), now + duration);
            }

            gain.gain.setValueAtTime(gainVal, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + duration);
        } catch (e) {
            console.warn(e);
        }
    }

    // Lion Dash / Roar whoosh
    playDash() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // White noise buffer for whoosh
            const bufferSize = this.ctx.sampleRate * 0.25;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, now);
            filter.frequency.linearRampToValueAtTime(1200, now + 0.12);
            filter.frequency.linearRampToValueAtTime(200, now + 0.25);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);

            // Add lion low roar tone
            this.playTone(180, 'sawtooth', 0.2, 0.15, 90);
        } catch (e) {}
    }

    // Animal panic / scared squeak
    playPanic() {
        if (!this.enabled || !this.ctx) return;
        // high squeak pitch bend upwards
        this.playTone(480, 'triangle', 0.12, 0.18, 900);
    }

    // Animal teasing / laugh sound
    playTease() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 523.25].forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.08, 0.12);
            }, i * 90);
        });
    }

    // Catch prey success sound
    playCatch() {
        if (!this.enabled || !this.ctx) return;
        // Happy ding-dong-pling
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((n, idx) => {
            setTimeout(() => {
                this.playTone(n, 'triangle', 0.18, 0.22);
            }, idx * 60);
        });
    }

    // Lion Starving / Collapse (sad hunger grumble + flop)
    playStarve() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        // Stomach growling: low frequency wobble
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(85, now);
            osc.frequency.linearRampToValueAtTime(60, now + 0.4);
            osc.frequency.linearRampToValueAtTime(95, now + 0.8);
            osc.frequency.linearRampToValueAtTime(45, now + 1.2);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 1.2);
        } catch (e) {}

        // Sad falling sliding tone
        setTimeout(() => {
            this.playTone(320, 'sine', 0.8, 0.25, 110);
        }, 500);
    }

    // Stage clear fanfare
    playStageClear() {
        if (!this.enabled || !this.ctx) return;
        const melody = [523.25, 659.25, 783.99, 1046.50];
        melody.forEach((f, i) => {
            setTimeout(() => {
                this.playTone(f, 'triangle', 0.35, 0.25);
            }, i * 140);
        });
    }

    // Victory 10th Stage ending fanfare
    playVictory() {
        if (!this.enabled || !this.ctx) return;
        const chords = [
            [523, 659, 784],
            [587, 740, 880],
            [659, 830, 987],
            [1046, 1318, 1568]
        ];
        chords.forEach((chord, i) => {
            setTimeout(() => {
                chord.forEach(freq => this.playTone(freq, 'triangle', 0.45, 0.18));
            }, i * 220);
        });
    }

    // 10-second warning tick
    playUrgentTick() {
        if (!this.enabled || !this.ctx) return;
        this.playTone(700, 'sine', 0.05, 0.15, 350);
    }

    // Savanna tribal / kalimba chill rhythm BGM
    startBGM() {
        if (!this.enabled || this.bgmPlaying || !this.ctx) return;
        this.bgmPlaying = true;

        // Kalimba-style pentatonic notes (C major pentatonic: C, D, E, G, A)
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
        const bassNotes = [130.81, 164.81, 196.00, 220.00];
        let step = 0;

        const loop = () => {
            if (!this.bgmPlaying || !this.enabled) return;

            // Bass beat every 4 steps
            if (step % 4 === 0) {
                const bass = bassNotes[(Math.floor(step / 4)) % bassNotes.length];
                this.playTone(bass, 'triangle', 0.22, 0.12);
            }

            // Kalimba melody pattern
            const melodyPatterns = [0, 2, 4, 3, 5, 4, 2, 1, 0, 4, 3, 5, 2, 0, 3, 1];
            const noteIdx = melodyPatterns[step % melodyPatterns.length];
            const freq = scale[noteIdx % scale.length];

            // Soft pluck
            this.playTone(freq, 'sine', 0.12, 0.08);

            // Shaker / cricket high tap
            if (step % 2 === 1) {
                this.playTone(1800, 'triangle', 0.03, 0.02, 1000);
            }

            step++;
            this.bgmTimer = setTimeout(loop, (60 / this.tempo) * 250); // sixteenth notes
        };

        loop();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

window.soundCtrl = new SoundController();
