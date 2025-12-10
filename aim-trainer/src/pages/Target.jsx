{/* In this component, the target (circles will appear) */}
import React from "react";
import { useEffect, useState } from "react";
import "../target.css";

function Target() {
    // position: pixel coordinates (x, y) relative to the top-left of the game area
    const [position, setPosition] = useState({ x: 0, y: 0 });
    // visible: whether the target is currently rendered (used to hide on click)
    const [visible, setVisible] = useState(true);

    // getCircleSize(): centralized place to control the target size.
    // Currently returns a constant 50px. To make targets difficulty-aware,
    // read from props or import difficulty settings from `constants.js`.
    const getCircleSize = () => {
        return 50;
    };

    /*
      spawnTarget()
      - Chooses a random (x, y) position inside the `#game-area` element so the
      target does not overflow the bounds. It then sets the position and marks
      the target visible.
    */
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

    // Initial spawn when component mounts. If you move to a parent-controlled
    // target system, replace this with a spawn call from the parent.
    useEffect(() => {
        spawnTarget();
    }, []);

    /*
      handleClick()
      - Called when the player clicks the target.
      - Hides the current target and schedules the next spawn after a short
        delay (150ms). In the full game this should also call a scoring
        callback (e.g., props.onHit()) to increment the player's score.
    */
    const handleClick = () => {
        setVisible(false);

        setTimeout(() => {
            spawnTarget();
        }, 150);
    };

    // Render
    // - The `#game-area` container holds the target. In larger implementations
    //   this container should be owned by the GameScreen and passed in as a ref.
    // - The `target-circle` class defines visual appearance in `target.css`.
    return (
        <>
            {/* Difficulty selector removed — difficulty now comes from main game settings (constants.js) */}

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