var UNICODE_CHARS = "·┼╬░▒▓█"; // Characters used for Unicode art, ordered by brightness
// Function to convert an image or canvas to ASCII
function imageToASCII(element, resolution) {
    console.log('Converting to ASCII:', element);
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
            var charIndex = Math.floor((brightness / 255) * (UNICODE_CHARS.length - 1));
            ascii += UNICODE_CHARS[charIndex];
        }
        ascii += '\n';
    }
    console.log('ASCII conversion complete:', ascii);
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
        console.log('Captured frame:', ascii);
    };
    video.addEventListener('play', function () {
        var interval = setInterval(function () {
            if (video.paused || video.ended) {
                clearInterval(interval);
                callback(asciiFrames);
                console.log('Video ended, total frames captured:', asciiFrames.length);
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
        console.log('Displaying frame:', frameIndex);
        frameIndex = (frameIndex + 1) % asciiFrames.length;
    }, 1000 / 30); // Display at 30 FPS
}
// Function to load and display a file
function loadFile(filePath) {
    var fileType = filePath.split('.').pop();
    var asciiOutput = document.getElementById('asciiOutput');
    console.log("Loading file: ".concat(filePath));
    if (fileType === 'jpg' || fileType === 'png') {
        var image_1 = new Image();
        image_1.src = filePath;
        image_1.onload = function () {
            console.log('Image loaded:', image_1);
            var ascii = imageToASCII(image_1, 100);
            asciiOutput.innerText = ascii;
        };
        image_1.onerror = function (error) {
            console.error('Error loading image:', error);
        };
    }
    else if (fileType === 'gif' || fileType === 'mp4') {
        var video_1 = document.createElement('video');
        video_1.src = filePath;
        video_1.onloadeddata = function () {
            console.log('Video loaded:', video_1);
            videoToASCII(video_1, 100, function (asciiFrames) {
                displayASCIIFrames(asciiFrames, asciiOutput);
            });
            video_1.play();
        };
        video_1.onerror = function (error) {
            console.error('Error loading video:', error);
        };
    }
}
// Function to populate the file list
function populateFileList() {
    var fileList = document.getElementById('fileList');
    var files = ['bobross.jpg', 'he-man.gif', 'spider-man.gif']; // Update with your custom file names
    fileList.innerHTML = ''; // Clear existing list items
    files.forEach(function (file) {
        var listItem = document.createElement('li');
        listItem.innerText = file;
        listItem.addEventListener('click', function () { return loadFile("examples/".concat(file)); });
        fileList.appendChild(listItem);
    });
    console.log('File list populated:', files);
}
// Initialize the file list
populateFileList();
