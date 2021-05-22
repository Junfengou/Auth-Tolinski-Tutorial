Run the app: nodemon ./src/index.js

Here is how this work...

We have two tables in our mongoDB that track a list of users
as well as a list of current active sessions

To register a user, we use a simple form to capture user data and store
it in the user table

Once registered, we have a form that hit a dedicated route on the server
to check if the incoming information (email and password) meets certain condition

- email exist in the database
- hashed version of the password matches the plain text through bcrypt
- generates a boolean field to let us know if it pass the test or not

If the user is authorized (meaning the email and password check out), then we
will proceed to create a session through the use of cookie

- session is stored in the database, available to look up at anytime
- access token to check if user have access, expire when the session ends.
- refresh token will re-generate a set of access token as long as it doesn't expire
