// Variables and DOM Elements
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let width, height;

// Resize handling
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initStars();
}
window.addEventListener('resize', resize);

// Elements
const dom = {
    skySunset: document.getElementById('sky-sunset'),
    skyTwilight: document.getElementById('sky-twilight'),
    skyNight: document.getElementById('sky-night'),
    skySpace: document.getElementById('sky-space'),
    spaceElements: document.getElementById('space-elements'),
    sunLayer: document.getElementById('sun-layer'),
    mountains: {
        bg: document.getElementById('mountain-bg'),
        mg: document.getElementById('mountain-mg'),
        fg: document.getElementById('mountain-fg'),
    },
    stargazer: document.getElementById('stargazer'),
    telescope: document.getElementById('telescope-tube'),
    cinematicTitle: document.getElementById('cinematic-title'),
    texts: [
        document.getElementById('text-1'),
        document.getElementById('text-2'),
        document.getElementById('text-3'),
        document.getElementById('text-4'),
        document.getElementById('text-5'),
        document.getElementById('text-6'),
        document.getElementById('text-7')
    ]
};

// Canvas Stars Data
let stars = [];
let constellations = [];

function initStars() {
    stars = [];
    // Regular stars
    const numStars = width < 768 ? 250 : 1000;
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height * 1.5, // Extend beyond visible initially
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random(),
            twinkleSpeed: Math.random() * 0.05 + 0.01,
            layer: Math.floor(Math.random() * 3) // 0: slow, 1: mid, 2: fast
        });
    }

    // Constellations predefined points relative to center
    const cx = width / 2;
    const cy = height / 3;
    
    // Orion
    const orionStars = [
        {x: cx - 50, y: cy - 70}, {x: cx + 30, y: cy - 80}, // Shoulders
        {x: cx - 20, y: cy}, {x: cx, y: cy + 5}, {x: cx + 20, y: cy + 10}, // Belt
        {x: cx - 40, y: cy + 80}, {x: cx + 40, y: cy + 70} // Knees
    ];
    // Big Dipper (Ursa Major)
    const dipperStars = [
        {x: cx - 200, y: cy - 100}, {x: cx - 180, y: cy - 80}, 
        {x: cx - 140, y: cy - 90}, {x: cx - 120, y: cy - 120},
        {x: cx - 80, y: cy - 110}, {x: cx - 100, y: cy - 140},
        {x: cx - 140, y: cy - 150}
    ];

    constellations = [
        { points: orionStars, lines: [[0,2], [1,4], [2,3], [3,4], [2,5], [4,6]] },
        { points: dipperStars, lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,3]] }
    ];
}

resize();

// Helper functions for mapping values
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

// Maps a scroll percentage (S) from a given input range [inMin, inMax] to an output range [outMin, outMax]
function mapRange(S, inMin, inMax, outMin, outMax) {
    if (S <= inMin) return outMin;
    if (S >= inMax) return outMax;
    const t = (S - inMin) / (inMax - inMin);
    return outMin + t * (outMax - outMin);
}

// Global Scroll State
let scrollPerc = 0;
let lastScrollPerc = -1;

function updateScroll() {
    const totalScroll = document.body.scrollHeight - window.innerHeight;
    scrollPerc = clamp(window.scrollY / totalScroll, 0, 1);
    
    // Request next frame
    requestAnimationFrame(render);
}
window.addEventListener('scroll', updateScroll);

