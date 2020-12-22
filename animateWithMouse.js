



const landscapePaths = []
const portraitPaths = []
for (i = 0; i<10; i++){
	landscapePaths.push("graphics/jpgDesktopRender/000"+i.toString(10)+".jpg")
	portraitPaths.push("graphics/mobileRender/000"+i.toString(10)+".jpg")
}
for (i = 10; i<=48; i++){
	landscapePaths.push("graphics/jpgDesktopRender/00"+i.toString(10)+".jpg")
	portraitPaths.push("graphics/mobileRender/00"+i.toString(10)+".jpg")
}

var landscapeQuery = window.matchMedia("(orientation: landscape)");

var images = new Array();
var imagesContainer = document.getElementById("imagesContainer");
var imagesLoaded = 0;
var imagePaths = [];
function preload() {
	// Show the first one
	
	if (landscapeQuery.matches){
		imagePaths = landscapePaths;
	} else {
		imagePaths = portraitPaths;
	}
	for (i = 0; i < imagePaths.length; i++) {
		let image = document.createElement("img");
		console.log(imagePaths[i]);
		image.src = imagePaths[i];
		image.setAttribute("onload", "incrementLoaded()")
		image.id = i;
		// let imageContainer = document.createElement("div");
		image.classList.add("imageMain");
		imagesContainer.appendChild(image);
	}
	console.log("images loaded = "+imagesLoaded);
	
}
preload(
	imagePaths
)
// console.log(images);
var xFraction = 0.5;
var yFraction = 0.5;


function incrementLoaded(){
	imagesLoaded++;
	if (imagesLoaded == 49){
		let firstImg = document.getElementById('24');
		firstImg.style.setProperty("display", "block");
		let topContainer = document.getElementById("topContainer");
		topContainer.classList.remove("rainbowLoad");
		let loadingMessage = document.getElementById("loadingMessage");
		// loadingMessage.remove();
		loadingMessage.innerHTML = "loaded";
		// checking whether touch or mouse
		let mouseQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
		if (mouseQuery.matches){
			// If mouse, not touchh
			var oldIndex = 24;
			// oldIndex=24;
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
					// $('.mainContainer').css('background-image', `url('${landscapePaths[index]}')`);
					let nextImg = document.getElementById(index);
					nextImg.style.setProperty("display", "block");
					let oldImg = document.getElementById(oldIndex);
					oldImg.style.setProperty("display", "none");
					oldIndex = index;
				}
			}
		} else {
			// if touch
			var index = 0;
			var t_index = 0;
			window.setInterval(function(){
				// workaround since we cant have a for loop with a wait
				
				console.log(t_index);
				// console.log(index);
				if (index > 48){
					t_index = 96-index;
				} else {
					t_index = index;
				}
				let oldImg = document.getElementById(t_index);
				if (index < 95){
					index++;
				}
				else {
					index = 0;
				}
				if (index > 48){
					t_index = 96-index;
				} else {
					t_index = index;
				}
				
				let nextImg = document.getElementById(t_index);
				
				oldImg.style.setProperty("display", "none");
				nextImg.style.setProperty("display", "block");
			}, 41)
		}
	}
}



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
		let gradientContainer = document.getElementById("gradientContainer2");
		gradientContainer.style.setProperty("background", "linear-gradient(180deg, rgba(30,106,195,1) 0%, rgb("+red+","+green+",150) 100%)")
		
	}
}

// /
const spotlight = document.getElementById("spotlight");
const spotlight_child = document.getElementById("spotlight-child");
const darkContainer = document.getElementById("darkContainer");
let mouseQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
if (mouseQuery.matches){
	darkContainer.addEventListener("mousemove", moveSpotlight);
} else {
	
}

