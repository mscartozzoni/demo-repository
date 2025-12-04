import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Server, Key, MessageSquare, Users, Tag, Book, Database } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CodeBlock = ({ code, language = 'json' }) => {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast({ title: "Copiado!", description: "O código foi copiado para a área de transferência." });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-800/80 rounded-lg overflow-hidden relative group">
            <pre className="p-4 text-sm text-white overflow-x-auto custom-scrollbar">
                <code className={`language-${language}`}>{code}</code>
            </pre>
            <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 text-gray-400 hover:text-white hover:bg-white/20"
                onClick={handleCopy}
            >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </Button>
        </div>
    );
};

const ApiEndpoint = ({ method, path, description, icon, children }) => (
    <Card className="glass-effect-strong text-white">
        <CardHeader>
            <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                    {icon}
                </div>
                <div>
                    <div className="flex items-center gap-4">
                        <span className={`text-sm font-bold px-2 py-1 rounded ${method === 'POST' ? 'bg-green-500' : method === 'GET' ? 'bg-blue-500' : 'bg-yellow-500'}`}>{method}</span>
                        <span className="font-mono text-lg">{path}</span>
                    </div>
                    <CardDescription className="mt-2">{description}</CardDescription>
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

const IntegrationManual = () => {
  const webhookUrl = `https://api.marcioplasticsurgery.com/webhook/botconversa`;
  const webhookJson = `{
  "patientId": "5511999998888",
  "patientName": "Nome do Paciente",
  "message": "Olá, gostaria de agendar uma consulta.",
  "email": "paciente@email.com",
  "tags": ["Primeira Consulta", "Orçamento"],
  "current_journey_step": "Agendamento Solicitado",
  "priority": "alta",
  "contact_status": "patient"
}`;
  const loginJson = `{
  "email": "atendente@email.com",
  "password": "senha_do_atendente"
}`;
  const loginResponseJson = `{
  "token": "SEU_TOKEN_JWT_AQUI",
  "user": {
    "id": "uuid-do-usuario",
    "name": "Nome do Atendente",
    "email": "atendente@email.com",
    "role": "admin"
  }
}`;
  const messageJson = `{
  "contact_id": "uuid-do-contato",
  "content": "Sua consulta está confirmada para amanhã.",
  "from_contact": false,
  "user_id": "uuid-do-atendente"
}`;

  return (
    <>
      <Helmet>
        <title>Manual de Integração API - BotConversa</title>
        <meta name="description" content="Guia técnico para integração da API do BotConversa." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Manual de Integração da API</h1>
          <p className="text-muted-foreground mt-2">
            Guia técnico com endpoints, estruturas JSON e schema do banco de dados para o backend.
          </p>
        </div>

        <ApiEndpoint method="POST" path="/webhook/botconversa" description="Endpoint para receber dados do fluxo do BotConversa e criar/atualizar contatos e mensagens." icon={<Server className="h-6 w-6 text-white" />}>
            <h4 className="font-semibold mb-2">Corpo da Requisição (JSON):</h4>
            <CodeBlock code={webhookJson} />
        </ApiEndpoint>

        <h2 className="text-2xl font-bold tracking-tight text-foreground pt-4 border-t border-border">Endpoints da API Interna</h2>

        <ApiEndpoint method="POST" path="/api/auth/login" description="Autentica um usuário e retorna um token JWT." icon={<Key className="h-6 w-6 text-white" />}>
            <h4 className="font-semibold mb-2">Corpo da Requisição (JSON):</h4>
            <CodeBlock code={loginJson} />
            <h4 className="font-semibold my-2">Resposta (JSON):</h4>
            <CodeBlock code={loginResponseJson} />
        </ApiEndpoint>
        
        <ApiEndpoint method="GET" path="/api/messages" description="Retorna uma lista de todas as mensagens." icon={<MessageSquare className="h-6 w-6 text-white" />} />
        
        <ApiEndpoint method="POST" path="/api/messages" description="Cria uma nova mensagem (usado para respostas internas)." icon={<MessageSquare className="h-6 w-6 text-white" />}>
            <h4 className="font-semibold mb-2">Corpo da Requisição (JSON):</h4>
            <CodeBlock code={messageJson} />
        </ApiEndpoint>

        <ApiEndpoint method="GET" path="/api/contacts" description="Retorna uma lista de todos os contatos." icon={<Users className="h-6 w-6 text-white" />} />
        <ApiEndpoint method="GET" path="/api/users" description="Retorna uma lista de todos os atendentes." icon={<Users className="h-6 w-6 text-white" />} />
        <ApiEndpoint method="GET" path="/api/tags" description="Retorna uma lista de todas as etiquetas." icon={<Tag className="h-6 w-6 text-white" />} />
        <ApiEndpoint method="GET" path="/api/logs" description="Retorna uma lista de todos os logs de auditoria." icon={<Book className="h-6 w-6 text-white" />} />

        <Card className="glass-effect-strong text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                    <Database className="h-6 w-6 text-white" />
                </div>
                <span>Schema do Banco de Dados</span>
            </CardTitle>
            <CardDescription>
              A estrutura completa do banco de dados está disponível na tela de Configurações.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Para ver o script SQL completo para criar todas as tabelas, navegue até <strong className="text-blue-300">Configurações {'>'} Banco de Dados</strong>.</p>
          </CardContent>
        </Card>

      </motion.div>
    </>
  );
};

export default IntegrationManual;