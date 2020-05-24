//color pallet from
// https://www.w3schools.com/colors/tryit.asp?filename=trycolors_palettes2

let d = 25
let total = 100
let xs = []
let ys = []
let dxs = []
let dys = []
mouse = false
let newForm = false
let stop = false;

// Setup appears at page load
function setup() {
  createCanvas(innerWidth, innerHeight)
  background(0)
  for(let i = 0; i < total; i++){
      xs.push(random(0, innerWidth))
      ys.push(random(0, innerHeight))
      dxs.push(random(-5,5))
      dys.push(random(-5,5))
  }
}
function keyPressed() {
  if(key === "r"){ //reset
      newForm = true
      mouse = false
      d = 25
      total = 100
  }
  if(key === "n"){ // new
     newForm = true;
     d = random(0,200)
     total = random(10, 100)
     if (!stop)  mouse = false;
  }
  if(key === "s") stop = !stop //stop & start
}

function drawCurves(x,y){
  noFill()
  for(let j = 0; j < total; j++){
    let distance = dist(x,y, xs[j], ys[j])
    if (distance < d && distance !== 0){
        let dx = distance / 2
        let dy = distance / 4
        stroke('#deeaee')
        beginShape()
        vertex(xs[j], ys[j])
        if (mouse) {
            bezierVertex(clickX,  clickY, clickX, clickY,x, y)
        } else {
            bezierVertex(xs[j] + dx, ys[j] + dy, x + dx, y - dy, x, y)
        }
        endShape()
    } else if (distance > d && distance <  2 * d){
        stroke('#eea29a')
        if (mouse) triangle(x,y, xs[j], ys[j], clickX, clickY)
        else triangle(x,y, xs[j], ys[j], x + d/4, y - d/4 )
    }
  }
}

function mousePressed(){
  clickX = mouseX
  clickY = mouseY
  mouse = true
}

function draw(){
  if (newForm){
      background(177,203,187,255)
      newForm = false
  }
  else if (stop) return
  else background(177,203,187,10)
  for(i = 0; i < total; i++){
    xs[i] += dxs[i]
    ys[i] += dys[i]
    if (ys[i] > height || ys[i] < 0) dys[i] = -dys[i]
    if (xs[i] > width || xs[i] < 0) dxs[i] = -dxs[i]
    drawCurves(xs[i], ys[i])
  }
}
