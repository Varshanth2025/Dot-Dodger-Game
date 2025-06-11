const canvas = document.getElementById("gameCanvas");
      const ctx = canvas.getContext("2d");
      const sidebar = document.getElementById("sidebar");
      const restartBtn = document.getElementById("restartBtn");
      const settingsBtn = document.getElementById("settingsBtn");
      const playerSpeedBtn = document.getElementById("playerSpeedBtn");
      const enemySpeedBtn = document.getElementById("enemySpeedBtn");
      const speedInputBox = document.getElementById("speedInputBox");
      const speedInput = document.getElementById("speedInput");
      const backBtn = document.getElementById("backBtn");
      const setBtn = document.getElementById("setBtn");

      const player = {
        x: 180,
        y: 450,
        width: 40,
        height: 40,
        color: "blue",
        speed: 20,
      };

      const enemies = [];
      const enemySize = 40;
      let score = 0;
      let gameOver = false;
      let enemySpawnInterval = 500;
      let spawnTimer;
      let currentInputType = "";

      function checkCollision(a, b) {
        return (
          a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y
        );
      }

      function spawnEnemy() {
        let attempts = 0;
        const maxAttempts = 10;
        let x, newEnemy;

        do {
          x = Math.floor(Math.random() * (canvas.width - enemySize));
          newEnemy = { x, y: 0, width: enemySize, height: enemySize };
          attempts++;
        } while (
          attempts < maxAttempts &&
          enemies.some((enemy) => checkCollision(newEnemy, enemy))
        );

        if (attempts < maxAttempts) {
          enemies.push(newEnemy);
        }
      }

      function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
      }

      function drawEnemies() {
        ctx.fillStyle = "red";
        for (const enemy of enemies) {
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
      }

      function updateEnemies() {
        for (const enemy of enemies) {
          enemy.y += 3;
          if (checkCollision(player, enemy)) {
            gameOver = true;
          }
        }
        for (let i = enemies.length - 1; i >= 0; i--) {
          if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            score++;
          }
        }
      }

      function drawScore() {
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 30);
      }

      function drawGameOver() {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("game over!", 120, 250);
        ctx.fillText("You Scored: " + score, 120, 290);
      }

      function resetGame() {
        player.x = 180;
        player.y = 450;
        enemies.length = 0;
        score = 0;
        gameOver = false;
        clearInterval(spawnTimer);
        spawnTimer = setInterval(spawnEnemy, enemySpawnInterval);
        gameLoop();
      }

      function goToHome() {
        speedInputBox.style.display = "none";
        playerSpeedBtn.style.display = "none";
        enemySpeedBtn.style.display = "none";
        restartBtn.style.display = "block";
        settingsBtn.style.display = "block";
      }

      function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!gameOver) {
          drawPlayer();
          drawEnemies();
          updateEnemies();
          drawScore();
          requestAnimationFrame(gameLoop);
        } else {
          drawGameOver();
        }
      }

      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft" && player.x > 0) {
          player.x -= player.speed;
        }
        if (e.key === "ArrowRight" && player.x + player.width < canvas.width) {
          player.x += player.speed;
        }
      });

      restartBtn.addEventListener("click", () => {
        resetGame();
      });

      settingsBtn.addEventListener("click", () => {
        restartBtn.style.display = "none";
        settingsBtn.style.display = "none";
        playerSpeedBtn.style.display = "block";
        enemySpeedBtn.style.display = "block";
        speedInputBox.style.display = "none";
      });

      playerSpeedBtn.addEventListener("click", () => {
        playerSpeedBtn.style.display = "none";
        enemySpeedBtn.style.display = "none";
        speedInputBox.style.display = "block";
        speedInput.placeholder = "(1-50)";
        speedInput.value = player.speed;
        speedInput.focus();
        currentInputType = "player";
      });

      enemySpeedBtn.addEventListener("click", () => {
        playerSpeedBtn.style.display = "none";
        enemySpeedBtn.style.display = "none";
        speedInputBox.style.display = "block";
        speedInput.placeholder = "(200-3000)";
        speedInput.value = enemySpawnInterval;
        speedInput.focus();
        currentInputType = "enemy";
      });

      setBtn.addEventListener("click", () => {
        const newValue = parseInt(speedInput.value);
        if (currentInputType === "player") {
          if (isNaN(newValue) || newValue < 1 || newValue > 50) {
            alert("Speed not in specified limit (1-50)");
            goToHome();
          } else {
            player.speed = newValue;
            goToHome();
          }
        } else if (currentInputType === "enemy") {
          if (isNaN(newValue) || newValue < 200 || newValue > 3000) {
            alert("Speed not in specified limit (200-3000 ms)");
            goToHome();
          } else {
            enemySpawnInterval = newValue;
            clearInterval(spawnTimer);
            spawnTimer = setInterval(spawnEnemy, enemySpawnInterval);
            goToHome();
          }
        }
      });

      backBtn.addEventListener("click", () => {
        goToHome();
      });

      spawnTimer = setInterval(spawnEnemy, enemySpawnInterval);
      gameLoop();