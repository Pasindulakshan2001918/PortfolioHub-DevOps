import { useEffect, useState } from "react";
import axios from "axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [tech, setTech] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;


  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/api/projects`,
        { title, description, link, tech },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects((p) => [res.data, ...p]);
      setTitle("");
      setDescription("");
      setLink("");
      setTech("");
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add project");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <header className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-blue-400">My Projects</h1>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleAdd} className="space-y-4 mb-6 bg-gray-800 p-6 rounded-2xl">
            {error && <p className="text-red-400">{error}</p>}
            <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Project title" className="w-full px-4 py-2 rounded bg-gray-700" />
            <input value={link} onChange={(e)=>setLink(e.target.value)} placeholder="Project link (optional)" className="w-full px-4 py-2 rounded bg-gray-700" />
            <input value={tech} onChange={(e)=>setTech(e.target.value)} placeholder="Tech (comma separated)" className="w-full px-4 py-2 rounded bg-gray-700" />
            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full px-4 py-2 rounded bg-gray-700" />
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 bg-blue-500 rounded-lg">Add Project</button>
            </div>
          </form>

          <div className="grid gap-4">
            {projects.length === 0 && <p className="text-gray-400">No projects yet.</p>}
            {projects.map(p => (
              <div key={p._id} className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-blue-400">{p.title}</h3>
                    <p className="text-gray-300 mt-1">{p.description}</p>
                    {p.link && <a href={p.link} className="text-sm text-purple-400" target="_blank" rel="noreferrer">{p.link}</a>}
                    {p.tech?.length > 0 && <p className="text-sm text-gray-400 mt-2">{p.tech.join(', ')}</p>}
                  </div>
                  <div className="space-x-2">
                    <button onClick={()=>handleDelete(p._id)} className="px-3 py-1 bg-red-500 rounded">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Projects;
