import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserCog, Save, Loader2, FileText, Settings, Code2, PlusCircle } from "lucide-react";

function UpdateProfile() {
  const [formData, setFormData] = useState({
    favlanguage: '',
    rating: '',
    platform: '',
    gitHub: '',
    projectslinks: [''],
    skills: [''],
    collaborator: false,
  });

  const navigate = useNavigate();
  const { userId } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/myprofile/${userId}`, {
          withCredentials: true,
        });
        const user = response.data.user;
        setFormData({
          favlanguage: user.favlanguage || '',
          rating: user.rating || '',
          platform: user.platform || '',
          gitHub: user.gitHub || '',
          projectslinks: user.projectslinks || [''],
          skills: user.skills || [''],
          collaborator: user.collaborator || false,
        });
      } catch {
        setError('Failed to fetch user data');
      }
    }
    fetchUserProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (index, e) => {
    const { name, value } = e.target;
    const updatedArray = [...formData[name]];
    updatedArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      [name]: updatedArray,
    }));
  };

  const handleAddItem = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: [...prev[name], ''],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/myprofile/${userId}/updateprofile`,
        formData,
        { withCredentials: true }
      );
      navigate(`/myprofile/${userId}`);
      setSuccess('Profile updated successfully!');
    } catch {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(`/myprofile/${userId}`)}
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-slate-600/70"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </button>

            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-4">
                <UserCog className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Edit Profile</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Update Profile
                </span>
              </h1>
              <p className="text-slate-400">Modify your account details and preferences</p>
            </div>

            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg border border-slate-600/50">
              <Code2 className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300 text-sm">Profile Editor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-400" />
                Basic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-white">Favorite Language</label>
                  <input
                    type="text"
                    name="favlanguage"
                    value={formData.favlanguage}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-white">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Platform & GitHub */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Settings className="h-6 w-6 text-purple-400" />
                Platform & Links
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-white">Platform</label>
                  <input
                    type="text"
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-white">GitHub</label>
                  <input
                    type="url"
                    name="gitHub"
                    value={formData.gitHub}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Projects & Skills */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <PlusCircle className="h-6 w-6 text-green-400" />
                Projects & Skills
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-white">Project Links</label>
                  {formData.projectslinks.map((link, i) => (
                    <input
                      key={i}
                      type="text"
                      name="projectslinks"
                      value={link}
                      onChange={(e) => handleArrayChange(i, e)}
                      className="w-full mb-2 p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddItem('projectslinks')}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    + Add Project
                  </button>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-white">Skills</label>
                  {formData.skills.map((skill, i) => (
                    <input
                      key={i}
                      type="text"
                      name="skills"
                      value={skill}
                      onChange={(e) => handleArrayChange(i, e)}
                      className="w-full mb-2 p-3 rounded-lg bg-slate-700/50 text-white border border-slate-600/50 focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddItem('skills')}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>
            </div>

            {/* Collaborator */}
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <UserCog className="h-6 w-6 text-cyan-400" />
                Collaboration
              </h3>
              <div className="flex items-center gap-4">
                <label className="text-base text-white">Open to Collaborate?</label>
                <input
                  type="checkbox"
                  checked={formData.collaborator}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, collaborator: e.target.checked }))
                  }
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-slate-300">{formData.collaborator ? 'Yes' : 'No'}</span>
              </div>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Update Profile
                  </>
                )}
              </button>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center">
                <p className="text-red-200">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center">
                <p className="text-green-200">{success}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
