"use client";
import { useState, useMemo } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ResidentSearch = ({
  residents = [],
  onSelectResident,
  label = "Buscar menu por residente",
  placeholder = "Buscar por nombre del residente...",
}) => {
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Filter residents based on search term
  const filteredResidents = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const searchLower = searchTerm.toLowerCase().trim();
    return residents.filter((resident) =>
      resident.full_name?.toLowerCase().includes(searchLower)
    );
  }, [searchTerm, residents]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(true);
    if (!value.trim()) {
      setSelectedResident(null);
      onSelectResident?.(null);
    }
  };

  // Handle form submit (prevent page reload)
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Handle resident selection
  const handleSelectResident = (resident) => {
    setSelectedResident(resident);
    setSearchTerm(resident.full_name);
    setShowResults(false);
    onSelectResident?.(resident);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedResident(null);
    setShowResults(false);
    onSelectResident?.(null);
  };

  return (
    <div className="mb-6">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center border-b border-gray-200">
          <label htmlFor="search-field" className="sr-only">
            Buscar residente
          </label>
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
          />
          <input
            id="search-field"
            name="search"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => searchTerm.trim() && setShowResults(true)}
            placeholder={placeholder}
            className="block w-full border-0 py-2 pl-8 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            autoComplete="off"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-gray-600"
              aria-label="Limpiar búsqueda"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchTerm.trim() && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
            {filteredResidents.length > 0 ? (
              <ul className="py-1">
                {filteredResidents.map((resident) => (
                  <li key={resident.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectResident(resident)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
                    >
                      <div className="font-medium">{resident.full_name}</div>
                      {resident.room_number && (
                        <div className="text-xs text-gray-500">
                          Habitación: {resident.room_number}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                No se encontraron residentes con ese nombre
              </div>
            )}
          </div>
        )}
      </form>

      {/* Selected Resident Info */}
      {selectedResident && (
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-indigo-900">
                Residente seleccionado:
              </h3>
              <p className="text-lg font-semibold text-indigo-700 mt-1">
                {selectedResident.full_name}
              </p>
              {selectedResident.room_number && (
                <p className="text-sm text-indigo-600">
                  Habitación: {selectedResident.room_number}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
              Cambiar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentSearch;

