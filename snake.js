let addButton = document.getElementById('addBtn');
let snakeParts = [
  { x: 7, y: 1 },
  { x: 6, y: 1 },
  { x: 5, y: 1 },
  { x: 4, y: 1 },
  { x: 3, y: 1 },
  { x: 2, y: 1 }
];
let speed = 700;
let speedCounter = 0;
let direction = 'right';
let appleExpired = false;
let appleAge = 1;
let apple = null;
let needRerender = false;

const directions = {
  up: { text: 'up', code: 38 },
  down: { text: 'down', code: 40 },
  left: { text: 'left', code: 37 },
  right: { text: 'right', code: 39 }
};

const opposites = {
  right: 'left',
  left: 'right',
  up: 'down',
  down: 'up'
};

const render = () => {
  let [head, ...tails] = snakeParts;
  // move tail to the head position
  tails.pop();
  tails.unshift(head);
  let newHead = { ...head };
  // move head
  if (direction === 'right') {
    newHead.x += 1;
  } else if (direction === 'left') {
    newHead.x -= 1;
  } else if (direction === 'down') {
    newHead.y += 1;
  } else if (direction === 'up') {
    newHead.y -= 1;
  }

  if (newHead.x > 49) {
    newHead.x = 0;
  }

  if (newHead.y > 49) {
    newHead.y = 0;
  }

  if (newHead.x < 0) {
    newHead.x = 49;
  }

  if (newHead.y < 0) {
    newHead.y = 49;
  }

  appleAge += 1;
  if (appleAge > 100) {
    appleExpired = true;
  }

  if (apple !== null && apple.x === newHead.x && apple.y === newHead.y) {
    apple = null;

    const len = tails.length;
    const last = { ...tails[len - 1] };

    tails.push(last);
  }

  snakeParts = [newHead, ...tails];

  if (!apple || appleExpired) {
    apple = {
      x: Math.floor(Math.random() * 49) + 1,
      y: Math.floor(Math.random() * 49) + 1
    };
    appleAge = 1;
    appleExpired = false;
  }

  tails.forEach(tail => {
    if (newHead.x === tail.x && newHead.y === tail.y) {
      snakeParts = [
        { x: 7, y: 1 },
        { x: 6, y: 1 },
        { x: 5, y: 1 },
        { x: 4, y: 1 },
        { x: 3, y: 1 },
        { x: 2, y: 1 }
      ];
      direction = 'right';

      speed = 700;
      clearInterval(renderInterval);
      renderInterval = setInterval(render, speed);
      apple = null;
    }
  });

  let renderHtml = ``;
  //add head
  renderHtml += `
    <div class="snake-body snake-head" style="left: ${newHead.x}0px; top: ${newHead.y}0px;"></div>
  `;
  // add tail
  tails.forEach(tail => {
    renderHtml += `
      <div class="snake-body snake-tail" style="left: ${tail.x}0px; top: ${tail.y}0px;"></div>
    `;
  });

  renderHtml += `
    <div class="apple" style="left: ${apple.x}0px; top: ${apple.y}0px;"></div>
  `;

  // score
  renderHtml += `
    <div class="score">${snakeParts.length - 1}</div>
  `;
  // speed
  renderHtml += `
    <div class="speed">${speed}</div>
  `;

  document.getElementById('main').innerHTML = renderHtml;

  needRerender = false;
};
let renderInterval = setInterval(render, speed);

const updateSpeed = () => {
  speedCounter += 1;

  if (speedCounter === 60) {
    if (speed > 301) {
      speed -= 100;
    } else if (speed < 301 && speed > 101) {
      speed -= 50;
    } else if (speed < 101 && speed > 11) {
      speed -= 10;
    } else if (speed < 11 && speed !== 1) {
      speed -= 1;
    } else {
    }

    speedCounter = 0;
    clearInterval(renderInterval);
    renderInterval = setInterval(render, speed);
  }
};
setInterval(updateSpeed, 1000);

document.onkeydown = event => {
  if (needRerender) {
    return;
  }
  needRerender = true;

  const oppositeDirection = opposites[direction];
  let newDirection = direction;

  const allDirectionKeys = ['down', 'up', 'left', 'right'];
  allDirectionKeys.forEach(directionKey => {
    if (event.keyCode === directions[directionKey].code) {
      newDirection = directions[directionKey].text;
    }
  });

  if (newDirection !== oppositeDirection) {
    direction = newDirection;
  }
};

addButton.onclick = () => {
  const len = snakeParts.length;
  const last = { ...snakeParts[len - 1] };

  snakeParts.push(last);
};
