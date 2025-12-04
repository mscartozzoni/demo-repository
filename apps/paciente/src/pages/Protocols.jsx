// pages/protocol.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  FileText,
  Search,
  Filter,
  MessageSquare,
  Calendar,
  Clock,
  User
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const protocolsData = [
  {
    id: 'PROT-2025-001',
    type: 'Prazo',
    title: 'Criação de Relatório Mensal',
    status: 'Em andamento',
    timestamp: '2025-08-10T09:00:00',
    user: 'Secretária P.',
    related: 'Prazo #1'
  },
  {
    id: 'PROT-2025-002',
    type: 'Prazo',
    title: 'Renovação de Licenças',
    status: 'Em andamento',
    timestamp: '2025-08-08T14:30:00',
    user: 'Assist. Adm.',
    related: 'Prazo #2'
  },
  {
    id: 'PROT-2025-006',
    type: 'Mensagem',
    title: 'Envio para Maria Silva',
    status: 'Concluído',
    timestamp: '2025-08-13T10:31:00',
    user: 'Dr. Secretária',
    related: 'Mensagem #1'
  },
  {
    id: 'PROT-2025-007',
    type: 'Evento',
    title: 'Agendamento de Consulta - João Carlos',
    status: 'Concluído',
    timestamp: '2025-08-13T09:16:00',
    user: 'Dr. Secretária',
    related: 'Evento #2'
  },
  {
    id: 'PROT-2025-008',
    type: 'Mensagem',
    title: 'Recebimento de Botconversa',
    status: 'Concluído',
    timestamp: '2025-08-13T11:00:00',
    user: 'Sistema',
    related: 'Mensagem #6'
  }
];

const Protocols = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredProtocols = protocolsData
    .filter((protocol) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        protocol.id.toLowerCase().includes(query) ||
        protocol.title.toLowerCase().includes(query) ||
        protocol.user.toLowerCase().includes(query);
      const matchesFilter =
        selectedFilter === 'all' ||
        protocol.type.toLowerCase() === selectedFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const getTypeInfo = (type) => {
    switch (type) {
      case 'Prazo':
        return {
          icon: <Clock className="w-5 h-5 text-yellow-400" />,
          color: 'border-yellow-500/50'
        };
      case 'Mensagem':
        return {
          icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
          color: 'border-blue-500/50'
        };
      case 'Evento':
        return {
          icon: <Calendar className="w-5 h-5 text-green-400" />,
          color: 'border-green-500/50'
        };
      default:
        return {
          icon: <FileText className="w-5 h-5 text-gray-400" />,
          color: 'border-gray-500/50'
        };
    }
  };

  return (
    <>
      <Helmet>
        <title>Protocolos - Portal Secretaria</title>
        <meta
          name="description"
          content="Registro e acompanhamento de protocolos de ações internas, garantindo rastreabilidade."
        />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">Protocolos de Ações</h1>
          <p className="text-gray-400">Rastreie todas as ações importantes geradas no sistema.</p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Buscar por ID, título ou usuário..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">Todos os Tipos</option>
                    <option value="prazo">Prazo</option>
                    <option value="mensagem">Mensagem</option>
                    <option value="evento">Evento</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de protocolos */}
        <div className="space-y-4">
          {filteredProtocols.map((protocol, index) => {
            const typeInfo = getTypeInfo(protocol.type);
            return (
              <motion.div
                key={protocol.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card
                  className={`glass-effect border-l-4 ${typeInfo.color} card-hover`}
                >
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    {/* ID e tipo */}
                    <div className="md:col-span-1 flex items-center gap-3">
                      {typeInfo.icon}
                      <div>
                        <p className="font-bold">{protocol.id}</p>
                        <p className="text-sm text-gray-400">{protocol.type}</p>
                      </div>
                    </div>

                    {/* Título e relacionado */}
                    <div className="md:col-span-2">
                      <p className="font-medium">{protocol.title}</p>
                      <p className="text-sm text-gray-400">
                        Relacionado a: {protocol.related}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="md:col-span-1 text-sm">
                      <span
                        className={`status-badge ${protocol.status === 'Concluído'
                            ? 'status-active'
                            : 'status-pending'
                          }`}
                      >
                        {protocol.status}
                      </span>
                    </div>

                    {/* Usuário */}
                    <div className="md:col-span-1 flex items-center gap-2 text-sm text-gray-300">
                      <User className="w-4 h-4" />
                      {protocol.user}
                    </div>

                    {/* Timestamp */}
                    <div className="md:col-span-1 text-sm text-gray-400 text-right">
                      {new Date(protocol.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Protocols;