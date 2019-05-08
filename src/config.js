module.exports = {
    PORT: process.env.PORT || 80,
    NODE_ENV: process.env.NODE_ENV || 'development',
    REACT_APP_API_KEY: process.env.REACT_APP_API_KEY,
    DB_URL: process.env.DB_URL || 'postgresql://dunder-mifflin@localhost/bookmarks',
  }

  //REACT_APP_API_KEY: process.env.REACT_APP_API_KEY || 'default_token'
  // ^ would allow the server to run without an api key, but is just lazy and insecure