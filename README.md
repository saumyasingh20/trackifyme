# trackifyme
A scalable full stack web application which lets users **track their activities throughout the day and for the entire week and maintain weekly streaks**.
Deployed at : https://trackifyme.live
# Tech Stack Used:
## Node.js:
   for server-side scripting.
## Express.js:
   as a backend framework to implement MVC Structure.
## Passport.js:
   as an Authentication middleware for Node.js. Implemented **passport-local-strategy** and **passport-google-oauth2-strategy**  
## MongoDB:
   as the database for storing all the data related to users and session cookies.
## Bootstrap:
   for designing the front end of the web application.
   
# Key Features:
  - Users can sign in using their email addresses or their Google Accounts.
  - Upon signing in, users will be directed to the dashboard where in they can add a new habit.
  - After adding a new habit, user can update it's status as Done/Not Done/None for the day from the dashboard.
  - On updating the status for the day, the users will the directed to the weekly dashboard where in they can update their status for the entire week.
  - According to the weekly status of a particular habit of the user, the weekly streak is automatically maintained.
    


# To run the project on your local machine:

  1) Open terminal. 
 
  2) Change the current working directory to the location where you want the cloned directory.
  
  ```
  $ git clone https://github.com/saumyasingh20/trackifyme/
  ```
  
  3) Install all the dependencies by running :
  
  ```
  npm install
  ```
  
  4) Run npm start to run the project at local host, port 8005:
  
   ```
  npm start
  ```
  
  5) In your browser, enter the URL :
  
  ```
  localhost:8005/
  ```



