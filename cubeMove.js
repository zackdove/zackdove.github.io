var xN = 10, yN = 15;
document.addEventListener('mousedown',function(e){
	var cube = document.getElementById("cube");
	e.preventDefault();
	e.stopPropagation();
	var x = e.clientX;
	var y = e.clientY;
	document.addEventListener('mousemove',move);
	document.addEventListener('mouseup', up);
	function move(e){
		e.preventDefault();
		e.stopPropagation();
		var x1 = e.clientX;
		var y1 = e.clientY;
		xN += (x1 - x)*0.04;
		yN += (y1 - y)*0.04;
		cube.style.transform = 'translateZ(-150px) rotateY(' + xN + 'deg) rotateX(' + -yN + 'deg)';
	}
	function up(){
		document.removeEventListener('mousemove', move);
	}
});
var cubeContainer = document.getElementById("cube");
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
		albumTextContainer.innerHTML = "grimes</br><i>visions</i></br>2012"
		return("front");
	}
	else if (225 < y && y < 315) {
		// B
		albumBg.style.setProperty("background-color", " rgb(56, 189, 15)");
		albumTextContainer.innerHTML = "animal collective</br><i>merriweather post pavilion</i></br>2009"
		return("right");
	} else if (((135 < y && y < 225) && (x > 315 || x < 45)) || ((y > 315 || y < 45) && ( 135 < x && x < 225))){
		albumBg.style.setProperty("background-color", " rgb(36, 164, 214)");
		albumTextContainer.innerHTML = "radiohead</br><i>ok computer</i></br>1997"
		return("back");
	} else if (45 < y && y < 135){
		albumBg.style.setProperty("background-color", " rgb(93, 107, 112)");
		albumTextContainer.innerHTML = "burial</br><i>untrue</i></br>2007"
		return("left");
	} else if (((y > 315 || y < 45) && (225 < x && x < 315)) || ((y > 135 && y < 225) && ( x>45 && x < 135))){
		albumBg.style.setProperty("background-color", " rgb(230, 199, 179)");
		albumTextContainer.innerHTML = "arca</br><i>kick i</i></br>2020"
		return("bottom");
	} else if (((y > 315 || y < 45) && (45 < x && x < 135)) || ((y > 135 && y < 225) && ( x>225 && x < 315))){
		albumBg.style.setProperty("background-color", " rgb(255, 0, 0)");
		albumTextContainer.innerHTML = "primal scream & andrew weatherall</br><i>screamadelica</i></br>1991"
		return("top");
	}
}
