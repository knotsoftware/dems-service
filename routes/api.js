/*
 * ALL HTTP-method routes for DemS RESTful API, serving json.
 */

// Example api endpoint
exports.carerThing = function(req, res){
  switch(req.params.thing) {
    
    case 'me':
      res.json({
        name: 'Mary'
      });
      break;

    case 'patients':
      res.json({
        patients: [
          {
            name: 'Barry',
            location: {
              lng: -14.87297349,
              lat: -34.8273648
            }
          }
        ]
      });
      break;
  }
};