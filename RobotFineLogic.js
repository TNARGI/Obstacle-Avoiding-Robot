//window.onload= function (){


//// Setting up background 'canvas'
var paper = new Raphael(0, 0, 1200, 600);
var backGround = paper.rect(0, 0, 1200, 600);

//// Creating robot
var robotStartX = 220; // changed from 220
var robotStartY = 320; // changed from 320
var robot = paper.circle(robotStartX, robotStartY, 10);
robot.cx = robot.getBBox().x + (robot.getBBox().width / 2); // Robot centre x
robot.cy = robot.getBBox().y + (robot.getBBox().height / 2); // Robot centre y

//// Declare sensor variables
var rightSensor1, leftSensor1,
    rightSensor2, leftSensor2,
    rightSensor3, leftSensor3,
    rightSensor4, leftSensor4,
    rightSensor5, leftSensor5,
    rightSensor6, leftSensor6;

//// Declare sensor array
sensors = [];

//// Declare obstacle proximities
var leftProximity = 100;
var rightProximity = 100;
var obstacleLocation = null;
var collisionCounter = 0;

//// Declare obstacle array
var obstacles = [];
addObstacles();


////// Differential drive variables
var mL = 5;
var mR = 5;
var xI = robotStartX;
var yI = robotStartY;
var thetaI = 0 * Math.PI;
var thetaIDot = ((mL - mR) / (2 * robot.attr("r")));
var deltaT = 3.5;
var phi1 = 25 * (Math.PI/180);
var phi2 = (-25) * (Math.PI/180);


// Seeded random number generator
Math.seed = 6;
Math.seededRandom = function (min, max)
{
  max = max || 1;
  min = min || 0;

  Math.seed = (Math.seed * 9301 + 49297) % 233280;
  var rnd = Math.seed / 233280;
  return min + rnd * (max - min);
}


// Drive function - distance proportional to number of iterations
function drive(iterations)
{
  for(var i=0; i<iterations; i++)
  {
    // Check if robot has crashed
    for(var j=0; j<obstacles.length; j++)
    {
      if(isCollide(robot, obstacles[j]))
      {
        //console.log(":::::: CRASH ::::::")
        collisionCounter += 1;
        var crashSite = paper.circle(xI, yI, 5).attr({fill: "orange"});
        robot.translate(robotStartX - xI, robotStartY - yI);

        // Randomise the initial motor outputs after crash to diversify movement
        mL = Math.floor(Math.seededRandom(-5,5.9999999999));
        mR = Math.floor(Math.seededRandom(-5,5.9999999999));

        xI = robotStartX;
        yI = robotStartY;
        thetaI = 0 * Math.PI;
        thetaIDot = ((mL - mR) / (2 *robot.attr("r")));
      }
    }


    // Update robot location
    var xIPlusOne = xI + ((((mL + mR) / 2) * Math.cos(thetaI)) * deltaT);
    var yIPlusOne = yI + ((((mL + mR) / 2) * Math.sin(thetaI)) * deltaT);
    var thetaIPlusOne = thetaI + (((mL - mR) / (2 *robot.attr("r"))) * deltaT);

    // Move robot to new location
    robot.translate(xIPlusOne - xI, yIPlusOne - yI);

    // Place a small circle to show robot movement trail
    paper.circle(xIPlusOne, yIPlusOne, 0.5).attr({ fill: "orange"});

    // Update current location
    xI = xIPlusOne;
    yI = yIPlusOne;
    thetaI = thetaIPlusOne;

    // Set new sensor coordinates
    rightSensor1 = [xI + (20*Math.cos(phi1+thetaI)), yI + (20*Math.sin(phi1+thetaI))];
    leftSensor1 = [xI + (20*Math.cos(phi2+thetaI)), yI + (20*Math.sin(phi2+thetaI))];
    rightSensor3 = [xI + (40*Math.cos(phi1+thetaI)), yI + (40*Math.sin(phi1+thetaI))];
    leftSensor3 = [xI + (40*Math.cos(phi2+thetaI)), yI + (40*Math.sin(phi2+thetaI))];
    rightSensor5 = [xI + (60*Math.cos(phi1+thetaI)), yI + (60*Math.sin(phi1+thetaI))];
    leftSensor5 = [xI + (60*Math.cos(phi2+thetaI)), yI + (60*Math.sin(phi2+thetaI))];
    rightSensor7 = [xI + (80*Math.cos(phi1+thetaI)), yI + (80*Math.sin(phi1+thetaI))];
    leftSensor7 = [xI + (80*Math.cos(phi2+thetaI)), yI + (80*Math.sin(phi2+thetaI))];

    // Refresh sensor array
    sensors = [
      rightSensor1, leftSensor1,
      rightSensor3, leftSensor3,
      rightSensor5, leftSensor5,
      rightSensor7, leftSensor7
    ];


    // Reset obstacle proximities
    leftProximity = 100;
    rightProximity = 100;



    // Check if sensors have detected an obstacle
    for (k=0; k<sensors.length; k++)
    {
      // Assess obstacle proximities
      determineObstacleProximity(leftProximity, rightProximity);

      for (l=0; l<obstacles.length; l++)
      {
          if(isCollidePoint(obstacles[l], sensors[k]))
          {
            if(k%2 == 0) // Obstacle detected by right sensors
            {
              setRightProximity(Math.floor(k/2));
            }
            if(k%2 == 1) // Obstacle detected by left sensors
            {
              setLeftProximity(Math.floor(k/2));
            }

            // Draw a green cirlce at the point of obstacle detection
            //paper.circle(sensors[k][0],sensors[k][1],5).attr({fill:"green"});
          }
      }
    }
  }
} // End of drive()
drive(4000);



