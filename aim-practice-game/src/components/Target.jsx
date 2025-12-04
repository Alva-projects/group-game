{/* In this component, the target (circles will appear) */}
import React from "react";
import { useEffect, useState } from "react";
import GameOver from "./GameOver";
import Theme from "./Theme";
import Timer from "./Timer";
import LinearTheme from "./LinearTheme";

function Target (){ 
    return(
    <>
      <div className="difficulty-div">
          <label for="difficutly" class="difficulty">Difficulty:</label>
            <select id="difficulty">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        <GameOver/>
        <Theme/>
        <Timer/>
    </>
)};

export default Target; 