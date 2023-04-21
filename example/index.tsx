import React from "react";
import ReactDOM from "react-dom";
import ArcticTree from "arctic-tree";

class Tree extends ArcticTree {
  async componentDidMount() {
    this.storage = [
      {
        id: 1,
        haschild: true,
        name: "10",
        higher: null,
        level: 1,
      },
      {
        id: 2,
        haschild: true,
        name: "20",
        higher: 1,
        level: 2,
      },
      {
        id: 3,
        haschild: false,
        name: "30",
        higher: 2,
        level: 3,
      },
      {
        id: 4,
        haschild: false,
        name: "40",
        higher: 2,
        level: 3,
      },
      {
        id: 5,
        haschild: true,
        name: "50",
        higher: null,
        level: 1,
      },
      {
        id: 6,
        haschild: false,
        name: "60",
        higher: 5,
        level: 2,
      },
      {
        id: 7,
        haschild: false,
        name: "70",
        higher: 5,
        level: 2,
      },
    ];
    this.doNextRun();
  }
}

ReactDOM.render(<Tree />, document.getElementById('layout'));
