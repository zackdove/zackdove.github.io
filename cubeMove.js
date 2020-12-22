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
var cubeContainer = document.getElementById("cubeContainer");
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


