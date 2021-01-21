var lightsOn = 0;
setTimeout(toggleLights, 1000*10);
function toggleLights(){
	let mouseQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
	if (mouseQuery.matches){
		var lightsToggleLabel = document.getElementById("lightsToggleLabel");
		var darkContainer = document.getElementById("darkContainer");
		var spotlight = document.getElementById("spotlight");
		var spotlight_child = document.getElementById("spotlight-child");
		if (lightsOn == 0){
			// turn on
			lightsToggleLabel.remove();
			lightsOn = 1;
			console.log("turnjng lights on");
			darkContainer.style.setProperty("background", "rgb(41, 127, 150)");
			let gradientContainer = document.getElementById("gradientContainer2");
			gradientContainer.style.setProperty("background", "linear-gradient(180deg, rgba(30,106,195,1) 0%, rgb(41, 127, 150) 100%)")
			darkContainer.style.setProperty("color", "#EEEEEE");
			spotlight.remove();
		}
	}
}