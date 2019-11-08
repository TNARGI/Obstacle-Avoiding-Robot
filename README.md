# Obstacle-Avoiding-Robot
Simulated, differential-drive robot that avoids environmental obstacles using fuzzy logic.

Description:
Project attempts to create an "adaptive system", one which is able to identify and respond appropriately to stimuli. The simulated robot is driven by a differential-drive system acheieved via trigonometry and Euler integration. As the robot makes its way through the environment, linear sensors, protruding at 25 degrees from the robot's front, detect obstacles at limited incremental distances. Depending on the location and distance of an obstruction, the robot will classify the impediment and take evasive action. The extremity of the robot's reaction to an obstacle is governed by fuzzy logic, grouping a continuum of data into discrete levels for simple conditional responses.
CourseFuzzyLogic - Distinguishes between 7 different positions of obstruction
FineFuzzyLogic - Distinguishes between 11 different positions of obstruction


Running Instructions:
With the files all located in the same directory, both 'RobotCourseLogic' and 'RobotFineLogic' can be opened and run in a web browser. Google Chrome is recommended. Browser may claim that the script has become unresponsive but given time, execution should be successful.
