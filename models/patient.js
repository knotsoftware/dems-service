/**
 * Patient Schema and Model
 * Functionality for the Patient persistence.
 */

(function (exports) {
  'use strict';

  /**
   * Initialises model with given db settings.
   * @param  {object} settings  MongoDB adapter settings
   * @return {object}           JugglingDB model object
   */
  exports.init = function(settings) {
    var Reminder = require('./reminder.js').init(settings);
    var Activity = require('./activity.js').init(settings);
    var Schema = require('jugglingdb').Schema;
    var schemaMongo = new Schema('mongodb', settings);

    var Patient = schemaMongo.define('Patient', {
      gid : { type: String, index: true },
      token : { type: String },
      email : { type: String, limit: 150 },
      name: { type: String, limit: 50 },
      carer_id: {type: String},
      last_outside: {type: Boolean, default: false}
    });

    var Location = schemaMongo.define('Location', {
      longitude: { type: Number },
      latitude: { type: Number },
      timestamp: { type: Number, default: Date.now },
      patient_id: { type: Object }
    });

    var Fence = schemaMongo.define('Fence', {
      // array of objects: {longitude: Number, latitude: Number}
      // as given by google maps and consumed by geolib
      //fid: { type: Number, default: Date.now(), index: true },
      polygon: { type: Object, default: [] },
      name: { type: String },
      notifyCarer: { type: Boolean },
      patient_id: { type: Object }
    });

    // Model Relationships
    Patient.hasMany(Location, {as: 'locations', foreignKey: 'patient_id'});
    Patient.hasMany(Fence, {as: 'fences', foreignKey: 'patient_id'});
    Patient.hasMany(Reminder, {as: 'reminders', foreignKey: 'patient_id'});
    Patient.hasMany(Activity, {as: 'activities', foreignKey: 'patient_id'});

    return Patient;
  };

})(exports);