//// Re-place sensor trails at the end of movement
var rightSensor1 = paper.circle(xI + (20*Math.cos(phi1+thetaI)), yI + (20*Math.sin(phi1+thetaI)), 3).attr({fill: "purple"});
var leftSensor1 = paper.circle(xI + (20*Math.cos(phi2+thetaI)), yI + (20*Math.sin(phi2+thetaI)), 3).attr({fill: "purple"});
var rightSensor3 = paper.circle(xI + (40*Math.cos(phi1+thetaI)), yI + (40*Math.sin(phi1+thetaI)), 3).attr({fill: "purple"});
var leftSensor3 = paper.circle(xI + (40*Math.cos(phi2+thetaI)), yI + (40*Math.sin(phi2+thetaI)), 3).attr({fill: "purple"});
var rightSensor5 = paper.circle(xI + (60*Math.cos(phi1+thetaI)), yI + (60*Math.sin(phi1+thetaI)), 3).attr({fill: "purple"});
var leftSensor5 = paper.circle(xI + (60*Math.cos(phi2+thetaI)), yI + (60*Math.sin(phi2+thetaI)), 3).attr({fill: "purple"});
var rightSensor7 = paper.circle(xI + (80*Math.cos(phi1+thetaI)), yI + (80*Math.sin(phi1+thetaI)), 3).attr({fill: "purple"});
var leftSensor7 = paper.circle(xI + (80*Math.cos(phi2+thetaI)), yI + (80*Math.sin(phi2+thetaI)), 3).attr({fill: "purple"});


// Check if 2 objects are colliding
function isCollide(a, b)
{
  return !(
    ((a.getBBox().y + a.getBBox().height) < (b.getBBox().y)) ||
    (a.getBBox().y > (b.getBBox().y + b.getBBox().height)) ||
    ((a.getBBox().x + a.getBBox().width) < b.getBBox().x) ||
    (a.getBBox().x > (b.getBBox().x + b.getBBox().width))
  );
}


// Check if an obstacle is colliding with a set of coordinates
function isCollidePoint(object, coordinates)
{
  return !(
    ((object.getBBox().y + object.getBBox().height) < (coordinates[1])) ||
    (object.getBBox().y > (coordinates[1])) ||
    ((object.getBBox().x + object.getBBox().width) < coordinates[0]) ||
    (object.getBBox().x > (coordinates[0]))
  );
}


// Draw the environment walls and obstacles
function addObstacles()
{
  var wall_01 = paper.rect(50, 30, 30, 530).attr({fill:"#b80404"});
  var wall_02 = paper.rect(80, 530, 1020, 30).attr({fill:"#b80404"});
  var wall_03 = paper.rect(1100, 30, 30, 530).attr({fill:"#b80404"});
  var wall_04 = paper.rect(80, 30, 1020, 30).attr({fill:"#b80404"});
  var obst_01 = paper.rect(170, 160, 60, 60).attr({fill: "purple"});
  var obst_02 = paper.rect(280, 360, 60, 60).attr({fill: "orange"});
  var obst_03 = paper.rect(480, 200, 60, 60).attr({fill: "red"});
  var obst_04 = paper.rect(720, 140, 60, 60).attr({fill: "green"});
  var obst_05 = paper.rect(710, 340, 60, 60).attr({fill: "blue"});
  var obst_06 = paper.rect(870, 400, 60, 60).attr({fill: "yellow"});
  var obst_07 = paper.rect(310, 100, 60, 60).attr({fill: "grey"});
  var obst_08 = paper.rect(1020, 250, 60, 60).attr({fill: "cyan"});
  var obst_09 = paper.rect(540, 270, 60, 60).attr({fill: "black"});

  // Fill obstacle array
  obstacles = [wall_01, wall_02, wall_03, wall_04,
  obst_01, obst_02, obst_03, obst_04, obst_05, obst_06, obst_07, obst_08, obst_09];
}


// Set the right proximity variable
function setRightProximity(prox)
{
  if(prox < rightProximity)
  {
    rightProximity = addNoiseSensors(prox);
  }
}

// Set the left proximity variable
function setLeftProximity(prox)
{
  if(prox < leftProximity)
  {
    leftProximity = addNoiseSensors(prox);
  }
}

