

function getCanvas(){
    const myCanvas = document.querySelector("canvas");
    console.log(myCanvas);  
    return myCanvas;  
}


let pc;
let inputCtx ;
let outputCtx ;

function setup() {
    colorMode(RGB, 255);
    createCanvas(window.innerWidth/2, window.innerHeight/2, WEBGL);
    background(255,0,0);
    pc = new pixelContext({
        width: window.innerWidth,
        height:  window.innerHeight,
        subdivisions: 40,
        fill: false,
        stroke: true,
        ascii: true,
        autoDraw: true,
        autoClear: true,
        inputCanvas: getCanvas(),
        inputCanvasIsWEBGL: true,
    });

    pc.buildPixels();
    
    inputCtx = pc.inputCtx;
    outputCtx = pc.outputCtx;
    //noFill()
    strokeWeight(10)
    
   
}


function draw() {
    rotateX(frameCount * 0.1);
    rotateY(frameCount*0.1);
    rotateZ(frameCount*0.1);
    background(255,0,0);
    lights();
    let c = color(0, 255, 0);
    directionalLight(c, -10, -10, -1);
    box(100)

    if(frameCount%10==0){
        pc.changeSubdivisions({
            subdivisions:60,
            floor:1,
            fixed:false
        });
        pc.buildPixels();
    }

    if(frameCount%10==0){
        pc.fill = randomBolean();
        pc.stroke = randomBolean();
        pc.ascii = randomBolean();

        if(pc.ascii==pc.fill==pc.stroke==false){
            pc.fill = true;
        }
    }

    pc.updatePixels();

}


function randomBolean(){
    return Math.random()>=0.5;
}

function keyPressed() {
    if (isLooping() === true) {
        noLoop();
      } 
      else {
        loop();
      }
    
  }