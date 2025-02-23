import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const AdminMovieAddSection = () => {
  const { signedPerson } = useSelector((store) => store.authentication);

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
  });
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [adminMovieDropDown, setAdminMovieDropDown] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/movies`);
      console.log("Fetch Movies Response:", response?.data);
      setMovies(response.data);
    } catch (err) {
      console.error("Fetch Movies Error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch movies");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const toggleAdminSection = () => {
    setAdminMovieDropDown((prevState) => !prevState);
  };

  const handleMovieInfo = (e) => {
    const name = e.target.name;
    const value =
      name === "genres" || name === "directors"
        ? e.target.value.split(",").map((item) => item.trim()).filter(Boolean)
        : e.target.value;

    setMovieInfo((prevInfo) => ({
      ...prevInfo,
      [name]: name === "rating" ? Number.parseFloat(value) || "" : value,
    }));
  };

  const validateMovieInfo = () => {
    const { movieName, imagePath, language, description, rating, duration, cast, relDate, genres, directors } = movieInfo;
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(relDate);
    const isValidRating = !isNaN(rating) && rating >= 0 && rating <= 10;

    if (!movieName) return "Movie name is required";
    if (!imagePath) return "Image path is required";
    if (!language) return "Language is required";
    if (!description) return "Description is required";
    if (!rating || !isValidRating) return "Rating must be a number between 0 and 10";
    if (!duration) return "Duration is required";
    if (!cast) return "Cast is required";
    if (!relDate || !isValidDate) return "Release date must be in yyyy-mm-dd format";
    if (!genres.length) return "At least one genre is required";
    if (!directors.length) return "At least one director is required";
    return null;
  };

  const movieAdd = async (e) => {
    e.preventDefault();
    const validationError = validateMovieInfo();
    if (validationError) {
      toast.error(validationError);
      return;
    }
  
    try {
      setLoading(true);
      const loadingToast = toast.loading("Adding movie...");
  
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
  
      console.log("Movie Add Response:", movieResponse.data);
  
      const movieId = movieResponse.data.id;
      if (!movieId) {
        toast.update(loadingToast, {
          render: "Movie added, but no ID returned. Genres and directors not saved. Refreshing list...",
          type: "warning",
          isLoading: false,
          autoClose: 5000,
        });
        await fetchMovies();
        toggleAdminSection();
        return;
      }
  
      await Promise.all([
        ...movieInfo.genres.map((genre) =>
          axios.post(`${import.meta.env.VITE_API_URL}/genreInsert`, {
            email: signedPerson.email,
            password: signedPerson.password,
            movieId,
            genre,
          })
        ),
        ...movieInfo.directors.map((director) =>
          axios.post(`${import.meta.env.VITE_API_URL}/directorInsert`, {
            email: signedPerson.email,
            password: signedPerson.password,
            movieId,
            director,
          })
        ),
      ]);
  
      toast.update(loadingToast, {
        render: "Movie added successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      await fetchMovies();
      toggleAdminSection();
    } catch (err) {
      console.error("Add Error:", err, "Response:", err.response); // Enhanced logging
      const errorMessage =
        err.response?.data?.error || // Use 'error' from updated backend
        err.response?.data?.message ||
        (err.request ? "Network error: Unable to reach the server" : err.message) ||
        "An unexpected error occurred";
      toast.error(errorMessage);
      toast.update(loadingToast, { render: errorMessage, type: "error", isLoading: false, autoClose: 5000 });
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
  };

  const deleteMovie = async (id) => {
    try {
      const loadingToast = toast.loading("Deleting movie...");
      await axios.delete(`${import.meta.env.VITE_API_URL}/movies/${id}`);
      setMovies(movies.filter((movie) => movie.id !== id));
      toast.update(loadingToast, {
        render: "Movie deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error(err.response?.data?.message || "Failed to delete movie");
    }
  };

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
    const validationError = validateMovieInfo();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);
      const loadingToast = toast.loading("Updating movie...");

      await axios.put(`${import.meta.env.VITE_API_URL}/movies/${selectedMovieId}`, {
        name: movieInfo.movieName,
        image_path: movieInfo.imagePath,
        language: movieInfo.language,
        synopsis: movieInfo.description,
        rating: movieInfo.rating,
        duration: movieInfo.duration,
        top_cast: movieInfo.cast,
        release_date: movieInfo.relDate,
      });

      await Promise.all([
        ...movieInfo.genres.map((genre) =>
          axios.put(`${import.meta.env.VITE_API_URL}/genreInsert`, {
            email: signedPerson.email,
            password: signedPerson.password,
            movieId: selectedMovieId,
            genre,
          })
        ),
        ...movieInfo.directors.map((director) =>
          axios.put(`${import.meta.env.VITE_API_URL}/directorInsert`, {
            email: signedPerson.email,
            password: signedPerson.password,
            movieId: selectedMovieId,
            director,
          })
        ),
      ]);

      toast.update(loadingToast, {
        render: "Movie updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      await fetchMovies(); // Refetch to sync with server
      toggleAdminSection();
    } catch (err) {
      console.error("Update Error:", err);
      const errorMessage =
        err.response?.data?.message ||
        (err.request ? "Network error: Unable to reach the server" : err.message) ||
        "An unexpected error occurred";
      toast.error(errorMessage);
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
  };

  return (
    <section className="section-admin-movie-add container">
      <div className="form-heading-container">
        <h2 className="form-admin-heading">Manage Movies</h2>
        <button className="btn-admin-arrow" onClick={toggleAdminSection}>
          {!adminMovieDropDown ? (
            <svg key="down-arrow" xmlns="http://www.w3.org/2000/svg" className="admin-icon" viewBox="0 0 512 512">
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
            <svg key="up-arrow" xmlns="http://www.w3.org/2000/svg" className="admin-icon" viewBox="0 0 512 512">
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
          {[
            { name: "movieName", placeholder: "Enter Movie Name" },
            { name: "imagePath", placeholder: "Enter Image path" },
            { name: "language", placeholder: "Enter Movie Language" },
            { name: "description", placeholder: "Enter Movie's Brief Description" },
            { name: "rating", placeholder: "Enter Movie Rating (0-10)" },
            { name: "duration", placeholder: "Enter Movie Duration (e.g., 2h 30m)" },
            { name: "cast", placeholder: "Enter Movie's Main Actor/Actress Name" },
            { name: "relDate", placeholder: "(yyyy-mm-dd) format" },
            { name: "genres", placeholder: "Enter separate Genres with comma" },
            { name: "directors", placeholder: "Enter separate Directors with comma" },
          ].map((field) => (
            <div key={field.name}>
              <p>{field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, " $1") + ":"}</p>
              <input
                name={field.name}
                onChange={handleMovieInfo}
                type="text"
                placeholder={field.placeholder}
                value={field.name === "genres" || field.name === "directors" ? movieInfo[field.name].join(", ") : movieInfo[field.name]}
              />
            </div>
          ))}
  
          <button type="submit" className="btn-admin" disabled={loading}>
            {loading ? "Saving..." : selectedMovieId ? "Update Movie" : "Add Movie"}
          </button>
        </form>
      )}
  
      <div className="movie-list">
        <p>Movie List</p>
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <p>{movie.name}</p>
            <div className="movie-item-buttons">
              <button key={`${movie.id}-edit`} onClick={() => updateMovie(movie.id)}>Edit</button>
              <button key={`${movie.id}-delete`} onClick={() => deleteMovie(movie.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};