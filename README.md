# Route Mapper App

**Created using React Native expo**

This app allows the user to track their routes by accessing their current location coordinates and printing a polyline on the world map wherever the user goes. The user begins when they accept the app's request of location. Next, they will be brought to a screen of the world map, buttons including start, end, and turn, as well as a stopwatch. The app begins tracking down the user route when the user presses start. When start is clicked, a marker called 'start' will appear on the user's exact starting location and the app will automatically zoom in a zoomed in region of the user's current location. When the user begins moving, the app will automatically draw a polyline that follows the user's footsteps. At any point during the route, the user can click on the turn button, essentially plotting a new marker onto the map with the label 'Turn number: "index"' (index just means the 'nth' marker on the screen). All throughout the route, the app will track down the user time via a stopwatch and the user's distance traveled. Additionally, throughout the route, the app will automatically update the region so that the user does not have to move the screen when entering a new region. When the user is finished, they can press the red STOP button that pauses the stopwatch time, ends the route, plots the last marker called 'end', and zooms out of the zoomed in region. When the STOP button is pressed, it will change to 'Analyze Results' button. At this point, the user can do two things. One is to just look at the map with the plotted markers and polyline, zoom in and out, and analyze their route. They can also press on the red analyze results button, which will open a modal that displays the user's distance, the time it took, the average speed, as well as number of turns, or markers, made. To exit the modal, the user can either press 'Done', which puts them back to the old plotted route screen or 'Quit' which brings the user back to the main screen, allowing them to run it again. 


  Limitations:
  
  -Since I am using 'region={{}}' in mapview, I am able to update the userRegion, however, this prevents the user from being able to move the screen around -zoom in and out- on their own. They are only able to do so after the route is ended. This may be an issue since the app does not zoom in all the way, and it may be hard for the user to see their route when route is being tracked. 
  
  -If the user places a marker that is either in front or very close to another marker, they will not be able to click on that marker's title or see one of the markers clearly. For example if the user moved 0m, the start and end will share the same coordinates. This will cause the markers to 'fight' for that spot, so that point will keep changing from red pin (start) to green pin (end) and back and forth. 
  
  -I used 'toFixed' to shave off the decimals of my distance and speed values, but sometimes the app still includes many decimals for example when I got '5.79999999995 m'.
  
  -If the user obtains weird distance or time values, the average speed may be displayed as 'infinity'. Not sure where that is coming from. 
