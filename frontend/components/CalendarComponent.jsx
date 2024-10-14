import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./CaendarComponent.css"

const CalendarComponent = () => {
    const [contests, setContests] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    fetchContests();
    }, []);

    useEffect(() => {
    filterEventsByDate(selectedDate);
    }, [selectedDate, contests]);

    const fetchContests = async () => {
    setLoading(true); 
    try {
        const response = await axios.get('https://codeforces.com/api/contest.list');
        const upcomingContests = response.data.result.filter(contest => contest.phase === 'BEFORE');
        setContests(upcomingContests);
    } catch (error) {
        console.error('Error fetching contests', error);
    } finally {
        setLoading(false); 
    }
    };

    const filterEventsByDate = (date) => {
    const eventsOnDate = contests.filter(contest => {
      const contestDate = new Date(contest.startTimeSeconds * 1000);
        return contestDate.toDateString() === date.toDateString();
    });
    setEvents(eventsOnDate);
    };

    const handleDateChange = (date) => {
    setSelectedDate(date);
    };

    return (
    <div className="calendar-container">
        <h1>Codeforces Upcoming Contests</h1>
        <Calendar onChange={handleDateChange} value={selectedDate} />
        {loading ? (
        <p>Loading...</p>
        ) : (
        <div className="events">
            {events.length > 0 ? (
            events.map((event, index) => (
                <div key={index} className="event">
                <h2>{event.name}</h2>
                <p>
                  Start Time: {new Date(event.startTimeSeconds * 1000).toLocaleString()}
                </p>
                <p>Duration: {event.durationSeconds / 3600} hours</p>
                </div>
            ))
            ) : (
            <p>No contests on this date</p>
            )}
        </div>
        )}
    </div>
    );
};

export default CalendarComponent;
