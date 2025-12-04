import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Copy, AlertTriangle, Database, ExternalLink } from 'lucide-react';

const CodeBlock = ({ code, language = 'sql' }) => {
  const { toast } = useToast();
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "✅ Copiado!",
      description: "O script SQL foi copiado para a área de transferência."
    });
  };

  return (
    <div className="relative">
      <pre className="bg-gray-900/70 text-white p-4 rounded-lg overflow-x-auto custom-scrollbar">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-white/20"
        onClick={handleCopy}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

const DatabaseTab = () => {
    const { toast } = useToast();

    const sqlScript = `
-- Habilita a extensão uuid-ossp se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela para armazenar os usuários do sistema (atendentes)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para armazenar os contatos (pacientes)
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id VARCHAR(255) UNIQUE NOT NULL, -- Telefone ou outro ID único
  name VARCHAR(255) NOT NULL,
  last_activity TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para armazenar as etiquetas de classificação
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  color VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela principal para armazenar as mensagens
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id VARCHAR(255) NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(100) NOT NULL, -- agendamento, duvidas, orcamento
  status VARCHAR(100) NOT NULL DEFAULT 'pendente', -- pendente, em_andamento, resolvido
  priority VARCHAR(50) NOT NULL DEFAULT 'media', -- baixa, media, alta
  is_new_patient BOOLEAN DEFAULT TRUE,
  "from" VARCHAR(50) NOT NULL, -- patient, agent
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de associação entre mensagens e etiquetas (relação muitos-para-muitos)
CREATE TABLE message_tags (
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (message_id, tag_id)
);

-- Tabela para armazenar logs do sistema (auditoria)
CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user" VARCHAR(255),
  action VARCHAR(255) NOT NULL,
  details TEXT,
  sector VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir usuário Admin padrão
INSERT INTO users (name, sector) VALUES ('Admin', 'todos');

-- Habilitar RLS (Row Level Security) para segurança
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (exemplos básicos, personalize conforme a necessidade)
-- Permite que usuários autenticados leiam tudo
CREATE POLICY "Allow authenticated read access" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read access" ON contacts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read access" ON tags FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read access" ON messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read access" ON message_tags FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read access" ON system_logs FOR SELECT USING (auth.role() = 'authenticated');

-- Permite que usuários autenticados insiram, atualizem e deletem
CREATE POLICY "Allow authenticated full access" ON users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access" ON contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access" ON tags FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access" ON messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access" ON message_tags FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access" ON system_logs FOR ALL USING (auth.role() = 'authenticated');
`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Configuração do Banco de Dados</h2>
        <p className="text-gray-300">Prepare seu projeto Supabase para armazenar os dados do BotConversa.</p>
      </div>

      <Card className="glass-effect-strong text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-green-400" />
            <span>Script de Criação das Tabelas</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Para que seus dados sejam salvos de forma permanente, você precisa criar as tabelas no seu banco de dados. Siga os passos abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="p-4 bg-yellow-500/20 border-l-4 border-yellow-400 text-yellow-200 rounded-r-lg flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Atenção: Este aplicativo usa dados locais!</h4>
                <p>
                  Este script SQL é um exemplo para um banco de dados PostgreSQL.
                  Para conectar este aplicativo a um banco de dados real, você precisará de um backend que implemente a API descrita no manual de integração.
                </p>
              </div>
            </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">1. Prepare seu Banco de Dados</h3>
            <p className="text-gray-400 mb-2">Configure seu banco de dados PostgreSQL (ou similar) e obtenha as credenciais de conexão.</p>
            <Button variant="outline" asChild className="border-gray-500 hover:bg-white/10">
                <a href="https://www.postgresql.org/download/" target="_blank" rel="noopener noreferrer">
                    Baixar PostgreSQL
                    <ExternalLink className="h-4 w-4 ml-2" />
                </a>
            </Button>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">2. Copie e Execute o Script Abaixo</h3>
            <p className="text-gray-400 mb-2">Copie todo o código SQL abaixo e execute-o no seu cliente de banco de dados (ex: pgAdmin, DBeaver) para criar as tabelas necessárias.</p>
            <CodeBlock code={sqlScript} />
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DatabaseTab;