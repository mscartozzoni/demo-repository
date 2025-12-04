# Portal Médico - Manual do Desenvolvedor

Bem-vindo ao Portal Médico! Esta é uma aplicação web robusta desenvolvida em React para auxiliar na gestão de clínicas e consultórios médicos, com foco especial na cirurgia plástica. Ele oferece ferramentas para agendamento, acompanhamento da jornada do paciente, teleconsultas, comunicação e muito mais.

Este documento serve como um guia técnico completo para o desenvolvimento, manutenção e integração do Portal Médico com o ecossistema de portais da clínica.

---

## 1. Visão Geral da Arquitetura

O Portal do Médico funciona como um **aplicativo satélite**. Ele é projetado para ser um cliente inteligente que consome dados de uma API central, gerenciada pelo **Portal Administrativo**. A autenticação, os dados dos pacientes e as regras de negócio são centralizadas, garantindo consistência e segurança em todo o ecossistema.

- **Frontend (Este Projeto):** Interface reativa e rica em funcionalidades para o médico.
- **Backend (API Central):** Ponto único de verdade para todos os dados. Gerencia a lógica de negócio e a comunicação com o banco de dados.

---

## 2. Guia de Integração e Uso da API

Para que o Portal do Médico funcione corretamente, ele precisa se conectar a uma API de backend que siga as especificações de endpoints e estruturas de dados detalhadas abaixo.

### 2.1 Autenticação gerenciada localmente
    - Pelo próprio portal médico (`medico.marcioplasticsurgery.com`)
        - Acesso liberado imediatamente
        - Após o clique no botão "Entrar", sem necessidade de cadastro, senha ou autenticação externa
    - Visualização após login
        - Usuário visualiza o e-mail e um token gerado na tela
    - Pode acessar todas as páginas principais diretamente pelo menu lateral
    - Sem integração externa
    - Não há integração ou dependência do portal administrativo central para autenticação
---
### 2.2. Navegação e Integração
    - Após o login, o usuário acessa todas as páginas principais diretamente pelo menu lateral fixo
        - Sem subpáginas ou navegação complexa
    - O portal médico está integrado ao banco de dados Supabase
        - Permite gestão segura dos dados e configurações do usuário
    - Todas as operações de leitura e escrita são realizadas diretamente no schema exclusivo do projeto no Supabase
        - Garante isolamento e organização das informações


## 3. Estrutura do Banco de Dados (Exemplo)

O backend que serve a este portal deve ter uma estrutura de banco de dados similar a esta. As tabelas são projetadas para serem relacionais e escaláveis.

Estão divididas em schemas: medico, secretaria, paciente, clinic, orcamento. E cada Portal tem o seu users 

#### Tabela: `users`
*Armazena informações de todos os usuários do sistema (médicos, secretárias, administradores).*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária única. | `"user_123"` |
| `name` | `string` | Nome completo do usuário. | `"Dr. Márcio"` |
| `email` | `string` | Endereço de email (usado para login). | `"marcio@clinica.com"` |
| `role` | `string` | Papel do usuário ("medico", "secretaria", "admin"). | `"medico"` |
| `avatar` | `string` (URL) | URL da imagem de perfil. | `"https://.../avatar.png"` |
| `status` | `string` | "active" ou "inactive". | `"active"` |
| `created_at` | `timestamp` | Data de criação do registro. | `"2025-08-25T10:00:00Z"` |
| `last_login` | `timestamp` | Data do último login. | `"2025-08-26T14:30:00Z"` |

#### Tabela: `patients`
*Armazena dados específicos dos pacientes.*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. | `"patient_abc"` |
| `full_name` | `string` | Nome completo do paciente. | `"Ana Beatriz Silva"` |
| `email` | `string` | Email do paciente. | `"ana.silva@example.com"`|
| `phone` | `string` | Telefone de contato. | `"+5511987654321"` |
| `cpf` | `string` | CPF do paciente. | `"123.456.789-00"` |
| `birth_date` | `date` | Data de nascimento. | `"1990-05-15"` |
| `address` | `jsonb` | Endereço completo. | `{ "rua": "...", "cidade": "..." }`|
| `surgery_date`| `date` | Data da cirurgia (se aplicável). | `"2025-09-20"` |
| `doctor_id` | `UUID` | Chave estrangeira para `users(id)`. | `"user_123"` |
| `created_at` | `timestamp` | Data de criação do registro. | `"2025-08-01T11:00:00Z"`|

