import "../target.css"
import { useState, useEffect } from "react";

function Theme() {
    const [color, setColor] = useState("red");
    const colors = ["blood", "evening", "dark", "barbie"];
    const gradientColors = {
    blood: "linear-gradient(135deg, #ad8d8dff, #650101ff)",
    evening: "linear-gradient(135deg, #859dd1ff, #120065ff)",
    dark: "linear-gradient(135deg, #4f4f4fff, #000000ff)",
    barbie: "linear-gradient(135deg, #d9bddbff, #a00085ff)",
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
                <p className="theme">Theme: {color}</p>
                </>
            )
}

export default Theme;