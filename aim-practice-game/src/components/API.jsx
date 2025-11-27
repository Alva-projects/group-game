import React, { useEffect, useState } from "react";

function API () {
    const [, ] = useState([]);
    const fetchData = async() => {;
        try {
            const response = await fetch("");
            const data = await response.json();
            (data);
        }
        catch (error){
            console.log("Error fetching data:", error);
        };
    };
    useEffect(() => {fetchData();}, [])
  return(
    <>
        <h1 className="">API</h1>
        <div>
            <div >

            </div>
        </div>
                <button className="btn restart" onClick={fetchData}>New Game</button>
    </>
  );  
};

export default API;