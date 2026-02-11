const MAX_STEPS = 50
const MAX_DIST = 100
const SURF_DIST = 0.01



class Camera{
    constructor(x, y, z, resolution,fov){
        this.pos = createVector(x,y,z)
        //this.planeDist = 2
        this.resolution = resolution
        this.fov = fov
        //this.plane = [] 
        this.rays = []
    }
    setRays(){
        var delta = width/(width/this.resolution)
        //print(delta)
        var size = width/2
        //var rowPlane = []
        var rowRay = []
        var v 
        var z = this.pos.z + this.fov

        for (let y = -size; y <= size; y+=delta) {
            //rowPlane = []
            rowRay = []
            for (let x = -size; x <= size; x+=delta) {
                let xMap = map(x,-size,size,-1,1)
                let yMap = map(y,-size,size,-1,1)
                v = createVector(x,y)
                //rowPlane.push(v)
                v = createVector(xMap,yMap,z)
                let vR = p5.Vector.sub(v,this.pos)
                vR.normalize()
                
                rowRay.push(vR)


                
            }
            //this.plane.push(rowPlane)
            this.rays.push(rowRay)
        }
        
    }
    sphere(p){
        var sphere = createVector(0,-1,5)
        var r = 1
        var sphereDist = p5.Vector.dist(p,sphere) -r


    }
    GetDist(p){
        var sphere = createVector(0,0,5)
        var r = .5
        var sphereDist = p5.Vector.dist(p,sphere) -r
        var planeDist = -p.y + 1
        //var square = this.sdBox(p)

        return min(sphereDist,planeDist)
    
    }
    sdBox(p)
    {
        var b = createVector(0,0,6)
        var x = p.mag()
        var q =  b.sub([x,x,x]);
        return max(q.mag(),0.0) + min(max(q.x,max(q.y,q.z)),0.0);
}
 GetNormal(p) {
	var d = this.GetDist(p);
    var e = .01
    
    
    var n = createVector(
        d - this.GetDist(p5.Vector.sub(p,createVector(e,0,0))),
        d - this.GetDist(p5.Vector.sub(p,createVector(0,e,0))),
        d - this.GetDist(p5.Vector.sub(p,createVector(0,0,e))));
    return n.normalize();
}
GetLight(p) {

    var lightPos = createVector(1, -10, -1);
    
    var lightDir = p5.Vector.sub(lightPos,p).normalize();
    var n = this.GetNormal(p);
    
    var dif = p5.Vector.dot(lightDir,n);
    dif = constrain(dif, 0, 1)
    /*
    var x = p5.Vector.mult(n,SURF_DIST*2)
    var d = this.RayMarch(x.add(p), lightDir)[0];
    if(d<p5.Vector.sub(lightPos,p).mag()) {
        dif *= .05
    }*/
    
    return dif;
}
    
    RayMarch(ro,rd) {
       var p
       var distSce = 0
       var dO = 0
       var rayDirec
        
       for (let i = 0; i < MAX_STEPS; i++) {
        rayDirec = p5.Vector.mult(rd,dO)
        
        p = p5.Vector.add(ro,rayDirec)

        distSce = this.GetDist(p)
        dO += distSce
        if(dO>MAX_DIST || distSce<SURF_DIST) {
            
            break};
           
       }
  
        return p
    }

    drawSqares(){
        loadPixels()
        var brigth 
        
        for (let y = 0; y < this.rays.length; y++) {
            for (let x = 0; x < this.rays[y].length; x++) {

                
                brigth = this.RayMarch(this.pos,this.rays[y][x])

                brigth = this.GetLight(brigth)
                
                if(brigth != 0){
                    brigth = floor(map(brigth,0,1,0,255))
                }

                setPixCol(brigth,brigth,brigth,x,y)

            }
            
        }
        
        updatePixels()
    }

}


function setPixCol(r,g,b,x,y){
    let pix = (x + y * width) * 4

    pixels[pix + 0] = r;
    pixels[pix + 1] = g;
    pixels[pix + 2] = b;
    pixels[pix + 3] = 255;
}
function mod(p,n){
    var pC = p.copy()
    pC.x = p.x%n
    pC.y = p.y%n
    pC.z = p.z%n
    return pC
}
var cam

function setup(){
    c = createCanvas(500,500);
    cam = new Camera(0,0,0,1,3)

    cam.setRays()
    const startTime = performance.now();
    cam.drawSqares()
    const endTime = performance.now();
    print("Tiempo de ejecución: ", endTime - startTime, "milisegundos")

    


    
}

function draw(){
    //background(0)
}