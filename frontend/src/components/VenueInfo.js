import React from 'react';
import {  useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'


function VenueInfo() {

    const { eventId } = useParams();

    const [eventData, setEventData] = useState(
        {
            "id": "Z698xZu0ZaGQo",
            "event_name": "Childish Gambino",
            "artist_names": ["Childish Gambino"],
            "artistIds": ["initializedDefaultId"],
            "dateAndTime": [2024, 11, 12],
            "sales_start_end": "2024-05-17T08:00:00Z to 2024-11-12T22:59:00Z",
            "price_range": [1490.0, 4242.0],
            "genre_id": "KnvZfZ7vAvv",
            "venue": { "name": "O2 Arena", "address": "\u010ceskomoravsk\u00e1 2345/17a, Praha 9", "phoneNumber": "020 8463 2000", "rating": "4.5 / 5", "website": "https://www.theo2.co.uk/" },
            "ticketmaster_URL": "https://www.ticketmaster.cz/event/childish-gambino-tickets/50833?language=en-us"
        }
    );
    const [genreName, setGenreName] = useState("defaultGenreName");
    const [artistIdPair, setArtistIdPair] = useState({});

    useEffect(() => {
        const getEventData = async () => {
            try {
                const response = await axios.get(`/GetEvent/${eventId}`);
                setEventData(response.data);
                setArtistIdPair({[response.data.artistIds[0]] : response.data.artist_names[0]})
            } catch (error) {
                console.error("Error: ", error)
            }
        }
        getEventData();
    }, [eventId]);

    useEffect(() => {
        const getGenreName = async () => {
            try {
                const response = await axios.get(`/GetGenre/${eventData.genre_id}`);
                setGenreName(response.data.name)
                
            } catch (error) {
                console.error("Error:", error)
            }
        }
        getGenreName()
    },[eventData]);

    return (
        <div class='event-instance'>
            <h2 class="event-instance-text">{eventData.event_name}</h2>
            <h4 class="event-instance-text">at</h4>
            <h3 class="event-instance-text">{eventData.venue.name}</h3>
            {/* <img src="https://workingonmyredneck.com/wp-content/uploads/2021/07/iowa-speedway.jpeg" className="img-fluid rounded" alt="..." style={{
                width: '25%', height: '25%', objectFit: 'cover', objectPosition: 'center'
            }} /> */}
            <br></br>
            <span class="badge rounded-pill text-bg-secondary">Ticket Price :  
                {
                    eventData.price_range.length === 0 ?
                    <strong>No Listed Price</strong>
                    :
                    eventData.price_range.length === 1 ?
                    <strong>${eventData.price_range[0]}</strong>
                    :
                    <strong>${eventData.price_range[0]} to ${eventData.price_range[1]}</strong>
                }
                </span>
            <br></br>
            <br></br>
            <h6 className="inline" class="event-instance-text">Artist: </h6> 
            <button type="button" class="btn btn-primary">
            <Link to={`/artists/artistspage/${Object.keys(artistIdPair)[0]}`} style={{ color: 'white' }}>
                {Object.values(artistIdPair)[0]}
            </Link>
            </button>
            <br></br>
            <br></br>

            <p className="card-text" class="event-instance-text">{eventData.dateAndTime[0]}-{eventData.dateAndTime[1]}-{eventData.dateAndTime[2]}</p>
            <p className="card-text"><small className="text-body-secondary" class="event-instance-text">{eventData.venue.address}</small></p>
            <p class="event-instance-text"><strong>Genre: </strong>  <button type="button" class="btn btn-primary">
                <Link to={`/genre/${eventData.genre_id}`} style={{ color: 'white' }}>
                    {genreName}
                </Link>
            </button></p> 
            
            <br></br>
            <div class="link-container d-flex justify-content-between">
                <a href={eventData.ticketmaster_URL} rel="noreferrer" target="_blank" class = "btn btn-primary">TicketMaster</a>
                <br></br>
                <a href={eventData.venue.website} rel="nonreferre" target="_blank" class="btn btn-primary">Venue Website</a>
            </div>
        </div>
    )
}


export default VenueInfo