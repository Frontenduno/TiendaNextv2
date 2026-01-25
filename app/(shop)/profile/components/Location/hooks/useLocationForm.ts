// app/profile/components/hooks/useLocationForm.ts
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ubicacion } from '@/interfaces/locations';
import { locationSchema, LocationFormData } from '@/utils/validations/schemas';

interface Department {
  id: string;
  name: string;
}

interface Province {
  id: string;
  name: string;
  department_id: string;
}

interface District {
  id: string;
  name: string;
  province_id: string;
  department_id: string;
}

interface UbigeoData {
  departments: Department[];
  provinces: Province[];
  districts: District[];
}

export const useLocationForm = (location: Ubicacion | null | undefined, isOpen: boolean) => {
  const [ubigeoData, setUbigeoData] = useState<UbigeoData | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);

  const formMethods = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      alias: '',
      direccion: '',
      distrito: '',
      ciudad: 'Lima',
      referencia: '',
      nombreContacto: '',
      telefono: '',
      esPrincipal: false,
    },
  });

  const { reset, setValue } = formMethods;

  // Cargar datos de ubigeo
  useEffect(() => {
    const fetchUbigeo = async () => {
      try {
        const response = await fetch('/api/ubigeo');
        const data = await response.json();
        setUbigeoData(data[0]);
      } catch (error) {
        console.error('Error al cargar ubigeos:', error);
      }
    };

    fetchUbigeo();
  }, []);

  // Filtrar provincias cuando cambia el departamento
  useEffect(() => {
    const filterProvinces = () => {
      if (ubigeoData && selectedDepartment) {
        const provinces = ubigeoData.provinces.filter(
          (p) => p.department_id === selectedDepartment
        );
        setFilteredProvinces(provinces);
        setFilteredDistricts([]);
        setSelectedProvince('');
      } else {
        setFilteredProvinces([]);
        setFilteredDistricts([]);
      }
    };
    
    filterProvinces();
  }, [selectedDepartment, ubigeoData]);

  // Filtrar distritos cuando cambia la provincia
  useEffect(() => {
    const filterDistricts = () => {
      if (ubigeoData && selectedProvince) {
        const districts = ubigeoData.districts.filter(
          (d) => d.province_id === selectedProvince
        );
        setFilteredDistricts(districts);
      } else {
        setFilteredDistricts([]);
      }
    };
    
    filterDistricts();
  }, [selectedProvince, ubigeoData]);

  // Reset form when location or modal state changes
  useEffect(() => {
    if (location) {
      reset({
        alias: location.alias,
        direccion: location.direccion,
        distrito: location.distrito,
        ciudad: location.ciudad,
        referencia: location.referencia,
        nombreContacto: location.nombreContacto,
        telefono: location.telefono,
        esPrincipal: location.esPrincipal,
      });
    } else {
      reset({
        alias: '',
        direccion: '',
        distrito: '',
        ciudad: 'Lima',
        referencia: '',
        nombreContacto: '',
        telefono: '',
        esPrincipal: false,
      });
    }
  }, [location, isOpen, reset]);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value;
    setSelectedDepartment(deptId);
    
    const dept = ubigeoData?.departments.find(d => d.id === deptId);
    if (dept) {
      setValue('ciudad', dept.name);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    const district = ubigeoData?.districts.find(d => d.id === districtId);
    if (district) {
      setValue('distrito', district.name);
    }
  };

  const resetForm = () => {
    reset();
    setSelectedDepartment('');
    setSelectedProvince('');
  };

  return {
    formMethods,
    ubigeoData,
    selectedDepartment,
    selectedProvince,
    filteredProvinces,
    filteredDistricts,
    setSelectedProvince,
    handleDepartmentChange,
    handleDistrictChange,
    resetForm,
  };
};