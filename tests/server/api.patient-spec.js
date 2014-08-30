describe('DemS API /patient', function() {
  var settings = require('../../dems.conf.json'),
      patientModel = require('../../models/patient.js').init(settings.db.mongoTest),
      request = require('supertest');
      request = request('http://localhost:3000');

  var patient22 = { id: 22, token: "firstkey", email: "someone@something.com", name: "Generic Bob", latitude: -27.4771, longitude: 153.0280 },
      patient8889 = {id: 8889, token: "myticket", email: "janedoe@gmail.com", name: "Jane", latitude: -35.8823, longitude: 160.2221 };

  beforeEach(function() {
       patientModel.create(patient22);

    patientModel.create(patient8889);

  });

  afterEach(function(done) {
    patientModel.destroyAll(function(data) {
      patientModel.count(function(err, count) {
        expect(count).toBe(0);
        done();
      });
    });
  });

  it('GET valid patients', function() {
    request.get('/api/patient/:22').expect(200, patient22);
    request.get('/api/patient/:8889').expect(200, patient8889);

  });

  it('GET status 404 for invalid patient', function() {
    request.get('/api/patient/:007').expect(404);
  });

  it('PUT for valid patient', function() {
    var update = { latitude: 55, longitude: 80 };
    var updatedPatient22 = patient22;
    updatedPatient22.latitude = 55;
    updatedPatient22.longitude = 80;

    request.put('/api/patient/:22').expect(200, updatedPatient22);
  });

  it('PUT 404 for invalid patient', function() {
    var update = { latitude: 55, longitude: 80 };
    request.put('/api/patient/:007').expect(404);
  });

  it('POST a new patient', function() {
    var newPatient = { id: 7, token: 'licensetokill', email: 'agent007@MI6.gov.uk', name: 'James Bond', latitude: 51.5286416, longitude: -0.1015987 };

    request.post('/api/patient').send(newPatient).expect(200, newPatient);
  });

});
