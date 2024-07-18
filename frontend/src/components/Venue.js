import React, { useState, useEffect } from 'react';
import VenueCard from './VenueCard';
import axios from 'axios';

function Venue() {

  const [eventData, setEventData] = useState({
    "events": [
      {
        "id": "Z698xZu0ZaGQo",
        "event_name": "Childish Gambino",
        "artist_names": ["Childish Gambino"],
        "dateAndTime": [2024, 11, 12],
        "sales_start_end": "2024-05-17T08:00:00Z to 2024-11-12T22:59:00Z",
        "price_range": [1490.0, 4242.0],
        "genre_id": "KnvZfZ7vAvv",
        "venue": { "name": "O2 Arena", "address": "\u010ceskomoravsk\u00e1 2345/17a, Praha 9", "phoneNumber": "020 8463 2000", "rating": "4.5 / 5", "website": "https://www.theo2.co.uk/" },
        "ticketmaster_URL": "https://www.ticketmaster.cz/event/childish-gambino-tickets/50833?language=en-us"
      }
    ]
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page) => {
    try {
      // const response = await axios.get(`https://www.cheapcheapticket.xyz/GetEvents`, {
        const response = await axios.get(`/GetEvents`, {
        params: { page, per_page: 30 }
      });
      
      const responseLength = await axios.get(`/GetAllEvents`);

      const newEvents = response.data.map((newEvent, index) => {
        const defaultEvent = eventData.events[index] || {
          id: "",
          event_name: "",
          artist_names: [],
          dateAndTime: [],
          sales_start_end: "",
          price_range: [],
          genre_id: "",
          venue: {
            name: "",
            address: "",
            phoneNumber: "",
            rating: "",
            website: ""
          },
          ticketmaster_URL: ""
        };
        return {
          ...defaultEvent,
          ...newEvent,
          venue: {
            ...defaultEvent.venue,
            ...newEvent.venue
          }
        };
      });
      setEventData({ events: newEvents });
      const totalEvents = responseLength.data.length;
      setTotalPages(Math.ceil(totalEvents / 30));
      
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]); 

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <div>
        <h2 class="page-title">Events</h2>
        <p class="page-title">Events all across the US! </p>
      </div>
      <div className="row g-4 m-5">
        {
          eventData.events.map((event, index) => (
            <div className="col-lg-4" key={index}>
              <VenueCard
                eventId={event.id}
                eventName={event.event_name}
                artistNames={event.artist_names}
                dateAndTime={event.dateAndTime}
                salesStartEnd={event.sales_start_end}
                priceRange={event.price_range}
                genreId={event.genre_id}
                venue={event.venue}
                ticketmasterURL={event.ticketmaster_URL}
              />
            </div>
          ))
        }
      </div>

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
  );
}

export default Venue;
