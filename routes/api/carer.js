/**
* RESTful API endpoints pertaining to a carer.
*/

(function(exports) {

  exports.init = function(app, models) {

    // Carer GET API
    app.get('/api/carer/:id', function(req, res) {
      var carerModel = models.carer;

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
      var carerModel = models.carer;

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
      var carerModel = models.carer;

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
      var carerModel = models.carer;

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
      res.json(req.user);
    });

    //Add patient to carer
    app.put('/api/carer/:carerId/patients', function(req, res) {
      var carerModel = models.carer;
      var patientModel = models.patient;

      console.log("body_patient "+req.query.patientId);
      console.log("params_carerId "+req.params.carerId);

      patientModel.find(Number(req.query.patientId), function(err, patient) {
        if (patient) {
          patient.updateAttributes({carer_id : Number(req.params.carerId)}, function(err, updatedPatientData) {
            carerModel.find(Number(req.params.carerId), function(err, carer) {
              if(carer){
                carer.updateAttributes({ patients:[140]}, function(err, updatedCarerData) {
                  res.status(200).send(updatedCarerData);
                });
              }else {
                res.status(404).end();
              }
            });
          });
        } else {
          res.status(404).end();
        }
      });
    });
  };
})(exports);
