{/* In this component, the target (circles will appear) */}
import "../target.css"
import React from "react";
import { useEffect, useState } from "react";

function Target (){
    const [color, setColor] = useState("blue");
    const colors = ["red", "orange", "yellow", "blue", "indigo", "violet"]

    let score = 0;
    let time = 20;
    
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
        <p class="time-container">Time left: <span id="time">20s</span></p>
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
        <label for="difficutly" class="difficulty">Difficulty:</label>
          <select id="difficulty">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          
    </>
)};

export default Target; 