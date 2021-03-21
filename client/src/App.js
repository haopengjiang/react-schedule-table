import React, { Component } from "react";
import "./App.css";
import DataGrids from './DataGrids';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
    }

    callAPI() {
        fetch("http://localhost:9000/testAPI")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    render() {
        return (
            <div className="App">
                <h3 className="App-intro">{this.state.apiResponse}</h3>
                <div className="DataGrids">
                <DataGrids></DataGrids>
                </div>
            </div>
        );
    }
}

export default App;