#### Tabela: `schedules`
*Armazena todos os tipos de agendamentos.*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. | `"sched_456"` |
| `doctor_id`| `UUID` | ID do médico responsável (de `users`). | `"user_123"` |
| `patient_id`| `UUID` | ID do paciente (de `patients`), pode ser nulo. | `"patient_abc"` |
| `start_time` | `timestamp` | Data e hora de início. | `"2025-09-10T14:00:00Z"` |
| `end_time` | `timestamp` | Data e hora de fim. | `"2025-09-10T15:00:00Z"` |
| `type` | `string` | "Consulta", "Cirurgia", "Retorno", "Pessoal". | `"Consulta"` |
| `status` | `string` | "confirmed", "cancelled", "completed". | `"confirmed"` |
| `title` | `string` | Título ou motivo do agendamento. | `"Consulta de avaliação"` |
| `whereby_link`| `string` (URL)| Link da sala de teleconsulta (se aplicável). | `"https://.../sala"` |

#### Tabela: `protocols`
*Define os modelos de jornada do paciente.*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. | `"proto_xyz"` |
| `name` | `string` | Nome do protocolo. | `"Protocolo Padrão - Pós-operatório"` |
| `description`| `string` | Descrição do que o protocolo cobre. | `"Acompanhamento padrão..."`|
| `total_stages`| `integer`| Número total de etapas no protocolo. | `15` |
| `is_active` | `boolean` | Se o protocolo está ativo para uso. | `true` |

#### Tabela: `protocol_stages`
*Define cada etapa (checklist) de um protocolo.*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. | `"stage_1"` |
| `protocol_id`| `UUID` | Chave estrangeira para `protocols(id)`. | `"proto_xyz"` |
| `name` | `string` | Nome da etapa. | `"1º Retorno Pós-Operatório"` |
| `position` | `integer`| Ordem da etapa dentro do protocolo. | `12` |
| `checklist` | `jsonb` | Lista de tarefas para a etapa. | `[{"item": "Verificar curativos"}, ...]` |
| `deadline_rules` | `jsonb`| Regras para o prazo (e.g., 7 dias após a cirurgia). | `{"type": "post_op", "days": 7}` |

#### Tabela: `patient_journeys`
*Rastreia o progresso de um paciente em um protocolo específico.*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. | `"journey_ab1"` |
| `patient_id`| `UUID` | Chave estrangeira para `patients(id)`. | `"patient_abc"` |
| `protocol_id`| `UUID` | Chave estrangeira para `protocols(id)`. | `"proto_xyz"` |
| `current_stage_id` | `UUID` | Chave estrangeira para `protocol_stages(id)`. | `"stage_1"` |
| `status` | `string` | "on-track", "delayed", "completed". | `"on-track"` |
| `completed_stages`| `jsonb` | Log de etapas concluídas e suas datas. | `[{"stage_id": "...", "completed_at": "..."}]`|

#### Tabela: `evolutions`
*Registra cada entrada de evolução pós-operatória.*

| Coluna | Tipo de Dados | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Chave primária. | `"evo_t5y"` |
| `patient_id`| `UUID` | Chave estrangeira para `patients(id)`. | `"patient_abc"` |
| `doctor_id`| `UUID` | Chave estrangeira para `users(id)`. | `"user_123"` |
| `evolution_date`| `date` | Data da evolução. | `"2025-08-10"` |
| `days_post_op`| `integer`| Dias de pós-operatório. | `9` |
| `data` | `jsonb` | Dados da evolução (peso, edema, dor, etc.). | `{"weight": "84", "edema": "2+"...}`|
| `notes` | `text` | Anotações sobre o estado da ferida, queixas, etc. | `"Apresenta boa cicatrização..."` |

---

## 4. API do Ecossistema (Endpoints Essenciais)

