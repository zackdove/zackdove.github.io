





function moveSpotlight(e) {
	let pos, x, y;
	e.preventDefault();
	x = e.clientX;
	y = e.clientY;

	let red = (e.clientX/window.innerWidth)*235;
	let green = 40+((e.clientY/window.innerHeight)*195)
	darkContainer.style.setProperty("background", "rgb("+red+","+green+",150)");
	let gradientContainer = document.getElementById("gradientContainer2");
	gradientContainer.style.setProperty("background", "linear-gradient(180deg, rgba(30,106,195,1) 0%, rgb("+red+","+green+",150) 100%)")
	
}

// /

const darkContainer = document.getElementById("darkContainer");
let mouseQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
if (mouseQuery.matches){
	darkContainer.addEventListener("mousemove", moveSpotlight);
} else {
	
}

