var app = require('http').createServer(webHandler),
	io = require('socket.io').listen(app,['websocket', 'flashsocket', 'xhr-polling']),
	fs = require('fs'),
	sys = require('sys'),
	config = require('./config');


/*
 *
 * Web
 *
 */
app.listen(80,'70.38.72.177');
function webHandler(req, res) {
	
	function fileHandler(err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading file');
		}
		
		res.writeHead(200);
		res.end(data);
	}
	
	if(req.url == '/') fs.readFile(__dirname + '/web/index.html',fileHandler);
	if(req.url == '/bieber') fs.readFile(__dirname + '/web/bieber.html',fileHandler);
	else if(req.url.substr(-3) == '.js') fs.readFile(__dirname + '/web'+req.url,fileHandler);
	else if(req.url.substr(-4) == '.css') fs.readFile(__dirname + '/web'+req.url,fileHandler);
}


var TwitterNode = require('twitter-node').TwitterNode;

/*
 *
 * Socket
 *
 */
 
var clients = {};
var clientsCount = 0;

var twit = null;

var twitStreaming = false;


io.set('log level', 1);
io.set('transports', [
	'websocket',
	'flashsocket',
	'htmlfile',
	'xhr-polling',
	'jsonp-polling'
]);

 
var general = io.sockets.on('connection', function (socket) {
	clientsCount++;
	console.log('**************Connected**************');
	socket.on('setWords',function(words) {
		
		var newWords = false;
		for(var i = 0; i < words.length; i++) {
			if(!clients[words[i]]) {
				clients[words[i]] = {};
				newWords = true;
			}
			clients[words[i]][socket.id] = socket;
		}
		
		if(newWords) {
			var words = [];
			for(var word in clients) {
				words.push(word);
			}
			if(!twit) initTwitter();
			twit.trackKeywords = words;
			twit.stream();
		}
		
	});
	
	socket.on('disconnect',function() {
		clientsCount--;
		console.log('Disconnect: ',clientsCount);
		twit = null;
		var words = [];
		var wordsChange = false;
		for(var word in clients) {
			if(clients[word]) {
				if(clients[word][socket.id]) {
					clients[word][socket.id] = null;
					delete clients[word][socket.id];
				}
				var count = 0;
				for(var id in clients[word]) {
					count++;
				}
				if(count > 0) {
					words.push(word);
				} else {
					clients[word] = null;
					wordsChange = true;
				}
			}
		}
		
		if(!clientsCount) {
			twit = null;
		} else if(wordsChange) {
			if(!twit) initTwitter();
			twit.trackKeywords = words;
			twit.stream();
		}
		
	});
	
});

function initTwitter() {

	twit = new TwitterNode({
	  user: config.twitter.username, 
	  password: config.twitter.password
	})
	
	twit.addListener('error', function(error) {
	  console.log(error.message);
	});
	
	twit.addListener('tweet', function(tweet) {
		//sys.puts("@" + tweet.user.screen_name + ": " + tweet.text);
		
		var data = {};
		data.text = tweet.text;
		data.length = tweet.text.length;
		
		for(var word in clients) {
			if(tweet.text.indexOf(word) != -1) {
				data.count = (tweet.text.toLowerCase().split(word).length - 1);	
				for(var id in clients[word]) {
					clients[word][id].emit('word',word,data);
				}
				break;
			}
		}
	});
	
	twit.addListener('delete', function(del) {
		sys.puts("DELETE: " + sys.inspect(del));
	});
	
	twit.addListener('end', function(resp) {
		//console.log(sys.inspect(resp,true));
		sys.puts("wave goodbye... " + resp.statusCode);
		initTwitter();
	})
	
}