/**
 * Savanna Lion Hunt Game Engine (초원 사자 사냥 게임)
 * 10 Stages, 3 Preys per Stage, 60s Timer, Hunger Collapse System, Cute Dynamic Animal Facial Expressions
 */

// Polyfill for CanvasRenderingContext2D.prototype.roundRect if not supported
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };
}

// --- 10 Stages Data Definition ---
const STAGES_DATA = [
    {
        stage: 1,
        title: "1단계: 아기 토끼 동산",
        name: "아기 토끼",
        emoji: "🐰",
        color: "#ffffff",
        subColor: "#ffccd5",
        earLen: 22,
        speed: 2.3,
        panicSpeed: 3.2,
        size: 26,
        description: "풀을 뜯으며 깡충깡충 뛰는 앙증맞은 아기 토끼들입니다.",
        bgHue: "daylight",
        teasePhrases: ["풀 맛있다! 🌿", "사자 안 무서워~ :P", "날 잡을 수 있을까?"]
    },
    {
        stage: 2,
        title: "2단계: 날쌘 산토끼 들판",
        name: "산토끼",
        emoji: "🐇",
        color: "#d4a373",
        subColor: "#faedcd",
        earLen: 25,
        speed: 2.7,
        panicSpeed: 3.7,
        size: 28,
        description: "갈색 털의 산토끼들은 아기 토끼보다 발이 조금 더 빠릅니다.",
        bgHue: "daylight",
        teasePhrases: ["메롱메롱~ 😜", "껑충껑충 깡충~", "아직 멀었지!"]
    },
    {
        stage: 3,
        title: "3단계: 어린 아기 가젤",
        name: "아기 가젤",
        emoji: "🦌",
        color: "#e09f3e",
        subColor: "#fff3b0",
        earLen: 16,
        horns: 10,
        speed: 3.2,
        panicSpeed: 4.3,
        size: 30,
        description: "호기심 많은 어린 가젤들! 사자가 다가오면 흠칫 놀랍니다.",
        bgHue: "sunny",
        teasePhrases: ["초원은 평화로워 🎵", "사자 아저씨 안녕?", "잡아봐라~ 💨"]
    },
    {
        stage: 4,
        title: "4단계: 날렵한 톰슨 가젤",
        name: "톰슨 가젤",
        emoji: "🦌💨",
        color: "#ca6702",
        subColor: "#332211",
        earLen: 18,
        horns: 16,
        speed: 3.7,
        panicSpeed: 5.0,
        size: 32,
        description: "검은 줄무늬와 민첩한 다리로 지그재그 회피를 펼칩니다.",
        bgHue: "sunny",
        teasePhrases: ["내 스텝을 따라올 테냐? ✨", "난 바람보다 빠르지!", "어림없다 냐하하"]
    },
    {
        stage: 5,
        title: "5단계: 아기 얼룩말 망아지",
        name: "얼룩말 망아지",
        emoji: "🦓",
        color: "#f8f9fa",
        stripeColor: "#212529",
        speed: 4.2,
        panicSpeed: 5.6,
        size: 34,
        description: "줄무늬가 깜찍한 얼룩말 망아지들! 무리를 지어 달립니다.",
        bgHue: "golden",
        teasePhrases: ["줄무늬 어때? 예쁘지? 🦓", "히히힝~ 못 잡지롱!", "꼬리 살랑살랑~"]
    },
    {
        stage: 6,
        title: "6단계: 질주하는 야생 얼룩말",
        name: "야생 얼룩말",
        emoji: "🦓⚡",
        color: "#ffffff",
        stripeColor: "#111111",
        speed: 4.7,
        panicSpeed: 6.2,
        size: 37,
        description: "강력한 뒷다리로 전력질주하는 성체 야생 얼룩말입니다.",
        bgHue: "golden",
        teasePhrases: ["다그닥 다그닥! ⚡", "사자야, 다이어트 좀 해!", "절대 못 따라와~"]
    },
    {
        stage: 7,
        title: "7단계: 품바 혹멧돼지",
        name: "혹멧돼지",
        emoji: "🐗",
        color: "#7f5539",
        subColor: "#9c6644",
        tusks: true,
        speed: 5.2,
        panicSpeed: 6.8,
        size: 36,
        description: "흙먼지를 뿜으며 씩씩하게 질주하는 용감한 혹멧돼지입니다.",
        bgHue: "sunset",
        teasePhrases: ["하쿠나 마타타~! 🐗", "흙먼지 맛 좀 봐라 💨", "꿀꿀! 안 잡히지!"]
    },
    {
        stage: 8,
        title: "8단계: 초원의 스프린터 타조",
        name: "타조",
        emoji: "🦤",
        color: "#343a40",
        subColor: "#e9ecef",
        isBird: true,
        speed: 5.7,
        panicSpeed: 7.4,
        size: 38,
        description: "긴 두 다리로 성큼성큼! 사바나에서 가장 발 빠른 새입니다.",
        bgHue: "sunset",
        teasePhrases: ["내 다리 길지? 부럽지? 🦤", "날개 퍼덕퍼덕~", "시속 70km로 간다!"]
    },
    {
        stage: 9,
        title: "9단계: 거대한 야생 누우/물소",
        name: "야생 물소",
        emoji: "🐂",
        color: "#495057",
        subColor: "#212529",
        horns: 20,
        speed: 6.2,
        panicSpeed: 8.0,
        size: 42,
        description: "육중한 뿔과 폭발적인 스피드로 달아나는 거대한 물소입니다.",
        bgHue: "dusk",
        teasePhrases: ["우우웅~! 뿔 맛 볼래? 🐂", "묵직하지만 빠르다고!", "비켜라 비켜~"]
    },
    {
        stage: 10,
        title: "10단계: 전설의 황금 가젤",
        name: "황금 가젤",
        emoji: "👑✨",
        color: "#ffd166",
        subColor: "#fff3b0",
        horns: 22,
        speed: 6.8,
        panicSpeed: 8.8,
        size: 36,
        description: "초원의 전설! 신출귀몰한 스피드로 사자를 농락하는 황금 가젤!",
        bgHue: "night",
        teasePhrases: ["잡을 수 있으면 잡아봐! 👑", "빛처럼 빠르게 슉슉!", "사자의 한계를 시험하마!"]
    }
];

