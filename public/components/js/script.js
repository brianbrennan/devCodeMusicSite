function showAlert(color){
	s('.' + color + 'Alert').addClass('active');
	setTimeout(function(){
		s('.' + color + 'Alert').removeClass('active');
	},3000);
}