import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

function ArtistsCard(props) {
    const [genreName, setGenreName] = useState("defaultGenreName");
    const [eventIdPairs, setEventIdPairs] = useState({});

    useEffect(() => {
        const getGenreName = async () => {
            try {
                const response = await axios.get(`/GetGenre/${props.genreId}`);
                setGenreName(response.data.name);
            } catch (error) {
                console.error('Error fetching genre name:', error);
            }
        };
        getGenreName();
    }, [props.genreId]);

    useEffect(() => {
        const fetchEventNames = async () => {
            const eventNames = ["defaultEventName 1", "defaultEventName 2", "defaultEventName 3"];
            const limitedFutureEvents = [...props.futureEvents].slice(0, 3);

            while (limitedFutureEvents.length < 3) {
                limitedFutureEvents.push("");
            }

            for (let i = 0; i < 3; i++) {
                if (limitedFutureEvents[i] !== "") {
                    try {
                        const response = await axios.get(`/GetEvent/${limitedFutureEvents[i]}`);
                        eventNames[i] = response.data.event_name;
                    } catch (error) {
                        console.error('Error fetching event name:', error);
                    }
                }
            }

            const eventIdPairs = Object.fromEntries(
                limitedFutureEvents.map((key, index) => [key, eventNames[index]])
            );
            setEventIdPairs(eventIdPairs);
        };
        fetchEventNames();
    }, [props.futureEvents]);

    return (
        <div className="card artist-card p-2 border-0">
            <div className="d-flex justify-content-center mt-3">
                <img className="card-img-top circle-image" src={props.image_url} alt="artistsPic" />
            </div>

            <div className="card-body text-start d-flex flex-column">
                <div className="artist-card-container mb-4">
                    {
                        props.name.length < 8 ?
                            <Link className="artist-card-title artist-card-headers artist-card-link" to={`/artists/artistspage/${props.id}`}>{props.name}</Link>
                            :
                            props.name.length < 12 ?
                                <Link className="artist-card-title2 artist-card-headers artist-card-link" to={`/artists/artistspage/${props.id}`}>{props.name}</Link>
                                :
                                <Link className="artist-card-title3 artist-card-headers artist-card-link" to={`/artists/artistspage/${props.id}`}>{props.name}</Link>
                    }
                </div>
                <span><h1 className="artist-card-text"><Link className="artist-card-link artist-card-genre" to={`/genre/${props.genreId}`}>Genre: {genreName}</Link></h1></span>
                {
                    props.albums.length === 0 ?
                        <span><h1 className="artist-card-text">&nbsp;</h1></span>
                        :
                        props.albums[0].length < 8 ?
                            <span><h1 className="artist-card-text">Latest Album : {props.albums[0]}</h1></span>
                            :
                            <span><h1 className="artist-card-text">Latest Album : {props.albums[0].substring(0, 7) + "..."}</h1></span>
                }
                <span><h1 className="artist-card-text">Popularity: {props.popularity}</h1></span>
            </div>

            <div className="card-body text-start d-flex flex-column">
                <h1 className="artist-card-subtitle artist-card-headers">Events</h1>
                {
                    Object.entries(eventIdPairs).map(([key, value], index) => (
                        key !== "" ?
                            (props.futureEvents[0]?.length < 15 ?
                                <span key={index}><Link className="artist-card-link artist-card-text" to={`/venue/${key}`}>{value}</Link></span>
                                :
                                <span key={index}><Link className="artist-card-link artist-card-text" to={`/venue/${key}`}>{value.substring(0, 15) + "..."}</Link></span>)
                            :
                            <span key={index}><Link className="artist-card-link artist-card-text">&nbsp;</Link></span>
                    ))
                }
            </div>
        </div>
    );
}

export default ArtistsCard;
