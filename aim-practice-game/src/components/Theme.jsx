{/* In this component, changing color/theme will be possible for the user. Will it maybe be needed to be moved to API.jsx? */}
import React from "react";
import { useEffect, useState } from "react";

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

    return(
        <div className="container-counter">
            <div className="">
                <p className="theme" style={{backgroundColor: color}}>
                    Theme: {color}</p>
            </div>
            <div className="buttons">

            </div>
            <button className="btn btn-color" onClick= {changeColor}>Change Theme</button>
        </div>
    );
};

export default Theme;