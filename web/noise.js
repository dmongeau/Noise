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
		
		
		
	},
	
	'setWords' : function(words) {
		if(Noise.photoInterval) {
			window.clearInterval(Noise.photoInterval);
			Noise.photoInterval = null;
		}
		
		Noise.words = words;
		var html = [];
		var width = Math.floor(100/words.length);
		for(var i = 0; i < words.length; i++) {
			html.push('<div id="'+words[i].toLowerCase()+'" class="word" style="width:'+width+'%;"><div class="center">'+words[i]+'</div><div class="tweet"></div><div class="binary"></div></div>');
		}
		$('body .word').remove();
		$('body').append(html.join(''));
		Noise.initSocket();
		
		function rotatePhotos() {
			var url = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=47719eb2bf8f7974912a1e0b424dba20&text='+escape(words[0])+'&sort=date-posted-desc&format=json&jsoncallback=?';
			//var url = 'http://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=dc9be3b556d2ce979e215a36ef37e1cf&format=json&jsoncallback=?';
			$.getJSON(url, function(data) {
				var photosCount = data.photos.photo.length;
				var photoIndex = 0;
					Noise.photoInterval = window.setInterval(function() {
					var photo = data.photos.photo[photoIndex];
					if(photo) {
						var image = 'http://farm'+photo.farm+'.static.flickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'.jpg';
						$('#image').css('backgroundImage','url('+image+')');
					}
					photoIndex++;
					if(photoIndex == photosCount) {
						window.clearInterval(Noise.photoInterval);
						rotatePhotos();
					}
				},500);
			});
			
		}
		
		rotatePhotos();
		
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
			var size = (50+((data.length/140) * 500));
			var fontSize = size+'px';
			var letterSpacing = ((data.length/140) * 10)+'px';
			var textTransform = data.count > 1 ? 'uppercase':'';
			var textDecoration = data.count > 2 || data.text.substr(0,4).toLowerCase() == 'fuck' ? 'underline':'';
			var fontWeight = data.count > 2 ? 'bold':'normal';
			
			var color = '#'+intToHex((data.length/140) * 16843008);
			
			var id = word.toLowerCase();
			$('#'+id+' .center').css({
				'fontSize' : fontSize,
				'textTransform' : textTransform,
				'textDecoration' : textDecoration,
				'fontWeight' : fontWeight,
				'color' : '#fff',
				'marginTop' : '-'+(size/2)+'px'
			});
			
			$('#'+id+' .tweet').text(data.text).css({
				'letterSpacing' : letterSpacing
			});
			
			/*$('#'+id+' .binary').text(toBin(data.text)).css({
				'letterSpacing' : letterSpacing
			});*/
			
			$('#'+id).css({
				'backgroundColor': color,
				'opacity' : (data.length/140)
			});
			
			
			
			
			/*
			 *
			 * Letters
			 *
			 */
			/*var maxLetterCount = 0;
			var stats = {};
			var letters = 'abcdefghijklmnopqrstuvwxyz';
			for(var i = 0; i < letters.length; i++) {
				var letter = letters[i];
				var count = stats[letter] = (data.text.toLowerCase().split(letter).length - 1);
				if(count > maxLetterCount) maxLetterCount = count;
			}
			
			for(var letter in stats) {
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