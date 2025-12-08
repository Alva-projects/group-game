import "../target.css"
import { useState, useEffect } from "react";

<<<<<<< HEAD:aim-practice-game/src/components/LinearTheme.jsx
=======
<<<<<<<< HEAD:aim-practice-game/src/components/Theme.jsx
function Theme() {
    const [color, setColor] = useState("Evening");
    const colors = ["Blood", "Evening", "Dark", "Barbie"];
    const gradientColors = {
    Blood: "linear-gradient(135deg, #d1a4a4ff, #5a0505ff)",
    Evening: "linear-gradient(135deg, #859dd1ff, #120065ff)",
    Dark: "linear-gradient(135deg, #4f4f4fff, #000000ff)",
    Barbie: "linear-gradient(135deg, #d9bddbff, #a00085ff)",
};
========
>>>>>>> pre-game-screens:aim-trainer/src/pages/LinearTheme.jsx
function LinearTheme() {
    const [color, setColor] = useState("red");
    const colors = ["red"]
    const gradientColors = {
        red: "linear-gradient(135deg, #d6ceceff, #b30000)"   
    };

<<<<<<< HEAD:aim-practice-game/src/components/LinearTheme.jsx
=======
>>>>>>>> pre-game-screens:aim-trainer/src/pages/LinearTheme.jsx
>>>>>>> pre-game-screens:aim-trainer/src/pages/LinearTheme.jsx
    const changeColor = () => {
                setColor((current) => {
                    const indexColor = colors.indexOf(current);
                    const nextColor = (indexColor +1) % colors.length;
                    
                    return colors[nextColor];
                });
            }
            useEffect(() => {
                document.title = `Theme ${color}`
            }, [color]);

            return (
                <>
<<<<<<< HEAD:aim-practice-game/src/components/LinearTheme.jsx
                    <div className="theme-target" style={{background: gradientColors[color]}}> 
                    </div>
                    <button className="btn btn-color" onClick= {changeColor}>Change Theme</button>
=======
<<<<<<<< HEAD:aim-practice-game/src/components/Theme.jsx
                <div className="theme-target" style={{background: gradientColors[color]}}> 
                </div>
                <button className="btn btn-color options" onClick= {changeColor}>Change Theme</button>
                <p className="theme options">Theme: {color}</p>
========
                    <div className="theme-target" style={{background: gradientColors[color]}}> 
                    </div>
                    <button className="btn btn-color" onClick= {changeColor}>Change Theme</button>
>>>>>>>> pre-game-screens:aim-trainer/src/pages/LinearTheme.jsx
>>>>>>> pre-game-screens:aim-trainer/src/pages/LinearTheme.jsx
                </>
            )
}

export default LinearTheme;