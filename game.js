let dollImg;
let items = [];
let bgImg;

let outfits = {
  outfit1: {
    hair: { img: null, file: "hair_v1.png", w: 120, h: 150 },
    outfit: { img: null, file: "outfit_v1.png", w: 165, h: 400 },
    shoes: { img: null, file: "shoes_v1.png", w: 105, h: 70 }
  }

  // finishedoutfits {
  //   finoutfit2: { img: null, file:"finoutfit2.PNG", w:400, h: 600 },
  //   finoutfit3: { img: null, file:"finoutfit3.PNG", w:400, h: 600 },
  //   finoutfit4: { img: null, file:"finoutfit4.PNG", w:400, h: 600 },
  //   finoutfit5: { img: null, file:"finoutfit5.PNG", w:400, h: 600 },
  //   finoutfit6: { img: null, file:"finoutfit6.PNG", w:400, h: 600 },
  //   finoutfit7: { img: null, file:"finoutfit7.PNG", w:400, h: 600 },
  //   finoutfit8: { img: null, file:"finoutfit8.PNG", w:400, h: 600 }
  // }
};

let currentOutfit = "outfit1";

function preload() {
  dollImg = loadImage('img/startingdoll.PNG');
  bgImg = loadImage('img/background.JPG');

  for (let key in outfits) {
    let outfit = outfits[key];
    for (let part in outfit) {
      let filePath = `img/${key}/${outfit[part].file}`;
      outfit[part].img = loadImage(filePath);
    }
  }
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0); // Optional: move canvas down so it doesn't cover the heading
  imageMode(CENTER);
  rectMode(CENTER);

  // Add the heading
  let header = createElement('h1', 'Welcome to my closet!');
  header.style('font-family', 'AphroditeStylistic');
  header.style('color', '#ffffff');
  header.style('text-align', 'center');
  header.style('width', '100%');
  header.position(0, 10); // x = 0, y = 10px from top


  // Create draggable outfit items
  let selected = outfits[currentOutfit];
  for (let part in selected) {
    let item = selected[part];
    item.img.resize(item.w, item.h);
    items.push(new DraggableItem(item.img, random(width), random(height), item.w, item.h));
  }
}


function draw() {
  // Draw background scaled to full canvas
  image(bgImg, width / 2, height / 2, width, height);

  // Draw the doll in the center
  image(dollImg, width / 2, height / 2 + 40, 400, 600);

  // Update and display all draggable items
  for (let item of items) {
    item.update();
    item.display();
  }

  // Check if all items are placed on the doll
  let allOnDoll = items.every(item =>
    item.overlapsWithDoll(width / 2, height / 2, 400, 600)
  );

  if (allOnDoll) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(28);
    text.style('font-family', 'benguiat');
    text("She's ready to go out!", width / 2, height - 20);
  }
}

function mousePressed() {
  for (let item of items) {
    item.pressed();
  }
}

function mouseReleased() {
  for (let item of items) {
    item.released();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// DraggableItem class
class DraggableItem {
  constructor(img, x, y, w, h) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.w = w;
    this.h = h;
  }

  display() {
    image(this.img, this.x, this.y, this.w, this.h);
  }

  pressed() {
    if (
      mouseX > this.x - this.w / 2 &&
      mouseX < this.x + this.w / 2 &&
      mouseY > this.y - this.h / 2 &&
      mouseY < this.y + this.h / 2
    ) {
      this.dragging = true;
      this.offsetX = mouseX - this.x;
      this.offsetY = mouseY - this.y;
    }
  }

  released() {
    this.dragging = false;
  }

  update() {
    if (this.dragging) {
      this.x = mouseX - this.offsetX;
      this.y = mouseY - this.offsetY;
    }
  }

  overlapsWithDoll(dollX, dollY, dollW, dollH) {
    return (
      this.x + this.w / 2 > dollX - dollW / 2 &&
      this.x - this.w / 2 < dollX + dollW / 2 &&
      this.y + this.h / 2 > dollY - dollH / 2 &&
      this.y - this.h / 2 < dollY + dollH / 2
    );
  }
}
