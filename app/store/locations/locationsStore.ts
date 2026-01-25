// store/locations/locationsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ubicacion } from '@/interfaces/locations';

interface LocationsState {
  locations: Ubicacion[];
  isLoaded: boolean;
  loadLocations: () => Promise<void>;
  addLocation: (location: Omit<Ubicacion, 'id'>) => void;
  updateLocation: (id: number, location: Omit<Ubicacion, 'id'>) => void;
  deleteLocation: (id: number) => void;
  setPrimaryLocation: (id: number) => void;
  getPrimaryLocation: () => Ubicacion | undefined;
  getLocationById: (id: number) => Ubicacion | undefined;
}

export const useLocationsStore = create<LocationsState>()(
  persist(
    (set, get) => ({
      locations: [],
      isLoaded: false,

      loadLocations: async () => {
        if (get().isLoaded && get().locations.length > 0) {
          return;
        }

        try {
          // Importar directamente el JSON
          const data = await import('@/data/locations.json');
          set({ 
            locations: data.ubicaciones || [],
            isLoaded: true 
          });
        } catch (error) {
          console.error('Error loading locations:', error);
          set({ 
            locations: [],
            isLoaded: true 
          });
        }
      },

      addLocation: (locationData) => {
        set((state) => {
          const newId = Math.max(...state.locations.map(l => l.id), 0) + 1;
          
          // Si la nueva ubicación es principal, quitar el principal de las demás
          const updatedLocations = locationData.esPrincipal
            ? state.locations.map(loc => ({ ...loc, esPrincipal: false }))
            : state.locations;

          return {
            locations: [...updatedLocations, { ...locationData, id: newId }]
          };
        });
      },

      updateLocation: (id, locationData) => {
        set((state) => {
          const locations = state.locations.map(loc => {
            if (loc.id === id) {
              return { ...locationData, id };
            }
            // Si la ubicación actualizada es principal, quitar el principal de las demás
            if (locationData.esPrincipal && loc.esPrincipal) {
              return { ...loc, esPrincipal: false };
            }
            return loc;
          });

          return { locations };
        });
      },

      deleteLocation: (id) => {
        set((state) => {
          const locationToDelete = state.locations.find(loc => loc.id === id);
          const remainingLocations = state.locations.filter(loc => loc.id !== id);

          // Si eliminamos la principal y hay otras, hacer principal la primera
          if (locationToDelete?.esPrincipal && remainingLocations.length > 0) {
            remainingLocations[0].esPrincipal = true;
          }

          return { locations: remainingLocations };
        });
      },

      setPrimaryLocation: (id) => {
        set((state) => ({
          locations: state.locations.map(loc => ({
            ...loc,
            esPrincipal: loc.id === id
          }))
        }));
      },

      getPrimaryLocation: () => {
        return get().locations.find(loc => loc.esPrincipal);
      },

      getLocationById: (id) => {
        return get().locations.find(loc => loc.id === id);
      }
    }),
    {
      name: 'locations-storage'
    }
  )
);