let dollImg;
let itemImgs = [];
let items = [];
let bigRectDimensions = { x: 0, y: 0, w: 0, h: 0 };

function preload() {
  // Load doll base image
  dollImg = loadImage('img/startingdoll.PNG');
  
  // Load draggable items
  let filenames = ['hair_v1.png', 'outfit_v1.png', 'shoes_v1.png'];
  for (let name of filenames) {
    itemImgs.push(loadImage('img/outfit1/' + name));
  }
}

function setup() {
  createCanvas(700, 700);
  imageMode(CENTER);
  rectMode(CENTER);

  bigRectDimensions.x = width / 2;
  bigRectDimensions.y = height / 2;
  bigRectDimensions.w = width * 0.6;
  bigRectDimensions.h = height * 0.6;

  // Create draggable items from images
  for (let i = 0; i < itemImgs.length; i++) {
    items.push(new DraggableItem(itemImgs[i], random(width), random(height)));
  }
}

function draw() {
  background('#FFF6E5'); // Match CSS background

  // Draw doll image at center
  image(dollImg, width / 2, height / 2, 300, 600); // scale as needed

  // Draw all draggable items
  for (let item of items) {
    item.update();
    item.display();
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

// Class for draggable outfit parts
class DraggableItem {
  constructor(img, x, y) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.w = 100;
    this.h = 100;
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
}
