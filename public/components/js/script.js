function showAlert(color){
	s('.' + color + 'Alert').addClass('active');
	setTimeout(function(){
		s('.' + color + 'Alert').removeClass('active');
	},3000);
}

function showModal(name){
	s('.modal-overlay').addClass('active');
}

function closeModal(name){
	s('.modal-overlay').removeClass('active');
}

function formStop(){
	event.stopPropagation();
}