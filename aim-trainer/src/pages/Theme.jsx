import "../target.css";
import { useState, useEffect } from "react";

function Theme() {
    const [color, setColor] = useState("Evening");
    const colors = ["Blood", "Evening", "Dark", "Barbie"];
    const gradientColors = {
    Blood: "linear-gradient(135deg, #d1a4a4ff, #5a0505ff)",
    Evening: "linear-gradient(135deg, #859dd1ff, #120065ff)",
    Dark: "linear-gradient(135deg, #4f4f4fff, #000000ff)",
    Barbie: "linear-gradient(135deg, #d9bddbff, #a00085ff)",
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
                <button className="btn btn-color options" onClick= {changeColor}>Change Theme</button>
                <p className="theme options">Theme: {color}</p>
                </>
            )
}

export default Theme;