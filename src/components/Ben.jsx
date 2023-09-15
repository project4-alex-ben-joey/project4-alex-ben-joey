import React from "react";
import "../App.css";
function Ben() {
  return (
    /* HTML GOES HERE */
    <section className="flexcontainer">
      <div>
        <div>
          <h1>Concert Accountant</h1>

          <div className="concertflex">
            <div className="inputcontainer">
                <label className='inputheader' htmlFor="">Who do you want to see?</label>
                <input type="text" placeholder="search" aria-label="search"/>
            </div>
            <p className="or">Or</p>
            <div className="inputcontainer">
                <label className='inputheader' htmlFor="">When do you want to see it?</label>
                <input type="date"/>
            </div>
            <div className="inputcontainer">
                {/* Border Radius goes on input header. Use your JavaScript to prevent the numbers from reaching the negatives. */}
                <label className='inputheader' htmlFor="">How bad do you want to see it?</label>
                <input type="number" placeholder="0" aria-label="0"/>
            </div>
          </div>
        </div>

        <div>
          <h2>Upcoming Shows</h2>
{/* Dynamically render show search API in the UL and LI. Remove the text and replace with said API. */}
          <ul>
            <li>
              <h3>Prozzak</h3>
              <p>Sydney, Australia</p>
              <p className="purpleBox">10 / 01 / 2023</p>
            </li>
            <li>
              <h3>Prozzak</h3>
              <p>New York, USA</p>
              <p className="purpleBox">10 / 02 / 2023</p>
            </li>
            <li>
              <h3>Prozzak</h3>
              <p>Toronto, Canada</p>
              <p className="purpleBox">10 / 04 / 2023</p>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h2>My Shows</h2>

        <h2>Cost</h2>
{/* Replace the IMG Src with the picture that's returned from the API. Replace the h3 and two p tags with the API also.*/}
        <ul>
          <li className="myshowsflexcontainer">
            <div className="myshowsinfoflex">
              <img src="https://placekitten.com/200/200" alt="Cat" />
              <div>
                <h3>Sinead O'Connor</h3>
                <p>Location</p>
                <p>??/??/????</p>
              </div>
            </div>
            <div className="moneyflex">
              <p>$5</p>
              <p>fontawesome</p>
            </div>
          </li>
          <li className="myshowsflexcontainer">
            <div className="myshowsinfoflex">
              <img src="https://placekitten.com/200/200" alt="Cat" />
              <div>
                <h3>Duran Duran</h3>
                <p>Location</p>
                <p>??/??/????</p>
              </div>
            </div>
            <div className="moneyflex">
              <p>$230</p>
              <p>fontawesome</p>
            </div>
          </li>
          <li className="myshowsflexcontainer">
            <div className="myshowsinfoflex">
              <img src="https://placekitten.com/200/200" alt="Cat" />
              <div>
                <h3>Taylor Swift</h3>
                <p>Location</p>
                <p>??/??/????</p>
              </div>
            </div>
            <div className="moneyflex">
              <p>$30,000</p>
              <p>fontawesome</p>
            </div>
          </li>
          <div className="savelistflex">
            <div className="noarrows">
              <label className="h2" htmlFor="">
                Budget Left...
              </label>
              <input type="number" placeholder="0" />
            </div>
            <div className="purpleBox">
            <p>Save List</p>
            </div>
          </div>
        </ul>
      </div>
    </section>
  );
}

export default Ben;
