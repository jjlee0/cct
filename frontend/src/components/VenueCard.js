import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios'


function VenueCard(props) {
    console.log(props)

    const [genreName, setGenreName] = useState("defaultGenreName")
    useEffect(() => {
        const getGenreName = async () => {
            try {
                const response = await axios.get(`/GetGenre/${props.genreId}`);
                
                setGenreName(response.data.name)
            } catch (error) {
                console.error("Error:", error)
            }
        }
        getGenreName()
    },[props.genreId]);

    return (
        <div className="card mb-3">
            <div className="row g-0">
                {/* <div className="col-md-4"> 
                    <img src="https://workingonmyredneck.com/wp-content/uploads/2021/07/iowa-speedway.jpeg" className="img-fluid rounded-start" alt="..." style={{
                        width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'
                    }} />
                </div> */}
                <div className="col-md-12">
                    <div className="card-body event-card">
                        <Link to={`/venue/${props.eventId}`}><h5  class="event-name event-card-link">{props.eventName}</h5></Link> 
                        {
                                props.priceRange.length === 0 ? 
                            ( <p>Ticket Price: <strong>No listed price</strong></p>)
                            :
                            props.priceRange.length == 1 || props.priceRange[0] === props.priceRange[1] ?
                            (<p>Ticket Price: <strong>${props.priceRange[0]}</strong></p>)
                            :
                            ( <p>Ticket Price: <strong>${props.priceRange[0]} to ${props.priceRange[1]}</strong></p>)
                        }
                        <p className="card-text">{props.dateAndTime[0]}-{props.dateAndTime[1]}-{props.dateAndTime[2]}</p>
                        <Link  className="btn btn-primary" >{props.artistNames[0]}</Link>
                        <p className="card-text"><small className="text-body-secondary" class="event-address">{props.venue.address}</small></p>
                        <p><strong>Genres: </strong> <Link class="event-card-link" to={`/genre/${props.genreId}`}>{genreName}</Link> </p> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VenueCard;