import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';

function GenreInstance() {
    const { genreId } = useParams();

    const [genreData, setGenreData] = useState({
        "name": "GenreName",
        "popular_artists": ["Artists 1 id"],
        "upcoming_events": ["Event 1 id"],
        "top_songs": ["Song 1", "Song 2", "Song 3"],
        "events_price_range": [0, 0]
    });

    const [eventIdPairs, setEventIdPairs] = useState({});
    const [artistsIdPairs, setArtistsIdPairs] = useState({});

    useEffect(() => {
        const getGenreData = async () => {
            try {
                const response = await axios.get(`/GetGenre/${genreId}`);
                setGenreData(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        getGenreData();
    }, [genreId]);

    useEffect(() => {
        const getEventNames = async () => {
            if (genreData.upcoming_events) {
                try {
                    const eventPromises = genreData.upcoming_events.map(async (eventId) => {
                        const response = await axios.get(`/GetEvent/${eventId}`);
                        return { eventId, eventName: response.data.event_name };
                    });
                    const eventNames = await Promise.all(eventPromises);
                    const eventIdPairs = Object.fromEntries(
                        eventNames.map(event => [event.eventId, event.eventName])
                    );
                    setEventIdPairs(eventIdPairs);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        const fetchArtistsNames = async () => {
            if (genreData.popular_artists) {
                try {
                    const namePromises = genreData.popular_artists.map(async (artistId) => {
                        const response = await axios.get(`/GetArtist/${artistId}`);
                        return { artistId, name: response.data.name };
                    });
                    const artistsNames = await Promise.all(namePromises);
                    const artistsIdPairs = Object.fromEntries(
                        artistsNames.map(artist => [artist.artistId, artist.name])
                    );
                    setArtistsIdPairs(artistsIdPairs);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        getEventNames();
        fetchArtistsNames();
    }, [genreData]);

    return (
        <>
            <div>
                <h1 className="genre-page-title mb-5 ">{genreData.name}</h1>
            </div>
            <div className="d-flex flex-row align-items-start justify-content-center genre-page text-start mt-5">

                <div className="genre-page-con d-flex flex-column mb-5">
                    <h1 className="genre-page-subtitle">Top songs </h1>
                    {genreData.top_songs.map((song, index) => (
                        index < 3 ? <h1 key={index} className="genre-page-text">{song}</h1> : null
                    ))}
                </div>

                <div className="genre-page-con d-flex flex-column mb-5">
                    <h1 className="genre-page-subtitle">Top Artists </h1>
                    {Object.entries(artistsIdPairs).map(([key, value], index) => (
                        <h1 key={index} className="genre-page-text">
                            <Link className="genre-page-link" to={`/artists/artistspage/${key}`}>{value}</Link>
                        </h1>
                    ))}
                </div>

                <div className="genre-page-con genre-page-venue d-flex flex-column mb-5 p-2 pb-3 rounded-4">
                    <h1 className="genre-page-subtitle mt-2">Venues </h1>
                    <h1 className="genre-page-price mb-4 ">${genreData.events_price_range[0]} - ${genreData.events_price_range[1]}</h1>
                    {Object.entries(eventIdPairs).map(([key, value], index) => (
                        <h1 key={index} className="genre-page-text mb-2">
                            <Link className="genre-page-link" to={`/venue/${key}`}>
                                {value.length < 17 ? value : `${value.substring(0, 14)}...`}
                            </Link>
                        </h1>
                    ))}
                </div>
            </div>
        </>
    );
}

export default GenreInstance;
