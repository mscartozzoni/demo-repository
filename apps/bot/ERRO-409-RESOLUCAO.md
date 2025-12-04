# 🔧 Resolução do Erro 409 (Conflict) - Guia Completo

## 📋 Resumo do Problema

O erro HTTP **409 Conflict** ocorre quando há tentativa de criar um recurso que já existe no banco de dados, violando restrições de **UNIQUE** (campos únicos).

### 🎯 Principais Causas Identificadas

1. **Duplicação de `patient_id`** na tabela `contacts`
2. **Duplicação de `email`** na tabela `users` 
3. **Duplicação de `name`** na tabela `tags`
4. **Violação de chave primária** (IDs duplicados)

---

## 🛠️ Soluções Implementadas

### 1. ✅ Tratamento Inteligente de Erros

#### **DataContext.jsx - addContact()**
```jsx
const addContact = useCallback(async (contactData) => {
  try {
    const { data, error } = await supabase.from('inbox_contacts').insert(contactData);
    
    if (error) {
      // 🚨 Erro 409 - Conflict: patient_id já existe
      if (error.code === '23505' || error.message.includes('duplicate')) {
        toast({ 
          variant: 'destructive', 
          title: "Contato já existe", 
          description: `ID "${contactData.patient_id}" já cadastrado` 
        });
        
        // 🔍 Busca e retorna o contato existente
        const { data: existing } = await supabase
          .from('inbox_contacts')
          .select('*')
          .eq('patient_id', contactData.patient_id)
          .single();
          
        return existing; // ✅ Retorna registro existente
      }
      
      // Outros erros
      toast({ variant: 'destructive', title: "Erro", description: error.message });
      return null;
    }
    
    // ✅ Sucesso - novo contato criado
    toast({ title: "Sucesso!", description: "Contato adicionado." });
    return data;
  } catch (err) {
    console.error('❌ Erro inesperado:', err);
    return null;
  }
});
```

#### **HybridDataService.ts - addPatient()**
```typescript
async addPatient(patient: PatientData): Promise<string> {
  try {
    const { data, error } = await this.supabaseClient
      .from('patients')
      .insert(patientData);

    if (error) {
      // 🚨 Erro 409 - patient_id ou email duplicado
      if (error.code === '23505') {
        console.warn(`⚠️ Paciente duplicado: ${patient.patient_id}`);
        
        // 🔍 Busca paciente existente
        const { data: existing } = await this.supabaseClient
          .from('patients')
          .select('*')
          .or(`patient_id.eq.${patient.patient_id},email.eq.${patient.email}`)
          .single();
        
        if (existing) {
          return existing.id; // ✅ Retorna ID do paciente existente
        }
      }
      
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('❌ Erro ao adicionar paciente:', error);
    throw error;
  }
}
```

### 2. 🔍 Validação Preventiva

#### **ConflictValidator.js - Verificação Prévia**
```javascript
export class ConflictValidator {
  
  // 🔍 Verifica se contato já existe ANTES de inserir
  static async validateContact(contactData) {
    const { data: existing } = await supabase
      .from('inbox_contacts')
      .select('*')
      .eq('patient_id', contactData.patient_id)
      .limit(1);

    if (existing?.length > 0) {
      return {
        isValid: false,
        existing: existing[0],
        message: `Contato já existe: ${existing[0].name}`
      };
    }

    return { isValid: true, existing: null };
  }
  
  // 🔍 Validação para usuários
  static async validateUser(userData) {
    const { data: existing } = await supabase
      .from('inbox_users')
      .select('*')
      .eq('auth_email', userData.auth_email)
      .limit(1);

    if (existing?.length > 0) {
      return {
        isValid: false,
        existing: existing[0],
        message: `Email já cadastrado: ${existing[0].name}`
      };
    }

    return { isValid: true, existing: null };
  }
}
```

### 3. 🎯 Componente de Cadastro Inteligente

#### **SignUpForm.jsx - Validação em Tempo Real**
```jsx
const SignUpForm = () => {
  const [validation, setValidation] = useState({
    isCheckingEmail: false,
    emailExists: false,
    isValid: false
  });

  // 🔍 Verifica email em tempo real
  const checkEmailAvailability = async (email) => {
    setValidation(prev => ({ ...prev, isCheckingEmail: true }));
    
    const result = await ConflictValidator.validateUser({ auth_email: email });
    
    setValidation(prev => ({
      ...prev,
      isCheckingEmail: false,
      emailExists: !result.isValid
    }));
    
    if (!result.isValid) {
      toast({
        variant: "destructive",
        title: "Email já cadastrado",
        description: result.message
      });
    }
  };

  const handleSubmit = async () => {
    // ✅ Validação final antes de submeter
    const emailValidation = await ConflictValidator.validateUser({ 
      auth_email: formData.email 
    });
    
    if (!emailValidation.isValid) {
      toast({
        variant: "destructive",
        title: "Email já existe",
        description: emailValidation.message
      });
      return;
    }
    
    // 🚀 Proceder com cadastro
    const newUser = await addUser(userData);
  };
};
```

---

## 📊 Códigos de Erro PostgreSQL

| Código | Descrição | Causa Comum |
|--------|-----------|-------------|
| `23505` | **UNIQUE_VIOLATION** | Campo único duplicado |
| `23503` | **FOREIGN_KEY_VIOLATION** | Referência inexistente |
| `23502` | **NOT_NULL_VIOLATION** | Campo obrigatório vazio |
| `23514` | **CHECK_VIOLATION** | Validação de check falhou |

---

## 🚀 Como Usar

### 1. **Para Cadastrar Contato**
```javascript
import { ConflictValidator } from '@/lib/conflictValidator';

// ✅ Validação prévia
const validation = await ConflictValidator.validateContact({
  patient_id: 'pac_123',
  email: 'joao@exemplo.com'
});

if (!validation.isValid) {
  console.log('❌ Contato já existe:', validation.existing);
  return validation.existing; // Usar existente
}

// 🚀 Prosseguir com inserção
const newContact = await addContact(contactData);
```

### 2. **Para Criar Usuário**
```javascript
// ✅ Verificar email antes
const emailCheck = await ConflictValidator.validateUser({
  auth_email: 'usuario@email.com'
});

if (!emailCheck.isValid) {
  toast({ 
    title: "Email já cadastrado",
    description: emailCheck.message 
  });
  return;
}

// 🚀 Criar usuário
const user = await addUser(userData);
```

---

## 🎯 Benefícios da Implementação

1. **🛡️ Prevenção de Erros**: Validação prévia evita tentativas de duplicação
2. **🔄 Recuperação Inteligente**: Retorna registros existentes quando apropriado
3. **📱 UX Melhorada**: Feedback em tempo real para usuários
4. **🚀 Performance**: Menos tentativas de inserção desnecessárias
5. **📋 Logs Detalhados**: Registro completo de conflitos para debugging

---

## 🔧 Próximos Passos

1. **✅ Implementado**: Tratamento básico de erro 409
2. **✅ Implementado**: Validação preventiva 
3. **✅ Implementado**: Componente de cadastro inteligente
4. **🔄 Em andamento**: Testes de integração
5. **📋 Planejado**: Documentação para equipe de desenvolvimento

---

## 📞 Suporte

Se encontrar novos casos de erro 409, verifique:

1. **Campos únicos** na estrutura do banco
2. **Logs do console** para detalhes do erro
3. **Validação prévia** está sendo chamada
4. **Toast notifications** para feedback do usuário

**Contato**: Use o sistema de mensagens interno para reportar problemas.
