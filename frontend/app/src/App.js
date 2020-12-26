import React from "react";
import "./App.css";
import axios from "axios";
const backendPort = process.env.BACKEND_PORT || 5000;
const backendHost = process.env.BACKEND_HOST || "backend";

const backendURL = `http://${backendHost}:${backendPort}`;
// const corsFreeURL = "http://localhost:7000/";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { longURL: "" };

    this.handleLongURL = this.handleLongURL.bind(this);
    this.postLongURL = this.postLongURL.bind(this);
  }

  handleLongURL(event) {
    this.setState({ longURL: event.target.value });
  }

  postLongURL(event) {
    console.log(this.state.longURL);
    axios
      // .post(`${corsFreeURL}http://localhost:5000/create`, {
      .post(backendURL, {
        long_url: this.state.longURL,
      })
      .then((res) => {
        console.log(res.data);
        this.setState({ short_url: res.data.short_url });
        console.log(this.state);
      });
    event.preventDefault();
  }
  render() {
    return (
      <div className="urlform">
        <form onSubmit={this.postLongURL}>
          <label htmlFor="longUrl">Enter Your URL </label>
          <input
            className="inputInForm"
            id="longUrl"
            name="longUrl"
            value={this.state.longURL}
            onChange={this.handleLongURL}
            type="text"
          />
          <button> Create Short URL! </button>
        </form>
        {this.state.short_url !== undefined && (
          <div>
            <p>{this.state.short_url}</p>
            <p className="monospace">
              Please copy and navigate to the above url to access your long URL
              :) Thank you
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default App;
