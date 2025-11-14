"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//tipos básicos
let age = 5;
const name = "Werlen";
const isAdmin = true;
const firstApm = "Gomes"; //mesmo que nada
const list = [1, 2, 3, 4, 5];
const list2 = [1, 2, 3, 4, 5];
const arr = ["A", "B", "C"];
const arr2 = ["A", "B", "C"];
const arrBool = [true, false];
const arrBool2 = [true, false];
const arrAll = [1, "B", true];
const arrAll2 = [1, "B", true];
//tupla
//pega na exata ordem especificada
const person = [1, "jane"];
const people = [
    [1, 'jane'],
    [2, 'Joe']
];
//Intersections
const productID = false;
//Enum
var direction;
(function (direction) {
    direction[direction["up"] = 1] = "up";
    direction[direction["Down"] = -1] = "Down";
    direction["Left"] = "Esquerda";
    direction["Rigth"] = "Direita";
})(direction || (direction = {}));
console.log(direction.up);
//type assertions - quando vc quer mudar o tipo da variavel
const productName = 'camisa';
let itemId1;
let itemId2;
itemId2 = productName;
itemId1 = productName;
console.log(typeof (itemId1), typeof (itemId2));
//# sourceMappingURL=types.js.map