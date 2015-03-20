{
    init: function(elevators, floors) {
        // helper functions
        sendElevatorTo = function(floor) {
            // for now, send the first elevator
            elevators[0].goToFloor(floor);
        }

		manageDestinationQueue = function() {
			// Update destination queue, but only when the elevator is stopped at a floor
			//elevator.on("stopped_at_floor", function() {
				var currentFloor = elevator.currentFloor();
				var destinationFloors = [];
				var destinationFloors = elevator.destinationQueue;
				var shortestDistance = floors.length;
				
				console.log("currentFloor: " + currentFloor);
				console.log("destinationFloors: " + destinationFloors);
				
				// Abort if idle
				if (destinationFloors.length == 0) {
					return;
				}
				
				// Find unique floors in destination array for floorPress and elevatorPress				
				destinationFloors = destinationFloors.filter(function(item, index, inputArray) {
					return inputArray.indexOf(item) == index;
				});
					
				//Find the closest floor where we can do something	
				if (destinationFloors.length > 1 && elevator.loadFactor() < .75) {
					for (var i = 0; i < destinationFloors.length; i++) {
						distance = Math.abs(currentFloor - destinationFloors[i]);
						console.log("distance, toFloor: " + distance + ", " + destinationFloors[i])
						if (distance < shortestDistance) {
							var closestFloor = destinationFloors[i];
							shortestDistance = distance;
						}
					console.log("closestFloor: " + closestFloor)
					}
					
					//Push closestFloor to the front of the array
					if (closestFloor != currentFloor) {
						destinationFloors.unshift(closestFloor);
					}
					console.log("after closest destinationFloors: " + destinationFloors);	
					
					//Inefficiently filter again since we just added a dupe in the last step
					destinationFloors = destinationFloors.filter(function(item, index, inputArray) {
						return inputArray.indexOf(item) == index;
					});					
					console.log("after filter destinationFloors: " + destinationFloors);
					
					if (destinationFloors.length > 0) {
						elevator.destinationQueue = destinationFloors;
					}					
				}
								
				elevator.checkDestinationQueue();
				elevator.goToFloor(elevator.destinationQueue[0],true)

			//});
		}
					
        // elevator events
        for (var e = 0; e < elevators.length; e++) {
            var elevator = elevators[e];
            elevator.on("idle", function() {
                elevator.goToFloor(0)
            });
            elevator.on("floor_button_pressed", function(floor) {
                console.log("elevatorPress " + floor)
				elevator.goToFloor(floor);
				manageDestinationQueue();
            });
           
			elevator.on("passing_floor", function(floorNum, direction) { 
				if (floorNum.up_button_pressed = true) {
					//console.log("passing floor may work?")
				}
		   });
        }

        //floor events
        for (var f = 0; f < floors.length; f++) {
            var floor = floors[f];
            floor.on("up_button_pressed down_button_pressed", function() {
				console.log("floorPress " + this.floorNum())
                elevator.goToFloor(this.floorNum());
				manageDestinationQueue();
            });
        }
    },

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}