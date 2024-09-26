const UNICODE_CHARS = "·┼╬░▒▓█"; // Characters used for Unicode art, ordered by brightness

// Function to convert an image or canvas to ASCII
function imageToASCII(element: HTMLImageElement | HTMLCanvasElement, resolution: number): string {
    console.log('Converting to ASCII:', element);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = resolution;
    canvas.height = resolution * (element.height / element.width);
    ctx.drawImage(element, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let ascii = '';

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const offset = (y * canvas.width + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const brightness = (r + g + b) / 3;
            const charIndex = Math.floor((brightness / 255) * (UNICODE_CHARS.length - 1));
            ascii += UNICODE_CHARS[charIndex];
        }
        ascii += '\n';
    }

    console.log('ASCII conversion complete:', ascii);
    return ascii;
}

// Function to convert a video to ASCII
function videoToASCII(video: HTMLVideoElement, resolution: number, callback: (asciiFrames: string[]) => void) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = resolution;
    canvas.height = resolution * (video.videoHeight / video.videoWidth);

    const asciiFrames: string[] = [];
    const captureFrame = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const ascii = imageToASCII(canvas, resolution);
        asciiFrames.push(ascii);
        console.log('Captured frame:', ascii);
    };

    video.addEventListener('play', () => {
        const interval = setInterval(() => {
            if (video.paused || video.ended) {
                clearInterval(interval);
                callback(asciiFrames);
                console.log('Video ended, total frames captured:', asciiFrames.length);
            } else {
                captureFrame();
            }
        }, 1000 / 30); // Capture at 30 FPS
    });
}

// Function to display ASCII frames in sequence
function displayASCIIFrames(asciiFrames: string[], container: HTMLElement) {
    let frameIndex = 0;
    setInterval(() => {
        container.innerText = asciiFrames[frameIndex];
        console.log('Displaying frame:', frameIndex);
        frameIndex = (frameIndex + 1) % asciiFrames.length;
    }, 1000 / 30); // Display at 30 FPS
}

// Function to load and display a file
function loadFile(filePath: string) {
    const fileType = filePath.split('.').pop();
    const asciiOutput = document.getElementById('asciiOutput');

    console.log(`Loading file: ${filePath}`);

    if (fileType === 'jpg' || fileType === 'png') {
        const image = new Image();
        image.src = filePath;
        image.onload = () => {
            console.log('Image loaded:', image);
            const ascii = imageToASCII(image, 100);
            asciiOutput.innerText = ascii;
        };
        image.onerror = (error) => {
            console.error('Error loading image:', error);
        };
    } else if (fileType === 'gif' || fileType === 'mp4') {
        const video = document.createElement('video');
        video.src = filePath;
        video.onloadeddata = () => {
            console.log('Video loaded:', video);
            videoToASCII(video, 100, (asciiFrames) => {
                displayASCIIFrames(asciiFrames, asciiOutput);
            });
            video.play();
        };
        video.onerror = (error) => {
            console.error('Error loading video:', error);
        };
    }
}

// Function to populate the file list
function populateFileList() {
    const fileList = document.getElementById('fileList');
    const files = ['bobross.jpg', 'he-man.gif', 'spider-man.gif']; // Update with your custom file names

    fileList.innerHTML = ''; // Clear existing list items

    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.innerText = file;
        listItem.addEventListener('click', () => loadFile(`examples/${file}`));
        fileList.appendChild(listItem);
    });

    console.log('File list populated:', files);
}

// Initialize the file list
populateFileList();