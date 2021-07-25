// Canvas element where all pixel manipulations are going on
let c = document.createElement("canvas");
// A source image
let img1 = new Image();
// Background color that will be contain a color from the image
let backgroundColor = "";
img1.crossOrigin = "*";
// Default size of pixels
let pixelSize = 30;
let imageContainerElement = document.getElementById("right-column");

function myFillRect(data, imageWidth, x, y, r, g, b, a) {
  let p = (x + (y * imageWidth)) * 4;
  data[p] = r;
  data[p + 1] = g;
  data[p + 2] = b;
  data[p + 3] = a;
  // Save the background color from image colors;
  backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
};

function drawPixels(size) {
  // Set width and height of the canvas to be the same as the original image size
  let origW = img1.width;
  let origH = img1.height;
  c.width = origW;
  c.height = origH;

  let ctx = c.getContext("2d");
  // Create a canvas using img1 as a source of truth for future manipulations
  ctx.drawImage(img1, 0, 0);

  // Get pixel data of an area
  let origData = ctx.getImageData(0, 0, origW, origH).data;
  pixelSize = parseInt(size);
  // Calculate the future image size, according to selected pixelSize
  let targedWidth = Math.floor(origW / pixelSize);
  let targedHeight = Math.floor(origH / pixelSize);
  // Create a new image size data
  let img2Data = ctx.createImageData(targedWidth, targedHeight);
  let targetData = img2Data.data

  for (let y = 0; y < targedHeight; y += 1) {
    for (let x = 0; x < targedWidth; x += 1) {
      let origX = x * pixelSize;
      let origY = y * pixelSize;
      let origP = (origX + (origY * origW)) * 4;

      myFillRect(targetData, targedWidth, x, y, origData[origP], origData[origP + 1], origData[origP + 2], origData[origP + 3]);
    }
  }

  // Instead of modifying the original canvas, create a helper canvas element of a size of future image according to selected pixels size
  let c2 = document.createElement("canvas");
  c2.width = targedWidth;
  c2.height = targedHeight;
  let ctx2 = c2.getContext("2d");

  // Reset image smoothing algorithms for scaling the image: 
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
  ctx2.imageSmoothingEnabled = false;
  ctx2.mozImageSmoothingEnabled = false;
  ctx2.webkitImageSmoothingEnabled = false;
  ctx2.msImageSmoothingEnabled = false;

  // Add new image data to the second canvas element
  ctx2.putImageData(img2Data, 0, 0);
  // Create a final image element that will appear on the page
  let img2 = document.createElement("img");

  // Get the representation of the image from the second canvas element and use it as a source of the final image
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
  img2.src = c2.toDataURL("image/jpeg");
  // The image-rendering CSS property sets an image scaling algorithm.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering
  img2.style.imageRendering = "pixelated";

  imageContainerElement.appendChild(img2);
  document.body.style.backgroundColor = backgroundColor;
};

const input = document.getElementById("pixelSize");
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && input.value !== "") {
    clearImageElement();
    pixelSize = input.value;
    drawPixels(pixelSize);
  };
});

// Before rendering a new image, remove a previous one if exists
function clearImageElement() {
  let imageToRemoveArr = document.getElementsByTagName("img");
  for (let i = 0; i < imageToRemoveArr.length; i += 1) {
    imageToRemoveArr[i].remove();
  };
};

// Get radio buttons with available art options and add event listeners
const artOptions = document.querySelectorAll('.art input');
for (let i = 0; i < artOptions.length; i += 1) {
  let artOption = artOptions[i];
  artOption.addEventListener("click", (e) => changeImageSource(e.target.value));
};

// Handle changing an art
function changeImageSource(srcName) {
  clearImageElement();
  img1.src = `https://raw.githubusercontent.com/LiaTsernant/pixel-art/master/assets/${srcName}.jpeg`;
  img1.onload = function () {
    drawPixels(pixelSize);
  };
};

// First default render
function initialRender() {
  changeImageSource("monalisa");
  img1.onload = function () {
    drawPixels(pixelSize);
  };
};

initialRender();