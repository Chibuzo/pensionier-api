# StarwarsAPI
This application offers a simple REST api for listing starwars' movies, posting comment on movies 
and fetching the character set for each movie.

# Usage
Base URL: `http://52.0.4.153:3000/api`

## List all starwars movies

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
    "status": "success",
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


## Get Movie Characters

* **Endpoint:**

  `GET` /characters
  
* **Header:**  

  Header: Content-Type: application/json
  
* **URL Param**

  * **Required**
 
    `movie_id=[int]`
  
  * **Optional**
  
    `gender=[female|male]`
  
    `sort=[name|gender|height]`
  
    `order=[asc|desc]`
  
* **Success Response**

  **Status Code:** 200
  
  **Data:**
```
  {
    "status": "success",
    "total_height_cm": 3066,
    "total_height_feet_inches": "100ft 7.09 in",
    "number_of_characters": 18,
    "characters": [
        {
            "name": "Luke Skywalker",
            "birth_year": "19BBY",
            "eye_colour": "blue",
            "gender": "male",
            "mass": "77",
            "height": "172"
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

   **Status Code:** 422
  
   **Data:**
  
```
{
  "status": "error",
  "errors": [
        {
            "message": "movie_id cannot be empty and must be a number"
        }
    ]
}
```


## Post comment

Post anonymous comment for a movie. Comment must not be more than 500 characters.

* **Endpoint:**

  `POST` /comments
  
* **Header:**  

  Header: Content-Type: application/json
  
* **Data Parameters**

  All data parameters are required.

  `comment=[text]`

  `movie_id=[int]`
  
* **Success Response**

  **Status Code:** 201
  
  **Data:**
```
  {
    "status": "success",
    "comment_id": "1"
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

   **Status Code:** 422
  
   **Data:**
```
{
  "status": "error",
  "errors": [
        {
            "message": "movie_id cannot be empty and must be a number"
        },
        {
            "message": comment must not be more than 500 characters long"
        }
    ]
}
```

  
  
## Fetch movie comments  

* **Endpoint:**

  `GET` /comments
  
* **Header:**  

  Header: Content-Type: application/json
  
* **URL parameter**

  * **Required**
  
    `movie_id=[int]`
  
* **Success Response**

  **Status Code:** 200
  
  **Data:**
```
  {
    "status": "success",
    "comments": [
        {
            "comment": "This is a comment about this movie",
            "public_ip": "3.2.34.344"
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

   **Status Code:** 422
  
   **Data:**
  
```
{
  "status": "error",
  "errors": [
        {
            "message": "movie_id cannot be empty and must be a number"
        }
    ]
}
```



