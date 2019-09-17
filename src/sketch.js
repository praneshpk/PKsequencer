let s = (p5) => {
    let layers = [];
    
    const dim = (x, y) => [window.innerWidth * x, window.innerHeight * y];

    const DIM = [960, 640];

    const SAMPLES = 16;

    const center = (dim) => [ 
        window.innerWidth / 2 - dim[0] / 2, 
        window.innerHeight / 2 - dim[1] / 2,
        dim[0], dim[1]
    ];

    const canvas = () => {
        p5.background(255);
        p5.fill(20, 30, 40);
        p5.rect(0, 0, DIM[0], DIM[1]);
        p5.stroke(255);
        p5.rect(0, DIM[1]/3.5, DIM[0], DIM[1] / 2.5);
        p5.stroke(255);
        for(let i = 0; i < SAMPLES; i++) {
            p5.fill(200);
            p5.rect(i  * (DIM[0]/SAMPLES) + 5, DIM[1] - 160, 40, 100);
        }
    }

    // sk.translate(window.innerWidth/2,window.innerHeight/2);
    p5.setup = () => {
        p5.createCanvas(window.innerWidth,window.innerHeight);
 
    }

    p5.draw = () => {
        canvas();

    }

}
const P5 = new p5(s);