var request = require('request')
	,	es_uri = 'http://127.0.0.1:9200/rockvinilo/items/'
	, GoogleSpreadsheet = require("google-spreadsheet")
	, docKey = '1EC8NZDPhSdWlpxqZL5jPhZTyNIR3ljWY0d7x-f402VM'
	// , docKey = '1-G7EHiqh2GMekqoLiBDha4A4LasQwb3Mi3Eq78rDKXY'
	, my_sheet = new GoogleSpreadsheet(docKey);

my_sheet.getRows( 1, function(err, row_data){

	console.log('ERR?',err)

  for (key in row_data) {
		var doc = row_data[key];
		doc.updated = doc._xml.match(/<updated>(.*)<\/updated>/)[1]
		delete doc._xml;
		delete doc._links;
		delete doc.save;
		delete doc.del;
		delete doc.title;
		delete doc.content;
		var id_arr = doc.id.split('/')
		doc.name = id_arr[id_arr.length - 1]
		delete doc.id;
		var  cfg = {
			uri: es_uri + doc.name,
			method: 'POST',
			json: true,
			body: doc
		}

		request(cfg, callback.es_insert)

	}

	// response.total = response.items.length;

	// console.log(response)

})

var callback = {
	es_insert: function(err, response, body){
		if (err) 
			console.log(err);
		console.log('RESPONSE:', response.body);		
	}
}