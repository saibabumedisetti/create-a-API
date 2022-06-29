const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "movies.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { movie_id, name, img, summary } = movieDetails;
  const addMovieQuery = `
    INSERT INTO
      movie (movie_id,name,img,summary)
    VALUES
      (
        '${name}',
        ${img},
        '${summary}'
      );`;

  const dbResponse = await db.run(addMovieQuery);
  const movieId = dbResponse.lastID;
  response.send({ movieId: movieId });
});
