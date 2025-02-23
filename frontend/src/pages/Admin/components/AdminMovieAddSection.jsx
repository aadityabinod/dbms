
import axios from "axios"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { adminErrorToast, adminMovieToast } from "../../../toasts/toast"

export const AdminMovieAddSection = () => {
  const { signedPerson } = useSelector((store) => store.authentication)

  const [movieInfo, setMovieInfo] = useState({
    movieName: "",
    imagePath: "",
    language: "",
    description: "",
    rating: "",
    duration: "",
    cast: "",
    relDate: "",
    genres: [],
    directors: [],
  })
  const [movies, setMovies] = useState([])
  const [selectedMovieId, setSelectedMovieId] = useState(null)
  const [adminMovieDropDown, setAdminMovieDropDown] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch all movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/movies`)
        console.log("API Response:", response?.data)
        setMovies(response.data)
      } catch (err) {
        console.error("API Error:", err?.response?.data)
      }
    }
    fetchMovies()
  }, [])

  const toggleAdminSection = () => {
    setAdminMovieDropDown((prevState) => !prevState)
  }

  const handleMovieInfo = (e) => {
    const name = e.target.name
    const value =
      name === "genres" || name === "directors" ? e.target.value.split(",").map((item) => item.trim()) : e.target.value

    setMovieInfo((prevInfo) => ({
      ...prevInfo,
      [name]: name === "rating" ? Number.parseFloat(value) : value,
    }))
  }

  const movieAdd = async (e) => {
    e.preventDefault();
    if (
      movieInfo.movieName !== "" &&
      movieInfo.imagePath !== "" &&
      movieInfo.language !== "" &&
      movieInfo.description !== "" &&
      movieInfo.rating !== "" &&
      movieInfo.duration !== "" &&
      movieInfo.cast !== "" &&
      movieInfo.relDate !== "" &&
      movieInfo.genres.length > 0 &&
      movieInfo.directors.length > 0
    ) {
      try {
        setLoading(true);
        const movieResponse = await axios.post(`${import.meta.env.VITE_API_URL}/adminMovieAdd`, {
          email: signedPerson.email,
          password: signedPerson.password,
          name: movieInfo.movieName,
          image_path: movieInfo.imagePath,
          language: movieInfo.language,
          synopsis: movieInfo.description,
          rating: movieInfo.rating,
          duration: movieInfo.duration,
          top_cast: movieInfo.cast,
          release_date: movieInfo.relDate,
        });
  
        const movieId = movieResponse.data?.last_id || movieResponse.data[0]?.last_id;
  
        if (movieId) {
          // Add genres
          await Promise.all(
            movieInfo.genres.map((genre) =>
              axios.post(`${import.meta.env.VITE_API_URL}/genreInsert`, {
                email: signedPerson.email,
                password: signedPerson.password,
                movieId,
                genre,
              })
            )
          );
  
          // Add directors
          await Promise.all(
            movieInfo.directors.map((director) =>
              axios.post(`${import.meta.env.VITE_API_URL}/directorInsert`, {
                email: signedPerson.email,
                password: signedPerson.password,
                movieId,
                director,
              })
            )
          );
  
          adminMovieToast();
          toggleAdminSection();
        }
      } catch (err) {
        console.error(err);
        adminErrorToast(err.response?.data?.message || "Failed to add movie");
      } finally {
        setMovieInfo({
          movieName: "",
          imagePath: "",
          language: "",
          description: "",
          rating: "",
          duration: "",
          cast: "",
          relDate: "",
          genres: [],
          directors: [],
        });
        setLoading(false);
      }
    }
  };

  const deleteMovie = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/movies/${id}`)
      setMovies(movies.filter((movie) => movie.id !== id))
      adminMovieToast("Movie deleted successfully")
    } catch (err) {
      console.error(err)
      adminErrorToast("Failed to delete movie")
    }
  }

  const updateMovie = async (id) => {
    const movieToUpdate = movies.find((movie) => movie.id === id);
    if (movieToUpdate) {
      setMovieInfo({
        movieName: movieToUpdate.name,
        imagePath: movieToUpdate.image_path,
        language: movieToUpdate.language,
        description: movieToUpdate.synopsis,
        rating: movieToUpdate.rating,
        duration: movieToUpdate.duration,
        cast: movieToUpdate.top_cast,
        relDate: movieToUpdate.release_date,
        genres: movieToUpdate.genres || [],
        directors: movieToUpdate.directors || [],
      });
      setSelectedMovieId(id);
      setAdminMovieDropDown(true);
    }
  };

  const movieUpdate = async (e) => {
    e.preventDefault();
    if (
      movieInfo.movieName !== "" &&
      movieInfo.imagePath !== "" &&
      movieInfo.language !== "" &&
      movieInfo.description !== "" &&
      movieInfo.rating !== "" &&
      movieInfo.duration !== "" &&
      movieInfo.cast !== "" &&
      movieInfo.relDate !== "" &&
      Array.isArray(movieInfo.genres) &&
      movieInfo.genres.length > 0 &&
      Array.isArray(movieInfo.directors) &&
      movieInfo.directors.length > 0
    ) {
      try {
        setLoading(true);
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/movies/${selectedMovieId}`, {
          name: movieInfo.movieName,
          image_path: movieInfo.imagePath,
          language: movieInfo.language,
          synopsis: movieInfo.description,
          rating: movieInfo.rating,
          duration: movieInfo.duration,
          top_cast: movieInfo.cast,
          release_date: movieInfo.relDate,
        });
  
        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie.id === selectedMovieId
              ? {
                  ...movie,
                  name: movieInfo.movieName,
                  image_path: movieInfo.imagePath,
                  language: movieInfo.language,
                  synopsis: movieInfo.description,
                  rating: movieInfo.rating,
                  duration: movieInfo.duration,
                  top_cast: movieInfo.cast,
                  release_date: movieInfo.relDate,
                }
              : movie
          )
        );
  
        // Update genres
        await Promise.all(
          movieInfo.genres.map((genre) =>
            axios.put(`${import.meta.env.VITE_API_URL}/genreInsert`, {
              email: signedPerson.email,
              password: signedPerson.password,
              movieId: selectedMovieId,
              genre,
            })
          )
        );
  
        // Update directors
        await Promise.all(
          movieInfo.directors.map((director) =>
            axios.put(`${import.meta.env.VITE_API_URL}/directorInsert`, {
              email: signedPerson.email,
              password: signedPerson.password,
              movieId: selectedMovieId,
              director,
            })
          )
        );
  
        adminMovieToast("Movie updated successfully");
        toggleAdminSection();
      } catch (err) {
        console.error("Update Error:", err?.response?.data);
        adminErrorToast("Failed to update movie");
      } finally {
        setMovieInfo({
          movieName: "",
          imagePath: "",
          language: "",
          description: "",
          rating: "",
          duration: "",
          cast: "",
          relDate: "",
          genres: [],
          directors: [],
        });
        setSelectedMovieId(null);
        setLoading(false);
      }
    }
  };

 

  return (
      <section className="section-admin-movie-add container">
        <div className="form-heading-container">
          <h2 className="form-admin-heading">Manage Movies</h2>
          <button className="btn-admin-arrow" onClick={toggleAdminSection}>
            {!adminMovieDropDown ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="admin-icon" viewBox="0 0 512 512">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="48"
                  d="M112 184l144 144 144-144"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="admin-icon" viewBox="0 0 512 512">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="48"
                  d="M112 328l144-144 144 144"
                />
              </svg>
            )}
          </button>
        </div>
  
        {adminMovieDropDown && (
          <form className="form-movie-add" onSubmit={selectedMovieId ? movieUpdate : movieAdd}>
            <div>
              <p>Movie Name:</p>
              <input
                name="movieName"
                onChange={handleMovieInfo}
                type="text"
                placeholder="Enter Movie Name"
                value={movieInfo.movieName}
              />
            </div>
  
            <div>
              <p>Movie Photo Path:</p>
              <input
                name="imagePath"
                onChange={handleMovieInfo}
                type="text"
                placeholder="Enter Image path"
                value={movieInfo.imagePath}
              />
            </div>
  
            <div>
              <p>Language:</p>
              <input
                name="language"
                onChange={handleMovieInfo}
                type="text"
                placeholder="Enter Movie Language"
                value={movieInfo.language}
              />
            </div>
  
            <div>
              <p>Synopsis:</p>
              <input
                name="description"
                onChange={handleMovieInfo}
                placeholder="Enter Movie's Brief Description"
                value={movieInfo.description}
              />
            </div>
  
            <div>
              <p>Rating:</p>
              <input
                name="rating"
                onChange={handleMovieInfo}
                type="text"
                placeholder="Enter Movie Rating"
                value={movieInfo.rating}
              />
            </div>
  
            <div>
              <p>Duration:</p>
              <input
                name="duration"
                onChange={handleMovieInfo}
                type="text"
                placeholder="Enter Movie Duration"
                value={movieInfo.duration}
              />
            </div>
  
            <div>
              <p>Top Cast:</p>
              <input
                name="cast"
                onChange={handleMovieInfo}
                type="text"
                placeholder="Enter Movie's Main Actor/Actress Name"
                value={movieInfo.cast}
              />
            </div>
  
            <div>
              <p>Release Date:</p>
              <input
                name="relDate"
                onChange={handleMovieInfo}
                type="text"
                placeholder="(yyyy-mm-dd) format"
                value={movieInfo.relDate}
              />
            </div>
  
            <div>
              <p>Movie Genres:</p>
              <input
                name="genres"
                onChange={handleMovieInfo}
                type="text"
                placeholder="Enter separate Genres with comma"
                value={movieInfo.genres.join(", ")} // Display as comma-separated string
              />
            </div>
  
            <div>
              <p>Movie Directors:</p>
              <input
                name="directors"
                onChange={handleMovieInfo}
                type="text"
                placeholder="Enter separate Directors with comma"
                value={movieInfo.directors.join(", ")} // Display as comma-separated string
              />
            </div>
  
            <button
              type="submit"
              className="btn-admin"
              disabled={
                loading ||
                !movieInfo.movieName ||
                !movieInfo.imagePath ||
                !movieInfo.language ||
                !movieInfo.description ||
                !movieInfo.rating ||
                !movieInfo.duration ||
                !movieInfo.cast ||
                !movieInfo.relDate ||
                movieInfo.genres.length === 0 ||
                movieInfo.directors.length === 0
              }
            >
              {loading ? "Saving..." : selectedMovieId ? "Update Movie" : "Add Movie"}
            </button>
          </form>
        )}
  
        <div className="movie-list">
          <p>Movie List</p>
          {movies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <p>{movie.name}</p>
              <button onClick={() => updateMovie(movie.id)}>Edit</button>
              <button onClick={() => deleteMovie(movie.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
    );
  };
 

