import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const SchemaContext = createContext();

export const useSchema = () => {
  const context = useContext(SchemaContext);
  if (!context) {
    throw new Error('useSchema must be used within a SchemaProvider');
  }
  return context;
};

export const SchemaProvider = ({ children }) => {
  const { toast } = useToast();
  const [aliases, setAliases] = useState({});
  const [schema, setSchema] = useState(null); // Mocked schema
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedAliases = localStorage.getItem('schema_aliases');
      if (savedAliases) {
        setAliases(JSON.parse(savedAliases));
      }
    } catch (e) {
      console.error("Failed to parse aliases from localStorage", e);
    }
  }, []);

  const saveAliases = (newAliases) => {
    try {
      localStorage.setItem('schema_aliases', JSON.stringify(newAliases));
      setAliases(newAliases);
      toast({
        title: "Apelidos Salvos!",
        description: "As nomenclaturas personalizadas foram salvas com sucesso.",
        className: 'bg-green-600 text-white'
      });
    } catch(e) {
      toast({
        title: "Erro ao salvar apelidos",
        description: "Não foi possível salvar os apelidos no armazenamento local.",
        variant: "destructive"
      });
    }
  };

  const getAlias = (type, key, defaultValue = null) => {
    const value = aliases[type]?.[key];
    // In a disconnected app, we return a sensible default if no alias is found
    return value || defaultValue || key.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  const fetchSchema = async () => {
    toast({
      title: 'Modo Demonstração',
      description: 'A busca de schema do banco de dados está desativada.',
    });
  };

  const value = {
    schema,
    aliases,
    loadingSchema: loading,
    fetchSchema,
    saveAliases,
    getAlias,
  };

  return (
    <SchemaContext.Provider value={value}>
      {children}
    </SchemaContext.Provider>
  );
};