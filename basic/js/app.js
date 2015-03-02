var printItems = function(response) {
	
	for (i in response.hits.hits) {
		var item = response.hits.hits[i]._source;

		var itemElem = $('<div class="col-xs-8 col-sm-4 col-md-3 col-lg-4 col-lg-height product" />')
			, itemImage = item.imagen ? item.imagen : 'https://dl.dropboxusercontent.com/u/3542/rockvinilo/default_disc.png'
		
		var grading = {}

		switch(item.estadocaratula) {
			case 'NUEVO':
			default:
				grading.cover = 'Sellado'; break;
			case '10':
			case '9':
				grading.cover = 'Como nuevo'; break;
			case '8':
				grading.cover = 'Excelente'; break;
			case '7':
				grading.cover = 'Muy buena'; break;
			case '6':
				grading.cover = 'Buena'; break;
			case '5':
				grading.cover = 'Regular'; break;
			case '4':
			case '3':
			case '2':
			case '1':
				grading.cover = 'Pobre'; break;
		}

		switch(item.estadodisco) {
			case 'NUEVO':
			default:
				grading.media = 'Nuevo'; break;
			case '10':
				grading.media = 'Tocado un par de veces'; break;
			case '9':
				grading.media = 'Como nuevo'; break;
			case '8':
				grading.media = 'Excelente'; break;
			case '7':
				grading.media = 'Muy bueno'; break;
			case '6':
				grading.media = 'Bueno'; break;
			case '5':
				grading.media = 'Regular'; break;
			case '4':
			case '3':
			case '2':
			case '1':
				grading.media = 'Pobre'; break;
		}

		console.log(item)

		var image = $('<img/>').attr('data-original', itemImage).addClass('cover').addClass('lazy')
		  , title = $('<span/>').text(item.album).addClass('title')
			, artist = $('<span/>').text(item.artista).addClass('artist')
			, price = $('<button/>').text(item.precio).addClass('btn btn-primary btn-info price')
									.attr('id', item.name)
									.attr('data-toggle', 'modal')
									.attr('data-target', '#myModal')
									.attr('data-image', itemImage)
									.attr('data-description', item.observaciones)
									.on('click', function(elem){
										$('#modalDesc').empty().html($(this).data('description'));
										$('#modalImg').attr('src', $(this).data('image'));
									})
			, gradeC = $('<span/>').text('Carátula: ' + grading.cover).addClass('grading')
			, gradeD = $('<span/>').text('Disco: ' + grading.media).addClass('grading')
		itemElem.append(image, title, artist, gradeD, gradeC, price)
		var list = $('#items ')

		list.append(itemElem);

		$("img.lazy").lazyload();

	}
}

var rockvinilo =  function() {

	var endpoint = 'https://www.rockvinilo.com/api/_search?q=disponibilidad:DISPONIBLE&size=1000&sort=artista:asc';

	$.ajax({
		url: endpoint,
		method: 'GET',
		success: printItems,
		error: function(err) {
			console.err(err)
		}
	});

}

$(document).ready(rockvinilo)


