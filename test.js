var t = require("./books.js");
String.prototype.repeat = function (n) {
	var a = [];
	a.length = n+1;
	return a.join(this);
};
var book = {
	title: "Favola di Amore e Psiche",
	author: "Apuelio",
	notes: "Titolo originale: Metamorfoseon (Asinus Aureus).".repeat(100)
};

var opt = t.lo("./config.json");
var rounds = 10000;
var start = Date.now();
for (var i=0; i<rounds; i++) {
	var s = t.score(opt, book, ["Favola", "Apuelio", "Meta"]);
}
var stop = Date.now();
var delta = stop - start;
console.log("The score is " + s);
console.log("Scoring " + rounds + " objects takes " + delta + "ms");
