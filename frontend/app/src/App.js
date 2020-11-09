import React from 'react';
import './App.css';


class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.createTinyUrl = this.createTinyUrl.bind(this);
    this.handleLongUrlChange = this.handleLongUrlChange.bind(this);
  }

  handleLongUrlChange(event){
    this.setState({longUrl:event.target.value});
  }

  createTinyUrl(event) {
    event.preventDefault();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "http://localhost:5000" },
      body: JSON.stringify({ url:this.state.longUrl})
  };
    
    fetch('http://localhost:5000/create',requestOptions)
    .then(result=>result.json())
    .then(items=>this.setState({items}));
  }

  render() {
    return (
      <form onSubmit={this.createTinyUrl}>
        <label htmlFor="longUrl">Enter Your URL</label>
        <input id="longUrl" name="longUrl" value={this.state.longUrl} onChange={this.handleLongUrlChange} type="text" />
        <button>Create Short URL!</button>
      </form>
    );
  }
}

export default App;
