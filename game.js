let dollImg;
let bgImg;
let items = [];
let currentRound = 0;

let itemSizes = {
  "img/outfit1/hair_v1.png": [120, 140],
  "img/outfit1/outfit_v1.png": [160, 400],
  "img/outfit1/shoes_v1.png": [100, 60],
  "img/outfit2/hair_v2.png": [110, 130],
  "img/outfit2/shirt_v2.png": [170, 180],
  "img/outfit2/skirt_v2.png": [170, 350],
  "img/outfit2/shoes_v2.png": [85, 65],
  "img/outfit3/hair_v3.png": [100,120],
  "img/outfit3/outfit_v3.png": [160, 400],
  "img/outfit3/shoes_v3.png": [80, 60],
  "img/outfit4/hair_v4.png": [100, 120],
  "img/outfit1/shirt_v4.png": [160, 180],
  "img/outfit1/pants_v4.png": [170, 310],
  "img/outfit4/shoes_v4.png": [80, 60],
};


let outfitData = [
  {
    phrase: "chúc mừng năm mới! Happy Lunar New Year. Let's go celebrate with family.",
    outfitKey: "outfit1",
    correctParts: ["img/outfit1/hair_v1.png", "img/outfit1/outfit_v1.png", "img/outfit1/shoes_v1.png"],
    finImg: "img/FinishedDrawnOutfits/finoutfit1.png"
  },
  {
    phrase: "I'm going to watch PCN (Philippines Cultural Night)! What should I wear?",
    outfitKey: "outfit2",
    correctParts: ["img/outfit2/hair_v2.png", "img/outfit2/shirt_v2.png", "img/outfit2/skirt_v2.png", "img/outfit2/shoes_v2.png"],
    finImg: "img/FinishedDrawnOutfits/finoutfit2.png"
  },
  {
    phrase: "I love the painting 'The Birth of Venus'. Make me an outfit based on the painting.",
    outfitKey: "outfit3",
    correctParts: ["img/outfit3/hair_v3.png", "img/outfit3/outfit_v3.png", "img/outfit3/shoes_v3.png"],
    finImg: "img/FinishedDrawnOutfits/finoutfit3.png"
  },
  {
    phrase: "Going to my job interview! What is a presentable outfit?",
    outfitKey: "outfit4",
    correctParts: ["img/outfit4/hair_v4.png", "img/outfit4/shirt_v4.png", "img/outfit4/pants_v4.png", "img/outfit4/shoes_v4.png"],
    finImg: "img/FinishedDrawnOutfits/finoutfit4.png"
  }
];

let allImages = {};
let finOutfits = {};
let promptP;
let header;
let nextButton;
let correct = false;

function preload() {
  dollImg = loadImage('img/startingdoll.PNG');
  bgImg = loadImage('img/background.JPG');

  // Load all images for all outfits
  for (let i = 1; i <= 4; i++) {
    let folder = `outfit${i}`;
    allImages[folder] = {};

    let files = {
      1: ["hair_v1.png", "outfit_v1.png", "shoes_v1.png"],
      2: ["hair_v2.png", "shirt_v2.png", "skirt_v2.png", "shoes_v2.png"],
      3: ["hair_v3.png", "outfit_v3.png", "shoes_v3.png"],
      4: ["hair_v4.png", "shirt_v4.png", "pants_v4.png", "shoes_v4.png"]
    };

    for (let file of files[i]) {
      allImages[folder][file] = loadImage(`img/${folder}/${file}`);
    }

    finOutfits[`finoutfit${i}`] = loadImage(`img/FinishedDrawnOutfits/finoutfit${i}.png`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  rectMode(CENTER);

  header = createElement('h1', 'Welcome to my closet!');
  header.style('font-family', 'AphroditeStylistic');
  header.style('color', '#ffffff');
  header.style('text-align', 'center');
  header.style('width', '100%');
  header.position(0, 10);

  promptP = createP('');
  promptP.style('color', 'white');
  promptP.style('font-size', '20px');
  promptP.style('text-align', 'center');
  promptP.position(0, 160);
  promptP.style('width', '100%');

  nextButton = createButton('Give up / Next');
  nextButton.position(width / 2 - 50, 220);
  nextButton.mousePressed(nextRound);

  startRound(currentRound);
}

function startRound(roundIndex) {
  correct = false;
  items = [];

  if (roundIndex >= outfitData.length) {
    promptP.html("Thanks for playing! You've finished all the rounds.");
    return;
  }

  let outfit = outfitData[roundIndex];
  promptP.html(outfit.phrase);

  // Add correct outfit parts
  for (let filePath of outfit.correctParts) {
    let fileName = filePath.split('/').pop();
    let img = allImages[outfit.outfitKey][fileName];

    // Get custom size or fallback to image size
    let [w, h] = itemSizes[filePath] || [img.width, img.height];

    items.push(new DraggableItem(img, random(width), random(height), w, h, filePath));
  }

  // Add 1 random decoy from another outfit
  let otherOutfits = outfitData.filter((_, i) => i !== roundIndex);
  let randomOutfit = random(otherOutfits);
  let decoyFilePath = random(randomOutfit.correctParts);
  let decoyFileName = decoyFilePath.split('/').pop();
  let decoyImg = allImages[randomOutfit.outfitKey][decoyFileName];

  let [dw, dh] = itemSizes[decoyFilePath] || [decoyImg.width, decoyImg.height];

  if (!itemSizes[decoyFilePath]) {
    console.log("Missing itemSizes entry for:", decoyFilePath);
  }


  items.push(new DraggableItem(decoyImg, random(width), random(height), dw, dh, decoyFilePath));
}


function draw() {
  background(0);
  image(bgImg, width / 2, height / 2, width, height);
  image(dollImg, width / 2, height / 2 + 130, 400, 600);

  for (let item of items) {
    item.update();
    item.display();
  }

  if (!correct && checkCorrectOutfit()) {
    correct = true;
    setTimeout(() => {
      clearItems();
      image(finOutfits[`finoutfit${currentRound + 1}`], width / 2, height / 2 + 40, 400, 600);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(28);
      text("She's ready to go out!", width / 2, height - 100);
      setTimeout(() => {
        nextRound();
      }, 2000);
    }, 500);
  }
}

function checkCorrectOutfit() {
  let correctFiles = outfitData[currentRound].correctParts;
  let placed = items.filter(item =>
    item.overlapsWithDoll(width / 2, height / 2 + 40, 400, 600)
  ).map(item => item.file);
  return correctFiles.every(f => placed.includes(f)) && placed.length === correctFiles.length;
}

function nextRound() {
  currentRound++;
  if (currentRound < outfitData.length) {
    startRound(currentRound);
  } else {
    promptP.html("You've completed all the outfits!");
    items = [];
  }
}

function clearItems() {
  items = [];
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

// Draggable item class
class DraggableItem {
  constructor(img, x, y, w, h, file) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.w = w;
    this.h = h;
    this.file = file;
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
