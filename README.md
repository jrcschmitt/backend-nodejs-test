# Backend NodeJS Test

This is a RESTful API that allows you to read the list of the nominees and winners for the Worst Film category at the **Golden Raspberry Awards**

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js: https://nodejs.org/ (v18.15.0)
- Package manager: npm (v9.5.0)

## Installation

1. Clone this repository to your local machine:

   ```bash
   https://github.com/jrcschmitt/backend-nodejs-test.git
   ```
   
2. Navigate to the project directory:
    
    ```bash
    cd backend-nodejs-test
    ```
    
3. Install project dependencies
    
    ```bash
    npm install
    ```
    
## Running the Application

To run the NojeJS application locally, execute the following command:

```bash
npm start
```

Now the server is listening to the port 3000.

## Available routes

This RESTful API has one available route:

  Route to get all movies:
    
    /api/movies

  In this route can be added a query param `projection=max-min-win-interval-for-producers` to get the minimum and maximum wins intervals for producers:
    

    /api/movies?projection=max-min-win-interval-for-producers

## Running the integration tests

To run the integration tests, execute these following steps:

  1. Ensure that the application is running

  2. Execute the following command in the root directory:
    
    npm test
