let noiseScale = 0.09;
let viewScale = 20;
let noiseMax = 160;
let rows = 90;
let columns = 120;
let heights = [];
var drop = [];
let captureVideoFrames = false;
const MAXIMUM_VIDEO_FRAME_COUNT = 2500;
let capturer;
if (captureVideoFrames) {
    capturer = new CCapture({ format: 'png', framerate: 25, name: 'perlinlandscapevid', verbose: true });
}
let canv;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, WEBGL);
}

function setup() {
    let p5canvas;
    if (captureVideoFrames) {
        p5canvas = createCanvas(1920, 1080);
    } else {
        p5canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    }
    canv = p5canvas.canvas;
    frameRate(25);

    if (captureVideoFrames) {
        capturer.start();
    }
    for(var i = 0; i < 200; i++) {
        drop[i] = new Drop();
    }
}

function draw() {
    if(mouseY>windowHeight/4){
      mouseY = 1080/4
    }
    let yOffset = -frameCount / 144;
    for (var y = 0; y < rows; y++) {
        heights[y] = [];
        for (var x = 0; x < columns; x++) {
            heights[y][x] = map(noise(x * noiseScale, yOffset), 0, 1, -mouseY, mouseY);
        }
        yOffset += noiseScale;
    }

    background(0);
    rotateX(PI / 2.6);
    translate(- 3 * width / 4, -height / 2);
    for(var j = 0; j < 200; j++) {
    drop[j].show();
    drop[j].update();
  }

    stroke(100,149,237);
    fill(0,0,139);
    strokeWeight(1);

    for (var y = 0; y < rows - 1; y++) {
        beginShape(TRIANGLE_STRIP);
        for (var x = 0; x < columns; x++) {
            vertex(x * viewScale, y * viewScale, heights[y][x]);
            vertex(x * viewScale, (y + 1) * viewScale, heights[y + 1][x]);
        }
        endShape();
    }

    if (captureVideoFrames) {
        capturer.capture(canv);
    }

    if (captureVideoFrames && frameCount == MAXIMUM_VIDEO_FRAME_COUNT) {
        noLoop();
        capturer.stop();
        capturer.save();
    }
}

function Drop() {
  this.x = random(0, 2*width);
  this.y = random(0, -3*height);
  
  this.show = function() {
    noStroke();
    fill(random(180,255));
    ellipse(this.x, this.y, random(1, 5), random(1, mouseY/1.5));   
  }
  this.update = function() {
    this.speed = mouseY/2.5;
    this.gravity = 1.05;
    this.y = this.y + this.speed*this.gravity;  
    
    if (this.y > height) {
      this.y = random(0, -height);
      this.gravity = 0;
        }
    }
 }
