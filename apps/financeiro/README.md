# Portal de Gestão para Clínicas de Estética - v1.0 (Modo de Demonstração)

## 1. Visão Geral e Lógica de Negócio

Este projeto é uma aplicação web de ponta, desenvolvida como um **Software as a Service (SaaS)**, projetada para ser o centro de comando de clínicas de estética e cirurgia plástica. A lógica de negócio fundamental é centralizar, otimizar e automatizar as operações da clínica, transformando dados em decisões estratégicas e impulsionando o crescimento.

O sistema foi concebido para resolver dores crônicas do setor:
- **Descentralização de Informações:** Pacientes, orçamentos, finanças e prontuários espalhados em diferentes sistemas ou planilhas.
- **Processo de Orçamento Lento e Ineficiente:** Dificuldade em calcular custos, taxas e o preço final de forma rápida e padronizada.
- **Falta de Visibilidade Financeira:** Dificuldade em entender a rentabilidade real de cada procedimento.
- **Jornada do Paciente Fragmentada:** Perda de oportunidades por falta de um acompanhamento estruturado desde o primeiro contato até o pós-venda.

O modelo de negócio é baseado em uma **ferramenta de demonstração (mock) totalmente funcional**, que opera com dados locais para prototipagem rápida e apresentação de funcionalidades, com um caminho claro para integração com um backend robusto (como Supabase) para a versão de produção.

---

## 2. Funcionalidades Implementadas

O portal está estruturado em módulos inteligentes e interconectados:

### Módulo 1: Dashboard
O ponto de partida. Oferece uma visão macro e instantânea da saúde da clínica com métricas chave.
- **KPIs Principais:** Faturamento, número de pacientes, taxa de conversão de orçamentos.
- **Gráficos de Desempenho:** Visualizações do funil de vendas e evolução financeira.
- **Atalhos Rápidos:** Acesso direto às funcionalidades mais usadas, como "Novo Paciente" e "Novo Orçamento".

### Módulo 2: Central de Pacientes (`/patients`)
O CRM da clínica. Gerencia todo o ciclo de vida do relacionamento com o paciente.
- **Listagem e Busca:** Acesso rápido a todos os pacientes cadastrados.
- **Criação de Novo Paciente:** Formulário para registro de novos pacientes com dados de demonstração realistas.
- **Encaminhamento para Orçamento:** Ao criar um novo paciente, o sistema permite iniciar imediatamente a criação de um orçamento, otimizando o fluxo de trabalho.

### Módulo 3: Catálogo de Serviços (`/services`)
O coração da precificação. Permite a criação e gestão de todos os procedimentos oferecidos.
- **Organização por Classes:** Separação clara entre "Procedimentos Cirúrgicos", "Estéticos" e "Consultas".
- **Criação de Serviço em Etapas:**
    1.  **Detalhes do Serviço:** Nome e descrição.
    2.  **Configuração Financeira:** Um formulário detalhado para definir a composição do preço, incluindo repasse médico, percentuais de clínica e lucro, custos fixos e variáveis, e bônus. O preço final é calculado automaticamente.

### Módulo 4: Assistente de Criação de Orçamentos (`/budgets`)
A funcionalidade mais poderosa do sistema. Um assistente passo a passo que guia o usuário na criação de orçamentos complexos de forma rápida e precisa.
- **Fluxo Guiado (Wizard) de 6 Etapas:**
    1.  **Seleção do Paciente:** Busca e seleção do paciente.
    2.  **Indicação do Serviço:** Escolha do procedimento principal.
    3.  **Detalhes do Orçamento:**
        - **Seleção de Hospital:** Escolha do local do procedimento.
        - **Custo Hospitalar Automático:** O valor é preenchido automaticamente com base em uma tabela de custos simulada (procedimento x hospital).
        - **Adição de Materiais Especiais:** Um card dinâmico permite adicionar itens extras (próteses, fios) que são somados ao total.
    4.  **Configuração de Pagamento (com IA):**
        - **Assistente de IA:** Sugere o protocolo de pagamento, valor de entrada e parcelamento com base no perfil do paciente e no procedimento, otimizando a conversão.
        - **Definição de Protocolos e Taxas:** Cálculo automático de taxas de cartão e juros de parcelamento.
    5.  **Revisão e Finalização:** Uma tela de resumo clara para conferência de todos os valores e condições.
    6.  **Conclusão:** Geração do orçamento final.
- **Portal de Orçamentos:** Permite visualizar o orçamento da perspectiva do cliente e gerenciar seu status (enviado, aprovado, etc.).

### Módulo 5: Finanças, Protocolos e Outros
- **Finanças (`/finances`):** Visão geral das transações (mock).
- **Protocolos (`/protocols`):** Gestão dos protocolos de pagamento que alimentam o assistente de orçamentos.
- **Investimentos (`/investments`):** Planejamento e acompanhamento de investimentos da clínica.
- **Faturas (`/invoices`):** Gestão de faturas e cobranças.
- **Jornada do Paciente (`/journey`):** Visualização do funil de vendas e acompanhamento da jornada.
- **Mensagens (`/messages`):** Central de comunicação com pacientes.

---

## 3. Configurações do Projeto

Este projeto é uma aplicação frontend moderna, construída com as seguintes tecnologias:

- **Build Tool:** Vite 4.4.5
- **Framework:** React 18.2.0
- **Roteamento:** React Router 6.16.0
- **Estilização:** TailwindCSS 3.3.3 com `shadcn/ui` para componentes base
- **Animações:** Framer Motion 10.16.4
- **Ícones:** Lucide React 0.285.0
- **Componentes UI:** Radix UI primitives

### Para rodar o projeto localmente:

1. **Instale as dependências:**