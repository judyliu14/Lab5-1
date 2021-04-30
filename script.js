// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const selectedFile = document.getElementById("image-input");
const form = document.getElementById("generate-meme");
const canvas = document.getElementById("user-image");
const ctx = canvas.getContext("2d");
const clear = document.getElementById("button-group").childNodes[1];
const read = document.getElementById("button-group").childNodes[3];
ctx.font = "30px Arial";

selectedFile.addEventListener("change", handleFiles, false);
function handleFiles() {
  img.alt = selectedFile.files[0].name;
  img.src = URL.createObjectURL(selectedFile.files[0]);
}

form.addEventListener("submit", (event) => {
  let textTop = document.getElementById("text-top").value;
  let textBottom = document.getElementById("text-bottom").value;
  ctx.fillText(textTop, canvas.width / 2, 50);
  ctx.fillText(textBottom, canvas.width / 2, canvas.height - 20);
  // disable the generate button
  form.childNodes[10].disabled = true;
  // enable the clear, read text, and voice selection select
  read.disabled = false;
  clear.disabled = false;
  document.getElementById("voice-selection").disabled = false;
  event.preventDefault(); // no refresh upon form submit
});

// on click
clear.onclick = () => {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// read click
read.onclick = () => {
  let textTop = document.getElementById("text-top").value;
  let textBottom = document.getElementById("text-bottom").value;
  // read
  let topUtter = new SpeechSynthesisUtterance(textTop);
  let bottomUtter = new SpeechSynthesisUtterance(textBottom);
  speechSynthesis.speak(topUtter);
  speechSynthesis.speak(bottomUtter);
};

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener("load", () => {
  // TODO

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let dimensions = getDimmensions(
    canvas.width,
    canvas.height,
    img.width,
    img.height
  );

  ctx.drawImage(
    img,
    dimensions.startX,
    dimensions.startY,
    dimensions.width,
    dimensions.height
  );
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { width: width, height: height, startX: startX, startY: startY };
}
