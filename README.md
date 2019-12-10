# StarwarsAPI
This application offers a simple REST api for listing starwars' movies, posting comment on movies 
and fetching the character set for each movie.

# Prerequisities
- Docker, and docker-compose installation

# Installation
- Clone the repository 
- Edit the `.env` file with your preferred database settings. (**NOTE:** your database host (`DB_HOST`) should be the name of the mysql service as entered in the docker-compose file)
- Run `docker-compose up -d` from the project's directory
- Chill a while for services to start up


# Documentation

[http://149.202.58.198:3000/api/docs](http://149.202.58.198:3000/api/docs)
