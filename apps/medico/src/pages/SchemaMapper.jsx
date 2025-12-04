import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchema } from '@/contexts/SchemaContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RocketIcon, CheckIcon, SymbolIcon, UploadIcon, TableIcon, ResetIcon } from '@radix-ui/react-icons';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from '@/components/ui/use-toast';

const SchemaMapper = () => {
  const { schema, fetchSchema, loadingSchema, saveAliases, aliases, getAlias } = useSchema();
  const [localAliases, setLocalAliases] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);
  
  useEffect(() => {
    setLocalAliases(JSON.parse(JSON.stringify(aliases))); // Deep copy
  }, [aliases]);

  const handleAliasChange = (type, key, value) => {
    setLocalAliases(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    saveAliases(localAliases);
  };
  
  const handleReset = () => {
    const confirmReset = window.confirm("Tem certeza que deseja redefinir todos os apelidos para os padrões?");
    if (confirmReset) {
      setLocalAliases({});
      saveAliases({});
      toast({
        title: "Apelidos Redefinidos!",
        description: "Todas as nomenclaturas foram restauradas para os valores padrão.",
      });
    }
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      <div className="animate-pulse bg-slate-800/50 h-12 rounded-lg"></div>
      <div className="animate-pulse bg-slate-800/50 h-48 rounded-lg"></div>
      <div className="animate-pulse bg-slate-800/50 h-48 rounded-lg"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <RocketIcon className="w-8 h-8 text-purple-400" />
              Gestor de Nomenclaturas
            </h1>
            <p className="text-slate-400 mt-2">Personalize os nomes de tabelas, colunas e textos do sistema.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={fetchSchema} disabled={loadingSchema} variant="outline">
              <SymbolIcon className={`w-4 h-4 mr-2 ${loadingSchema ? 'animate-spin' : ''}`} />
              {loadingSchema ? 'Carregando...' : 'Recarregar Schema'}
            </Button>
            <Button onClick={handleSave} variant="shine">
              <UploadIcon className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
        </div>
      </div>

      <AnimatePresence>
        {loadingSchema ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderSkeleton()}
          </motion.div>
        ) : schema ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {Object.keys(schema).filter(schemaName => schemaName === 'public' || schemaName === 'pacientes').map(schemaName => (
              <Collapsible key={schemaName} defaultOpen={true} className="bg-slate-800/50 rounded-xl border border-slate-700/60 p-6">
                 <CollapsibleTrigger className="w-full">
                    <div className="flex justify-between items-center cursor-pointer">
                      <h2 className="text-xl font-semibold text-white capitalize">{getAlias('schema_name', schemaName, schemaName)}</h2>
                      <p className="text-sm text-slate-400">Clique para expandir/recolher</p>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-6 space-y-4">
                  {schema[schemaName].map(table => (
                    <Collapsible key={table.table} defaultOpen={false} className="bg-slate-900/60 rounded-lg border border-slate-700 p-4">
                        <CollapsibleTrigger className="w-full">
                            <div className="flex justify-between items-center cursor-pointer">
                                <h3 className="text-lg font-medium text-blue-300 flex items-center gap-2">
                                  <TableIcon/> {table.table}
                                </h3>
                                <p className="text-sm text-slate-500">Clique para ver colunas</p>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4 pl-4 border-l-2 border-slate-700 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                <label className="text-slate-300 font-semibold">Apelido para Tabela:</label>
                                <Input
                                    className="md:col-span-2"
                                    placeholder={`Ex: ${table.table}`}
                                    value={localAliases.table_name?.[table.table] || ''}
                                    onChange={(e) => handleAliasChange('table_name', table.table, e.target.value)}
                                />
                            </div>
                            <hr className="border-slate-700 my-3"/>
                            {table.columns.map(column => (
                                <div key={column.column_name} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                    <label className="text-slate-400 text-sm truncate" title={column.column_name}>{column.column_name}</label>
                                    <Input
                                        className="md:col-span-2"
                                        placeholder={`Ex: ${column.column_name.replace(/_/g, ' ')}`}
                                        value={localAliases.column_name?.[`${table.table}.${column.column_name}`] || ''}
                                        onChange={(e) => handleAliasChange('column_name', `${table.table}.${column.column_name}`, e.target.value)}
                                    />
                                </div>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-red-300">Zona de Perigo</h3>
                  <p className="text-sm text-red-400/80 mt-1">Redefinir todas as nomenclaturas para o padrão. Esta ação não pode ser desfeita.</p>
                </div>
                <Button variant="destructive" onClick={handleReset}>
                  <ResetIcon className="w-4 h-4 mr-2" />
                  Redefinir Tudo
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 bg-slate-800/50 rounded-xl">
            <p className="text-slate-400">Nenhum schema carregado. Clique em "Recarregar Schema" para buscar a estrutura do banco de dados.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchemaMapper;