const bass = new p5.Oscillator();

let s = (p5) => {
    let layers = [];
    
    const dim = (x, y) => [window.innerWidth * x, window.innerHeight * y];

    const D = [1050, 640];

    const SAMPLES = 16;

    const FPS = 120;

    let BPM = 80;

    let step = 0;

    const center = (dim) => [ 
        window.innerWidth / 2 - dim[0] / 2, 
        window.innerHeight / 2 - dim[1] / 2,
        dim[0], dim[1]
    ];
    
    let gutter = D[0]/SAMPLES/4 * 1.5;

    let s = [
        (D[0] - gutter * SAMPLES*1.1) / SAMPLES,
        D[1] * .15
    ];

    const sample = (on, sample, context) => {
        p5.noStroke();
        on ? p5.fill(199,185,110) : p5.fill(149,134,58);
        p5.rect(context.x, context.y, context.w, context.h);
        if(on) {
            sample.amp(.2);
            sample.freq(context.x);
        } else {
        }
    }

    const canvas = () => {
        p5.background(255);
        p5.fill(40, 40, 50);
        p5.rect(0, 0, D[0], D[1]);
        p5.stroke(255);
        p5.line(0, D[1]* .2, D[0], D[1]* .2);
        p5.line(0, D[1]* .7, D[0], D[1]* .7);

        if(Math.floor(p5.frameCount % (FPS*60/BPM/(SAMPLES))) === 0) {
            step = (step + 1) % SAMPLES;        
        }
        for(let i = 0; i < SAMPLES; i++) {
            let context = {
                x: i * (s[0] + gutter) + gutter*1.25,
                y: D[1] - s[1] * 1.5,
                w: s[0],
                h: s[1]
            };
            sample(i===step, bass, context);         
        }
    }

    // sk.translate(window.innerWidth/2,window.innerHeight/2);
    p5.setup = () => {
        p5.frameRate(FPS);
        p5.createCanvas(window.innerWidth,window.innerHeight);
        bass.setType('sine');
        bass.amp(0.5);
        bass.start();
 
    }

    p5.draw = () => {
        canvas();
    }

}

const P5 = new p5(s);