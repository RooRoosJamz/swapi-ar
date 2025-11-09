import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { Starship } from "../types/Starship";
import StarshipForm from "../components/StarshipForm"; 
import StarshipModal from "./StarshipModal";
import Select from "react-select";
import 'bootstrap/dist/css/bootstrap.min.css';

const StarshipTable: React.FC = () => {
  const { token, logout } = useAuth();
  const [starships, setStarships] = useState<Starship[]>([]);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof Starship | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  // Filter state
  const [manufacturerFilter, setManufacturerFilter] = useState<string[]>([]);
  const [classFilter, setClassFilter] = useState<string[]>([]);
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  // Add/Edit Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingStarship, setEditingStarship] = useState<Starship | null>(null);  

  // Fetch all starships
  const fetchStarships = async () => {
    try {
      const response = await api.get("/Starship");
      setStarships(response.data);
    } catch (err: any) {
      console.error("Error fetching starships:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
      } else {
        setError("Failed to load starships.");
      }
    }
  };
  // Handle seeding starship data
  const handleSeedData = async () => {
    try {
      setMessage("Seeding data...");
      const response = await api.post("/StarshipSeeder/seed");
      setMessage(response.data || "Starships seeded successfully!");
      await fetchStarships(); // refresh table
    } catch (err: any) {
      console.error("Error seeding starships:", err);
      setMessage("Failed to seed starships.");
    }
  };
  // Handle sorting, by string or number
  const handleSort = (column: keyof Starship) => {
    let newDirection: "asc" | "desc" = "asc";
    if (sortColumn === column && sortDirection === "asc") {
      newDirection = "desc";
    }

    setSortColumn(column);
    setSortDirection(newDirection);

    const sorted = [...starships].sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      // Try to parse as number first, removing commas
      const numA = parseFloat((valueA?.toString() ?? "").replace(/,/g, ""));
      const numB = parseFloat((valueB?.toString() ?? "").replace(/,/g, ""));
      const isNumberA = !isNaN(numA);
      const isNumberB = !isNaN(numB);

      if (isNumberA && isNumberB) {
        //  If both are numbers, sort numerically
        return newDirection === "asc" ? numA - numB : numB - numA;
      } else {
        // Sort as strings
        const strA = valueA?.toString().toLowerCase() ?? "";
        const strB = valueB?.toString().toLowerCase() ?? "";
        // Sort by comparing strA and strB, 
        if (strA < strB) return newDirection === "asc" ? -1 : 1;
        if (strA > strB) return newDirection === "asc" ? 1 : -1;
        return 0;
      }
    });
    setStarships(sorted);
  };
  // Delete handler
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this starship?")) return;
    try {
      await api.delete(`/Starship/${id}`);
      // Remove from local state
      setStarships((prev) => prev.filter((ship) => ship.id !== id));
      setMessage("Starship deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting starship:", err);
      setMessage("Failed to delete starship.");
    }
  };
  // Add Handler, using model and form
  const handleAddStarship = async (newStarship: Starship) => {
    setStarships((prev) => [...prev, newStarship]);
    setShowForm(false);
  };
  // Update handler
  const handleUpdateStarship = async (updatedStarship: Starship) => {
    setStarships((prev) =>
      prev.map((ship) => (ship.id === updatedStarship.id ? updatedStarship : ship))
    );
    setEditingStarship(null);
    setShowForm(false);
  };
  // Filter options
  const manufacturerOptions = Array.from(
    new Set(starships.map((s) => s.manufacturer))
  ).map((m) => ({ value: m, label: m }));

  const classOptions = Array.from(
    new Set(starships.map((s) => s.starship_class))
  ).map((c) => ({ value: c, label: c }));

  // Initial fetch
  useEffect(() => {
    if (token) fetchStarships();
  }, [token, logout]);
  // If not logged in, show message
  if (!token) {
    return (
      <div style={{ textAlign: "center", paddingTop: "3rem" }}>
        <h3>Please log in to view starships.</h3>
      </div>
    );
  }
  // If error, show error message
  if (error) {
    return (
      <div style={{ textAlign: "center", paddingTop: "3rem", color: "red" }}>
        <h3>{error}</h3>
      </div>
    );
  }

  return (
    <div className="m-4">
      <h2 className="mb-3">Starships</h2>

      {/* See and Add Buttons */}
      <div className="mb-3 d-flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={handleSeedData}>
          Seed Data
          </button>
        <button
          className="btn btn-success"
          onClick={() => { setEditingStarship(null); setShowForm(true); }}
        >
          Add Starship
        </button>
        {message && <div className="mt-2">{message}</div>}
      </div>
      
      {/* Search & Filters */}
      <div className="mb-3 d-flex flex-wrap gap-2">
        {/* Search */}
        <input
          type="text"
          placeholder="Search starships..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control" style={{ minWidth: "250px", width: "50%" }}
        />
        {/* Filter by Manufacturer */}
        <div style={{ minWidth: "200px" }}>
          <label>Filter by Manufacturer</label>
          <Select
            isMulti
            options={manufacturerOptions}
            value={manufacturerOptions.filter((o) => manufacturerFilter.includes(o.value))}
            onChange={(selected) => setManufacturerFilter(selected.map((s) => s.value))}
          />
        </div>
        {/* Filter by Starship Class */}
        <div style={{ minWidth: "200px" }}>
          <label>Filter by Starship Class</label>
          <Select
            isMulti
            options={classOptions}
            value={classOptions.filter((o) => classFilter.includes(o.value))}
            onChange={(selected) => setClassFilter(selected.map((s) => s.value))}
          />
        </div>
      </div>


      {/* Starship Table */}
      {starships.length === 0 ? (
        <p>Loading starships...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              {/* Sortable Columns*/}
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("name")}
              >
                Name{" "}
                {sortColumn === "name" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("model")}
              >
                Model{" "}
                {sortColumn === "model" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("manufacturer")}
              >
                Manufacturer{" "}
                {sortColumn === "manufacturer" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("cost_in_credits")}
              >
                Cost In Credits{" "}
                {sortColumn === "cost_in_credits" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("length")}
              >
                Length{" "}
                {sortColumn === "length" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("max_atmosphering_speed")}
              >
                Max Atmosphering Speed{" "}
                {sortColumn === "max_atmosphering_speed" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("crew")}
              >
                Crew{" "}
                {sortColumn === "crew" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("passengers")}
              >
                Passengers{" "}
                {sortColumn === "passengers" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("cargo_capacity")}
              >
                Cargo Capacity{" "}
                {sortColumn === "cargo_capacity" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th style={th}>Consumables</th>
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("hyperdrive_rating")}
              >
                Hyperdrive Rating{" "}
                {sortColumn === "hyperdrive_rating" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("MGLT")}
              >
                MGLT{" "}
                {sortColumn === "MGLT" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("starship_class")}
              >
                Starship Class{" "}
                {sortColumn === "starship_class" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("created")}
              >
                Created{" "}
                {sortColumn === "created" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                style={{ ...th, cursor: "pointer" }}
                onClick={() => handleSort("edited")}
              >
                Edited{" "}
                {sortColumn === "edited" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th style={th}>Pilots</th>
              <th style={th}>Films</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>


          <tbody>
            {/* Apply filter before mapping */}
            {starships
              .filter((ship) => {
                const term = searchTerm.toLowerCase();
                {/* Search Filter */}
                const matchesSearch =
                      ship.name.toLowerCase().includes(term) ||
                      ship.model.toLowerCase().includes(term) ||
                      ship.manufacturer.toLowerCase().includes(term) ||
                      ship.starship_class.toLowerCase().includes(term) ||
                      ship.pilots.some((pilot) => pilot.toLowerCase().includes(term)) ||
                      ship.films?.some((film) => film.toLowerCase().includes(term));

                {/* Select Filter */}
                    const matchesManufacturer =
                      manufacturerFilter.length === 0 || manufacturerFilter.includes(ship.manufacturer);

                    const matchesClass =
                      classFilter.length === 0 || classFilter.includes(ship.starship_class);
                return matchesSearch && matchesManufacturer && matchesClass;
              })
              .map((ship) => (

              <tr key={ship.id}>
                <td style={td}>{ship.name}</td>
                <td style={td}>{ship.model}</td>
                <td style={td}>{ship.manufacturer}</td>
                <td style={td}>{ship.cost_in_credits}</td>
                <td style={td}>{ship.length}</td>
                <td style={td}>{ship.max_atmosphering_speed}</td>
                <td style={td}>{ship.crew}</td>
                <td style={td}>{ship.passengers}</td>
                <td style={td}>{ship.cargo_capacity}</td>
                <td style={td}>{ship.consumables}</td>
                <td style={td}>{ship.hyperdrive_rating}</td>
                <td style={td}>{ship.MGLT}</td>
                <td style={td}>{ship.starship_class}</td>
                <td style={td}>
                  {ship.created ? new Date(ship.created).toLocaleDateString() : ""}
                </td>
                <td style={td}>
                  {ship.edited ? new Date(ship.edited).toLocaleDateString() : ""}
                </td>
                <td style={td}>
                  {ship.pilots.length > 0 
                  ? ship.pilots?.join(", ") 
                  : <span style={{ color: "#888" }}>No pilots</span>}
                  </td>
                <td style={td}>{ship.films?.join(", ")}</td>
                {/* Actions: Edit/Delete */}
                <td style={td}>
                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setEditingStarship(ship);
                      setShowForm(true);
                    }}
                    className="btn btn-primary btn-sm me-2 mb-1 px-3"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(ship.id)}
                    className="btn btn-danger btn-sm mb-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {/* Modal to Add/Edit*/}
      {showForm && (
        <StarshipModal onClose={() => { 
          setShowForm(false); 
          setEditingStarship(null); 
          }}>
          <StarshipForm
            onAdd={handleAddStarship}
            onUpdate={handleUpdateStarship}
            existingStarship={editingStarship}
          />
        </StarshipModal>
      )}
    </div>
  );
};

const th: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
};

const td: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
};

export default StarshipTable;


