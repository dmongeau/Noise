// JavaScript Document


var Noise = {
	
	'words' : [],
	'socket' : null,
	'photoInterval' : null,
	
	'init' : function() {
		
		Noise.initSocket();
		
		
		/*$('body').append('<div id="letters"><ul></ul></div>');
		
		var letters = 'abcdefghijklmnopqrstuvwxyz';
		for(var i = 0; i < letters.length; i++) {
			var letter = letters[i];
			$('#letters ul').append('<li id="letter-'+letter+'">'+letter+'</li>');
		}*/
		
		//var words = window.location.hash.substr(1).split(',');
		var words = ['fuck'];
		Noise.setWords(words);
		$('body').append('<img src="data:image/gif;base64,'+Bieber+'" />');
		
		
		
	},
	
	'setWords' : function(words) {
		if(Noise.photoInterval) {
			window.clearInterval(Noise.photoInterval);
			Noise.photoInterval = null;
		}
		
		Noise.words = words;
		
		Noise.initSocket();
		
		
	},
	
	
	'initSocket' : function() {
		
		if(Noise.socket) {
			Noise.socket.disconnect();	
			Noise.socket = null;
		}
		
		var socket = Noise.socket = io.connect('http://70.38.72.177');
		
		socket.on('connect',function(data) {
			socket.emit('setWords',Noise.words);
		});
		
		socket.on('word',function(word,data) {
			/*
			 *
			 *
			 *
			 */
			var size = (50+((data.length/140) * 300))*data.count;
			var fontSize = size+'px';
			var letterSpacing = ((data.length/140) * 10)+'px';
			var textTransform = data.count > 1 ? 'uppercase':'';
			var textDecoration = data.count > 2 ? 'underline':'';
			var fontWeight = data.count > 2 ? 'bold':'normal';
			
			var color = '#'+intToHex((data.length/140) * 16843008);
			
			/*var half = Math.floor(Bieber.length/7)*5;
			var image = Bieber.substr(0,half)+data.text+Bieber.substr(half+data.length);
			var third = Math.floor(image.length/5)*2;
			image = Bieber.substr(0,third)+data.text+Bieber.substr(third+data.length);*/
			/*var image = Bieber.replace(/a/,'b').replace(/C/,'D').replace(/1/,'2');
			$('body img').attr('src','data:image/gif;base64,'+image);
			console.log(Bieber.length);
			console.log(image.length);*/
			
			/*
			 *
			 * Letters
			 *
			 */
			var maxLetterCount = 0;
			var stats = {};
			var letters = 'abcdefghijklmnopqrstuvwxyz';
			for(var i = 0; i < letters.length; i++) {
				var letter = letters[i];
				var count = stats[letter] = (data.text.toLowerCase().split(letter).length - 1);
				if(count > maxLetterCount) maxLetterCount = count;
			}
			
			var sortable = [];
			for (var letter in stats) {
				sortable.push([letter, stats[letter]]);
			}
			sortable.sort(function(a, b) {return a[1] - b[1]});
			
			var image = Bieber.replace(sortable[0][0],sortable[25][0]);
			//image = image.replace(sortable[1][0],sortable[24][0]);
			//image = image.replace(sortable[2][0],sortable[23][0]);
			image = image.replace(sortable[3][0],sortable[22][0]);
			//image = image.replace(sortable[4][0],sortable[21][0]);
			image = image.replace(sortable[5][0],sortable[20][0]);
			image = image.replace(sortable[6][0],sortable[19][0]);
			$('body img').attr('src','data:image/gif;base64,'+image);
			
			
			
			/*for(var letter in stats) {
				var count = stats[letter];
				var size = (count/maxLetterCount) * 300;
				var color = '#'+intToHex((count/maxLetterCount) * 16843008);
				if(size < 12) size = 12;
				$('#letter-'+letter).css({
					'fontSize' : size+'px',
					'backgroundColor' : color
				})
			}*/
			
		});
		
		
		
		
		
	}
};


function intToHex(i) {  
    var hex = parseInt(i).toString(16);  
    return (hex.length < 2) ? "0" + hex : hex;  
} 

function toBin(str){
 var st,i,j,d;
 var arr = [];
 var len = str.length;
 for (i = 1; i<=len; i++){
                //reverse so its like a stack
  d = str.charCodeAt(len-i);
  for (j = 0; j < 8; j++) {
   arr.push(d%2);
   d = Math.floor(d/2);
  }
   arr.push(' ');
 }
        //reverse all bits again.
 return arr.reverse().join("");
}