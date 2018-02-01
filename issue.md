### 2018-02-01

issue: How to secure your API key

solution: Create a file to store all API keys inside. Then edit .gitignore file to skip this file

issue: Google Oauth: 400. That’s an error. Error: redirect_uri_mismatch

solution: 

1. Go to modify the credentials of your API_KEY in console.developers.google.com.
2. Update the authorized redirect URL as: localhost:5000/auth/google/callback instead of localhost:5000/*