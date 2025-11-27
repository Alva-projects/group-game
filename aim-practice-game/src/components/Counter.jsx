import React from "react";
import { useEffect, useState } from "react";
import "./counter.css"

function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = `Count: ${count}`
    }, [count, color]);

    return(
        <div className="">
            <div className="">
                <p>Score: {count}</p>

            </div>
                <div className="add">
                    <button className="btn btn-add" onClick={() => setCount((c) => c + 2)}>Score:</button>
                </div>
                <button className="btn btn-reset" onClick={() => setCount((c) => 0)}>Reset counter</button>
            <button className="btn btn-color" onClick= {changeColor}>Change color</button>
        </div>
    );
};

export default Counter;