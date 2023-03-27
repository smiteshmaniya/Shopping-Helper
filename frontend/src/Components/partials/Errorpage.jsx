import React from "react";
import "../../App.css";
const Errorpage = () => {
  return (
    <>
      <div style={{ width: "100%" }}>
        <div style={{ margin: "auto", width: "fit-content" }}>
          <img src="Images/errorPng.png" />
          <div>
            <div className="ErrorHeading">
              404 Error!!! Sorry, the page is not found!!!
            </div>
            <p style={{ fontSize: "1.2rem", letterSpacing: "0.15rem" }}>
              May be the page you want to access is deleted or not present.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Errorpage;
