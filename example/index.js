var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from "react";
import ReactDOM from "react-dom";
import ArcticTree from "arctic-tree";
class Tree extends ArcticTree {
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
ReactDOM.render(React.createElement(Tree, null), document.getElementById('layout'));
