/**
 * RESTful API routes used by client apps, serving json.
 */

(function(exports) {
  "use strict";

  /**
   * Intialises declared API routes.
   */
  exports.init = function(app) {

    /******************************/
    /* PATIENTS                   */
    /******************************/

    // Patient GET API
    app.get('/api/patient/:id', function(req, res) {
      var patientModel = require('../models').patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(404).end();
        }
      });

    });

    // Patient UPDATE API
    app.put('/api/patient/:id', function(req, res) {
      var patientModel = require('../models').patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.updateAttributes(req.body, function(err, data) {
            res.status(200).send(data);
          });
        } else {
          res.status(404).end();
        }
      });
    });

    // Patient CREATE API
    app.post('/api/patient', function(req, res) {
      var patientModel = require('../models').patient;

      patientModel.create(req.body, function(err, data) {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(400).end();
        }
      });
    });

    // Patient DELETE API
    app.delete('/api/patient/:id', function(req, res) {
      var patientModel = require('../models').patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.destroy();
          res.status(200).end();
        } else {
          res.status(404).end();
        }
      });
    });

    /******************************/
    /* CARER                      */
    /******************************/

    // Carer GET API
    app.get('/api/carer/:id', function(req, res) {
      var carerModel = require('../models').carer;

      carerModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(404).end();
        }
      });
    });

    // Carer UPDATE API
    app.put('/api/carer/:id', function(req, res) {
      var carerModel = require('../models').carer;

      carerModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.updateAttributes(req.body, function(err, data) {
            res.status(200).send(data);
            });
        } else {
          res.status(404).end();
        }
      });
    });

    // Carer CREATE API
    app.post('/api/carer', function(req, res) {
      var carerModel = require('../models').carer;

      carerModel.create(req.body, function(err, data) {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(400).end();
        }
      });
    });

    // Carer DELETE API
    app.delete('/api/carer/:id', function(req, res) {
      var carerModel = require('../models').carer;

      carerModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.destroy();
          res.status(200).end();
        } else {
          res.status(404).end();
        }
      });
    });

    // Carer GET CURRENT API
    app.get('/api/currentCarer', function(req, res) {
      res.json(req.user)
    });

    /******************************/
    /* PATIENT LOCATIONS          */
    /******************************/
    // Location GET API
    app.get('/api/patient/:id/locations', function(req, res) {
      var patientModel = require('../models').patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.locations(function(err, locations) {
            res.status(200).send(locations);
          });
        } else {
          res.status(404).end();
        }
      });
    });

    // Location CREATE API
    app.post('/api/patient/:id/locations', function(req, res) {
      var patientModel = require('../models').patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.locations.create(req.body, function(err, locations) {
            res.status(200).send(locations);
          });
        } else {
          res.status(404).end();
        }
      });
    });

    /******************************/
    /* RANDOM                     */
    /******************************/

    // Example api endpoint
    app.get('/api/carer/:thing', function(req, res) {
      switch(req.params.thing) { // given the params are X

        case 'me': // do Y
          res.json({
            name: 'Mary'
          });
          break;

        case 'patients': // or Z
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
    });

  }; // end init

})(exports);
