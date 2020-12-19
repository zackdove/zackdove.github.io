var lightsOn = 0;
function toggleLights(){
	var lightsToggleLabel = document.getElementById("lightsToggleLabel");
	var darkContainer = document.getElementById("darkContainer");
	var spotlight = document.getElementById("spotlight");
	var spotlight_child = document.getElementById("spotlight-child");
	if (lightsOn == 1){
		// turn off
		console.log("turning lights off");
		lightsOn = 0;
		lightsToggleLabel.innerHTML = "turn the lights on";
		darkContainer.style.setProperty("background", "#222222");
		spotlight.style.setProperty("box-shadow", "0 0 0 10000px rgba(0, 0, 0, 1.0)")
		darkContainer.style.setProperty("color", "#00aa00");
		spotlight_child.style.setProperty("box-shadow", "inset 0px 0px 200px 75px rgba(0,0,0,1.0)");
		let gradientContainer = document.getElementById("gradientContainer2");
		gradientContainer.style.setProperty("background", "linear-gradient(180deg, rgba(30,106,195,1) 0%, black 100%)")
	} else {
		// turn on
		lightsOn = 1;
		console.log("turnjng lights on");
		lightsToggleLabel.innerHTML = "turn the lights off"
		darkContainer.style.setProperty("background", "rgb(41, 127, 150)");
		let gradientContainer = document.getElementById("gradientContainer2");
		gradientContainer.style.setProperty("background", "linear-gradient(180deg, rgba(30,106,195,1) 0%, rgb(41, 127, 150) 100%)")
		darkContainer.style.setProperty("color", "#EEEEEE");
		spotlight.style.setProperty("box-shadow", "none")
		spotlight_child.style.setProperty("box-shadow", "none")
	}
}