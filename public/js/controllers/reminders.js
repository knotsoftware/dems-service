(function () {
  angular.module('DemS').controller("RemindersController", ['$scope', 'Session','Reminder','Enum', function($scope, Session, Reminder,Enum){
    var self = this;
    var calendarOptions = {
      theme: true,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      editable: true,
      selectable: true,
      displayEventEnd: {
        "default": false
      },
      timezone: "local",
      select: function(start, end, jsEvent, view) {
        // Change to the date selected and go to the day view
        if(view.name === "agendaDay"){
          self.openAddEvent(start);
        } else {
          self.calendar.fullCalendar('gotoDate', start);
          self.calendar.fullCalendar('changeView', 'agendaDay');
        }
      },
      eventClick: function(calEvent, jsEvent, view) {
        self.openEditReminderModal(calEvent.id);
      },

      timeFormat: "h:mma",

      eventDrop: function(calEvent, delta) {
        self.editEvent(calEvent, delta);
      }
    };

    $scope.reminders = [];
    self.reminder = {};
    self.levels = [];
    self.reminderModalTitle= "";

    self.init = function () {
      self.setLevels();

      $scope.$watch(function () { return Session.currentPatient; }, function (patient) {
        if (patient) {
          $scope.patient = patient;
          self.refreshReminders();
        }
      });

      $scope.$watch(function() { return Session.currentTab; }, function(tab) {
        if (tab == "reminders") {
          self.refreshReminders();
        }
      });


    };

    self.setLevels = function(){
      Enum.get("level_types",function(data){
        for(var index in data) {
          self.levels.push({id:parseInt(index), name:data[index]});
         }
         self.reminder.level = 0;
      });
    };

    self.saveReminder = function(){};
    self.addNewReminder = function(){
      self.reminder.time = self.reminder.timeAsDate.getTime();
      Reminder.save({id:$scope.patient.id}, self.reminder, function(message){
        self.refreshReminders();
      });
    };

    self.editReminder = function () {
      console.log("Edit event", self.reminder.id);
      self.reminder.time = self.reminder.timeAsDate.getTime();
      console.log(self.reminder);
      var updatedReminder = {
        level:self.reminder.level,
        time:self.reminder.time,
        name:self.reminder.name,
        type:self.reminder.type,
        message:self.reminder.message
      };
      Reminder.update({id:$scope.patient.id, reminderId:self.reminder.id},updatedReminder,function(message){
        self.refreshReminders();
      });
    };

    self.editReminderTime = function (calEvent) {
      console.log("Edit event time", calEvent.id);
      Reminder.update({id:$scope.patient.id, reminderId:self.getReminder(calEvent.id).id},
        {time: new Date(calEvent.start._i).getTime()},
        function(message){
          self.refreshReminders();
      });
    };

    self.removeReminder = function(){
      Reminder.delete({id:$scope.patient.id, reminderId:self.reminder.id}, function(message){
        self.refreshReminders();
      });
    };

    self.refreshReminders = function(){
      Reminder.getPatientsReminders({id:$scope.patient.id}, function(reminders){
        $scope.reminders = reminders;
        $scope.reminderEvents = self.getEventsFromReminders();
        self.reminder = {};
        self.initCalendar();
        self.reminder.level=0;
      });
    };

    self.getReminder = function (reminderId) {
      for (var i = 0, length = $scope.reminders.length; i < length; i++) {
        if ($scope.reminders[i].id === reminderId) {
          return $scope.reminders[i];
        }
      }
    };

    self.getEventsFromReminders = function () {
      var reminderEvents = [];

      for (var i = 0, length = $scope.reminders.length; i < length; i++) {
      /*
         * The default turns the events purple for
         * debugging purposes.
      */
      var statusColor = "pink";
      switch($scope.reminders[i].acknowledgement){
        case "none":
          statusColor = "orange";
          break;
        case "OK":
          statusColor = "green";
          break;
        case "Yes":
          statusColor = "green";
          break;
        case "No":
          statusColor = "red";
          break;
        case "Done":
          statusColor = "green";
          break;
        case "Not Done":
          statusColor = "red";
          break;
        /*
         * The default turns the events purple for
         * debugging purposes.
         */
        default:
          statusColor = "purple";
          break;
      }
        var reminderEvent = {
          id: $scope.reminders[i].id,
          title: $scope.reminders[i].name + " - " + $scope.reminders[i].message,
          start: new Date($scope.reminders[i].time),
          end: new Date($scope.reminders[i].time + 60 * 60000),
          durationEditable: false,
          color: statusColor
        };
        reminderEvents.push(reminderEvent);
      }

      return reminderEvents;
    };

    self.editEvent = function (calEvent, delta) {
      console.log("Edit event", calEvent);
      var reminder = self.getReminder(calEvent.id);
      var previousDate = new Date(reminder.time);

      var newTime = new Date(reminder.time).setMinutes(previousDate.getMinutes() + delta.asMinutes());

      Reminder.update({id:$scope.patient.id, reminderId:reminder.id},
        {time: newTime},
        function(message){
           //self.refreshReminders();
      });
    };

    self.openAddEvent = function(startDate) {
      self.reminder.timeAsDate = startDate.toDate();
      $scope.$apply();
      self.openAddReminderModal();
    };

    self.openAddReminderModal = function () {
      console.log("Opening Add Reminder Modal");
      self.reminderModalTitle = "Add new Reminder";
      self.saveReminder = self.addNewReminder;
      $("#reminderModal").modal('show');
    };

    self.openEditReminderModal = function (reminderId) {
      console.log("Opening Edit Reminder Modal");
      self.reminderModalTitle = "Edit Reminder";
      self.reminder = self.getReminder(reminderId);
      console.log(self.reminder);
      self.reminder.timeAsDate = new Date (self.reminder.time);
      self.saveReminder = self.editReminder;
      $scope.$apply();
      $("#reminderModal").modal('show');
    };

    self.closeReminderModal = function(){
      console.log(self.reminder);
      self.reminder = {};
      self.reminder.level=0;
    };

    self.initCalendar = function () {
      if(self.calendar === undefined) {
        self.calendar = $("#calendar").fullCalendar(calendarOptions);
      } else {
        self.calendar.fullCalendar('destroy');
        self.calendar = $("#calendar").fullCalendar(calendarOptions);
      }
      self.calendar.fullCalendar('addEventSource', $scope.reminderEvents);
    };

    self.init();
  } ] );
})();
