var getYelp = function() {
    newNonce = function() {
        return (Math.floor(Math.random() * 1e9).toString());
    };

    timestamp = function() {
        return Math.floor((new Date).getTime() / 1e3);
    };

    var httpMethod = 'GET',
    url = 'http://api.yelp.com/v2/search?',
    parameters = {
        oauth_consumer_key : 'pbgEiH-pMbycTGcDENnrTw',
        oauth_token : 'mGh9RGiZrOdMALoWyjLwzyxcccxYE1QH',
        oauth_nonce : newNonce(),
        oauth_timestamp : timestamp(),
        oauth_signature_method : 'HMAC-SHA1',
        oauth_version : '1.0',
        term: 'Texas Spice',
        location: 'Texas',
        callback: 'cb',
        limit: 1
    },
    consumerSecret = 'fr3ZPEoHO2o404uW-byRoIhxw7I',
    tokenSecret = 'YGTSJNfAOSu7aRc2YUk90FsmsyU',
    // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
    signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);

    // parameters.oauth_signature = oauthSignerOld(parameters);
    parameters.oauth_signature = signature;

    // Set up the ajax settings
    var ajaxSettings = {
        url: url,
        data: parameters,
        cache: true,
        dataType: 'jsonp',
        success: function(response) {
            // Update the infoWindow to display the yelp rating image
            // $('#yelp').attr("src", response.businesses[0].rating_img_url);
            // $('#yelp-url').attr("href", response.businesses[0].url);
            $('#yelp').append(response[0]);
            console.log(response.businesses[0].snippet_text);
        },
        error: function(response) {
            // $('#text').html('Data could not be retrieved from yelp.');
            console.log("no funciono" + response[0]);
        }
    };

    // Send off the ajax request to Yelp
    $.ajax(ajaxSettings);
};

getYelp();
