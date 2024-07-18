import React from 'react';
import { useState, useEffect } from 'react';
import GenreCard from './GenreCard';
import axios from 'axios'


function Genre() {

  const [genresData, setGenresData] = useState(
    [
      // {
      //   "genreId": "KnvZfZ7vAvv",
      //   "name": "GenreName",
      //   "popular_artists": ["73sIBHcqh3Z3NyqHKZ7FOL", "Artists 2 id", "Artists 3 id"],
      //   "upcoming_events": ["Event ID"],
      //   "top_songs": ["Song 1", "Song 2", "Song 3"],
      //   "events_price_range": [0, 0]
      // }
    ]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (currentPage) => {
    try {
      const response = await axios.get(`/GetGenres`, {
        params: { page: currentPage, per_page: 5 }
      });
      
      const responseLength = await axios.get(`/GetAllGenres`);

      const newGenres = response.data.map((newGenre, index) => {
        const defaultGenre = genresData[index] || {};
        return {
          ...defaultGenre,
          ...newGenre
        };
      });

      setGenresData( newGenres );
      const totalGenres = responseLength.data.length;
      setTotalPages(Math.ceil(totalGenres / 5));
    } catch (error) {
      console.error("Error:", error)
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]); 

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  return (
    <>

      <h1 class="m-5 page-title">Genres</h1>
      <div class="row d-flex justify-content-center genre-card-container ">
        {
          genresData.map((genre, index) => (
            <GenreCard key={index}
              genreId={genre.id}
              name={genre.name}
              popularArtists={genre.popular_artists}
              upcomingEvents={genre.upcoming_events}
              topSongs={genre.top_songs}
              eventsPriceRange={genre.events_price_range}
            />
          ))
        }
      </div>

      <div class="d-flex justify-content-center align-items-center">
      <div className="d-flex justify-content-center align-items-center">
        <div className="pagination p-5">
          <button className="page-item" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Back</button>
          {Array.from({ length: totalPages }, (_, index) => (
            currentPage === index + 1 ?
              <button class=" page-item text-bg-dark" >{currentPage}</button>
              :
              <></>
          ))}
          <button className="page-item" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
        </div>
      </div>
      </div>
    </>

  );
}

export default Genre;