// Based on fuzzy obstacle proximities, defuzzify and choose a direction to move
function chooseTrajectory(obstacleLocation)
{
  switch(obstacleLocation)
  {
    case "no obstacles":
      mL = addNoiseMotors(2.5);
      mR = addNoiseMotors(2.5);
      break;

    case "far right":
      mL = addNoiseMotors(2);
      mR = addNoiseMotors(3);
      break;

    case "far mid right":
      mL = addNoiseMotors(1.8);
      mR = addNoiseMotors(3.2);

    case "near mid right":
      mL = addNoiseMotors(1.4);
      mR = addNoiseMotors(3.6);

    case "near right":
      mL = addNoiseMotors(1);
      mR = addNoiseMotors(4);
      break;

    case "far left":
      mL = addNoiseMotors(3);
      mR = addNoiseMotors(2);
      break;

    case "far mid left":
      mL = addNoiseMotors(3.2);
      mR = addNoiseMotors(1.8);

    case "near mid left":
      mL = addNoiseMotors(3.6);
      mR = addNoiseMotors(1.4);

    case "near left":
      mL = addNoiseMotors(4);
      mR = addNoiseMotors(1);
      break;

    case "multiple left":
      mL = addNoiseMotors(5);
      mR = addNoiseMotors(0);
      break;

    case "multiple right":
      mL = addNoiseMotors(0);
      mR = addNoiseMotors(5);
      break;
  }
}


// Fuzzify the obstacle proximites into linguistic variables
function determineObstacleProximity(leftProximity, rightProximity)
{
  if(leftProximity > 4)
  {
      if(rightProximity > 4)
      {
        obstacleLocation = "no obstacles";
        chooseTrajectory(obstacleLocation);
      }
      else if(rightProximity <= 3.5 && rightProximity > 2.5)
      {
        obstacleLocation = "far right";
        chooseTrajectory(obstacleLocation);
      }
      else if(rightProximity <= 2.5 && rightProximity > 1.5)
      {
        obstacleLocation = "far mid right";
        chooseTrajectory(obstacleLocation);
      }
      else if(rightProximity <= 1.5 && rightProximity > 0.5)
      {
        obstacleLocation = "near mid right";
        chooseTrajectory(obstacleLocation);
      }
      else if(rightProximity <= 0.5 && rightProximity > (-0.5))
      {
        obstacleLocation = "near right";
        chooseTrajectory(obstacleLocation);
      }
  }
  else if(rightProximity > 4)
  {
    if(leftProximity > 4)
    {
      obstacleLocation = "no obstacles";
      chooseTrajectory(obstacleLocation);
    }
      else if(leftProximity <= 3.5 && leftProximity > 2.5)
      {
        obstacleLocation = "far left";
        chooseTrajectory(obstacleLocation);
      }
      else if(leftProximity <= 2.5 && leftProximity > 1.5)
      {
        obstacleLocation = "far mid left";
        chooseTrajectory(obstacleLocation);
      }
      else if(leftProximity <= 1.5 && leftProximity > 0.5)
      {
        obstacleLocation = "near mid left";
        chooseTrajectory(obstacleLocation);
      }
      else if(leftProximity <= 0.5 && leftProximity > (-0.5))
      {
        obstacleLocation = "near left";
        chooseTrajectory(obstacleLocation);
      }  }
  else
  {
    if(rightProximity < leftProximity)
    {
      obstacleLocation = "multiple right";
      chooseTrajectory(obstacleLocation);
    }
    else if(rightProximity > leftProximity)
    {
      obstacleLocation = "multiple left";
      chooseTrajectory(obstacleLocation);
    }
  }
} // End of determineObstacleProximity()


// Add Gaussian noise to motor values
function addNoiseMotors(variable)
{
  var variance = (1/6) * (Math.pow((0-2.5),2)
  + Math.pow((1-2.5),2) + Math.pow((2-2.5),2)
  + Math.pow((3-2.5),2) + Math.pow((4-2.5),2)
  + Math.pow((5-2.5),2));

  var std_dev = Math.sqrt(variance);
  var noise = (1 / (std_dev * Math.sqrt(2* Math.PI))) * Math.exp((-1 * Math.pow(variable - 2.5, 2)) / (2 * Math.pow(std_dev, 2)));

  return (variable + noise);
}


// Add Gaussian noise to sensor values
function addNoiseSensors(variable)
{
  var variance = (1/5) * (Math.pow((0-2),2)
  + Math.pow((1-2),2) + Math.pow((2-2),2)
  + Math.pow((3-2),2) + Math.pow((4-2),2));

  var std_dev = Math.sqrt(variance);
  var noise = (1 / (std_dev * Math.sqrt(2* Math.PI))) * Math.exp((-1 * Math.pow(variable - 2, 2)) / (2 * Math.pow(std_dev, 2)));

  return (variable + noise);
}



// Output the total number of collisions during the simulation
console.log("Number of Collisions: " + collisionCounter);


//}; // End of window.onload
