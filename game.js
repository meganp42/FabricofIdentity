let dollImg;
let items = [];
let bigRectDimensions = { x: 0, y: 0, w: 0, h: 0 };

// Outfit data structure
let outfits = {
  outfit1: {
    hair: { img: null, file: "hair_v1.png", w: 120, h: 150 },
    outfit: { img: null, file: "outfit_v1.png", w: 165, h: 400 },
    shoes: { img: null, file: "shoes_v1.png", w: 105, h: 70 }
  },
  //outfit2: {
    //hair: { img: null, file: "hair_v2.png", w: 110, h: 110 },
    //outfit: { img: null, file: "outfit_v2.png", w: 125, h: 190 },
    //shoes: { img: null, file: "shoes_v2.png", w: 85, h: 65 }
  //}
};

let currentOutfit = "outfit1";

function preload() {
  dollImg = loadImage('img/startingdoll.PNG');

  // Preload all outfit images
  for (let key in outfits) {
    let outfit = outfits[key];
    for (let part in outfit) {
      let filePath = `img/${key}/${outfit[part].file}`;
      outfit[part].img = loadImage(filePath);
    }
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

  // Resize and create draggable items for the current outfit
  let selected = outfits[currentOutfit];
  for (let part in selected) {
    let item = selected[part];
    item.img.resize(item.w, item.h);
    items.push(new DraggableItem(item.img, random(width), random(height), item.w, item.h));
  }
}

function draw() {
  background('#FFF6E5'); // Match CSS background

  // Draw doll image at center
  image(dollImg, width / 2, height / 2, 400, 600); // scale as needed

  // Update and display all draggable items
  for (let item of items) {
    item.update();
    item.display();
  }

  // Check if all items are within the doll area
  let allOnDoll = true;
  for (let item of items) {
    if (!item.overlapsWithDoll(width / 2, height / 2, 400, 600)) {
      allOnDoll = false;
      break;
    }
  }

  // Display message if all items are on the doll
  if (allOnDoll) {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(28);
    text("She's ready to go out!", width / 2, 650);
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

// Updated class to support per-item sizing
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
