import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const stored = localStorage.getItem("user");
  const storedUser = stored ? JSON.parse(stored) : null;

  const [name, setName] = useState(storedUser?.name || "");
  const [email, setEmail] = useState(storedUser?.email || "");
  const [avatarData, setAvatarData] = useState(storedUser?.avatar || "");
  const [avatarPreview, setAvatarPreview] = useState(storedUser?.avatar || "");
  const [linkedin, setLinkedin] = useState(storedUser?.linkedin || "");
  const [career, setCareer] = useState(storedUser?.career || "");
  const [bio, setBio] = useState(storedUser?.bio || "");
  const [skills, setSkills] = useState((storedUser?.skills || []).join(", "));
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;


  const token = localStorage.getItem("token");

  useEffect(()=>{
    if (!storedUser) navigate('/login');
  },[storedUser, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/api/auth/users/${storedUser._id}`,
        { name, email, linkedin, career, bio, avatar: avatarData, skills: skills.split(',').map(s=>s.trim()).filter(Boolean) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // update localStorage user
      const updated = { ...res.data };
      localStorage.setItem('user', JSON.stringify(updated));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setAvatarData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <header className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-blue-400">Edit Profile</h1>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-2xl">
          {error && <p className="text-red-400">{error}</p>}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">No photo</div>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-300">Upload profile photo</label>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="mt-2 text-sm" />
              </div>
            </div>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-700" placeholder="Full name" />
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-700" placeholder="Email" />
            <input value={linkedin} onChange={(e)=>setLinkedin(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-700" placeholder="LinkedIn URL" />
            <input value={career} onChange={(e)=>setCareer(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-700" placeholder="Career / Position" />
            <textarea value={bio} onChange={(e)=>setBio(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-700" placeholder="Short bio" />
            <input value={skills} onChange={(e)=>setSkills(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-700" placeholder="Skills (comma separated)" />
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 bg-blue-500 rounded-lg">Save</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile;
