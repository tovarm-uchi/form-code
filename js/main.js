let total = 200
let circles = []
let recs = []
let tris = []
let lines = []
let STARTING_LINES = []
let colors = []
const X = 0
const Y = 1
const W = X2 = 2
const H = Y2 = 3
const X3 = 4
const Y3 = 5
let dxs = []
let dys = []
let maxSpeed = 3
let PREV_SPEED
let newForm = false
let stop = false

function createSettingForm(){
  const settingBox = createDiv()
  settingBox
    .id("modal")
    .style('background-color: rgba(0,0,0,0.25)')
    .style('display: none')

  const closing_x = createDiv("×").id("close-modal").style('font-size: 20px')

  const settings = createElement('ul')
    .style('list-style: none')
    .style('margin-top: 8px')
    .style('padding: 0')
    .style('text-align: left')

  const r = createElement('li', "Press r to reset settings")
  const n = createElement('li', "Press n to create a new drawing with random values")
  const s = createElement('li', "Press s to stop or start movement")

  const looping = createElement('li')
  const loopingText = createSpan("Max Speed").style('maring-right: 10px')
  const loopingValue = createInput('EnterNumber').id("SpeedValue")
  looping.child(loopingText).child(loopingValue)

  selectAll('li').forEach((i) => {
    i.style('margin: 0').style('padding: 0').parent(settings)})

  settingBox.child(closing_x).child(settings)
}

function createMenu() {
  createSettingForm()
  const menu = createButton("Settings")
  select("#modal").parent(menu)
  menu.position(50,50)
  menu.mouseOver(() => select('#modal').style('display', 'flex'))
  select('#close-modal').mouseClicked(() => select('#modal').style('display', 'none'))
}

function createArrays(){
  circles = []
  recs = []
  tris = []
  lines = []
  let rc1 = color(random(255), random(255), random(255))
  let rc2 = color(random(255), random(255), random(255))
  let rc3 = color(random(255), random(255), random(255))

  colors = [rc1, rc2, rc3]
  PREV_SPEED = maxSpeed
  for(let i = 0; i < total; i++){
    dxs.push(random(-maxSpeed,maxSpeed))
    dys.push(random(-maxSpeed,maxSpeed))
    let x = random(0, innerWidth)
    let y = random(0, innerHeight)
    let w = random(0, innerWidth / 10)
    let h = random(0, innerHeight / 10)
    lines.push([x, y, x + w, y + h])

        // no longer used but more process which lead me to constants above
        // let randShape = Math.floor(random(0, 3))
        // if(randShape === 0) recs.push([x, y, w, h])
        // else if (randShape === 1){
        //   let x2 = x - w/2
        //   let x3 = x + w/2
        //   let y2 = y + h
        //   tris.push([x, y, x2, y2, x3, y2])
        // }
        // else if (randShape === 2){
        //   let x2 = x + w
        //   let y2 = y + h
        //   lines.push([x, y, x2, y2])
        // }
  }
}

// Setup appears at page load
function setup() {
  createCanvas(windowWidth, windowHeight)
  createMenu()
  background(0)
  createArrays()
}

function keyPressed() {
  if(key === "r"){ //reset
      newForm = true
      d = 25
      total = 100
  }
  if(key === "n"){ // new
     newForm = true;
     total = random(10, 300)
     createArrays()
  }
  if(key === "s") stop = !stop //stop & start
}

function adjustXY(shape, i, tri, lin){
  shape[X] += dxs[i]
  shape[Y] += dys[i]
  if (shape[Y] > height || shape[Y] < 0) dys[i] = -dys[i]
  if (shape[X] > width || shape[X]  < 0) dxs[i] = -dxs[i]

  if(tri){
    shape[X2] += dxs[i]
    shape[Y2] += dys[i]
    shape[X3] += dxs[i]
    shape[Y3] += dys[i]
  }
  else if (lin){
    shape[X2] += dxs[i]
    shape[Y2] += dys[i]
  }
}

// the overlap functions either return an empty list of a list of the next
// shape to be created

function overlapRec(s1, s2){
  let centerS1X = s1[X] + s1[W]/2
  let centerS1Y = s1[Y] + s1[H]/2
  let centerS2X = s2[X] + s2[W]/2
  let centerS2Y = s2[Y] + s2[H]/2

  let dX = Math.abs(centerS1X - centerS2X)
  let dY = Math.abs(centerS1Y - centerS2Y)

 if (dX < (s1[W] + s2[W])/2 && dY < (s1[H] + s2[H])/2){
   return [[centerS1X, centerS1Y, s1[W]/2 ], [centerS2X, centerS2Y, s2[W]/2]]

 }
 else return []
}

