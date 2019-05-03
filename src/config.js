module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    REACT_APP_API_KEY: process.env.REACT_APP_API_KEY,
  }

  //REACT_APP_API_KEY: process.env.REACT_APP_API_KEY || 'default_token'
  // ^ would allow the server to run without an api key, but is just lazy and insecure