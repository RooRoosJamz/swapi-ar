import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Starship } from "../types/Starship";
import Select, { MultiValue } from "react-select";

interface StarshipFormProps {
  onAdd?: (newStarship: Starship) => void;
  onUpdate?: (updatedStarship: Starship) => void;
  existingStarship?: Starship | null;
}

const StarshipForm: React.FC<StarshipFormProps> = ({ onAdd, onUpdate,existingStarship }) => {
  const [form, setForm] = useState<Partial<Starship>>({
    name: "",
    model: "",
    manufacturer: "",
    cost_in_credits: "",
    length: "",
    max_atmosphering_speed: "",
    crew: "",
    passengers: "",
    cargo_capacity: "",
    consumables: "",
    hyperdrive_rating: "",
    MGLT: "",
    starship_class: "",
    pilots: [],
    films: [],
  });

  const [message, setMessage] = useState<string>("");

  // Pilot options
  const [pilotOptions, setPilotOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Film options. (Could be fetched from API)
  const filmOptions = [
    "A New Hope",
    "The Empire Strikes Back",
    "Return of the Jedi",
    "The Phantom Menace",
    "Attack of the Clones",
    "Revenge of the Sith",
  ].map((f) => ({ value: f, label: f }));

  // Populate form with existing starship data if editing
  useEffect(() => {
    if (existingStarship) {
      setForm(existingStarship);
    }
  }, [existingStarship]);

  // Fetch pilot from backend
  useEffect(() => {
    const fetchPilots = async () => {
      try {
        const response = await api.get<{ name: string }[]>("/Swapi/people"); 
        const options = response.data.map((p) => ({
          value: p.name,
          label: p.name,
        }));
        setPilotOptions(options);
      } catch (error) {
        console.error("Error fetching pilots:", error);
      }
    };

    fetchPilots();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for creating a new starship and updating existing starship
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        if (existingStarship && onUpdate) {
            // Update existing starship
            const response = await api.put<Starship>(`/Starship/${existingStarship.id}`, { 
                ...form,
                edited: new Date().toISOString() 
            });
            onUpdate(response.data);
            setMessage("Starship updated successfully!");
            return;
        } else if (onAdd) {
            // Create new starship
            const response = await api.post<Starship>("/Starship", {
                ...form,
                created: new Date().toISOString(),
                edited: new Date().toISOString()
            });
            onAdd(response.data);
            setMessage("Starship created successfully!");
        }

        // Reset form
        setForm({
            name: "",
            model: "",
            manufacturer: "",
            cost_in_credits: "",
            length: "",
            max_atmosphering_speed: "",
            crew: "",
            passengers: "",
            cargo_capacity: "",
            consumables: "",
            hyperdrive_rating: "",
            MGLT: "",
            starship_class: "",
            pilots: [],
            films: [],
        });
    } catch (err: any) {
      console.error("Error submitting starship:", err);
      setMessage("Failed to submit   starship.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{existingStarship ? "Update Starship" : "Add New Starship"}</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {Object.keys(form).map((key) => {
        // Hide fields that are not editable by user
        if (
          key === "id" ||
          key === "created" ||
          key === "edited" ||
          key === "url"
        ) return null;

          // Show multi-select for films
          if (key === "films") {
            return (
              <div key={key} style={{ minWidth: "250px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>
                  Films
                </label>
                <Select
                  isMulti
                  options={filmOptions}
                  value={(form.films ?? []).map((f) => ({ value: f, label: f }))}
                  onChange={(selected: MultiValue<{ value: string; label: string }>) =>
                    setForm({
                      ...form,
                      films: selected.map((s) => s.value),
                    })
                  }
                />
              </div>
            );
          }

          // Show multi-select for pilots
            if (key === "pilots") {
                return (
                <div key={key} style={{ minWidth: "250px" }}>
                    <label style={{ display: "block", marginBottom: "4px" }}>
                    Pilots
                    </label>
                    <Select
                    isMulti
                    options={pilotOptions}
                    value={(form.pilots ?? []).map((p) => ({
                        value: p,
                        label: p,
                    }))}
                    onChange={(selected: MultiValue<{ value: string; label: string }>) =>
                        setForm({
                        ...form,
                        pilots: selected.map((s) => s.value),
                        })
                    }
                    />
                </div>
                );
            }
          // Regular input for other fields
          return (
            <input
              key={key}
              name={key}
              placeholder={key.replaceAll("_", " ")}
              value={(form as any)[key] ?? ""}
              onChange={handleChange}
            />
          );
        })}
      </div>
      <button type="submit" style={{ marginTop: "10px" }}>
        {existingStarship ? "Update" : "Create"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default StarshipForm;
