### 2018-02-01

**issue:** How to secure your API key

**solution:** Create a file to store all API keys inside. Then edit .gitignore file to skip this file

**issue:** Google Oauth: 400. That’s an error. Error: redirect_uri_mismatch

**solution:** 

- Go to modify the credentials of your API_KEY in console.developers.google.com.

- Update the authorized redirect URL as: localhost:5000/auth/google/callback instead of localhost:5000/*

**issue:** When deploy to Heroku, google auth occurs an error: 

Error: redirect_uri_mismatch

The redirect URI in the request, http://emaily-haisheng-lin.herokuapp.com/auth/google/callback, does not match the ones authorized for the OAuth client. 

**reason:**

- Google misunderstand that the redirect URL is in http not https

- Our app does not trust Heroku Proxy

**solution:**

- hardcode passport.js callback URL as: https://emaily-haisheng-lin.herokuapp.com/auth/google/callback

- add { proxy: true } option in GoogleStrategy

---