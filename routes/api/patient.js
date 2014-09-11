/**
 * RESTFUL API routes realting to the Patient Model
 */

(function(exports) {
  'use strict';

  exports.init = function(app, models) {

    var patientModel = models.patient;

    // Patient GET API
    app.get('/api/allPatients', function(req, res) {
      patientModel.all({},function(err, data) {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(404).end();
        }
      });
    });

    // Patient GET API
    app.get('/api/patient/:id', function(req, res) {
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

    //Patient CREATE API
    app.post('/api/patient', function(req, res) {
      patientModel.create(req.body, function(err, data) {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(400).end();
        }
      });
    });

    //Patient DELETE API
    app.delete('/api/patient/:id', function(req, res) {

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.destroy();
          res.status(200).end();
        } else {
          res.status(404).end();
        }
      });
    });

    // Location GET API
    app.get('/api/patient/:id/locations', function(req, res) {
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
      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          req.body.patient_id = Number(req.params.id);
          data.locations.create(req.body, function(err, locations) {
            res.status(200).send(locations);
          });
        } else {
          res.status(404).end();
        }
      });

    });

    // Fence GET API
    app.get('/api/patient/:id/fence', function(req, res) {
      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.fences(function(err, fences) {
            res.status(200).send(fences);
          });
        } else {
          res.status(404).end();
        }
      });

    });

    //Fence CREATE API
    app.post('/api/patient/:id/fence', function(req, res) {
      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          req.body.patient_id = Number(req.params.id);
          data.fences.create(req.body, function(err, fences) {
            res.status(200).send(fences);
          });
        } else {
          res.status(404).end();
        }
      });

    });


    //Fence UPDATE API
    app.put('/api/patient/:id/fence/:fid', function(req, res) {
      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.fences.find(req.params.fid, function(err, fences) {
            if(fences) {
              fences.updateAttributes(req.body);
              res.status(200).send(fences);
            } else {
              res.status(404).end();
            }
          });
        } else {
          res.status(404).end();
        }
      });

    });

    //Fence DELETE API
    app.delete('/api/patient/:id/fence/:fid', function(req, res) {
      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.fences.find(req.params.fid, function(err, fences) {
            if(fences) {
              fences.destroy();
              res.status(200).end();
            } else {
              res.status(404).end();
            }
          });
        } else {
          res.status(404).end();
        }
      });

    });


  };

})(exports);