function overlapTri(s1, s2){
  let h1 = Math.abs(s1[Y] - s1[Y2])
  let w1 = Math.abs(s1[X2] - s1[X3])
  let h2 = Math.abs(s2[Y] - s2[Y2])
  let w2 = Math.abs(s2[X2] - s2[X3])
  let centerS1X = s1[X]
  let centerS1Y = s1[Y] + h1/2
  let centerS2X = s2[X]
  let centerS2Y = s2[Y] + h2/2

  let dX = centerS1X - centerS2X
  let dY = centerS1Y - centerS2Y

 if (Math.abs(dX) < (w1 + w2)/2 && Math.abs(dY) < (h1 + h2)/2){
   if(dX > 0){
     centerS1X += w1
     centerS2X -= w2
   } else {
     centerS1X -= w1
     centerS2X += w2
   }

   if(dY > 0){
     centerS1Y += h1
     centerS2Y -= h2
   } else {
     centerS1Y -= h1
     centerS2Y += h2
   }
   return [[centerS1X, centerS1Y, w1 * 2, h1 * 2],
           [centerS2X, centerS2Y, w2 * 2, h2 * 2]]
 }
 else return []
}

//now instead we are going to eliminate both if they touch
function overlapCirc(s1, s2){
  let distance = dist(s1[X], s1[Y], s2[X], s2[Y])
  return (distance < (s1[W] + s2[W]) )

}

// looked up on line
//https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
function intersects(a,b,c,d,p,q,r,s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
}

function overlapLines(l1, l2){
  if(intersects(l1[X], l1[Y], l1[X2], l1[Y2], l2[X], l2[Y], l2[X2], l2[Y2])) {
    let x = l1[X2]
    let y = l2[Y]
    let w = Math.abs(l1[X] - l2[X])
    let h = Math.abs(l1[Y2] - l2[Y2])
    let x2 = x - w/2
    let x3 = x + w/2
    let y2 = y + h
    return [x, y, x2, y2, x3, y2]
  } else {
    return []
  }
}
function redoSpeed(max){
  dxs = []
  dys = []
  for(let i = 0; i < total; i++){
    dxs.push(random(-max,max))
    dys.push(random(-max,max))
  }
  maxSpeed = max
}

function draw(){
  let inputSpeed = select('#SpeedValue').elt.value
  if(inputSpeed !== "EnterNumber" && inputSpeed !== maxSpeed) redoSpeed(inputSpeed)
  let skip = []
  let intersect = false
  if (newForm){
    background(177,203,187,255)
    newForm = false
  }
  else if (stop) return
  else background(177,203,187,255)

  let i = 0;
  skip = []
  for(j = 0; j < circles.length; j++){
    adjustXY(circles[j], i)
    c = color(random(100), random(100), random(100))
    strokeWeight(random(0,1))
    fill(c)
    stroke(c)
    ellipse(circles[j][X], circles[j][Y], circles[j][W])
    intersect = false
    if(recs.length <= 3){
      circles.forEach((other, idx) => {
        if(idx != j && skip.includes(idx) === false && overlapCirc(circles[j], other)){
          intersect = true;
          skip.push(idx)
        }
      })
      if(intersect) skip.push(j)
    }
    i++
  }
  skip.forEach((bad) => circles.splice(bad, 1))

  skip = []
  for(j = 0; j < recs.length; j++){
    if (skip.includes(j)) continue;
    let rec = recs[j]
    adjustXY(rec, i, false, false)
    stroke(colors[2])
    fill(colors[2])
    strokeWeight(1)
    rect(rec[X], rec[Y], rec[W], rec[H])
    intersect = false;
    if (tris.length <= 3){ // ONLY START REMOVING WHEN 1 0r NO TRIANGLES LEFT
      recs.forEach((other, idx) => {
        if(idx !== j && skip.includes(idx) === false){
          let points = overlapRec(rec, other)
          if(points.length > 1){
            intersect = true;
            circles.push(points[0])
            // circles.push(points[1])
            skip.push(idx)
          }
        }
      })
    }
    if(intersect) skip.push(j)
    i++
  }
  skip.forEach((bad) => recs.splice(bad, 1))


  skip = []
  for(j = 0; j < tris.length; j++){
    if (skip.includes(j)) continue;
    let tri = tris[j]
    adjustXY(tri, i, true, false)
    stroke(colors[1])
    noFill()
    strokeWeight(4)
    triangle(tri[X], tri[Y],tri[X2],tri[Y2],tri[X3],tri[Y3])
    intersect = false;
    if (lines.length <= 3){
      tris.forEach((other, idx) => {
        if(idx !== j && skip.includes(idx) === false){
          let points = overlapTri(tri, other)
          if(points.length > 1){
            intersect = true;
            recs.push(points[0])
            recs.push(points[1])
            skip.push(idx)
          }
        }
      })
    }
    if(intersect) skip.push(j)
    i++
  }
  skip.forEach((bad) => tris.splice(bad, 1))

  skip = []
  for(j = 0; j < lines.length; j++){
    if(skip.includes(j)) continue;
    let lin = lines[j]
    adjustXY(lin, i, false, true)
    stroke(colors[0])
    strokeWeight(1)
    line(lin[X], lin[Y], lin[X2], lin[Y2])
    intersect = false;
    lines.forEach((other, idx) => {
      if(idx !== j && skip.includes(idx) === false){
        let points = overlapLines(lin, other)
        if(points.length > 1){
          intersect = true;
          tris.push(points)
          skip.push(idx)
        }
      }
    })
    if(intersect) skip.push(j)
    i++
  }
  skip.forEach((bad) => lines.splice(bad, 1))
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight)
}
