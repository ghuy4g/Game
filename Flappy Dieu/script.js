const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Các biến toàn cục
const bird = {
  x: 100,
  y: canvas.height / 2,
  width: 30,
  height: 30,
  velocityY: 0,
  gravity: 0.4,
  jump: -7,
};

const PIPE_WIDTH = 50;
const PIPE_SPACING = 300; // Thay đổi giá trị này để điều chỉnh khoảng cách giữa hai ống nước
const PIPE_VELOCITY = 2;

let pipes = [];
let score = 0;
let gameIsOver = false;
let isRestarting = false;

// Hình ảnh chim
const birdImage = new Image();
birdImage.src = "bird.png";

// Hàm reset game
function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocityY = 0;
  pipes = [];
  score = 0;
  gameIsOver = false;
  isRestarting = false;
}

// Cập nhật trạng thái của nhân vật và các ống nước
function update() {
  if (gameIsOver) {
    if (isRestarting) {
      resetGame();
    }
    return; // Ngừng cập nhật khi game over và không phải lúc chơi lại
  }

  bird.velocityY += bird.gravity;
  bird.y += bird.velocityY;

  // Tạo ống nước mới
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - canvas.width / 2) {
    const pipeY = Math.random() * (canvas.height - PIPE_SPACING);
    pipes.push({ x: canvas.width, y: pipeY });
  }

  // Di chuyển các ống nước
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= PIPE_VELOCITY;

    // Xóa ống nước khi nó ra khỏi màn hình
    if (pipes[i].x < -PIPE_WIDTH) {
      pipes.splice(i, 1);
    }

    // Kiểm tra va chạm
    if (
      bird.x + bird.width > pipes[i].x &&
      bird.x < pipes[i].x + PIPE_WIDTH &&
      (bird.y < pipes[i].y || bird.y + bird.height > pipes[i].y + PIPE_SPACING)
    ) {
      gameIsOver = true;
      isRestarting = true;
    }

    // Cộng điểm nếu chim vượt qua ống nước
    if (bird.x === pipes[i].x + PIPE_WIDTH) {
      score++;
    }
  }

  // Kiểm tra va chạm với đáy màn hình
  if (bird.y + bird.height > canvas.height) {
    gameIsOver = true;
    isRestarting = true;
  }
}

// Hiển thị các đối tượng lên cửa sổ
function draw() {
  // Xóa toàn bộ cửa sổ
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Vẽ ống nước
  ctx.fillStyle = "#007ea7";
  for (const pipe of pipes) {
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.y);
    ctx.fillRect(pipe.x, pipe.y + PIPE_SPACING, PIPE_WIDTH, canvas.height - pipe.y - PIPE_SPACING);
  }

  // Vẽ chim
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

  // Hiển thị điểm số
  ctx.fillStyle = "#000";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 10, 40);

  // Hiển thị thông báo khi game over
  if (gameIsOver) {
    ctx.fillStyle = "#000";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    ctx.fillText("Press Space to Play Again", canvas.width / 2 - 200, canvas.height / 2 + 50);
  }
}

// Xử lý sự kiện nhấn phím
document.addEventListener("keydown", function (event) {
  if (event.keyCode === 32) {
    if (isRestarting) {
      resetGame();
    } else if (!gameIsOver) {
      bird.velocityY = bird.jump;
    }
  }
});

// Vòng lặp trò chơi
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Bắt đầu vòng lặp trò chơi
gameLoop();