A API central deve expor os seguintes endpoints para que o Portal do Médico e outros satélites possam operar.

| Método | Endpoint Sugerido | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Verifica o status da API. | Opcional |
| **GET** | `/api/users/me` | Retorna os dados do usuário autenticado (logado). | Obrigatória |
| | | **Gestão de Pacientes** | |
| **GET** | `/api/patients` | Lista todos os pacientes associados ao médico logado. | Obrigatória |
| **GET** | `/api/patients/{id}` | Retorna os detalhes de um paciente específico. | Obrigatória |
| | | **Agenda e Consultas** | |
| **GET** | `/api/schedules` | Lista agendamentos (permite filtros por data e tipo). | Obrigatória |
| **POST**| `/api/schedules` | Cria um novo agendamento (consulta, cirurgia, etc.).| Obrigatória |
| **POST**| `/api/meetings/whereby` | Gera um link de teleconsulta para um agendamento. | Obrigatória |
| | | **Jornada do Paciente** | |
| **GET** | `/api/journeys` | Lista as jornadas de todos os pacientes do médico. | Obrigatória |
| **POST**| `/api/journeys/{id}/advance`| Avança o paciente para a próxima etapa da jornada. | Obrigatória |
| **GET** | `/api/protocols` | Lista todos os protocolos de jornada disponíveis. | Obrigatória |
| **POST**| `/api/protocols` | Cria um novo protocolo de jornada (Admin). | Obrigatória |
| | | **Evolução e Caderno Digital** | |
| **GET** | `/api/patients/{id}/evolutions` | Lista o histórico de evolução de um paciente. | Obrigatória |
| **POST**| `/api/patients/{id}/evolutions`| Adiciona um novo registro de evolução. | Obrigatória |
| **GET** | `/api/patients/{id}/documents` | Lista os documentos do caderno digital do paciente. | Obrigatória |
| **POST**| `/api/documents` | Salva um novo documento no caderno digital. | Obrigatória |
| | | **Comunicação** | |
| **POST**| `/api/messages/sms` | Envia uma mensagem SMS para um paciente. | Obrigatória |
| **POST**| `/api/messages/email`| Envia um email para um paciente (suporta anexos). | Obrigatória |

SEGUE EDGEFUNCTION 

Edge Function (index.ts)

Protocols
GET /clinic/protocols → list base templates from clinic.protocols
GET /doctor/protocols?clinic_id=... → list medico.protocols
GET /doctor/protocols/:protocolId/stages → list ordered stages
POST /doctor/protocols/:protocolId/stages → create stage
PUT /doctor/protocols/:protocolId/stages/:stageId → update stage
DELETE /doctor/protocols/:protocolId/stages/:stageId → delete stage
Patient Journeys (assign protocol to patient)
GET /doctor/patient-journeys?clinic_id=&patient_id=
GET /doctor/patient-journeys/:journeyId
POST /doctor/patient-journeys → create journey { clinic_id, patient_id, protocol_id, ... }
PUT /doctor/patient-journeys/:journeyId
DELETE /doctor/patient-journeys/:journeyId
Client API (api.js)

For ProtocolConfig.jsx
getDoctorProtocols(clinicId, token)
getProtocolStages(protocolId, token)
createProtocolStage(protocolId, data, token)
updateProtocolStage(protocolId, stageId, data, token)
deleteProtocolStage(protocolId, stageId, token)
Aliases for clarity: addProtocolStage → create, patchProtocolStage → update, removeProtocolStage → delete
Assign protocol to patient
assignProtocolToPatient(data, token) → POST /doctor/patient-journeys
updatePatientJourney(journeyId, data, token)
deletePatientJourney(journeyId, token)

## 5. Próximos Passos

1.  **Desenvolvimento do Backend:** Utilizar este documento como guia para construir a API central.
2.  **Conexão Real:** Substituir os dados de fallback em `src/services/api.js` por chamadas `fetch` aos endpoints reais da API.
3.  **Testes de Integração:** Validar se o fluxo de autenticação e a troca de dados entre o portal e a API estão funcionando perfeitamente.