!function(){

	$('.search')

		.children('button')
		
		.on('click', () => {

			let partern = $('.search').children('input').val();

			window.location.href = `/home/album?search=${partern}`

		})

}()