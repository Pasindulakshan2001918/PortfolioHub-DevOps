import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login"); 
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const API_URL = import.meta.env.VITE_API_URL || "http://13.233.164.96:5000";

        const res = await axios.get(`${API_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data || []);
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const profileCompletion = () => {
    if (!user) return 0;
    const fields = [user.name, user.email, user.linkedin, user.career, user.bio, user.skills];
    const total = fields.length;
    let filled = 0;
    fields.forEach(f => {
      if (Array.isArray(f)) {
        if (f.length > 0) filled++;
      } else if (f) filled++;
    });
    return Math.round((filled / total) * 100);
  };

  const avatarMarkup = () => {
    if (!user) return null;
    if (user.avatar) {
      return (
        <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
      );
    }
    // fallback: initials
    const initials = user.name ? user.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() : 'U';
    return (
      <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">{initials}</div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">

      <header className="flex justify-between items-center px-8 py-6 bg-gray-800 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-blue-400">PortfolioHub</div>
          
        </div>

        <div className="flex-1 flex justify-center">
          <nav className="flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
            <Link to="/projects" className="text-gray-300 hover:text-white">Projects</Link>
            <Link to="/profile" className="text-gray-300 hover:text-white">Profile</Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3">
              {avatarMarkup()}
            </div>
          )}
          <button onClick={handleLogout} className="px-3 py-2 bg-red-500 rounded hover:bg-red-600">Logout</button>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <section className="md:col-span-1 bg-gray-800 p-6 rounded-2xl">
            <div className="flex items-center space-x-4">
              {avatarMarkup()}
              <div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-sm text-gray-300">{user?.career || 'Your Profession'}</p>
                <p className="mt-2 text-gray-400 text-sm">{user?.bio || 'Add a short professional bio on your profile.'}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm text-gray-400">Contact</h3>
              <p className="text-sm mt-1 text-blue-300"><a href={user?.linkedin || '#'} target="_blank" rel="noreferrer">{user?.linkedin ? 'LinkedIn' : 'Add LinkedIn'}</a></p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm text-gray-400">Skills</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {(user?.skills || []).slice(0,8).map((s, i) => (
                  <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded">{s}</span>
                ))}
                {(!user?.skills || user.skills.length === 0) && <span className="text-sm text-gray-500">No skills added</span>}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm text-gray-400">Profile Completion</h3>
              <div className="mt-2 bg-gray-700 rounded-full h-3 overflow-hidden">
                <div className="h-3 bg-green-400" style={{ width: `${profileCompletion()}%` }} />
              </div>
              <div className="text-sm text-gray-300 mt-1">{profileCompletion()}% complete</div>
            </div>
          </section>

          <section className="md:col-span-2">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h4 className="text-sm text-gray-400">Total Projects</h4>
                <div className="text-3xl font-bold text-blue-400">{projects.length}</div>
              </div>
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h4 className="text-sm text-gray-400">Skills Highlighted</h4>
                <div className="text-3xl font-bold text-purple-400">{(user?.skills || []).length}</div>
              </div>
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h4 className="text-sm text-gray-400">Recent Activity</h4>
                <div className="text-3xl font-bold text-green-400">{projects.length > 0 ? 'Active' : 'Idle'}</div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Recent Projects</h3>
                <Link to="/projects" className="text-sm text-blue-400">Manage Projects</Link>
              </div>

              <div className="grid gap-4">
                {projects.length === 0 && <p className="text-gray-400">You haven't added any projects yet. Click Manage Projects to add your first one.</p>}
                {projects.slice(0,6).map(p => (
                  <div key={p._id} className="p-4 bg-gray-900 rounded-lg flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-white">{p.title}</h4>
                      <p className="text-sm text-gray-300">{p.description}</p>
                      <div className="text-xs text-gray-400 mt-2">{p.tech?.join(', ')}</div>
                    </div>
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-blue-400">View</a>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-4 text-center text-gray-500 text-sm">
        © 2025 PortfolioHub. All rights reserved.
      </footer>
    </div>
  );
}

export default Dashboard;
