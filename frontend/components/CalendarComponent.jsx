import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CaendarComponent.css';
import { Calendar as CalendarIcon, Clock, Trophy, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CalendarComponent = () => {
    const [contests, setContests] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-slate-600/70"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </button>
                        
                        <div className="text-center">
                            <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-4">
                                <Trophy className="h-5 w-5 text-blue-400" />
                                <span className="text-blue-400 font-medium">Competitive Programming</span>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">CodeForces Contest Calendar</span>
                            </h1>
                            <p className="text-slate-400">Stay updated with upcoming coding competitions</p>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600/50">
                            <CalendarIcon className="h-4 w-4 text-blue-400" />
                            <span className="text-slate-300 text-sm">{contests.length} contests</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left: Calendar */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <CalendarIcon className="h-6 w-6 text-blue-400" />
                                    Contest Calendar
                                </h2>
                                <p className="text-slate-400">Select a date to view contests</p>
                            </div>

                            <div className="contest-calendar-wrapper">
                                <Calendar 
                                    onChange={handleDateChange} 
                                    value={selectedDate}
                                    className="contest-calendar"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Events */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <Trophy className="h-6 w-6 text-blue-400" />
                                    Contests on {selectedDate.toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </h2>
                                <p className="text-slate-400">
                                    {events.length > 0 
                                        ? `${events.length} contest${events.length > 1 ? 's' : ''} scheduled`
                                        : 'No contests scheduled for this date'
                                    }
                                </p>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="text-center">
                                        <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                                        <p className="text-slate-400">Loading contests...</p>
                                    </div>
                                </div>
                            ) : events.length > 0 ? (
                                <div className="space-y-4">
                                    {events.map((event, index) => (
                                        <div key={index} className="bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-600/70 rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                                                        {event.name}
                                                    </h3>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-slate-300">
                                                            <Clock className="h-4 w-4 text-blue-400" />
                                                            <span className="text-sm">{formatDateTime(event.startTimeSeconds)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-300">
                                                            <Trophy className="h-4 w-4 text-yellow-400" />
                                                            <span className="text-sm">Duration: {formatDuration(event.durationSeconds)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-600/50">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                    <span className="text-sm text-green-300">Upcoming</span>
                                                </div>
                                                <a
                                                    href={`https://codeforces.com/contest/${event.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    View Contest
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Trophy className="h-10 w-10 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">No Contests Today</h3>
                                    <p className="text-slate-400">Select another date to view upcoming contests</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-8">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <CalendarIcon className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="text-2xl font-bold text-white">{contests.length}</div>
                                <div className="text-sm text-slate-400">Total Contests</div>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Clock className="h-6 w-6 text-green-400" />
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {contests.filter(c => new Date(c.startTimeSeconds * 1000) > new Date()).length}
                                </div>
                                <div className="text-sm text-slate-400">Upcoming</div>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Trophy className="h-6 w-6 text-yellow-400" />
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {events.length}
                                </div>
                                <div className="text-sm text-slate-400">Today's Events</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarComponent;
