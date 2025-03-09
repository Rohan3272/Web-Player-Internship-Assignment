Music Player - A Web-Based Audio Streaming UI


Overview 
This project is a fully responsive, interactive music player built using HTML, CSS, and JavaScript (or React.js, SCSS, and React-Bootstrap if applicable). The objective was to create a visually appealing and functional music player that allows users to play, pause, navigate, and manage their favorite tracks efficiently.


Features:

Core Features-
Music playback with play, pause, forward, and rewind functionality
Interactive progress bar for tracking and scrubbing through songs
Fully responsive UI for desktop and mobile devices
Dynamic background gradient that changes based on the album art
Smooth animations and transitions for better user experience
Search functionality to filter songs by title
Recently Played section that stores the last 10 played songs using session storage
Favorites section where users can mark and store favorite songs using local storage

Advanced Features-
"For You" section displaying all available tracks
"Recently Played" section tracking the last 10 played songs
"Favorites" section allowing users to save and remove tracks
"Top Tracks" section ranking songs based on the number of times they were played


Technologies Used:
Frontend-
HTML, CSS, JavaScript
Local Storage and Session Storage for data persistence


Challenges Faced and Solutions: 
Album art missing in the "Top Tracks" section
Problem: Some tracks in the "Top Tracks" section did not display album art because it was not stored properly in local storage.
Solution: Updated trackPlayCount() to ensure album art is saved the first time a song is played.

GitHub file size limitations for MP3 uploads- 
Problem: GitHub does not allow files larger than 100MB to be uploaded through the web interface.
Solution: Compressed MP3 files to reduce their size and provided an alternative approach using Google Drive for external hosting.


Note on Responsiveness: 
Due to time constraints, the application is currently not fully responsive. On smaller screens, the player component does not yet adapt as intended (e.g., displaying the player as the main interface with a menu button for the song list).


Future Improvements: 
Implement backend authentication for persistent user data across devices
Add a playlist feature allowing users to create and manage custom playlists
Enable user-uploaded music files for a more personalized experience
Integrate real-time music streaming APIs for additional song options
