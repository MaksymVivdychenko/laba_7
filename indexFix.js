const playButton = document.getElementById('play');
const work = document.getElementById('work');
const closeButton = document.getElementById('close');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const reloadButton = document.getElementById('reload');
const square = document.getElementById('square');
const anim = document.getElementById('anim');

let animationInterval;
let circlePosition = { x: anim.clientWidth, y: 0};
let speed = 5;
let IDCounter = 0;

const getCurrentTimestamp = (timeZone = 'UTC') => {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const formattedDate = formatter.format(date);
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    return `${formattedDate}.${milliseconds}`;
};

window.onload = function() {
    clearServerFile();
    localStorage.clear();
    console.log('Server and Local storage were cleared');
};

function getRandomDirection() {
    const angle = Math.random() * (0.5 * Math.PI)
    return { x: speed * Math.cos(angle), y: speed * Math.sin(angle) };
}
let direction = getRandomDirection();

playButton.addEventListener('click', () => {
    work.style.display = 'block';
    circlePosition = { x: anim.clientWidth, y: 0};
    square.style.left = `calc(${circlePosition.x}px - 20px)`;
    square.style.top = `${circlePosition.y}px`;
});

closeButton.addEventListener('click', () => {
    IDCounter ++;
    saveToLocalStorage(IDCounter, getCurrentTimestamp('Europe/Kyiv'), "Close button clicked");
    sendToServer(IDCounter, "Close button clicked");
    clearInterval(animationInterval);
    square.style.left = `calc(${circlePosition.x}px - 20px)`;
    square.style.top = `${circlePosition.y}px`;
    circlePosition = { x: anim.clientWidth, y: 0 };
    work.style.display = 'none';
    reloadButton.style.display = 'none';
    startButton.style.display = 'inline-block';
    stopButton.style.display = 'none';
    square.style.display = 'block';
    direction = getRandomDirection();
    setTimeout(getEventFromLocalStorage(), 40);
    setTimeout(getEventFromServer(), 40);
});

startButton.addEventListener('click', () => {
    IDCounter ++;
    sendToServer(IDCounter, "Start button clicked");
    saveToLocalStorage(IDCounter, getCurrentTimestamp('Europe/Kyiv'), "Start button clicked");
    startButton.style.display = 'none';
    stopButton.style.display = 'inline-block';
    animationInterval = setInterval(() => {
        circlePosition.x -= direction.x;
        circlePosition.y += direction.y;

        // Collision
        if (circlePosition.x >= anim.clientWidth) {
            IDCounter ++;
            direction.x *= -1;
            sendToServer(IDCounter, "Square touched right border");
            saveToLocalStorage(IDCounter, getCurrentTimestamp('Europe/Kyiv'), "Square touched right border");
        }

        else if (circlePosition.y + square.clientHeight >= anim.clientHeight || circlePosition.y <= 0) {
            IDCounter ++;
            sendToServer(IDCounter, "Square touched top/bottom border");
            saveToLocalStorage(IDCounter, getCurrentTimestamp('Europe/Kyiv'), "Square touched top/bottom border");
            direction.y *= -1;
        }

        else if (parseFloat(square.style.opacity) <= 0.1) {
            IDCounter ++;
            sendToServer(IDCounter, "Square went outside");
            saveToLocalStorage(IDCounter, getCurrentTimestamp('Europe/Kyiv'), "Square went outside");
            clearInterval(animationInterval);
            stopButton.style.display = 'none';
            reloadButton.style.display = 'inline-block';
            square.style.display = 'none';
            square.style.opacity = 1;
        }
        else{
            IDCounter ++;
            sendToServer(IDCounter, "Square moved");
            saveToLocalStorage(IDCounter, getCurrentTimestamp('Europe/Kyiv'), "Square moved");
        }
        if (circlePosition.x <  0) {
            let currentOpacity = parseFloat(square.style.opacity) || 1;
            square.style.opacity = currentOpacity - 0.2;
        }
        square.style.left = `${circlePosition.x}px`;
        square.style.top = `${circlePosition.y}px`;
        
    }, 20);
});

stopButton.addEventListener('click', () => {
    IDCounter ++;
    sendToServer(IDCounter, "Stop button clicked");
    saveToLocalStorage(IDCounter, getCurrentTimestamp('Europe/Kyiv'), "Stop button clicked");
    stopButton.style.display = 'none';
    startButton.style.display = 'inline-block';
    clearInterval(animationInterval);
});

reloadButton.addEventListener('click', () => {
    IDCounter ++;
    sendToServer(IDCounter, "Reload button clicked");
    saveToLocalStorage(IDCounter, getCurrentTimestamp('Europe/Kyiv'), "Reload button clicked");
    reloadButton.style.display = 'none';
    startButton.style.display = 'inline-block';
    square.style.display = 'block';
    circlePosition = { x: anim.clientWidth, y: 0};
    direction = getRandomDirection();
    square.style.left = `calc(${circlePosition.x}px - 20px)`;
    square.style.top = `${circlePosition.y}px`;
});