



const imagePaths = []
for (i = 0; i<10; i++){
	imagePaths.push("graphics/desktopRender/000"+i.toString(10)+".png")
}
for (i = 10; i<=48; i++){
	imagePaths.push("graphics/desktopRender/00"+i.toString(10)+".png")
}

var images = new Array();
var topContainer = document.getElementById("topContainer");
var imagesLoaded = 0;
function preload() {
	// Show the first one
	
	for (i = 0; i < imagePaths.length; i++) {
		let image = document.createElement("img");
		image.onload = function(){
			imagesLoaded++;
		}
		console.log(imagePaths[i]);
		image.src = imagePaths[i];
		image.id = i;
		// let imageContainer = document.createElement("div");
		image.classList.add("imageMain");
		topContainer.appendChild(image);
	}
	console.log("images loaded = "+imagesLoaded);
	
}
preload(
	imagePaths
)
// console.log(images);

var xFraction = 0.5;
var yFraction = 0.5;
var oldIndex = 0;
if (imagesLoaded = 49){
	let firstImg = document.getElementById('24');
	firstImg.style.setProperty("display", "block");
	let topContainer = document.getElementById("topContainer");
	topContainer.classList.remove("rainbowLoad");
	let loadingMessage = document.getElementById("loadingMessage");
	// loadingMessage.remove();
	loadingMessage.innerHTML = "loaded";
	oldIndex=24;
	onmousemove = function(e){
		// console.log("mouse location:", e.clientX, e.clientY);
		let xFraction = e.clientX/window.innerWidth;
		let yFraction = e.clientY/window.innerHeight;
		let index = Math.round((xFraction * 48) + (yFraction * 48));
		console.log(index);
		if (index > 48){
			index = 96 - index;
		}
		if (index != oldIndex){
			// console.log("mouse index= ", index);
			// $('.mainContainer').css('background-image', `url('${imagePaths[index]}')`);
			let nextImg = document.getElementById(index);
			nextImg.style.setProperty("display", "block");
			let oldImg = document.getElementById(oldIndex);
			oldImg.style.setProperty("display", "none");
			oldIndex = index;
		}
	}
}



// /
const spotlight = document.getElementById("spotlight");
const spotlight_child = document.getElementById("spotlight-child");
const darkContainer = document.getElementById("darkContainer");
darkContainer.addEventListener("mousemove", moveSpotlight);
darkContainer.addEventListener("touchmove", moveSpotlight);
function moveSpotlight(e) {
	let pos, x, y;
	e.preventDefault();
	x = e.clientX - 200;
	y = e.clientY - 200;
	spotlight.style.left = x + "px";
	spotlight.style.top = y + "px";
	spotlight_child.style.left = x + "px";
	spotlight_child.style.top = y + "px";
	if (lightsOn){
		console.log("lighhts on");
		let red = (e.clientX/window.innerWidth)*235;
		let green = 40+((e.clientY/window.innerHeight)*195)
		darkContainer.style.setProperty("background", "rgb("+red+","+green+",150)");
		let gradientContainer = document.getElementById("gradientContainer");
		gradientContainer.style.setProperty("background", "linear-gradient(180deg, rgba(209,211,255,1) 0%, rgba(30,106,195,1) 55%, rgb("+red+","+green+",150) 100%)")
		
	}
}