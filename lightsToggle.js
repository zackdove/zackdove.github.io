var on = 0;
function toggleLights(){
	var lightsToggleLabel = document.getElementById("lightsToggleLabel");
	var darkContainer = document.getElementById("darkContainer");
	var spotlight = document.getElementById("spotlight");
	var spotlight_child = document.getElementById("spotlight-child");
	if (on == 1){
		// turn off
		console.log("turning lights off");
		on = 0;
		lightsToggleLabel.innerHTML = "turn the lights on";
		darkContainer.style.setProperty("background", "linear-gradient(45deg, #010,#333,#010)");
		spotlight.style.setProperty("box-shadow", "0 0 0 10000px rgba(0, 0, 0, 1.0)")
		spotlight_child.style.setProperty("box-shadow", "inset 0px 0px 200px 75px rgba(0,0,0,1.0)")
	} else {
		// turn on
		on = 1;
		console.log("turnjng lights on");
		lightsToggleLabel.innerHTML = "turn the lights off"
		darkContainer.style.setProperty("background", "#FFFFFF");
		spotlight.style.setProperty("box-shadow", "none")
		spotlight_child.style.setProperty("box-shadow", "none")
	}
}