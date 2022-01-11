import * as React from "react";
import "./OrderForm.css";

export default function OrderForm({ onOpen = () => {} }, childrem) {
  return (
    <div class="container">
      <div class="card">
        <div class="contentBx">
          <h2>Initiate your position</h2>
          <div class="size">
            <h3>Size: </h3>
            <input></input>
          </div>
          <div class="size">
            <h3>Call or Put:</h3>
            <input></input>
          </div>
          <div class="size">
            <h3>Price Future:</h3>
            <input></input>
          </div>
          <div class="size">
            <h3>Due date:</h3>
            <input></input>
          </div>
          <button onClick={onOpen}>Create</button>
        </div>
      </div>
    </div>
  );
}
