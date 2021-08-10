# Coding challenge
Create a simple analytics dashboard.

# Stack
- Docker
- NodeJs or PHP for backend
- Postgres
- VueJs
- webpack
- npm
- SCSS with flex
 
# Todo
- Create these two tables: 
    1) `hotel`(`id`, `name`)
    2) `review`(`id`, `hotel_id`, `score`, `comment`, `created_date`)
- Fill the `hotel` table with 10 rows with random names
- Fill the `review` table with a total number of 50.000 reviews which are distributed randomly over the last two years. Score and comments should be randomly filled and each hotel should have a random number of reviews as well.

- ### Overtime Endpoint:
  This REST-API endpoint gets a hotel-id and a date range from http requests and returns the overtime average score of the hotel, grouped the date range as follows:
  - 1 - 29 days: Grouped daily
  - 30 - 89 days: Grouped weekly
  - More than 89 days: Grouped monthly
  
  The response should contain "review-count", "average-score" and "date-group" (either the day, calendar-week or the month) per data point
  
- ### Create a dashboard:
  Please use the wireframe to create a page (let's call it Dashboard) which contains a chart to use the backend endpoint. It shows the average-score in the chart and the review-count as a tooltip. In the top of the chart users can select a hotel and a date range. Whenever they change the hotel or the date range, a new request should be automatically generated and sent to the backend and the chart should be updated as well.

  See (dashboard.png)
  
  The appearance of the page and the chart does not matter, but it should also work in screens with any size.
  
  You can use any external libraries to implement the dashboard.
  
- Use a DTO layer and a serializer in the backend to generate the response for the endpoint.
- Include a readme file and provide steps to build the application.
- Make sure the application (both frontend and backend) is covered by tests. Use Jest for frontend.
- Send the project to us.

