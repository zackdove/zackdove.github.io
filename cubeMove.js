var xN = 10, yN = 15;
var cubeContainer = document.getElementById("cube");
cubeContainer.addEventListener('mousedown',function(e){
	var cube = document.getElementById("cube");
	e.preventDefault();
	e.stopPropagation();
	var x = e.clientX;
	var y = e.clientY;
	cubeContainer.addEventListener('mousemove',move);
	cubeContainer.addEventListener('mouseup', up);
	function move(e){
		e.preventDefault();
		e.stopPropagation();
		var x1 = e.clientX;
		var y1 = e.clientY;
		xN += (x1 - x)*0.04;
		yN += (y1 - y)*0.04;
		cube.style.transform = 'translateZ(-150px) rotateY(' + xN + 'deg) rotateX(' + -yN + 'deg)';
		t_xN = ((xN % 360)+360)%360;
		t_yN = ((yN % 360)+360)%360;
		let album = whichAlbum(t_xN, t_yN);
	}
	function up(){
		cubeContainer.removeEventListener('mousemove', move);
	}
});

cubeContainer.addEventListener('touchstart',function(e){
	var cube = document.getElementById("cube");
	e.preventDefault();
	e.stopPropagation();
	var touches = e.changedTouches;
	console.log(touches);
	console.log(touches[0]);
	console.log(touches[0].clientX);
	var x = touches[0].screenX;
	var y = touches[0].screenY;
	cubeContainer.addEventListener("touchmove",handleMove);
	cubeContainer.addEventListener("touchend", handleEnd);
	function handleMove(e1){
		e1.preventDefault();
		e1.stopPropagation();
		var x1 = e1.touches[0].screenX;
		var y1 = e1.touches[0].screenY;
		xN += (x1 - x)*0.04;
		yN += (y1 - y)*0.04;
		cube.style.transform = 'translateZ(-150px) rotateY(' + xN + 'deg) rotateX(' + -yN + 'deg)';
		t_xN = ((xN % 360)+360)%360;
		t_yN = ((yN % 360)+360)%360;
		let album = whichAlbum(t_xN, t_yN);
		console.log(album);
		// console.log(cube.style.transform);
	}
	function handleEnd(e1){
		e1.preventDefault();
		cubeContainer.removeEventListener("touchmove",handleMove);
	}
	// document.addEventListener('mouseup', up);
	
	// function up(){
	// 	document.removeEventListener('mousemove', move);
	// }
});
// swap because they're passed in opposite
function whichAlbum(y, x){
	let albumBg = document.getElementById("albumBg");
	let albumTextContainer = document.getElementById("albumTextContainer");
	if (((y > 315 || y < 45) && (x > 315 || x < 45)) || ((y > 135 && y < 225) && ( x>135 && x < 225))){
		// A
		albumBg.style.setProperty("background-color", " rgb(126, 56, 130)");
		albumTextContainer.innerHTML = "<p>grimes</p><p><i>visions</i></p><p>2012</p>"
		return("front");
	}
	else if (225 < y && y < 315) {
		// B
		albumBg.style.setProperty("background-color", " rgb(56, 189, 15)");
		albumTextContainer.innerHTML = "<p>animal collective</p><p><i>merriweather post pavilion</i></p><p>2009</p>"
		return("right");
	} else if (((135 < y && y < 225) && (x > 315 || x < 45)) || ((y > 315 || y < 45) && ( 135 < x && x < 225))){
		albumBg.style.setProperty("background-color", " rgb(36, 164, 214)");
		albumTextContainer.innerHTML = "<p>radiohead</p><p><i>ok computer</i></p><p>1997</p>"
		return("back");
	} else if (45 < y && y < 135){
		albumBg.style.setProperty("background-color", " rgb(93, 107, 112)");
		albumTextContainer.innerHTML = "<p>burial</p><p><i>untrue</i></p><p>2007</p>"
		return("left");
	} else if (((y > 315 || y < 45) && (225 < x && x < 315)) || ((y > 135 && y < 225) && ( x>45 && x < 135))){
		albumBg.style.setProperty("background-color", " rgb(230, 199, 179)");
		albumTextContainer.innerHTML = "<p>arca</p><p><i>kick i</i></p><p>2020</p>"
		return("bottom");
	} else if (((y > 315 || y < 45) && (45 < x && x < 135)) || ((y > 135 && y < 225) && ( x>225 && x < 315))){
		albumBg.style.setProperty("background-color", " rgb(255, 0, 0)");
		albumTextContainer.innerHTML = "<p>primal scream & andrew weatherall</p><p><i>screamadelica</i></p><p>1991</p>"
		return("top");
	}
}
