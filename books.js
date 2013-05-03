var http = require("http");
var fs = require("fs");
var crypto = require("crypto");
var lazydb = require("./lazydb");
var error = require("./error");
var WebSocketServer = require("ws").Server;

var opt;

var load_options = function () {
	var config_path = process.argv[2];
	var opt_string = fs.readFileSync(config_path, "utf8");
	opt = JSON.parse(opt_string);
};

var init = function () {
	var http_srv = http.createServer();
	http_srv.on("request", handle_http_request);
	http_srv.listen(opt.http_port);

	var ws_srv = new WebSocketServer({port: opt.ws_port});
	wss.on("connection", handle_ws_connection);
};

var handle_http_request = function (req, res) {
	var body = "";
	req.setEncoding("utf8");
	req.on("data", function (chunk) {
		body += chunk;
	});
	req.on("end", function () {
		var ans;
		try {
			body = JSON.parse(body);
		} catch (e) {
			res.writeHead(400);
			res.end();
			return;
		}

		if (body.action === "get") {
			handle_get(body, finalize_response);
		}

		if (body.action === "put") {
			handle_put(body, finalize_response);
		}

		if (body.action === "del") {
			handle_del(body, finalize_response);
		}

	});
};

var handle_get = function (body, callback) {
	var key, value, kvp;
	if (typeof(body.key) !== "string") {
		callback(error[400]);
		return;
	}
	key = new Buffer(body.key);
	value = books_db.get(key);
	if (!value) {
		callback(erorr[401]);
	}
	value = value.toString();
	kvp = {
		key: key,
		value: value
	};
	callback(false, JSON.stringify(kvp));
};

var handle_put = function (body, callback) {
	if (typeof(body.username) !== "string") {
		callback(error[400]);
		return;
	}
	if (typeof(body.password) !== "string") {
		callback(error[400]);
		return;
	}
	if (typeof(body.key) !== "string") {
		callback(error[400]);
		return;
	}
	if (typeof(body.value) !== "string") {
		callback(error[400]);
		return;
	}
	authenticate(body.username, body.password, function (err) {
		if (err) {
			callback(error[402]);
			return;
		}
		var key = new Buffer(body.key);
		var value = new Buffer(body.value);
		books_db.put(body.key, body.value, function (err) {
			if (err) {
				callback(err);
				return;
			}
			callback(false);
		});
	});
};

var handle_del = function (body, callback) {
	if (typeof(body.username) !== "string") {
		callback(error[400]);
		return;
	}
	if (typeof(body.password) !== "string") {
		callback(error[400]);
		return;
	}
	if (typeof(body.key) !== "string") {
		callback(error[400]);
		return;
	}

	authenticate(body.username, body.password, function (err) {
		if (err) {
			callback(error[402]);
			return;
		}
		var key = new Buffer(body.key);
		books_db.del(body.key, function (err) {
			if (err) {
				callback(err);
				return;
			}
			callback(false);
		});
	});
};
