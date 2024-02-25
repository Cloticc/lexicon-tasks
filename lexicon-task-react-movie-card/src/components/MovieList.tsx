import { IMovie } from './AddMovie';
import {MovieCard} from './MovieCard';

export const MovieList = ({ movies }: { movies: IMovie[] }) => {
  if (!movies || movies.length === 0) {
    return <p>No movies available or nothing added.</p>;
  }


  return (
    <section className="movie-list">
      
      <h2>Movies</h2>
      {movies.map((movie) => (
        <article key={movie.title}>
          <MovieCard {...movie} />
        </article>
      ))}
    </section>
  );
};