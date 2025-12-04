import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent } from '@/components/ui/card';
    import { Avatar, AvatarFallback } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { Clock, User, MessageSquare, AlertCircle, Tag, MoreVertical, Edit2, Trash2, CheckCircle, Flag, MailWarning } from 'lucide-react';
    import { useNavigate } from 'react-router-dom';
    import { useData } from '@/contexts/DataContext';
    import { useToast } from '@/components/ui/use-toast';
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
    import { cn } from '@/lib/utils';

    const ConversationCard = ({ conversation }) => {
      const navigate = useNavigate();
      const { tags: allTags, updateConversation } = useData();
      const { toast } = useToast();

      const timeAgo = (dateString) => {
        if (!dateString) return 'agora';
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        if (seconds < 5) return "agora";
        let interval = seconds / 31536000;
        if (interval > 1) return `há ${Math.floor(interval)} anos`;
        interval = seconds / 2592000;
        if (interval > 1) return `há ${Math.floor(interval)} meses`;
        interval = seconds / 86400;
        if (interval > 1) return `há ${Math.floor(interval)} dias`;
        interval = seconds / 3600;
        if (interval > 1) return `há ${Math.floor(interval)}h`;
        interval = seconds / 60;
        if (interval > 1) return `há ${Math.floor(interval)}min`;
        return `há ${Math.floor(seconds)}s`;
      };

      const priorityConfig = {
        baixa: { label: 'Baixa', color: 'bg-gray-500', icon: <Flag className="h-3 w-3" /> },
        media: { label: 'Média', color: 'bg-yellow-500 text-black', icon: <Flag className="h-3 w-3" /> },
        alta: { label: 'Alta', color: 'bg-orange-500', icon: <Flag className="h-3 w-3" /> },
        urgente: { label: 'Urgente', color: 'bg-red-600', icon: <AlertCircle className="h-3 w-3" /> }
      };

      const getPriorityDetails = (priority) => {
        return priorityConfig[priority] || priorityConfig.media;
      };
      
      const handlePriorityChange = (newPriority) => {
        updateConversation(conversation.patient_id, { priority: newPriority });
      };

      const handleTagToggle = (tagId) => {
        const currentTags = conversation.tags || [];
        const newTags = currentTags.includes(tagId)
          ? currentTags.filter(t => t !== tagId)
          : [...currentTags, tagId];
        updateConversation(conversation.patient_id, { tags: newTags });
      };

      const handleArchive = () => {
         toast({ title: "🚧 Funcionalidade em breve", description: "A opção de arquivar conversas será adicionada." });
      }

      return (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
          <Card className={cn(
            "glass-effect-soft hover:glass-effect-strong transition-all duration-300 flex flex-col h-full",
            conversation.hasUnread && "border-primary/50 shadow-lg shadow-primary/10"
          )}>
            <CardContent className="p-4 space-y-3 flex-grow">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-tr from-fuchsia-500 to-purple-500 text-white">
                      {conversation.patientName?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-foreground flex items-center">
                      {conversation.patientName} 
                      {conversation.isNewPatient && <Badge variant="secondary" className="ml-2 text-xs">Novo</Badge>}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {conversation.patientId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                    {conversation.hasUnread && (
                        <div className="p-1.5 bg-primary/20 rounded-full animate-pulse">
                            <MailWarning className="h-4 w-4 text-primary" />
                        </div>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Flag className="mr-2 h-4 w-4" />
                            <span>Prioridade</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {Object.keys(priorityConfig).map(p => (
                                <DropdownMenuItem key={p} onClick={() => handlePriorityChange(p)}>{priorityConfig[p].label}</DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Tag className="mr-2 h-4 w-4" />
                            <span>Etiquetas</span>
                          </DropdownMenuSubTrigger>
                           <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                               {allTags.map(tag => (
                                 <DropdownMenuCheckboxItem
                                   key={tag.id}
                                   checked={conversation.tags && conversation.tags.includes(tag.id)}
                                   onCheckedChange={() => handleTagToggle(tag.id)}
                                 >
                                   {tag.name}
                                 </DropdownMenuCheckboxItem>
                               ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate(`/conversation/${conversation.patient_id}`)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          <span>Ver & Responder</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={handleArchive}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Arquivar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>

              <p className={cn(
                  "text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-grow",
                  conversation.hasUnread && "font-semibold text-foreground"
                )}>
                <MessageSquare className="h-4 w-4 mr-2 inline-block text-gray-400" />
                {conversation.content}
              </p>

              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                 {(conversation.tags && conversation.tags.length > 0) &&
                    allTags
                      .filter(t => conversation.tags.includes(t.id))
                      .map(tag => (
                        <Badge key={tag.id} style={{ backgroundColor: tag.color, color: 'white' }} variant="default">{tag.name}</Badge>
                    ))
                  }
              </div>
            </CardContent>
            <div className="p-4 pt-2 border-t border-border">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3" />
                  <span>{timeAgo(conversation.created_at)}</span>
                </div>
                <Button
                  size="sm"
                  variant={conversation.hasUnread ? "default" : "glass"}
                  className="text-xs"
                  onClick={() => navigate(`/conversation/${conversation.patient_id}`)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {conversation.hasUnread ? 'Responder' : 'Atender'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      );
    };

    export default ConversationCard;