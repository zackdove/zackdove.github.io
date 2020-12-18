function scrollToTop(){
	let elemId = "topContainer";
	console.log(elemId);
	var element_to_scroll_to = document.getElementById(elemId);
	element_to_scroll_to.scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	});
}

function scrollToBottom(){
	let elemId = "darkContainer";
	console.log(elemId);
	var element_to_scroll_to = document.getElementById(elemId);
	element_to_scroll_to.scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	});
}


