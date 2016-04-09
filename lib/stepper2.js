var stepperInterface = {
  init: function(Five) {
    var heightStepper = new Five.Stepper({
      type: five.Stepper.TYPE.DRIVER,
  		stepsPerRev: 200,
      pins: {
        step: 32,
        dir: 33
      }
    });

    var panStepper = new Five.Motor({
      pins: {
        dir: 28,
        step: 27
      }
    });

    var tiltStepper = new Five.Motor({
      pins: {
        dir: 26,
        step: 25
      }
    });

    var motorConfig = {
      panHeadLeft: {
        stepper: stepperInterface.panStepper,
        direction: 'ccw'
      },
      panHeadRight: {
        stepper: stepperInterface.panStepper,
        direction: 'cw'
      },
      tiltHeadBack: {
        stepper: stepperInterface.tiltStepper,
        direction: 'ccw'
      },
      tiltHeadFwd: {
        stepper: stepperInterface.tiltStepper,
        direction: 'cw'
      },
      heightHeadUp: {
        stepper: stepperInterface.heightStepper,
        direction: 'ccw'
      },
      heightHeadDown: {
        stepper: stepperInterface.heightStepper,
        direction: 'cw'
      }
    };

    for (var command in motorConfig) {
      if (motorConfig.hasOwnProperty(command)) {
        motorConfig[command].mActive = false;
        motorConfig[command].jfActive = false;

        this[command] = function() {
          motorConfig[command].mActive = true;

          if (!motorConfig[command].jfActive) {
            var direction = motorConfig[command].direction === 'ccw' ? 1 : 0;
            motorConfig[command].jfActive = true;

            motorConfig[command].stepper.step({
              steps: 1,
              direction: direction
            }, function() {
              motorConfig[command].jfActive = false;
              this[command]();
            }.bind(this));
          }
        };
      }
    }

    this.stop = function() {
      for (var command in motorConfig) {
        if (motorConfig.hasOwnProperty(command)) {
          motorConfig[command].mActive = false;
        }
      }
    };
  }
};



return stepperInterface;
