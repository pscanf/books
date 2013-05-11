var http = require("http");
var book = JSON.stringify({
	title: "Favola di Amore e Psiche",
	author: "Apuelio",
	notes: "Titolo originale: Metamorfoseon (Asinus Aureus)."
});

var put_req_body = JSON.stringify({
	action: "put",
	username: "paolo",
	password: "paolo",
	key: "0000001",
	value: book
});

var del_req_body = JSON.stringify({
	action: "del",
	username: "paolo",
	password: "paolo",
	key: "0000001"
});

var get_req_body = JSON.stringify({
	action: "get",
	key: "0000001"
});

var search_req_body = JSON.stringify({
	action: "search",
	keywords: ["Favola"]
});

var opt = {
	host: "127.0.0.1",
	port: 8081,
	method: "POST"
};

var req = http.request(opt, function (res) {
	res.setEncoding("utf8");
	var res_body = "";
	res.on("data", function (chunk) {
		res_body += chunk;
	});
	res.on("end", function () {
		console.log("RESPONSE CODE: ");
		console.log(res.statusCode);
		console.log("RESPONSE BODY: ");
		console.log(res_body);
	});
});

//req.end(put_req_body);
//req.end(get_req_body);
req.end(search_req_body);
//req.end(del_req_body);
