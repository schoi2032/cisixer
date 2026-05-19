document.addEventListener('DOMContentLoaded', function () {

    // --- 1. Fun Facts Rotator ---
    const facts = [
        "Dolphins sleep with one eye open!",
        "A group of dolphins is called a pod.",
        "Dolphins can swim up to 20 miles per hour.",
        "Dolphins have 2 stomachs: one for food storage and one for digestion.",
        "Killer whales are actually a species of dolphin!",
        "Dolphins give themselves names (signature whistles).",
        "Some dolphins can live to be 50 years old.",
        "Dolphins help sick or injured members of their pod.",
        "Dolphins can recognize themselves in a mirror.",
        "The killer whale (orca) is the largest member of the dolphin family.",
        "Dolphins have been known to protect swimmers from sharks.",
        "Some dolphins can jump as high as 20 feet out of the water.",
        "Dolphins use echolocation to find food and navigate.",
        "A baby dolphin is called a calf.",
        "Dolphins are mammals, not fish!",
        "Taeyang made the background with Claude Opus 4 😈"
    ];

    const factElement = document.getElementById('fact-display');
    if (factElement) {
        let currentFact = 0;

        // Initial fact
        factElement.textContent = facts[currentFact];

        setInterval(() => {
            factElement.style.opacity = 0;
            setTimeout(() => {
                currentFact = (currentFact + 1) % facts.length;
                factElement.textContent = facts[currentFact];
                factElement.style.opacity = 1;
            }, 500);
        }, 6000);
    }

    // --- 2. Gravity Box Simulation ---
    // fixing taeyang's ai ahh code
    // subtracts arrays (number arrays)

    function arraySub (e,x) {
        const sArray = [];
        for (let i = 0; i < e.length && i < x.length; i++) {
            sArray.push(e[i] - x[i]);
        }
        return sArray
    }
    // multiplies arrays (you'll understand in a second okay please)
    function arrayMult (e,x) {
        const sArray = [];
        for (let i = 0; i < e.length && i < x.length; i++) {
            sArray.push(e[i] * x[i]);
        }
        return sArray
    }
    function arrayAdd (e,x) {
        const sArray = [];
        for (let i = 0; i < e.length && i < x.length; i++) {
            sArray.push(e[i] + x[i]);
        }
        return sArray
    }

    function arrayDiv (e,x) {
        const sArray = [];
        for (let i = 0; i < e.length && i < x.length; i++) {
            sArray.push(e[i] / x[i]);
        }
        return sArray
    }
    const canvas = document.getElementById('gravityCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const clearBtn = document.getElementById('clearBallsBtn');
        let balls = [];
        const radi = 20;
        let d = undefined
        class Ball {
            constructor(x, y) {
            // snapping
                // up
                this.x = x;
                this.y = y;
                this.dy = -(Math.random() * 4);
                this.dx = Math.random() * 4;
                this.radius = radi;
                this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
            }
//meow creatures are better
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
            }

            update() {
                console.log(this.y);

                if (this.y + radi + this.dy - 1> canvas.height) {
                    this.edges("vert", canvas.height - this.y - radi - this.dy - 1);
                }

                if (this.y + this.dy < radi) {
                    this.edges("vert", radi - this.y - this.dy);
                }

                if (this.x + radi + this.dx > canvas.width) {
                    this.edges("horz", canvas.width - this.x - radi - this.dx);
                }

                if (this.x + this.dx - radi <= 0) {
                    this.edges("horz", radi - this.x - this.dx);
                }
                this.x += this.dx;
                this.y += this.dy;

                this.draw();
            }
            // checks for collision (may add quad tree)
            collcheck() {
                let ball1 = undefined;
                let ball2 = undefined;
                for (let i = balls.indexOf(this) + 1; i < balls.length; i++) {
                        ball1 = this;
                        ball2 = balls[i];
                        // d means distance
                        d = Math.sqrt((Math.abs(ball1.x-ball2.x) ** 2) + (Math.abs(ball1.y-ball2.y) ** 2));
                        if (d < 40) {
                            this.collresult(ball1, ball2, d, i);
                    }

                }
            }
            // collision resolution (resource: https://dipamsen.github.io/notebook/page/collisions.pdf)
            collresult(b1, b2, d, i, j ) {
                let b1Vect = [b1.dx, b1.dy];
                let b2Vect = [b2.dx, b2.dy];
                let b1Pos = [b1.x, b1.y];
                let b2Pos = [b2.x, b2.y];
                let vectSub = arraySub(b2Vect, b1Vect);
                let posSub = arraySub(b2Pos, b1Pos);
                 // b1 collision resolution
                let b1$ = arrayDiv(arrayMult(vectSub,arrayMult(posSub, posSub)), arrayMult(posSub,posSub));
                 // b2 collision resolution
                let b2$ = [-((b1$)[0]), -((b1$)[1])];
                b1.dx = arrayAdd(b1$, b1Vect)[0];
                b1.dy = arrayAdd(b1$, b1Vect)[1];
                b2.dx = arrayAdd(b2$, b2Vect)[0];
                b2.dy = arrayAdd(b2$, b2Vect)[1];
                const overlap = radi * 2 - d;
                const nx = (b2.x - b1.x) / d;
                const ny = (b2.y - b1.y) / d;

                b1.x -= nx * overlap / 2;
                b1.y -= ny * overlap / 2;
                b2.x += nx * overlap / 2;
                b2.y += ny * overlap / 2;
            }
            // edge collision
            edges(type, amount) {
                switch (type) {
                    case "vert":
                        this.dy = -this.dy;
                        this.y += amount;
                        break;
                    case "horz":
                        this.dx = -this.dx;
                        this.x += amount;
                        break;
                }

            }
        }

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balls.forEach(ball  => ball.update());
            for (let i = 0; i < 100; i++) {
                balls.forEach(ball => ball.collcheck());
            }
        }

        
        animate();
 

        // Add ball on click
        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            balls.push(new Ball(x, y));
        });

        clearBtn.addEventListener('click', () => {
            balls = [];
        });
        console.log(canvas.height);
    }

    // --- 3. Click Speed Test ---
    const clickBtn = document.getElementById('clickBtn');
    const scoreDisplay = document.getElementById('clickScore');
    const timerDisplay = document.getElementById('clickTimer');

    if (clickBtn) {
        let score = 0;
        let timeLeft = 10;
        let isPlaying = false;
        let timerId = null;

        clickBtn.addEventListener('click', () => {
            if (!isPlaying) {
                // Start Game
                if (clickBtn.textContent === "Play Again") {
                    score = 0;
                    timeLeft = 10;
                    scoreDisplay.textContent = `Score: ${score}`;
                    timerDisplay.textContent = `Time: ${timeLeft}s`;
                }

                isPlaying = true;
                clickBtn.textContent = "CLICK ME!";

                timerId = setInterval(() => {
                    timeLeft--;
                    timerDisplay.textContent = `Time: ${timeLeft}s`;
                    if (timeLeft <= 0) {
                        clearInterval(timerId);
                        isPlaying = false;
                        clickBtn.textContent = "Play Again";
                        alert(`Time's up! You got ${score} clicks!`);
                    }
                }, 1000);

                score++;
                scoreDisplay.textContent = `Score: ${score}`;
            } else {
                // Count Clicks
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
            }
        });
    }

    // --- 4. Color Reactor ---
    const reactionBox = document.getElementById('reactionBox');
    const reactionResult = document.getElementById('reactionResult');

    if (reactionBox) {
        let startTime;
        let timeoutId;
        let isWaiting = false;

        function startReactionTest() {
            reactionBox.style.backgroundColor = '#e74c3c'; // Red
            reactionBox.textContent = "Wait for Green...";
            reactionResult.textContent = "";
            isWaiting = true;

            const randomTime = Math.floor(Math.random() * 3000) + 1000; // 1-4 seconds

            timeoutId = setTimeout(() => {
                reactionBox.style.backgroundColor = '#2ecc71'; // Green
                reactionBox.textContent = "CLICK NOW!";
                startTime = Date.now();
                isWaiting = false;
            }, randomTime);
        }

        reactionBox.addEventListener('click', () => {
            if (reactionBox.textContent === "Click to Start") {
                startReactionTest();
                return;
            }

            if (isWaiting) {
                // Clicked too early
                clearTimeout(timeoutId);
                reactionBox.style.backgroundColor = '#e74c3c';
                reactionBox.textContent = "Too Early!";
                reactionResult.textContent = "You clicked too soon. Try again.";
                setTimeout(() => {
                    reactionBox.textContent = "Click to Start";
                    reactionBox.style.backgroundColor = '#3498db';
                }, 1500);
                isWaiting = false;
            } else if (reactionBox.textContent === "CLICK NOW!") {
                // Success
                const reactionTime = Date.now() - startTime;
                reactionBox.textContent = `${reactionTime}ms`;
                reactionResult.textContent = reactionTime < 250 ? "Super Fast! ⚡" : "Good job! 👍";

                setTimeout(() => {
                    reactionBox.textContent = "Click to Start";
                    reactionBox.style.backgroundColor = '#3498db';
                }, 2000);
            }
        });

        // Initial State
        reactionBox.textContent = "Click to Start";
        reactionBox.style.backgroundColor = '#3498db';
    }

});
