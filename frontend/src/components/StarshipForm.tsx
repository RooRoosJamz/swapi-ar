import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Starship } from "../types/Starship";
import Select, { MultiValue } from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

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
    <form onSubmit={handleSubmit} className="p-3">
      <h3 className="mb-4 text-center">
        {existingStarship ? "Update Starship" : "Add New Starship"}
      </h3>

       <div className="row g-3">
        {Object.keys(form).map((key) => {
          if (["id", "created", "edited", "url"].includes(key)) return null;

          {/** Multi-select for Films */}
          if (key === "films") {
            return (
              <div className="col-md-6" key={key}>
                <Select
                  isMulti
                  options={filmOptions}
                  placeholder="Select Films"
                  value={(form.films ?? []).map((f) => ({
                    value: f,
                    label: f,
                  }))}
                  onChange={(
                    selected: MultiValue<{ value: string; label: string }>
                  ) =>
                    setForm({
                      ...form,
                      films: selected.map((s) => s.value),
                    })
                  }
                />
              </div>
            );
          }

          {/** Multi-select for Pilots */}
          if (key === "pilots") {
            return (
              <div className="col-md-6" key={key}>
                <Select
                  isMulti
                  options={pilotOptions}
                  value={(form.pilots ?? []).map((p) => ({
                    value: p,
                    label: p,
                  }))}
                  placeholder="Select Pilots"
                  onChange={(
                    selected: MultiValue<{ value: string; label: string }>
                  ) =>
                    setForm({
                      ...form,
                      pilots: selected.map((s) => s.value),
                    })
                  }
                />
              </div>
            );
          }

          {/** Default input fields */}
          return (
            <div className="col-md-6" key={key}>
              <input
                name={key}
                className="form-control"
                placeholder={key.replaceAll("_", " ")}
                value={(form as any)[key] ?? ""}
                onChange={handleChange}
              />
            </div>
          );
        })}
      </div>

      {/* Create/Update Button */}
      <div className="mt-4 text-center">
        <button type="submit" className="btn btn-primary px-4">
          {existingStarship ? "Update" : "Create"}
        </button>
        {message && (
          <div
            className={`alert mt-3 ${
              message.includes("successfully")
                ? "alert-success"
                : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </form>
  );
};


export default StarshipForm;
