var xFraction = 0.5;
var oldIndex = 0;

onmousemove = function(e){
	// console.log("mouse location:", e.clientX, e.clientY);
	let xFraction = e.clientX/window.innerWidth;
	
	let index = Math.round(xFraction * 48);
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

const imagePaths = []
for (i = 0; i<10; i++){
	imagePaths.push("graphics/desktopRender/000"+i.toString(10)+".png")
}
for (i = 10; i<=96; i++){
	imagePaths.push("graphics/desktopRender/00"+i.toString(10)+".png")
}

var images = new Array();
var topContainer = document.getElementById("topContainer");

function preload() {
	// Show the first one
	let image = document.createElement("img");
	console.log(imagePaths[0]);
	image.src = imagePaths[0];
	image.id = 0;
	// let imageContainer = document.createElement("div");
	image.classList.add("imageMain");
	image.style.setProperty("display", "block");
	topContainer.appendChild(image);

	for (i = 1; i < imagePaths.length; i++) {
		let image = document.createElement("img");
		console.log(imagePaths[i]);
		image.src = imagePaths[i];
		image.id = i;
		// let imageContainer = document.createElement("div");
		image.classList.add("imageMain");
		topContainer.appendChild(image);
	}
	
}
preload(
	imagePaths
)
// console.log(images);



