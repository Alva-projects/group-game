{/* In this component, Alva will fix a timer */}
import { useState, useEffect } from "react";
function Timer() {
    const [time, setTime]= useState(30);
    const [gameOver, setGameOver]= useState(false)

        useEffect(() => {
            if (gameOver) return; 
            const timer= setInterval(() => {
                
            setTime((t) => {
                if (t <= 0) {
                    setGameOver(true);
                    return 0;
                }
            return t - 1;
            });
            
            }, 1000);
            return () => clearInterval(timer);
            }, [gameOver]);
            return(
            <p className="time-container">Time left: <span id="time">{time} {`s`}</span></p>
            )
}

export default Timer;