// --- Particle System ---
class Particle {
    constructor(x, y, type = 'dust') {
        this.x = x;
        this.y = y;
        this.type = type; // 'dust', 'sweat', 'star', 'heart', 'meat', 'tear'
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.life = 1;
        this.decay = Math.random() * 0.03 + 0.02;
        this.size = Math.random() * 6 + 4;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.life -= this.decay;
        return this.life > 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        if (this.type === 'dust') {
            ctx.fillStyle = '#e9c46a';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'sweat') {
            ctx.fillStyle = '#48cae4';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'star') {
            ctx.fillStyle = '#ffd166';
            ctx.font = `${Math.floor(this.size * 2)}px sans-serif`;
            ctx.fillText('⭐', this.x, this.y);
        } else if (this.type === 'heart') {
            ctx.fillStyle = '#ff4d6d';
            ctx.font = `${Math.floor(this.size * 2)}px sans-serif`;
            ctx.fillText('🍖', this.x, this.y);
        } else if (this.type === 'tear') {
            ctx.fillStyle = '#00b4d8';
            ctx.font = '16px sans-serif';
            ctx.fillText('💧', this.x, this.y);
        }
        ctx.restore();
    }
}

// --- Lion Player Class ---
class Lion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseSpeed = 5.2;
        this.speed = this.baseSpeed;
        this.angle = 0;
        this.vx = 0;
        this.vy = 0;
        this.size = 38;
        
        // Dash mechanic
        this.dashCooldown = 0;
        this.dashDuration = 0;
        this.isDashing = false;
        
        // Animation
        this.walkFrame = 0;
        this.isMoving = false;
        this.state = 'NORMAL'; // 'NORMAL', 'STARVED', 'CELEBRATING'
        this.tearTimer = 0;
    }

    update(input, bounds, particles) {
        if (this.state === 'STARVED') {
            // Drop down sad / starved animation
            this.vx = 0;
            this.vy = 0;
            this.tearTimer++;
            if (this.tearTimer % 18 === 0) {
                particles.push(new Particle(this.x - 10 + Math.random() * 20, this.y - 15, 'tear'));
            }
            return;
        }

        if (this.state === 'CELEBRATING') {
            // Little happy bounce
            this.walkFrame += 0.2;
            return;
        }

        // Handle dash duration & cooldown
        if (this.dashDuration > 0) {
            this.dashDuration--;
            this.isDashing = true;
            this.speed = this.baseSpeed * 1.85;
            // Emit dust trail
            if (Math.random() < 0.6) {
                particles.push(new Particle(this.x - Math.cos(this.angle) * 20, this.y - Math.sin(this.angle) * 20, 'dust'));
            }
        } else {
            this.isDashing = false;
            this.speed = this.baseSpeed;
        }

        if (this.dashCooldown > 0) {
            this.dashCooldown--;
        }

        // Movement input (Keyboard or Virtual Joystick / Mouse)
        let dx = 0;
        let dy = 0;

        if (input.keys['ArrowUp'] || input.keys['KeyW']) dy -= 1;
        if (input.keys['ArrowDown'] || input.keys['KeyS']) dy += 1;
        if (input.keys['ArrowLeft'] || input.keys['KeyA']) dx -= 1;
        if (input.keys['ArrowRight'] || input.keys['KeyD']) dx += 1;

        // Joystick or Pointer override
        if (input.joystick && (input.joystick.x !== 0 || input.joystick.y !== 0)) {
            dx = input.joystick.x;
            dy = input.joystick.y;
        }

        const len = Math.hypot(dx, dy);
        if (len > 0.05) {
            this.isMoving = true;
            const normX = dx / len;
            const normY = dy / len;
            this.vx = normX * this.speed;
            this.vy = normY * this.speed;
            this.angle = Math.atan2(this.vy, this.vx);
            this.walkFrame += this.isDashing ? 0.35 : 0.2;

            if (Math.random() < 0.15) {
                particles.push(new Particle(this.x - Math.cos(this.angle) * 15, this.y - Math.sin(this.angle) * 15, 'dust'));
            }
        } else {
            this.isMoving = false;
            this.vx *= 0.7;
            this.vy *= 0.7;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Boundary Clamp
        this.x = Math.max(this.size, Math.min(bounds.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(bounds.height - this.size, this.y));

        // Trigger Dash if requested
        if (input.dashRequested && this.dashCooldown <= 0) {
            this.dashCooldown = 90; // ~1.5 sec
            this.dashDuration = 22; // ~0.37 sec sprint
            input.dashRequested = false;
            window.soundCtrl?.playDash();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.state === 'STARVED') {
            // --- Starved Collapsed Sad Lion ---
            this.drawStarvedLion(ctx);
        } else {
            // Normal / Running Lion
            ctx.rotate(this.angle);
            this.drawActiveLion(ctx);
        }

        ctx.restore();
    }

    drawActiveLion(ctx) {
        const bounce = this.isMoving ? Math.sin(this.walkFrame) * 3 : 0;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.ellipse(0, 8, this.size * 0.9, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.strokeStyle = '#c67d0a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        const tailWag = Math.sin(this.walkFrame * 1.5) * 8;
        ctx.moveTo(-25, 0);
        ctx.quadraticCurveTo(-38, tailWag, -45, tailWag * 1.2);
        ctx.stroke();
        // Tail tuft
        ctx.fillStyle = '#6e3f05';
        ctx.beginPath();
        ctx.arc(-45, tailWag * 1.2, 5, 0, Math.PI * 2);
        ctx.fill();

        // Four paws running
        ctx.fillStyle = '#d48b15';
        const legOffset = Math.sin(this.walkFrame) * 8;
        // Back legs
        ctx.beginPath();
        ctx.arc(-14 - legOffset, -18, 6, 0, Math.PI * 2);
        ctx.arc(-14 + legOffset, 18, 6, 0, Math.PI * 2);
        ctx.fill();
        // Front legs
        ctx.beginPath();
        ctx.arc(14 + legOffset, -17, 7, 0, Math.PI * 2);
        ctx.arc(14 - legOffset, 17, 7, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#e89c1e';
        ctx.beginPath();
        ctx.ellipse(0, bounce, 24, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fluffy Glorious Mane (갈기)
        ctx.fillStyle = '#7a3e08';
        ctx.beginPath();
        const maneRadius = 24;
        const spikes = 12;
        for (let i = 0; i < spikes; i++) {
            const a = (i / spikes) * Math.PI * 2;
            const r = maneRadius + ((i % 2 === 0) ? 5 : 1);
            const mx = 10 + Math.cos(a) * r;
            const my = Math.sin(a) * r + bounce;
            if (i === 0) ctx.moveTo(mx, my);
            else ctx.lineTo(mx, my);
        }
        ctx.closePath();
        ctx.fill();

        // Head
        ctx.fillStyle = '#f3a92b';
        ctx.beginPath();
        ctx.arc(12, bounce, 15, 0, Math.PI * 2);
        ctx.fill();

        // Cute Ears
        ctx.fillStyle = '#8f4a0b';
        ctx.beginPath();
        ctx.arc(7, -13 + bounce, 5, 0, Math.PI * 2);
        ctx.arc(7, 13 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f3cf95';
        ctx.beginPath();
        ctx.arc(8, -13 + bounce, 3, 0, Math.PI * 2);
        ctx.arc(8, 13 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();

        // Muzzle / Snout
        ctx.fillStyle = '#ffe3a8';
        ctx.beginPath();
        ctx.ellipse(19, bounce, 8, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nose (cute triangle)
        ctx.fillStyle = '#4a2505';
        ctx.beginPath();
        ctx.moveTo(23, bounce - 3);
        ctx.lineTo(26, bounce);
        ctx.lineTo(23, bounce + 3);
        ctx.closePath();
        ctx.fill();

        // Eyes (Determined hunter cute eyes)
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(17, -5 + bounce, 2.5, 0, Math.PI * 2);
        ctx.arc(17, 5 + bounce, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Eye sparkles
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(18, -6 + bounce, 1, 0, Math.PI * 2);
        ctx.arc(18, 4 + bounce, 1, 0, Math.PI * 2);
        ctx.fill();

        // Whiskers
        ctx.strokeStyle = '#6a4010';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, bounce - 4); ctx.lineTo(27, bounce - 8);
        ctx.moveTo(20, bounce + 4); ctx.lineTo(27, bounce + 8);
        ctx.stroke();

        // Dash Flames / Speed aura
        if (this.isDashing) {
            ctx.fillStyle = 'rgba(255, 120, 0, 0.4)';
            ctx.beginPath();
            ctx.arc(-15, bounce, 28, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawStarvedLion(ctx) {
        // Collapsed on the floor, limp, tears, hungry stomach grumbling
        // Shadow flat
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 15, 35, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Limp paws stretched out
        ctx.fillStyle = '#d48b15';
        ctx.beginPath();
        ctx.ellipse(-25, 14, 12, 5, 0, 0, Math.PI * 2);
        ctx.ellipse(25, 14, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Flumped body
        ctx.fillStyle = '#c77f15';
        ctx.beginPath();
        ctx.ellipse(0, 8, 26, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Drooped Mane
        ctx.fillStyle = '#5a3006';
        ctx.beginPath();
        ctx.arc(5, 5, 22, 0, Math.PI * 2);
        ctx.fill();

        // Head resting on ground
        ctx.fillStyle = '#e89c1e';
        ctx.beginPath();
        ctx.arc(14, 8, 14, 0, Math.PI * 2);
        ctx.fill();

        // Drooped Ears
        ctx.fillStyle = '#6a3607';
        ctx.beginPath();
        ctx.ellipse(8, 20, 5, 3, 0.3, 0, Math.PI * 2);
        ctx.ellipse(8, -4, 5, 3, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Sad crying eyes (> < or U U)
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2.5;
        // Left eye
        ctx.beginPath();
        ctx.moveTo(17, 4);
        ctx.lineTo(21, 6);
        ctx.lineTo(17, 8);
        ctx.stroke();
        // Right eye
        ctx.beginPath();
        ctx.moveTo(17, 9);
        ctx.lineTo(21, 11);
        ctx.lineTo(17, 13);
        ctx.stroke();

        // Tears pooling
        ctx.fillStyle = '#48cae4';
        ctx.beginPath();
        ctx.arc(23, 7, 3, 0, Math.PI * 2);
        ctx.arc(23, 13, 3, 0, Math.PI * 2);
        ctx.fill();

        // Sad wavy mouth
        ctx.beginPath();
        ctx.moveTo(22, 11);
        ctx.quadraticCurveTo(24, 13, 26, 12);
        ctx.stroke();

        // Hungry Thought Bubble (Bone / 꼬르륵)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        // Mini thought bubbles
        ctx.beginPath();
        ctx.arc(18, -12, 4, 0, Math.PI * 2);
        ctx.arc(28, -22, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Main big thought bubble
        ctx.beginPath();
        ctx.roundRect(15, -60, 68, 32, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#333';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('🍖 배고파...', 22, -40);

        // Sweat drops
        ctx.fillStyle = '#00b4d8';
        ctx.font = '16px sans-serif';
        ctx.fillText('💧', -15, -5);
    }
}

// --- Prey Animal Class with Cute Dynamic Facial Expressions ---
class Prey {
    constructor(stageData, bounds) {
        this.stageData = stageData;
        this.bounds = bounds;
        
        // Random spawn away from center
        this.x = Math.random() * (bounds.width - 120) + 60;
        this.y = Math.random() * (bounds.height - 120) + 60;
        
        this.size = stageData.size;
        this.angle = Math.random() * Math.PI * 2;
        this.wanderAngle = this.angle;
        this.speed = stageData.speed;
        
        this.vx = 0;
        this.vy = 0;
        this.walkFrame = Math.random() * 10;
        
        // Emotion states: 'RELAXED', 'ALERT', 'PANIC', 'CAUGHT'
        this.emotion = 'RELAXED';
        this.distToLion = 999;
        
        // Tease & Chat timer
        this.chatBubble = null;
        this.chatTimer = 0;
        this.nextChatIn = Math.floor(Math.random() * 120 + 80);
        this.panicScreamTriggered = false;

        this.caughtAnimation = 0;
        this.isCaught = false;
    }

    update(lion, particles) {
        if (this.isCaught) {
            this.caughtAnimation += 0.08;
            return this.caughtAnimation < 1;
        }

        const dx = this.x - lion.x;
        const dy = this.y - lion.y;
        this.distToLion = Math.hypot(dx, dy);

        // Distance thresholds
        const PANIC_DIST = 160;
        const ALERT_DIST = 320;

        if (this.distToLion < PANIC_DIST) {
            // === PANIC STATE ===
            this.emotion = 'PANIC';
            this.speed = this.stageData.panicSpeed;
            // Run straight away from lion with slight zig-zag
            const fleeAngle = Math.atan2(dy, dx) + Math.sin(this.walkFrame * 2) * 0.25;
            this.angle = fleeAngle;
            this.vx = Math.cos(fleeAngle) * this.speed;
            this.vy = Math.sin(fleeAngle) * this.speed;
            this.walkFrame += 0.35;

            // Emit sweat or panic dust
            if (Math.random() < 0.25) {
                particles.push(new Particle(this.x, this.y - 12, 'sweat'));
                particles.push(new Particle(this.x, this.y + 10, 'dust'));
            }

            if (!this.panicScreamTriggered) {
                this.panicScreamTriggered = true;
                const screams = ["으악! 살려줘!! 😱", "사자 온다 도망쳐!! 💨", "꺄아악!! 💦", "살려주세요오!!"];
                this.chatBubble = screams[Math.floor(Math.random() * screams.length)];
                this.chatTimer = 65;
                window.soundCtrl?.playPanic();
            }
        } else if (this.distToLion < ALERT_DIST) {
            // === ALERT STATE ===
            this.emotion = 'ALERT';
            this.speed = this.stageData.speed * 1.15;
            this.panicScreamTriggered = false;

            // Trot away cautiously
            const awayAngle = Math.atan2(dy, dx);
            this.angle = awayAngle;
            this.vx = Math.cos(awayAngle) * this.speed;
            this.vy = Math.sin(awayAngle) * this.speed;
            this.walkFrame += 0.22;

            if (!this.chatBubble && Math.random() < 0.03) {
                const alerts = ["어라?! 냄새가... ❗", "사자가 오고 있어! 👀", "조심해! 땀 삐질 💦", "위험 감지!"];
                this.chatBubble = alerts[Math.floor(Math.random() * alerts.length)];
                this.chatTimer = 55;
            }
        } else {
            // === RELAXED STATE ===
            this.emotion = 'RELAXED';
            this.speed = this.stageData.speed * 0.65;
            this.panicScreamTriggered = false;

            // Gentle wandering & grazing
            if (Math.random() < 0.03) {
                this.wanderAngle += (Math.random() - 0.5) * 1.2;
            }
            this.angle = this.wanderAngle;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.walkFrame += 0.12;

            // Teasing chat
            this.nextChatIn--;
            if (this.nextChatIn <= 0) {
                const phrases = this.stageData.teasePhrases || ["풀 냠냠~ 🌿", "메롱! :P", "날씨 좋다 ☀️"];
                this.chatBubble = phrases[Math.floor(Math.random() * phrases.length)];
                this.chatTimer = 75;
                this.nextChatIn = Math.floor(Math.random() * 240 + 160);
                if (Math.random() < 0.4) window.soundCtrl?.playTease();
            }
        }

        // Apply movement
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off canvas edges
        const padding = this.size + 15;
        if (this.x < padding) { this.x = padding; this.vx = Math.abs(this.vx); this.wanderAngle = 0; }
        if (this.x > this.bounds.width - padding) { this.x = this.bounds.width - padding; this.vx = -Math.abs(this.vx); this.wanderAngle = Math.PI; }
        if (this.y < padding) { this.y = padding; this.vy = Math.abs(this.vy); this.wanderAngle = Math.PI / 2; }
        if (this.y > this.bounds.height - padding) { this.y = this.bounds.height - padding; this.vy = -Math.abs(this.vy); this.wanderAngle = -Math.PI / 2; }

        if (this.chatTimer > 0) {
            this.chatTimer--;
            if (this.chatTimer <= 0) this.chatBubble = null;
        }

        return true;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.isCaught) {
            // Caught dizzy star effect
            const scale = Math.max(0, 1 - this.caughtAnimation);
            ctx.scale(scale, scale);
            ctx.rotate(this.caughtAnimation * 10);
            this.drawAnimalBody(ctx);
            this.drawExpression(ctx, 'CAUGHT');
            ctx.restore();
            return;
        }

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 10, this.size * 0.75, this.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rotate facing direction
        ctx.rotate(this.angle);

        // Draw Animal Body
        this.drawAnimalBody(ctx);

        // Draw Animal Face with specific Expression
        this.drawExpression(ctx, this.emotion);

        ctx.restore();

        // Draw Cute Floating Emote & Speech Bubble above Animal (Unrotated)
        this.drawSpeechBubble(ctx);
    }

    drawAnimalBody(ctx) {
        const bounce = Math.sin(this.walkFrame) * 2.5;
        const color = this.stageData.color;
        const subColor = this.stageData.subColor || '#fff';
        const s = this.size;

        // Legs
        ctx.fillStyle = subColor;
        const legSwing = Math.sin(this.walkFrame) * 6;
        ctx.beginPath();
        ctx.arc(-s * 0.4 - legSwing, -s * 0.45, 4, 0, Math.PI * 2);
        ctx.arc(-s * 0.4 + legSwing, s * 0.45, 4, 0, Math.PI * 2);
        ctx.arc(s * 0.4 + legSwing, -s * 0.45, 4.5, 0, Math.PI * 2);
        ctx.arc(s * 0.4 - legSwing, s * 0.45, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Main Body
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(0, bounce, s * 0.65, s * 0.48, 0, 0, Math.PI * 2);
        ctx.fill();

        // Specific animal skins
        if (this.stageData.stripeColor) {
            // Zebra stripes
            ctx.fillStyle = this.stageData.stripeColor;
            for (let i = -2; i <= 2; i++) {
                ctx.beginPath();
                ctx.ellipse(i * (s * 0.18), bounce, 3, s * 0.42, 0.2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Head
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(s * 0.5, bounce, s * 0.42, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = subColor;
        ctx.beginPath();
        ctx.ellipse(s * 0.72, bounce, s * 0.22, s * 0.24, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ears / Horns
        if (this.stageData.earLen) {
            // Long Rabbit / Gazelle ears
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(s * 0.35, -s * 0.55 + bounce, 5, this.stageData.earLen * 0.5, -0.4, 0, Math.PI * 2);
            ctx.ellipse(s * 0.35, s * 0.55 + bounce, 5, this.stageData.earLen * 0.5, 0.4, 0, Math.PI * 2);
            ctx.fill();
            // Inner ear pink
            ctx.fillStyle = '#ffb3c1';
            ctx.beginPath();
            ctx.ellipse(s * 0.35, -s * 0.55 + bounce, 2.5, this.stageData.earLen * 0.35, -0.4, 0, Math.PI * 2);
            ctx.ellipse(s * 0.35, s * 0.55 + bounce, 2.5, this.stageData.earLen * 0.35, 0.4, 0, Math.PI * 2);
            ctx.fill();
        }

        if (this.stageData.horns) {
            // Gazelle / Buffalo Horns
            ctx.strokeStyle = '#3d2614';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(s * 0.4, -s * 0.3 + bounce);
            ctx.quadraticCurveTo(s * 0.2, -s * 0.8 + bounce, s * 0.6, -s * 0.85 + bounce);
            ctx.moveTo(s * 0.4, s * 0.3 + bounce);
            ctx.quadraticCurveTo(s * 0.2, s * 0.8 + bounce, s * 0.6, s * 0.85 + bounce);
            ctx.stroke();
        }

        if (this.stageData.tusks) {
            // Warthog white tusks
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(s * 0.7, -5 + bounce);
            ctx.lineTo(s * 0.88, -12 + bounce);
            ctx.moveTo(s * 0.7, 5 + bounce);
            ctx.lineTo(s * 0.88, 12 + bounce);
            ctx.stroke();
        }

        // Tail
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        const tailWiggle = Math.sin(this.walkFrame * 2) * 5;
        ctx.moveTo(-s * 0.6, bounce);
        ctx.lineTo(-s * 0.85, tailWiggle + bounce);
        ctx.stroke();
    }

    drawExpression(ctx, emotion) {
        const s = this.size;
        const bounce = Math.sin(this.walkFrame) * 2.5;
        const headX = s * 0.5;
        const eyeYOffset = s * 0.18;

        if (emotion === 'RELAXED') {
            // Cute relaxed / happy smile (^ . ^ or happy squint)
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.arc(headX + 5, -eyeYOffset + bounce, 2.8, 0, Math.PI * 2);
            ctx.arc(headX + 5, eyeYOffset + bounce, 2.8, 0, Math.PI * 2);
            ctx.fill();
            // Sparkles in eye
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(headX + 6, -eyeYOffset - 1 + bounce, 1.2, 0, Math.PI * 2);
            ctx.arc(headX + 6, eyeYOffset - 1 + bounce, 1.2, 0, Math.PI * 2);
            ctx.fill();

            // Rosy cheeks
            ctx.fillStyle = 'rgba(255, 130, 150, 0.55)';
            ctx.beginPath();
            ctx.arc(headX + 4, -eyeYOffset - 4 + bounce, 3.5, 0, Math.PI * 2);
            ctx.arc(headX + 4, eyeYOffset + 4 + bounce, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Cute mouth (w or small tongue stick out :P)
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(headX + 11, bounce, 2.5, 0, Math.PI);
            ctx.stroke();
        } else if (emotion === 'ALERT') {
            // Surprised big round eyes (O _ O) + Sweat drop
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(headX + 5, -eyeYOffset + bounce, 4.5, 0, Math.PI * 2);
            ctx.arc(headX + 5, eyeYOffset + bounce, 4.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.arc(headX + 6, -eyeYOffset + bounce, 2.2, 0, Math.PI * 2);
            ctx.arc(headX + 6, eyeYOffset + bounce, 2.2, 0, Math.PI * 2);
            ctx.fill();

            // Sweat drop on forehead
            ctx.fillStyle = '#48cae4';
            ctx.beginPath();
            ctx.arc(headX, -eyeYOffset - 6 + bounce, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // O mouth
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(headX + 11, bounce, 2, 0, Math.PI * 2);
            ctx.stroke();
        } else if (emotion === 'PANIC') {
            // Freaking out, big wide panic eyes (> < or massive wide screaming eyes)
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(headX + 6, -eyeYOffset + bounce, 6, 0, Math.PI * 2);
            ctx.arc(headX + 6, eyeYOffset + bounce, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#000';
            // Dilated tiny shocked pupils
            ctx.beginPath();
            ctx.arc(headX + 7, -eyeYOffset + bounce, 1.8, 0, Math.PI * 2);
            ctx.arc(headX + 7, eyeYOffset + bounce, 1.8, 0, Math.PI * 2);
            ctx.fill();

            // Screaming open mouth
            ctx.fillStyle = '#b7094c';
            ctx.beginPath();
            ctx.ellipse(headX + 12, bounce, 4.5, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Multiple flying sweat droplets
            ctx.fillStyle = '#00b4d8';
            ctx.beginPath();
            ctx.arc(headX - 4, -eyeYOffset - 9 + bounce, 3, 0, Math.PI * 2);
            ctx.arc(headX - 2, eyeYOffset + 9 + bounce, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (emotion === 'CAUGHT') {
            // Spiral eyes @_@
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(headX + 5, -eyeYOffset, 4, 0, Math.PI * 2);
            ctx.arc(headX + 5, eyeYOffset, 4, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    drawSpeechBubble(ctx) {
        // Draw head emotion badge / speech bubble above the animal
        ctx.save();
        const bubbleY = this.y - this.size - 22;

        if (this.chatBubble) {
            // Text Speech Bubble
            ctx.font = 'bold 13px sans-serif';
            const textWidth = ctx.measureText(this.chatBubble).width;
            const bw = textWidth + 18;
            const bh = 26;
            const bx = this.x - bw / 2;

            // Bubble background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.strokeStyle = this.emotion === 'PANIC' ? '#ff4d6d' : (this.emotion === 'ALERT' ? '#e76f51' : '#2a9d8f');
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(bx, bubbleY - bh, bw, bh, 8);
            ctx.fill();
            ctx.stroke();

            // Pointer arrow
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.beginPath();
            ctx.moveTo(this.x - 4, bubbleY);
            ctx.lineTo(this.x, bubbleY + 6);
            ctx.lineTo(this.x + 4, bubbleY);
            ctx.fill();

            // Text
            ctx.fillStyle = '#111';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.chatBubble, this.x, bubbleY - bh / 2);
        } else {
            // Cute Small Emotion Badge Icon
            let badgeEmoji = '🌿';
            let badgeColor = '#57cc99';
            if (this.emotion === 'ALERT') {
                badgeEmoji = '❗';
                badgeColor = '#f39c12';
            } else if (this.emotion === 'PANIC') {
                badgeEmoji = '😱';
                badgeColor = '#e63946';
            }

            ctx.fillStyle = badgeColor;
            ctx.beginPath();
            ctx.arc(this.x, bubbleY + 6, 11, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(badgeEmoji, this.x, bubbleY + 6);
        }

        ctx.restore();
    }
}

// --- Savanna Environment Decoration (Trees, Rocks, Grass clumps) ---
class SavannaWorld {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.decorations = [];
        this.generateDecorations();
    }

    generateDecorations() {
        this.decorations = [];
        // Acacia trees
        for (let i = 0; i < 7; i++) {
            this.decorations.push({
                type: 'tree',
                x: Math.random() * (this.width - 150) + 75,
                y: Math.random() * (this.height - 150) + 75,
                scale: Math.random() * 0.4 + 0.8
            });
        }
        // Grass clumps
        for (let i = 0; i < 28; i++) {
            this.decorations.push({
                type: 'grass',
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                swayOffset: Math.random() * Math.PI * 2
            });
        }
        // Rocks
        for (let i = 0; i < 6; i++) {
            this.decorations.push({
                type: 'rock',
                x: Math.random() * (this.width - 100) + 50,
                y: Math.random() * (this.height - 100) + 50,
                r: Math.random() * 12 + 10
            });
        }
    }

    draw(ctx, bgHue, time) {
        // Background sky/ground gradient based on stage theme
        const grad = ctx.createLinearGradient(0, 0, 0, this.height);
        if (bgHue === 'daylight') {
            grad.addColorStop(0, '#cce3b8');
            grad.addColorStop(1, '#aacc00');
        } else if (bgHue === 'sunny') {
            grad.addColorStop(0, '#dde5b6');
            grad.addColorStop(1, '#adc178');
        } else if (bgHue === 'golden') {
            grad.addColorStop(0, '#fefae0');
            grad.addColorStop(1, '#dda15e');
        } else if (bgHue === 'sunset') {
            grad.addColorStop(0, '#f4a261');
            grad.addColorStop(1, '#e76f51');
        } else if (bgHue === 'dusk') {
            grad.addColorStop(0, '#e07a5f');
            grad.addColorStop(1, '#9d4edd');
        } else if (bgHue === 'night') {
            grad.addColorStop(0, '#240046');
            grad.addColorStop(1, '#3c096c');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.width, this.height);

        // Draw Grass clumps
        this.decorations.forEach(d => {
            if (d.type === 'grass') {
                const sway = Math.sin(time * 0.05 + d.swayOffset) * 4;
                ctx.strokeStyle = bgHue === 'night' ? '#7b2cbf' : '#588157';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(d.x, d.y); ctx.quadraticCurveTo(d.x - 4 + sway, d.y - 12, d.x - 7 + sway, d.y - 16);
                ctx.moveTo(d.x, d.y); ctx.quadraticCurveTo(d.x + sway, d.y - 15, d.x + sway, d.y - 20);
                ctx.moveTo(d.x, d.y); ctx.quadraticCurveTo(d.x + 4 + sway, d.y - 12, d.x + 8 + sway, d.y - 15);
                ctx.stroke();
            } else if (d.type === 'rock') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
                ctx.beginPath();
                ctx.ellipse(d.x, d.y + 4, d.r * 1.3, d.r * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#6c757d';
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fill();
            } else if (d.type === 'tree') {
                // African Flat-top Acacia Tree
                ctx.save();
                ctx.translate(d.x, d.y);
                ctx.scale(d.scale, d.scale);
                // Shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.beginPath();
                ctx.ellipse(0, 5, 55, 18, 0, 0, Math.PI * 2);
                ctx.fill();
                // Trunk
                ctx.strokeStyle = '#4a2810';
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(-6, -40, -18, -65);
                ctx.moveTo(-6, -30);
                ctx.quadraticCurveTo(10, -50, 22, -65);
                ctx.stroke();
                // Flat canopy
                ctx.fillStyle = bgHue === 'night' ? '#3a0ca3' : '#386641';
                ctx.beginPath();
                ctx.ellipse(-18, -68, 35, 12, 0, 0, Math.PI * 2);
                ctx.ellipse(20, -68, 30, 10, 0, 0, Math.PI * 2);
                ctx.ellipse(0, -72, 45, 14, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });
    }
}

// --- Main Game Controller ---
class LionGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Virtual canvas resolution
        this.width = 1200;
        this.height = 760;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.input = {
            keys: {},
            joystick: { x: 0, y: 0 },
            dashRequested: false
        };

        this.currentStageIdx = 0; // 0 to 9 (10 stages)
        this.requiredPreyCount = 3; // 3 per stage
        this.caughtInStage = 0;
        this.totalCaught = 0;

        // 1 Minute timer = 60.00 seconds
        this.stageTimeLimit = 60;
        this.timeRemaining = this.stageTimeLimit;
        this.isTimerRunning = false;
        this.lastTimestamp = 0;
        this.urgentSoundTriggeredSec = -1;

        this.gameState = 'START'; // 'START', 'PLAYING', 'STAGE_CLEAR', 'HUNGER_COLLAPSE', 'GAME_VICTORY'

        this.lion = new Lion(this.width / 2, this.height / 2);
        this.preys = [];
        this.particles = [];
        this.world = new SavannaWorld(this.width, this.height);
        this.time = 0;

        // Bind DOM elements
        this.bindDOM();
        this.setupEventListeners();
        this.resizeCanvas();
    }

    bindDOM() {
        this.dom = {
            stageBadge: document.getElementById('stageBadge'),
            stageTitle: document.getElementById('stageTitle'),
            targetAnimalName: document.getElementById('targetAnimalName'),
            timerDisplay: document.getElementById('timerDisplay'),
            timerProgress: document.getElementById('timerProgress'),
            preyCounter: document.getElementById('preyCounter'),
            dashBtn: document.getElementById('dashBtn'),
            dashCooldownBar: document.getElementById('dashCooldownBar'),
            soundBtn: document.getElementById('soundBtn'),
            
            // Live Animal Emotion Card (돋보기 레이더)
            radarCard: document.getElementById('radarCard'),
            radarEmoji: document.getElementById('radarEmoji'),
            radarDist: document.getElementById('radarDist'),
            radarMood: document.getElementById('radarMood'),
            radarQuote: document.getElementById('radarQuote'),

            // Modals
            startModal: document.getElementById('startModal'),
            startBtn: document.getElementById('startBtn'),
            
            stageClearModal: document.getElementById('stageClearModal'),
            clearStageTitle: document.getElementById('clearStageTitle'),
            clearStageDesc: document.getElementById('clearStageDesc'),
            nextStageBtn: document.getElementById('nextStageBtn'),

            starveModal: document.getElementById('starveModal'),
            starveStageTitle: document.getElementById('starveStageTitle'),
            retryBtn: document.getElementById('retryBtn'),
            giveupBtn: document.getElementById('giveupBtn'),

            victoryModal: document.getElementById('victoryModal'),
            playAgainBtn: document.getElementById('playAgainBtn')
        };
    }

    setupEventListeners() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.input.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                this.input.dashRequested = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            this.input.keys[e.code] = false;
        });

        // Window resize
        window.addEventListener('resize', () => this.resizeCanvas());

        // Dash button
        if (this.dom.dashBtn) {
            this.dom.dashBtn.addEventListener('click', () => {
                this.input.dashRequested = true;
            });
            this.dom.dashBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.input.dashRequested = true;
            });
        }

        // Sound toggle
        if (this.dom.soundBtn) {
            this.dom.soundBtn.addEventListener('click', () => {
                window.soundCtrl.init();
                const enabled = window.soundCtrl.toggle();
                this.dom.soundBtn.innerHTML = enabled ? '🔊 소리 켜짐' : '🔇 소리 꺼짐';
                this.dom.soundBtn.classList.toggle('muted', !enabled);
            });
        }

        // Start button
        this.dom.startBtn.addEventListener('click', () => {
            window.soundCtrl.init();
            window.soundCtrl.startBGM();
            this.hideAllModals();
            this.startStage(0);
        });

        // Stage Clear Next button
        this.dom.nextStageBtn.addEventListener('click', () => {
            this.hideAllModals();
            this.startStage(this.currentStageIdx + 1);
        });

        // Retry (다시 도전하기) button on Starve Collapse
        this.dom.retryBtn.addEventListener('click', () => {
            this.hideAllModals();
            this.startStage(this.currentStageIdx); // Retry current stage
        });

        // Give up / End (끝내기 / 처음부터) button
        this.dom.giveupBtn.addEventListener('click', () => {
            this.hideAllModals();
            this.currentStageIdx = 0;
            this.dom.startModal.classList.remove('hidden');
        });

        // Victory Play Again
        this.dom.playAgainBtn.addEventListener('click', () => {
            this.hideAllModals();
            this.currentStageIdx = 0;
            this.startStage(0);
        });

        // Touch Virtual Joystick on Canvas
        this.setupVirtualJoystick();
    }

    setupVirtualJoystick() {
        let touchStart = null;
        const stickEl = document.getElementById('joystickHandle');
        const baseEl = document.getElementById('joystickBase');

        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            touchStart = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
            if (baseEl) {
                baseEl.style.display = 'block';
                baseEl.style.left = `${touch.clientX}px`;
                baseEl.style.top = `${touch.clientY}px`;
            }
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            if (!touchStart) return;
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const curX = touch.clientX - rect.left;
            const curY = touch.clientY - rect.top;

            const dx = curX - touchStart.x;
            const dy = curY - touchStart.y;
            const dist = Math.hypot(dx, dy);
            const maxDist = 55;

            if (dist > 5) {
                this.input.joystick.x = dx / dist;
                this.input.joystick.y = dy / dist;
            }

            if (stickEl) {
                const cappedDist = Math.min(dist, maxDist);
                const angle = Math.atan2(dy, dx);
                stickEl.style.transform = `translate(${Math.cos(angle) * cappedDist}px, ${Math.sin(angle) * cappedDist}px)`;
            }
        }, { passive: false });

        const endTouch = () => {
            touchStart = null;
            this.input.joystick.x = 0;
            this.input.joystick.y = 0;
            if (baseEl) baseEl.style.display = 'none';
            if (stickEl) stickEl.style.transform = 'translate(0px, 0px)';
        };

        this.canvas.addEventListener('touchend', endTouch);
        this.canvas.addEventListener('touchcancel', endTouch);

        // Click / Drag mouse to move
        let mouseHolding = false;
        this.canvas.addEventListener('mousedown', (e) => {
            mouseHolding = true;
            this.updatePointerMove(e);
        });
        window.addEventListener('mousemove', (e) => {
            if (mouseHolding) this.updatePointerMove(e);
        });
        window.addEventListener('mouseup', () => {
            mouseHolding = false;
            this.input.joystick.x = 0;
            this.input.joystick.y = 0;
        });
    }

    updatePointerMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.width / rect.width;
        const scaleY = this.height / rect.height;
        const canvasMouseX = (e.clientX - rect.left) * scaleX;
        const canvasMouseY = (e.clientY - rect.top) * scaleY;

        const dx = canvasMouseX - this.lion.x;
        const dy = canvasMouseY - this.lion.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 20) {
            this.input.joystick.x = dx / dist;
            this.input.joystick.y = dy / dist;
        } else {
            this.input.joystick.x = 0;
            this.input.joystick.y = 0;
        }
    }

    resizeCanvas() {
        // Fit container while keeping aspect ratio
        const container = document.getElementById('gameContainer');
        if (!container) return;
        const maxW = container.clientWidth;
        const maxH = container.clientHeight;
        const aspect = this.width / this.height;

        let w = maxW;
        let h = w / aspect;
        if (h > maxH) {
            h = maxH;
            w = h * aspect;
        }
        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;
    }

    hideAllModals() {
        this.dom.startModal.classList.add('hidden');
        this.dom.stageClearModal.classList.add('hidden');
        this.dom.starveModal.classList.add('hidden');
        this.dom.victoryModal.classList.add('hidden');
    }

    startStage(stageIndex) {
        this.currentStageIdx = stageIndex;
        const stageData = STAGES_DATA[this.currentStageIdx];

        this.caughtInStage = 0;
        this.timeRemaining = this.stageTimeLimit; // 60 seconds
        this.urgentSoundTriggeredSec = -1;
        this.gameState = 'PLAYING';
        this.isTimerRunning = true;

        // Reset lion
        this.lion.x = this.width / 2;
        this.lion.y = this.height / 2;
        this.lion.state = 'NORMAL';
        this.lion.dashCooldown = 0;

        // Spawn preys: keep 4~5 active on the field so lion always has hunting targets!
        this.preys = [];
        const count = 5;
        for (let i = 0; i < count; i++) {
            this.spawnSinglePrey();
        }

        this.particles = [];
        this.world.generateDecorations();

        this.updateHUD();
    }

    spawnSinglePrey() {
        const stageData = STAGES_DATA[this.currentStageIdx];
        const prey = new Prey(stageData, { width: this.width, height: this.height });
        // Make sure prey spawns at least 250px away from lion
        while (Math.hypot(prey.x - this.lion.x, prey.y - this.lion.y) < 250) {
            prey.x = Math.random() * (this.width - 120) + 60;
            prey.y = Math.random() * (this.height - 120) + 60;
        }
        this.preys.push(prey);
    }

    updateHUD() {
        const stageData = STAGES_DATA[this.currentStageIdx];
        this.dom.stageBadge.textContent = `STAGE ${stageData.stage} / 10`;
        this.dom.stageTitle.textContent = stageData.title;
        this.dom.targetAnimalName.textContent = `${stageData.emoji} ${stageData.name}`;

        // 3 Prey icons progress
        let icons = '';
        for (let i = 0; i < this.requiredPreyCount; i++) {
            if (i < this.caughtInStage) {
                icons += '🍗 ';
            } else {
                icons += '⚪ ';
            }
        }
        this.dom.preyCounter.innerHTML = `${icons} <span>(${this.caughtInStage}/${this.requiredPreyCount})</span>`;

        // Timer HUD format: 00:00
        const secs = Math.ceil(this.timeRemaining);
        const mins = Math.floor(secs / 60);
        const remSecs = secs % 60;
        const timeStr = `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
        this.dom.timerDisplay.textContent = timeStr;

        // Progress bar (60s -> 0%)
        const pct = (this.timeRemaining / this.stageTimeLimit) * 100;
        this.dom.timerProgress.style.width = `${pct}%`;
        if (this.timeRemaining <= 10) {
            this.dom.timerDisplay.classList.add('urgent');
            this.dom.timerProgress.classList.add('urgent');
        } else {
            this.dom.timerDisplay.classList.remove('urgent');
            this.dom.timerProgress.classList.remove('urgent');
        }

        // Dash cooldown HUD
        if (this.lion.dashCooldown > 0) {
            const cdPct = (this.lion.dashCooldown / 90) * 100;
            this.dom.dashCooldownBar.style.width = `${cdPct}%`;
            this.dom.dashBtn.classList.add('cooling');
        } else {
            this.dom.dashCooldownBar.style.width = '0%';
            this.dom.dashBtn.classList.remove('cooling');
        }
    }

    updateClosestPreyRadar() {
        if (this.preys.length === 0) return;

        let closest = null;
        let minDist = 9999;
        this.preys.forEach(p => {
            if (!p.isCaught && p.distToLion < minDist) {
                minDist = p.distToLion;
                closest = p;
            }
        });

        if (closest) {
            this.dom.radarEmoji.textContent = closest.stageData.emoji;
            this.dom.radarDist.textContent = `거리: ${Math.round(minDist)}m`;

            if (closest.emotion === 'PANIC') {
                this.dom.radarMood.textContent = '😱 패닉! 전속력 도망 중!!';
                this.dom.radarMood.className = 'radar-mood panic';
                this.dom.radarQuote.textContent = `"${closest.chatBubble || '으아악!! 살려줘!! 💨'}"`;
            } else if (closest.emotion === 'ALERT') {
                this.dom.radarMood.textContent = '👀 경계 중! 사자를 발견함!';
                this.dom.radarMood.className = 'radar-mood alert';
                this.dom.radarQuote.textContent = `"${closest.chatBubble || '헉! 뒤에서 사자 냄새가... 💦'}"`;
            } else {
                this.dom.radarMood.textContent = '🌿 평화로움 (사자를 못 봄 / 놀리는 중)';
                this.dom.radarMood.className = 'radar-mood relaxed';
                this.dom.radarQuote.textContent = `"${closest.chatBubble || '냠냠~ 풀이 참 맛있네! 🎵'}"`;
            }
        }
    }

    checkCollisions() {
        const catchDistance = (this.lion.size + 15);

        for (let i = 0; i < this.preys.length; i++) {
            const prey = this.preys[i];
            if (prey.isCaught) continue;

            const dist = Math.hypot(this.lion.x - prey.x, this.lion.y - prey.y);
            if (dist < catchDistance) {
                // CAUGHT!
                prey.isCaught = true;
                this.caughtInStage++;
                this.totalCaught++;

                // Sound & particles
                window.soundCtrl?.playCatch();
                for (let p = 0; p < 8; p++) {
                    this.particles.push(new Particle(prey.x, prey.y, 'star'));
                    this.particles.push(new Particle(prey.x, prey.y, 'heart'));
                }

                // If not stage complete yet, spawn a replacement prey so field is never empty
                if (this.caughtInStage < this.requiredPreyCount) {
                    setTimeout(() => {
                        if (this.gameState === 'PLAYING') {
                            this.spawnSinglePrey();
                        }
                    }, 1200);
                }

                this.updateHUD();

                // Check Stage Clear condition (3 animals caught!)
                if (this.caughtInStage >= this.requiredPreyCount) {
                    this.handleStageClear();
                }

                break;
            }
        }
    }

    handleStageClear() {
        this.gameState = 'STAGE_CLEAR';
        this.isTimerRunning = false;
        this.lion.state = 'CELEBRATING';

        // Check if final 10th Stage!
        if (this.currentStageIdx >= STAGES_DATA.length - 1) {
            window.soundCtrl?.playVictory();
            setTimeout(() => {
                this.dom.victoryModal.classList.remove('hidden');
            }, 1000);
        } else {
            window.soundCtrl?.playStageClear();
            const nextStageData = STAGES_DATA[this.currentStageIdx + 1];
            this.dom.clearStageTitle.textContent = `🎉 ${STAGES_DATA[this.currentStageIdx].title} 클리어!`;
            this.dom.clearStageDesc.textContent = `사자가 배부르게 사냥에 성공했습니다! 다음 상대는 더욱 빠른 ${nextStageData.name}(${nextStageData.emoji})입니다!`;
            
            setTimeout(() => {
                this.dom.stageClearModal.classList.remove('hidden');
            }, 800);
        }
    }

    handleHungerCollapse() {
        this.gameState = 'HUNGER_COLLAPSE';
        this.isTimerRunning = false;
        this.lion.state = 'STARVED';

        window.soundCtrl?.playStarve();

        const currentStageData = STAGES_DATA[this.currentStageIdx];
        this.dom.starveStageTitle.textContent = `😢 ${currentStageData.title} 실패`;

        setTimeout(() => {
            this.dom.starveModal.classList.remove('hidden');
        }, 1200);
    }

    update(dt) {
        this.time++;

        if (this.gameState === 'PLAYING' && this.isTimerRunning) {
            // Count down 60 seconds timer
            this.timeRemaining -= dt;

            // Urgent 10-second warning tick sound
            const currentIntSec = Math.floor(this.timeRemaining);
            if (currentIntSec <= 10 && currentIntSec >= 1 && currentIntSec !== this.urgentSoundTriggeredSec) {
                this.urgentSoundTriggeredSec = currentIntSec;
                window.soundCtrl?.playUrgentTick();
            }

            if (this.timeRemaining <= 0) {
                this.timeRemaining = 0;
                this.updateHUD();
                this.handleHungerCollapse();
                return;
            }

            this.updateHUD();
        }

        // Update Lion
        this.lion.update(this.input, { width: this.width, height: this.height }, this.particles);

        // Update Preys
        for (let i = this.preys.length - 1; i >= 0; i--) {
            const alive = this.preys[i].update(this.lion, this.particles);
            if (!alive) {
                this.preys.splice(i, 1);
            }
        }

        // Update Radar widget
        if (this.gameState === 'PLAYING') {
            this.updateClosestPreyRadar();
            this.checkCollisions();
        }

        // Update Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            if (!this.particles[i].update()) {
                this.particles.splice(i, 1);
            }
        }
    }

    render() {
        const stageData = STAGES_DATA[this.currentStageIdx] || STAGES_DATA[0];
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Draw World Background & Savanna Trees
        this.world.draw(this.ctx, stageData.bgHue, this.time);

        // 2. Draw Preys
        this.preys.forEach(prey => prey.draw(this.ctx));

        // 3. Draw Lion
        this.lion.draw(this.ctx);

        // 4. Draw Particles
        this.particles.forEach(p => p.draw(this.ctx));
    }

    loop(timestamp) {
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;
        const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
        this.lastTimestamp = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }

    init() {
        requestAnimationFrame((t) => this.loop(t));
    }
}

// Start game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.game = new LionGame();
    window.game.init();
});
