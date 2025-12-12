{/* In this component, the target (circles will appear) */}
import React from "react";
import { useEffect, useState } from "react";
import GameOver from "./GameOver";
import Theme from "./Theme";
import Timer from "./Timer";
import LinearTheme from "./LinearTheme";
import "../target.css";

function Target() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(true);
    // const [difficulty, setDifficulty] = useState("easy");
    // difficulty selection is now handled by the main game settings (see constants.js)
    // const [difficulty, setDifficulty] = useState("easy");

    // Circle size based on difficulty
    const getCircleSize = () => {
        // if (difficulty === "easy") return 70;
        // if (difficulty === "medium") return 50;
        // if (difficulty === "hard") return 35;
        return 50;
    };

    // Find a random position and show the circle
    const spawnTarget = () => {
        const gameArea = document.getElementById("game-area");
        if (!gameArea) return;

        const areaWidth = gameArea.clientWidth;
        const areaHeight = gameArea.clientHeight;
        const size = getCircleSize();

        const x = Math.random() * (areaWidth - size);
        const y = Math.random() * (areaHeight - size);

        setPosition({ x, y });
        setVisible(true);
    };

    // First spawn
    useEffect(() => {
        spawnTarget();
    }, []);

    // When circle is clicked
    const handleClick = () => {
        setVisible(false);

        setTimeout(() => {
            spawnTarget();
        }, 150);
    };

    return (
        <>
            {/* Difficulty selector */}
            {/* <label htmlFor="difficulty" className="difficulty">
                Difficulty:
            </label>
            <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
            >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select> */}
            {/* Difficulty selector removed — difficulty now comes from main game settings (constants.js) */}

            {/* Other teammate components */}
            <GameOver />
            <Theme />
            <Timer />

            {/* Game area with target circle */}
            <div id="game-area" className="game-area">
                {visible && (
                    <div
                        className="target-circle"
                        onClick={handleClick}
                        style={{
                            left: position.x,
                            top: position.y,
                            width: getCircleSize(),
                            height: getCircleSize(),
                        }}
                    ></div>
                )}
            </div>
        </>
    );
}

export default Target;