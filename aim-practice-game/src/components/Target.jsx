{/* In this component, the target (circles will appear) */}
import "../target.css"
import React from "react";
import { useEffect, useState } from "react";

function Target (){
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
    <>
        <div className="box-target" style={{backgroundColor: color}}> 
        </div>
        <div className="contiainer-theme">
            <div className="">
                <p className="theme">
                    Theme: {color}</p>
            </div>
            <div className="buttons">

            </div>
            <button className="btn btn-color" onClick= {changeColor}>Change Theme</button>
        </div>
    </>
)};

export default Target; 