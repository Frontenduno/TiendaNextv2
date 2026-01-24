import { LocationCard } from "../feature/LocationCard";
import { DistrictFilter } from "../feature/DistrictFilter";
import { Location } from "@/interfaces/footer/location/location";

interface LocationsGridProps {
  locations: Location[];
  districts: string[];
  initialDistrict?: string;
}

export function LocationsGrid({ locations, districts, initialDistrict = "Todos" }: LocationsGridProps) {
  const selectedDistrict = initialDistrict;

  const filteredLocations = selectedDistrict === "Todos"
    ? locations
    : locations.filter((location) => location.district === selectedDistrict);

  return (
    <div className="space-y-8">
      <DistrictFilter
        districts={districts}
        selectedDistrict={selectedDistrict}
      />

      {filteredLocations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron tiendas en {selectedDistrict}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600">
            Mostrando {filteredLocations.length} tienda{filteredLocations.length !== 1 ? 's' : ''} 
            {selectedDistrict !== "Todos" && ` en ${selectedDistrict}`}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
