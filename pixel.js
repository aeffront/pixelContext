

class pixel{
    constructor(x,y,size,color,textColor="black"){
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.textColor = textColor;
        this.ascii;
    }
}

class pixelContext{

    constructor({width,height,subdivisions,fill=true,stroke=false,ascii=false,autoDraw=true,autoClear=true,inputCanvas=null,inputCanvasIsWEBGL=false}){
        this.width = width;
        this.height = height;
        this.subdivisions = subdivisions;

        this.inputCanvas ; // If no inputCanvas is provided, a new one will be created
        this.inputCanvasIsWEBGL = inputCanvasIsWEBGL;
        if(inputCanvas){
            this.inputCanvas = inputCanvas;
        }
        else{
            this.inputCanvas = document.createElement("canvas");
            document.body.appendChild(this.inputCanvas);
        }
       
        this.inputCanvas.style.display = "none";
        this.outputCanvas = document.createElement("canvas");
        this.outputCanvas.style.cursor = "none";
        this.outputCanvas.style.position = "fixed";

        this.inputCtx = null;
        if(this.inputCanvasIsWEBGL){
            this.inputCtx = this.inputCanvas.getContext('webgl2',{ willReadFrequently: true });
            console.log(this.inputCtx);
            
        }
        else{
            this.inputCtx = this.inputCanvas.getContext('2d', {willReadFrequently:true});
            if (!this.inputCtx) {
                throw new Error("Failed to get 2D context");
            }
        }
        
        this.outputCtx = this.outputCanvas.getContext('2d', {willReadFrequently:true});

       
        document.body.appendChild(this.outputCanvas);

        this.inputCanvas.width = this.outputCanvas.width = width;
        this.inputCanvas.height = this.outputCanvas.height = height;

        this.pixels = [];

        this.fill = fill;
        this.stroke = stroke;
        this.ascii = ascii;
        this.aciiChars = ["@","#","$","%","&","?","*",";",":",",",".","  "];

        this.autoDraw = autoDraw; // If true, drawPixels() will be called after updatePixels()
        this.autoClear = autoClear; // If true, the output canvas will be cleared before drawing the pixels
    }
// Creates the pixels contained in this.pixels depending on the width, height and subdivisions
    buildPixels(){
        this.pixels = [];
        let size = this.width / this.subdivisions;
        for(let x = 0; x < this.width; x += size){
            for(let y = 0; y < this.height; y += size){
                const p = new pixel(x,y,size,"white");
                this.pixels.push(p);
            }
        }
    }
// Draws the pixels contained in this.pixels onto the output canvas
    drawPixels(){
        if(this.autoClear){
            this.outputCtx.clearRect(0, 0, this.width, this.height);
        }
        this.pixels.forEach((pixel) => {
            if(this.fill){
                this.outputCtx.fillStyle = pixel.color;
                this.outputCtx.fillRect(pixel.x,pixel.y,pixel.size,pixel.size);
            }
            
            if(this.ascii){
                this.outputCtx.fillStyle = pixel.textColor;
                this.outputCtx.font = `${pixel.size*1.2}px Arial`;
                this.outputCtx.fillText(pixel.ascii,pixel.x,pixel.y + pixel.size);
            }
            if(this.stroke){
                this.outputCtx.strokeStyle = pixel.color;
                this.outputCtx.lineWidth = pixel.size/10;
                this.outputCtx.strokeRect(pixel.x,pixel.y,pixel.size,pixel.size);
            }
            
        });
    }
// Extracts the pixel data (color) from the input canvas and updates the pixel data (color) in this.pixels
    updatePixels(){


        if(this.inputCanvasIsWEBGL){
            
            this.pixels.forEach((pixel) => {
                const data = new Uint8Array(4);
                this.inputCtx.readPixels(pixel.x, pixel.y, 1, 1, this.inputCtx.RGBA, this.inputCtx.UNSIGNED_BYTE, data);
                if(this.ascii&& !this.fill){
                    pixel.textColor = pixel.color= `rgb(${Math.round(data[0]/255)*255}, ${Math.round(data[1]/255)*255}, ${Math.round(data[2]/255)*255})`;
                    
                }
                else if(this.ascii && this.fill){
                    pixel.textColor = 'white';
                    pixel.color = `rgb(${Math.round(data[0]/255)*255}, ${Math.round(data[1]/255)*255}, ${Math.round(data[2]/255)*255})`;
                    
                }
                
                else{
                    pixel.color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
                }
                pixel.ascii = this.aciiChars[Math.floor(((data[0]+data[1]+data[2])/(3*255)) * this.aciiChars.length)];
            });
            if(this.autoDraw){
                this.drawPixels();
            }
            
        }
        else{
            this.pixels.forEach((pixel) => {

                const data = this.inputCtx.getImageData(pixel.x, pixel.y, 1, 1).data;
                
                if(this.ascii&& !this.fill){
                    pixel.textColor = `rgb(${Math.round(data[0]/255)*255}, ${Math.round(data[1]/255)*255}, ${Math.round(data[2]/255)*255})`;
                    
                }
                else if(this.ascii && this.fill){
                    pixel.textColor = 'white';
                    pixel.color = `rgb(${Math.round(data[0]/255)*255}, ${Math.round(data[1]/255)*255}, ${Math.round(data[2]/255)*255})`;
                    
                }
                
                else{
                    pixel.color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
                }
                pixel.ascii = this.aciiChars[Math.floor(((data[0]+data[1]+data[2])/(3*255)) * this.aciiChars.length)];
                
            });
            if(this.autoDraw){
                this.drawPixels();
            }

        }

        

        
    }
// Changes the number of subdivisions in this.pixels
    changeSubdivisions({subdivisions=50,floor=0,fixed=true}){
        if(fixed){
            this.subdivisions = subdivisions+floor;
        }
        else{
            this.subdivisions = Math.floor(Math.random()*subdivisions)+floor;
            this.buildPixels();
        }
    }
    
}
