# Documentação da API - ClinicFlow

Esta documentação detalha os endpoints da API para o sistema ClinicFlow, que gerencia as operações de banco de dados da clínica, incluindo pacientes, agendamentos, documentos, exames e prescrições.

**Nome da Edge Function**: `clinic-flow`

**URL Base**: `https://<PROJECT_REF>.supabase.co/functions/v1/clinic-flow`

---

## Autenticação

Todas as requisições para a API ClinicFlow devem incluir um token de autenticação JWT (obtido no login do Supabase) no cabeçalho `Authorization`.

**Cabeçalho**: `Authorization: Bearer <seu-jwt-token>`

---

## Formato de Resposta Padrão

### Sucesso (`200 OK` ou `201 Created`)