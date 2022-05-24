import React, { Component } from "react";
import danImage from "./about_images/dan.jpg";
import sonyaImage from "./about_images/sonya.jpg";
import colinImage from "./about_images/colin.jpg";

export default class AboutUs extends Component {
  render() {
    return (
      <div class="about-main">
        <h2>About us</h2>
        <p>
          SOKO is an online system that aims to plan for smart green trips
          inside the city and its neighborhood for online shopping and then
          delivery to the destinations. Considering the traffic as a serious
          threat to the quality of life these years, the world has been looking
          for various solutions to decrease the stress, frustration, delays and
          terrible air pollutions being caused through it. SOKO provides a smart
          green solution on this regard by providing online shopping services
          and then delivery of the purchased items from the warehouses to the
          destination address.
        </p>
        <h2>Our Team</h2>

        <div class="about-row">
          <div class="about-column">
            <img src={danImage} />
          </div>
          <div class="about-column">
            <h3>Dan Kotov</h3>
            <p>
              Studying Computer Science at Ryerson University
              <br />
              Freelance motion and graphic design
              <br />
              <i>The Office</i> enthusiast & professional Hookah maker
            </p>
            <div button-box>
              <button
                className="about-button"
                style={{ marginRight: 10 }}
                onClick={() => {
                  window.location.href = "https://www.linkedin.com/in/";
                }}
              >
                LinkedIn
              </button>
              <button
                class="about-button"
                style={{ backgroundColor: "black", color: "white" }}
                onClick={() => {
                  window.location.href = "https://github.com/kotovrdtrlf";
                }}
              >
                Github
              </button>
            </div>
          </div>
        </div>

        <div class="about-row">
          <div class="about-column">
            <img src={sonyaImage} />
          </div>
          <div class="about-column">
            <h3>Sonya Jurane</h3>
            <p>
              Computer Science student at Ryerson University
              <br />
              Climber, kitesurfer & aspiring pilot
              <br />
              Cheese pizza addict
            </p>
            <div button-box>
              <button
                class="about-button"
                style={{ marginRight: 10 }}
                onClick={() => {
                  window.location.href =
                    "https://www.linkedin.com/in/sonyajurane/";
                }}
              >
                LinkedIn
              </button>
              <button
                class="about-button"
                style={{ backgroundColor: "black", color: "white" }}
                onClick={() => {
                  window.location.href = "https://github.com/SonyaJurane";
                }}
              >
                Github
              </button>
            </div>
          </div>
        </div>

        <div class="about-row">
          <div class="about-column">
            <img src={colinImage} />
          </div>
          <div class="about-column">
            <h3>Colin Mackay</h3>
            <p>
              Computer Science student at Ryerson University
              <br />
              Developer for Inclusive Media & Design Centre
              <br />
              Amateur Chef
            </p>
            <div button-box>
              <button
                class="about-button"
                style={{ marginRight: 10 }}
                onClick={() => {
                  window.location.href =
                    "https://www.linkedin.com/in/colin-mackay-b2448297/";
                }}
              >
                LinkedIn
              </button>
              <button
                className="about-button"
                style={{ backgroundColor: "black", color: "white" }}
                onClick={() => {
                  window.location.href = "https://github.com/quietcolossus";
                }}
              >
                Github
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
