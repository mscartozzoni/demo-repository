import React from 'react';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Input } from '@/components/ui/input';
    import { Search, Tag, Flag, MailCheck, MailWarning } from 'lucide-react';
    import { useData } from '@/contexts/DataContext';

    const ConversationFilters = ({ filters, setFilters }) => {
      const { tags } = useData();

      const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
      };

      const priorityOptions = [
        { value: 'all', label: 'Todas Prioridades' },
        { value: 'urgente', label: 'Urgente' },
        { value: 'alta', label: 'Alta' },
        { value: 'media', label: 'Média' },
        { value: 'baixa', label: 'Baixa' },
      ];

      const statusOptions = [
        { value: 'unread', label: 'Não Lidas', icon: <MailWarning className="h-4 w-4 mr-2" /> },
        { value: 'all', label: 'Todas', icon: <MailCheck className="h-4 w-4 mr-2" /> },
      ];

      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou ID do paciente..."
              className="pl-10 bg-card/80 border-border"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
           <div className="relative">
            <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value === 'all' ? 'all' : value)}>
              <SelectTrigger className="w-full pl-10 bg-card/80 border-border">
                <SelectValue placeholder="Filtrar por prioridade..." />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Select value={filters.tag} onValueChange={(value) => handleFilterChange('tag', value === 'all' ? 'all' : value)}>
              <SelectTrigger className="w-full pl-10 bg-card/80 border-border">
                <SelectValue placeholder="Filtrar por etiqueta..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Etiquetas</SelectItem>
                {tags.map(tag => (
                  <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-4 flex justify-center">
             <div className="flex items-center justify-center rounded-xl p-1 bg-secondary/50 border border-border space-x-1">
                {statusOptions.map(option => (
                  <button 
                    key={option.value}
                    onClick={() => handleFilterChange('status', option.value)}
                    className={`flex items-center justify-center text-center text-sm p-2 rounded-lg transition-all duration-300 min-w-[120px] ${
                      filters.status === option.value
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
          </div>
        </div>
      );
    };

    export default ConversationFilters;