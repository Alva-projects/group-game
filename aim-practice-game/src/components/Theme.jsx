import "../target.css"
import { useState, useEffect } from "react";

function Theme() {
    const [color, setColor] = useState("blue");
    const colors = ["red", "orange", "yellow", "blue", "indigo", "violet"]
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
                <div className="theme-target" style={{backgroundColor: color}}> 
                </div>
                <button className="btn btn-color" onClick= {changeColor}>Change Theme</button>
                <p className="theme">Theme: {color}</p>
                </>
            )
}

export default Theme;