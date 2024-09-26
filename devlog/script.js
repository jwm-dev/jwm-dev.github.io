// script.ts
var PALETTE = "·┼╬░▒▓█"; // Characters used for Unicode art, ordered by brightness
// Function to convert an image or canvas to ASCII
function imageToASCII(element, resolution) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = resolution;
    canvas.height = resolution * (element.height / element.width);
    ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var ascii = '';
    for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {
            var offset = (y * canvas.width + x) * 4;
            var r = data[offset];
            var g = data[offset + 1];
            var b = data[offset + 2];
            var brightness = (r + g + b) / 3;
            var charIndex = Math.floor((brightness / 255) * (PALETTE.length - 1));
            ascii += PALETTE[charIndex];
        }
        ascii += '\n';
    }
    return ascii;
}
// Function to convert a video to ASCII
function videoToASCII(video, resolution, callback) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = resolution;
    canvas.height = resolution * (video.videoHeight / video.videoWidth);
    var asciiFrames = [];
    var captureFrame = function () {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var ascii = imageToASCII(canvas, resolution);
        asciiFrames.push(ascii);
    };
    video.addEventListener('play', function () {
        var interval = setInterval(function () {
            if (video.paused || video.ended) {
                clearInterval(interval);
                callback(asciiFrames);
            }
            else {
                captureFrame();
            }
        }, 1000 / 30); // Capture at 30 FPS
    });
}
// Function to display ASCII frames in sequence
function displayASCIIFrames(asciiFrames, container) {
    var frameIndex = 0;
    setInterval(function () {
        container.innerText = asciiFrames[frameIndex];
        frameIndex = (frameIndex + 1) % asciiFrames.length;
    }, 1000 / 30); // Display at 30 FPS
}
// Function to load and display a file
function loadFile(filePath) {
    var fileType = filePath.split('.').pop();
    var asciiOutput = document.getElementById('asciiOutput');
    if (fileType === 'jpg' || fileType === 'png') {
        var image_1 = new Image();
        image_1.src = filePath;
        image_1.onload = function () {
            var ascii = imageToASCII(image_1, 100);
            asciiOutput.innerText = ascii;
        };
    }
    else if (fileType === 'gif' || fileType === 'mp4') {
        var video_1 = document.createElement('video');
        video_1.src = filePath;
        video_1.onloadeddata = function () {
            videoToASCII(video_1, 100, function (asciiFrames) {
                displayASCIIFrames(asciiFrames, asciiOutput);
            });
            video_1.play();
        };
    }
}
// Function to populate the file list
function populateFileList() {
    var fileList = document.getElementById('fileList');
    var files = ['example1.jpg', 'example2.gif']; // Add your example files here
    files.forEach(function (file) {
        var listItem = document.createElement('li');
        listItem.innerText = file;
        listItem.addEventListener('click', function () { return loadFile("examples/".concat(file)); });
        fileList.appendChild(listItem);
    });
}
// Initialize the file list
populateFileList();