function render() {
    if (Math.abs(scrollPerc - lastScrollPerc) < 0.0001) return; // Optimization
    lastScrollPerc = scrollPerc;

    const S = scrollPerc;

    // --- DOM UPDATES ---

    // Sky Opacities
    dom.skySunset.style.opacity = mapRange(S, 0.0, 0.15, 1, 0);
    dom.skyTwilight.style.opacity = mapRange(S, 0.05, 0.15, 0, 1) * mapRange(S, 0.35, 0.45, 1, 0);
    dom.skyNight.style.opacity = mapRange(S, 0.25, 0.35, 0, 1) * mapRange(S, 0.70, 0.80, 1, 0);
    dom.skySpace.style.opacity = mapRange(S, 0.70, 0.85, 0, 1);
    
    // Space Elements (Nebula / Deeper Space)
    dom.spaceElements.style.opacity = mapRange(S, 0.75, 0.85, 0, 1);
    const spaceScale = mapRange(S, 0.75, 1.0, 1, 1.4);
    dom.spaceElements.style.transform = `scale(${spaceScale})`;

    // Sun movement
    dom.sunLayer.style.transform = `translateY(${mapRange(S, 0, 0.15, 20, 100)}vh)`;
    dom.sunLayer.style.opacity = mapRange(S, 0.10, 0.15, 1, 0);

    // Cinematic Opening Title
    if (dom.cinematicTitle) {
        dom.cinematicTitle.style.opacity = mapRange(S, 0.08, 0.14, 1, 0);
        const yOffset = mapRange(S, 0, 0.15, -50, -65);
        dom.cinematicTitle.style.transform = `translate(-50%, ${yOffset}%)`;
        
        // Color transition for black to white based on sun going down (0 to 0.08)
        const t1_r = Math.floor(mapRange(S, 0, 0.08, 0, 255));
        const t1_g = Math.floor(mapRange(S, 0, 0.08, 0, 255));
        const t1_b = Math.floor(mapRange(S, 0, 0.08, 0, 255));
        
        const t2_r = Math.floor(mapRange(S, 0, 0.08, 0, 251));
        const t2_g = Math.floor(mapRange(S, 0, 0.08, 0, 213));
        const t2_b = Math.floor(mapRange(S, 0, 0.08, 0, 176));
        
        const s_r = Math.floor(mapRange(S, 0, 0.08, 0, 226));
        const s_g = Math.floor(mapRange(S, 0, 0.08, 0, 232));
        const s_b = Math.floor(mapRange(S, 0, 0.08, 0, 240));

        dom.cinematicTitle.style.setProperty('--title-color-1', `rgb(${t1_r}, ${t1_g}, ${t1_b})`);
        dom.cinematicTitle.style.setProperty('--title-color-2', `rgb(${t2_r}, ${t2_g}, ${t2_b})`);
        dom.cinematicTitle.style.setProperty('--subtitle-color', `rgb(${s_r}, ${s_g}, ${s_b})`);
    }

    // Mountain Parallax
    // They slowly sink downwards as we "pan up" to the sky
    dom.mountains.bg.style.transform = `translateY(${mapRange(S, 0, 1, 0, 40)}vh)`;
    dom.mountains.mg.style.transform = `translateY(${mapRange(S, 0, 1, 0, 30)}vh)`;
    dom.mountains.fg.style.transform = `translateY(${mapRange(S, 0, 1, 0, 20)}vh)`;

    // Stargazer
    // Fades in, rotates telescope, fades out in space, returns at end
    let stargazerAlpha = 0;
    if (S < 0.5) stargazerAlpha = mapRange(S, 0.25, 0.30, 0, 1);
    else if (S < 0.8) stargazerAlpha = mapRange(S, 0.70, 0.80, 1, 0);
    else stargazerAlpha = mapRange(S, 0.90, 0.95, 0, 1);
    
    dom.stargazer.style.opacity = stargazerAlpha;
    // Keep it grounded with foreground
    dom.stargazer.style.transform = `translateY(${mapRange(S, 0, 1, 0, 20)}vh)`; 
    
    // Telescope Angle
    const telAngle = mapRange(S, 0.30, 0.45, 30, 65) - mapRange(S, 0.90, 0.98, 0, 35);
    dom.telescope.style.transform = `rotate(${telAngle}deg)`;

    // Text Overlays
    const textTiming = [
        { i: 0, inS: -0.1, inE: 0.0, outS: 0.08, outE: 0.12 },  // Text 1: Sunset
        { i: 1, inS: 0.15, inE: 0.20, outS: 0.26, outE: 0.30 }, // Text 2: Twilight Stars
        { i: 2, inS: 0.32, inE: 0.37, outS: 0.42, outE: 0.46 }, // Text 3: Telescope
        { i: 3, inS: 0.48, inE: 0.52, outS: 0.58, outE: 0.62 }, // Text 4: Constellations
        { i: 4, inS: 0.64, inE: 0.68, outS: 0.74, outE: 0.78 }, // Text 5: Milky Way
        { i: 5, inS: 0.80, inE: 0.84, outS: 0.88, outE: 0.92 }, // Text 6: Space Infinite
        { i: 6, inS: 0.93, inE: 0.97, outS: 1.1, outE: 1.2 }    // Text 7: Ending
    ];

    textTiming.forEach(t => {
        const opIn = mapRange(S, t.inS, t.inE, 0, 1);
        const opOut = mapRange(S, t.outS, t.outE, 1, 0);
        const totalOp = opIn * opOut;
        dom.texts[t.i].style.opacity = totalOp;
        
        // Small parallax floating effect for text
        const yOffset = mapRange(S, t.inS, t.outE, 30, -30);
        dom.texts[t.i].style.transform = `translateY(${yOffset}px)`;
    });

    // --- CANVAS UPDATES ---
    ctx.clearRect(0, 0, width, height);
    
    // Global alpha for stars (fade in starting twilight)
    const starMasterAlpha = mapRange(S, 0.10, 0.25, 0, 1);
    if (starMasterAlpha === 0) return; // Skip drawing if entirely hidden
    
    // Parallax logic for canvas drawing
    ctx.save();
    // Move everything up slowly based on scroll to fake camera panning up
    const panY = mapRange(S, 0, 1, 0, -height*0.5); 
    
    // Draw regular stars
    stars.forEach(star => {
        // Twinkle
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0.2) star.twinkleSpeed *= -1;
        
        // Layer parallax offset
        const pOffset = star.layer * (panY * 0.3);
        const finalY = star.y + panY + pOffset;
        
        // Culling (don't draw offscreen)
        if (finalY < -10 || finalY > height + 10) return;

        ctx.globalAlpha = star.opacity * starMasterAlpha;
        ctx.beginPath();
        ctx.arc(star.x, finalY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    });

    // Draw Constellations
    const constelAlpha = mapRange(S, 0.45, 0.55, 0, 1) * mapRange(S, 0.65, 0.70, 1, 0);
    const lineProgress = mapRange(S, 0.45, 0.52, 0, 1); // 0 to 1 for line drawing
    
    if (constelAlpha > 0) {
        constellations.forEach(c => {
            // Draw lines first
            ctx.globalAlpha = constelAlpha * 0.5;
            ctx.strokeStyle = '#a4c2f4';
            ctx.lineWidth = 1;
            
            c.lines.forEach(line => {
                const p1 = c.points[line[0]];
                const p2 = c.points[line[1]];
                
                // Final visually shifted coordinates
                const y1 = p1.y + panY;
                const y2 = p2.y + panY;
                
                // Calculate point towards p2 based on lineProgress
                const currentX = p1.x + (p2.x - p1.x) * lineProgress;
                const currentY = y1 + (y2 - y1) * lineProgress;

                if (lineProgress > 0) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, y1);
                    ctx.lineTo(currentX, currentY);
                    ctx.stroke();
                }
            });

            // Draw glowing stars on constellation points
            ctx.globalAlpha = starMasterAlpha; // Star itself is always visible when stars are visible
            c.points.forEach(p => {
                const finalY = p.y + panY;
                ctx.beginPath();
                ctx.arc(p.x, finalY, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
                // Glow
                ctx.globalAlpha = constelAlpha * 0.8;
                ctx.beginPath();
                ctx.arc(p.x, finalY, 8, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(164, 194, 244, 0.3)';
                ctx.fill();
                ctx.globalAlpha = starMasterAlpha;
            });
        });
    }

    // Milky Way Effect (Canvas specific particles)
    const mwAlpha = mapRange(S, 0.60, 0.75, 0, 1);
    if (mwAlpha > 0) {
        ctx.globalAlpha = mwAlpha * 0.15;
        // Simple rotation of canvas for space depth effect
        ctx.save();
        ctx.translate(width/2, height/2 + panY);
        ctx.rotate(mapRange(S, 0.6, 1.0, 0, Math.PI/4));
        ctx.translate(-width/2, -(height/2 + panY));
        
        const grad = ctx.createRadialGradient(width/2, height/2 + panY, 50, width/2, height/2 + panY, 400);
        grad.addColorStop(0, '#5d4273');
        grad.addColorStop(0.5, '#29386f');
        grad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = grad;
        // Draw ellipse-like shape
        ctx.scale(1, 0.4);
        ctx.beginPath();
        ctx.arc(width/2, (height/2 + panY)/0.4, 600, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    ctx.restore();
}

// Initial draw
updateScroll();
// Continuous loop for twinkling
function loop() {
    requestAnimationFrame(render);
    requestAnimationFrame(loop);
}
loop();
/* CUSTOM SPACESHIP CURSOR */

document.addEventListener("DOMContentLoaded", () => {

const cursor = document.querySelector(".spaceship-cursor");

let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;

window.addEventListener("mousemove",(e)=>{
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor(){

    currentX += (mouseX - currentX) * 0.2;
    currentY += (mouseY - currentY) * 0.2;

    cursor.style.left = currentX + "px";
    cursor.style.top = currentY + "px";

    requestAnimationFrame(animateCursor);
}

animateCursor();

});
