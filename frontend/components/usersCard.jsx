import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react';

function UsersCard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getUsers() {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/top-users`, { withCredentials: true });
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    }
    getUsers();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-400 fill-current" />;
    if (index === 1) return <Medal className="h-5 w-5 text-slate-300 fill-current" />;
    if (index === 2) return <Award className="h-5 w-5 text-amber-600 fill-current" />;
    return <span className="text-slate-400 font-bold">{index + 1}</span>;
  };

  const getRankColor = (index) => {
    if (index === 0) return "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
    if (index === 1) return "from-slate-500/20 to-slate-600/20 border-slate-500/30";
    if (index === 2) return "from-amber-600/20 to-amber-700/20 border-amber-600/30";
    return "from-slate-700/20 to-slate-800/20 border-slate-700/30";
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Top Users</h2>
            <p className="text-slate-400 text-sm">Leading the coding community</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-3" />
            <p className="text-slate-400 text-sm">Loading top users...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : users.length > 0 ? (
          <div className="space-y-3">
            {users.map((user, index) => (
              <div
                key={user._id}
                className={`group bg-gradient-to-r ${getRankColor(index)} border ${getRankColor(index).split(' ')[2]} rounded-xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(index)}
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                        {user.username}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-lg border border-slate-600/50">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    <span className="text-sm font-medium text-green-400">
                      {user.solutionsCount} Solutions
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-400 font-medium">No top users yet</p>
            <p className="text-slate-500 text-sm mt-1">Be the first to solve problems!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {/* <div className="p-6 pt-0">
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Total Active Users</span>
            <span className="text-white font-semibold">156</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-slate-400">This Week</span>
            <span className="text-green-400 font-semibold">+12</span>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default UsersCard;
  