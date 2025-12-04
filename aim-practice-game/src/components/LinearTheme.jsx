import "../target.css"
import { useState, useEffect } from "react";

function LinearTheme() {
    const [color, setColor] = useState("red");
    const colors = ["red"]
    const gradientColors = {
        red: "linear-gradient(135deg, #d6ceceff, #b30000)"   
    };

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
                    <div className="theme-target" style={{background: gradientColors[color]}}> 
                    </div>
                    <button className="btn btn-color" onClick= {changeColor}>Change Theme</button>
                </>
            )
}

export default LinearTheme;