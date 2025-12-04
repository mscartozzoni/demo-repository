import { useState, useEffect, useCallback } from 'react';

// Persisting mock data in memory to simulate a database
let mockServiceClasses = [
    { id: 'sc1', name: 'Procedimento Cirúrgico', description: 'Serviços que necessitam de centro cirúrgico.', icon: 'Scissors' },
    { id: 'sc2', name: 'Procedimento Estético', description: 'Serviços realizados em consultório.', icon: 'Sparkles' },
    { id: 'sc3', name: 'Consultas', description: 'Avaliações e acompanhamentos.', icon: 'Stethoscope' },
];

let mockServices = {
    'sc1': [
        { id: 's1', service_class_id: 'sc1', name: 'Lipoaspiração', description: 'Remoção de gordura localizada.', basePrice: 15000, depositFixed: 3000, active: true, medical_fee: 8000, clinic_percentage: 20, profit_percentage: 20, employee_bonus_fixed: 500, fixed_costs: 1000, variable_costs_percentage: 10, science_fee: 150 },
        { id: 's2', service_class_id: 'sc1', name: 'Prótese de Silicone', description: 'Aumento dos seios com implantes.', basePrice: 22000, depositFixed: 5000, active: true, medical_fee: 12000, clinic_percentage: 20, profit_percentage: 20, employee_bonus_fixed: 500, fixed_costs: 1500, variable_costs_percentage: 10, science_fee: 250 },
        { id: 's3', service_class_id: 'sc1', name: 'Rinoplastia', description: 'Cirurgia plástica do nariz.', basePrice: 18000, depositFixed: 4000, active: false, medical_fee: 10000, clinic_percentage: 20, profit_percentage: 20, employee_bonus_fixed: 500, fixed_costs: 1200, variable_costs_percentage: 10, science_fee: 200 },
    ],
    'sc2': [
        { id: 's4', service_class_id: 'sc2', name: 'Toxina Botulínica', description: 'Aplicação para rugas de expressão.', basePrice: 1800, depositFixed: 500, active: true, medical_fee: 800, clinic_percentage: 30, profit_percentage: 30, employee_bonus_fixed: 100, fixed_costs: 100, variable_costs_percentage: 5, science_fee: 0 },
        { id: 's5', service_class_id: 'sc2', name: 'Preenchimento Labial', description: 'Aumento do volume dos lábios.', basePrice: 2500, depositFixed: 700, active: true, medical_fee: 1200, clinic_percentage: 30, profit_percentage: 30, employee_bonus_fixed: 100, fixed_costs: 150, variable_costs_percentage: 5, science_fee: 0 },
    ],
    'sc3': [
        { id: 's6', service_class_id: 'sc3', name: 'Consulta de Avaliação', description: 'Primeira consulta com o especialista.', basePrice: 500, depositFixed: 100, active: true, medical_fee: 300, clinic_percentage: 20, profit_percentage: 10, employee_bonus_fixed: 0, fixed_costs: 50, variable_costs_percentage: 0, science_fee: 0 },
    ]
};

export const useServiceClasses = () => {
  const [serviceClasses, setServiceClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServiceClasses = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setServiceClasses([...mockServiceClasses]);
      setLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    fetchServiceClasses();
  }, [fetchServiceClasses]);

  const addServiceClass = async (classData) => {
    const newClass = { ...classData, id: `sc_${Date.now()}` };
    mockServiceClasses.push(newClass);
    if (!mockServices[newClass.id]) {
        mockServices[newClass.id] = [];
    }
    fetchServiceClasses();
    return { data: [newClass], error: null };
  };
  
  return { serviceClasses, loading, error, refetch: fetchServiceClasses, addServiceClass };
};

export const useServices = (serviceClassId) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(() => {
    if (!serviceClassId) {
      setServices([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setServices([...(mockServices[serviceClassId] || [])]);
      setLoading(false);
    }, 400);
  }, [serviceClassId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  const addService = async (serviceData) => {
      const newService = { ...serviceData, id: `s_${Date.now()}` };
      if (mockServices[serviceClassId]) {
          mockServices[serviceClassId].push(newService);
      } else {
          mockServices[serviceClassId] = [newService];
      }
      fetchServices();
      return { data: [newService], error: null };
  };

  const updateService = async (id, dataToUpdate) => {
    if (mockServices[serviceClassId]) {
        const serviceIndex = mockServices[serviceClassId].findIndex(s => s.id === id);
        if (serviceIndex > -1) {
            mockServices[serviceClassId][serviceIndex] = { ...mockServices[serviceClassId][serviceIndex], ...dataToUpdate };
        }
    }
    fetchServices();
    return { data: [{id, ...dataToUpdate}], error: null };
  };

  const deleteService = async (id) => {
      if (mockServices[serviceClassId]) {
          mockServices[serviceClassId] = mockServices[serviceClassId].filter(s => s.id !== id);
      }
      fetchServices();
      return { data: [{id}], error: null };
  };


  return { 
    services, 
    loading, 
    error, 
    refetch: fetchServices, 
    addService,
    updateService,
    deleteService
  };
};