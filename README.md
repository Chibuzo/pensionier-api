# starwarsAPI
This application offers a simple REST api for listing starwars' movies, posting comment on movies 
and fetching the character set for each movie.

## Usage
Base URL: `http://url/api`

### List all starwars movies

No URL or data parameters

* **Endpoint:**

  `GET` /movies
  
* **Header:**  

  Header: Content-Type: application/json
  
* **Success Response**

  **Status Code:** 200
  
  **Data:**
```
  {
    status: 'success',
    "movies": [
        {
            "title": "Movie title
            "opening_crawl": "Long time ago, in a far away galaxy...",
            "comment_count": 3
        },
     ...
    ]
}    
```

* **Error Response**

  **Status Code:** 400
  
  **Data:**
```
{
  "status": "error",
  "message": "Acceptable content-type header is missing"
}
```
OR

  **Status Code:** 500
  
  **Data:**
  
```
{
  "status": "error",
  "message": "Server error! Unable to fetch movies at this time. Please try again later"
}
```

  




