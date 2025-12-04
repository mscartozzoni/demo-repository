# 🔑 Guia de Acesso Remoto ao VPS - Portal Clinic

**Objetivo:** Acessar o VPS de qualquer lugar com pendrive/chave SSH

---

## 💡 O que você precisa entender:

Você tem **2 opções principais:**

### Opção 1: 🔐 Chave SSH no Pendrive (RECOMENDADO)
**Mais seguro e fácil**
- Leva o pendrive com a chave SSH
- Conecta de qualquer computador
- Não precisa decorar senha

### Opção 2: 🔑 YubiKey (Hardware Security Key)
**Mais profissional, mais caro**
- ~R$250-400
- Chave física USB
- Máxima segurança

---

## ✅ OPÇÃO 1: Pendrive com Chave SSH (Mais Simples)

### O que é?

É como uma "senha digital" salva em arquivo. Você leva o arquivo no pendrive e pode acessar o servidor de qualquer computador.

### Passo a Passo:

#### 1. Preparar o Pendrive

```bash
# 1. Conecte o pendrive
# 2. Crie uma pasta chamada "portal-clinic-ssh"
# 3. O pendrive será montado em (Mac/Linux):
#    /Volumes/SEU_PENDRIVE  (Mac)
#    /media/SEU_PENDRIVE    (Linux)
```

#### 2. Copiar Chave SSH para o Pendrive

```bash
# Mac/Linux
# Copiar chave privada
cp ~/.ssh/id_ed25519 /Volumes/SEU_PENDRIVE/portal-clinic-ssh/
cp ~/.ssh/id_ed25519.pub /Volumes/SEU_PENDRIVE/portal-clinic-ssh/

# Criar script de conexão
cat > /Volumes/SEU_PENDRIVE/portal-clinic-ssh/conectar.sh << 'EOF'
#!/bin/bash
# Script de conexão Portal Clinic VPS

# Detectar sistema operacional
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac
    KEY_PATH="/Volumes/$(ls /Volumes/ | grep -v Macintosh)/portal-clinic-ssh/id_ed25519"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    KEY_PATH="/media/$(whoami)/*/portal-clinic-ssh/id_ed25519"
else
    # Windows (Git Bash)
    KEY_PATH="/$(ls /mnt/ | head -1)/portal-clinic-ssh/id_ed25519"
fi

# Conectar
echo "🔐 Conectando ao Portal Clinic VPS..."
ssh -i "$KEY_PATH" root@82.29.56.143
EOF

chmod +x /Volumes/SEU_PENDRIVE/portal-clinic-ssh/conectar.sh
```

#### 3. Criar arquivo README no pendrive

```bash
cat > /Volumes/SEU_PENDRIVE/portal-clinic-ssh/README.txt << 'EOF'
===========================================
 PORTAL CLINIC - CHAVE SSH
===========================================

VPS IP: 82.29.56.143
Usuário: root

--- COMO USAR ---

Mac/Linux:
1. Abra Terminal
2. cd /Volumes/SEU_PENDRIVE/portal-clinic-ssh/
3. ./conectar.sh

Windows (Git Bash):
1. Abra Git Bash
2. cd /mnt/SEU_PENDRIVE/portal-clinic-ssh/
3. bash conectar.sh

Ou conectar manualmente:
ssh -i /caminho/para/id_ed25519 root@82.29.56.143

--- SEGURANÇA ---
⚠️ NÃO compartilhe este pendrive
⚠️ NÃO copie estes arquivos para computadores públicos
⚠️ Mantenha o pendrive em local seguro

--- COMANDOS ÚTEIS ---
pm2 list                    # Ver aplicações rodando
pm2 logs portal-bot         # Ver logs do backend
pm2 restart portal-bot      # Reiniciar backend
systemctl status nginx      # Status do Nginx
systemctl restart nginx     # Reiniciar Nginx

--- SUPORTE ---
Email: support@portal-clinic.com.br
Documentação: /var/www/docs/
EOF
```

#### 4. Usar o Pendrive em Outro Computador

**No seu computador ou em qualquer outro:**

```bash
# 1. Conecte o pendrive
# 2. Abra Terminal (Mac/Linux) ou Git Bash (Windows)
# 3. Execute:

# Mac
cd /Volumes/SEU_PENDRIVE/portal-clinic-ssh/
./conectar.sh

# Linux
cd /media/seu-usuario/SEU_PENDRIVE/portal-clinic-ssh/
./conectar.sh

# Windows (Git Bash)
cd /mnt/SEU_PENDRIVE/portal-clinic-ssh/
bash conectar.sh
```

---

## 🔐 OPÇÃO 2: YubiKey (Avançado)

### O que é?

YubiKey é uma chave física USB que armazena suas credenciais de forma ultra segura. É tipo um "cofre digital" no tamanho de um pendrive.

### Vantagens:
✅ Máxima segurança  
✅ Impossível copiar a chave  
✅ Resistente à água  
✅ Dura anos  
✅ Suporta múltiplos protocolos (SSH, FIDO2, etc)

### Desvantagens:
❌ Custa R$250-400  
❌ Configuração mais complexa  
❌ Se perder, precisa reconfigurar tudo

### Onde Comprar:
- Amazon: https://www.amazon.com.br/s?k=yubikey
- Site oficial: https://www.yubico.com

### Modelos Recomendados:
1. **YubiKey 5 NFC** (~R$280) - Tem NFC para celular
2. **YubiKey 5C** (~R$300) - USB-C
3. **YubiKey 5 Nano** (~R$320) - Fica permanente no USB

### Como Configurar YubiKey:

```bash
# 1. Instalar ferramentas
brew install ykman  # Mac
# ou
sudo apt install yubikey-manager  # Linux

# 2. Verificar YubiKey conectado
ykman info

# 3. Gerar chave SSH no YubiKey
ssh-keygen -t ed25519-sk -C "portal-clinic-yubikey"

# 4. Copiar chave pública para VPS
ssh-copy-id -i ~/.ssh/id_ed25519_sk root@82.29.56.143

# 5. Testar conexão (precisa do YubiKey conectado)
ssh root@82.29.56.143
# Vai pedir para tocar no YubiKey (luz piscando)
```

---

## 🆚 Comparação: Pendrive vs YubiKey

| Característica | Pendrive SSH | YubiKey |
|----------------|--------------|---------|
| **Custo** | R$20-50 | R$250-400 |
| **Segurança** | ⭐⭐⭐ Boa | ⭐⭐⭐⭐⭐ Excelente |
| **Facilidade** | ⭐⭐⭐⭐⭐ Muito fácil | ⭐⭐⭐ Médio |
| **Risco de Cópia** | Alto | Impossível |
| **Durabilidade** | Média | Alta |
| **Portabilidade** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 Recomendação:

### Para começar: **Pendrive SSH** 👍
- Rápido de configurar
- Barato
- Suficientemente seguro para maioria dos casos

### Para produção crítica: **YubiKey**
- Se você vai acessar de muitos computadores diferentes
- Se precisa conformidade com segurança corporativa
- Se pode investir ~R$300

---

## 📱 BÔNUS: Acesso via Celular

### Android:
1. Instale **Termux** (Play Store)
2. Configure SSH:
```bash
pkg install openssh
# Copie chave do pendrive via USB/OTG
ssh -i /sdcard/portal-clinic-ssh/id_ed25519 root@82.29.56.143
```

### iPhone/iPad:
1. Instale **Termius** (App Store - Grátis)
2. Adicione Host:
   - Host: 82.29.56.143
   - User: root
   - Key: Importar do iCloud/Arquivos

---

## 🔒 Segurança Importante

### ⚠️ NUNCA faça:
- ❌ Deixar pendrive em computador público
- ❌ Enviar chave por email/WhatsApp
- ❌ Fazer upload para nuvem sem criptografia
- ❌ Compartilhar com terceiros

### ✅ SEMPRE faça:
- ✅ Mantenha backup da chave (em local seguro)
- ✅ Use senha forte no pendrive se possível
- ✅ Mantenha pendrive em local seguro
- ✅ Considere ter 2 pendrives (backup)

---

## 🛠️ Script Completo para Criar Pendrive

Copie e cole no Terminal:

```bash
#!/bin/bash

echo "🔐 Configurando Pendrive SSH para Portal Clinic"
echo ""

# Detectar pendrive
if [ -d "/Volumes" ]; then
    # Mac
    PENDRIVE=$(ls /Volumes/ | grep -v "Macintosh" | head -1)
    PENDRIVE_PATH="/Volumes/$PENDRIVE"
else
    # Linux
    PENDRIVE=$(ls /media/$USER/ | head -1)
    PENDRIVE_PATH="/media/$USER/$PENDRIVE"
fi

if [ -z "$PENDRIVE" ]; then
    echo "❌ Nenhum pendrive detectado!"
    echo "Por favor, conecte um pendrive e tente novamente."
    exit 1
fi

echo "✅ Pendrive detectado: $PENDRIVE"
echo ""

# Criar estrutura
mkdir -p "$PENDRIVE_PATH/portal-clinic-ssh"

# Copiar chaves
echo "📋 Copiando chaves SSH..."
cp ~/.ssh/id_ed25519 "$PENDRIVE_PATH/portal-clinic-ssh/"
cp ~/.ssh/id_ed25519.pub "$PENDRIVE_PATH/portal-clinic-ssh/"

# Criar script de conexão
cat > "$PENDRIVE_PATH/portal-clinic-ssh/conectar.sh" << 'EOF'
#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ssh -i "$SCRIPT_DIR/id_ed25519" root@82.29.56.143
EOF

chmod +x "$PENDRIVE_PATH/portal-clinic-ssh/conectar.sh"

# Criar README
cat > "$PENDRIVE_PATH/portal-clinic-ssh/README.txt" << 'EOF'
Portal Clinic SSH Key
VPS: 82.29.56.143
User: root

Para conectar: ./conectar.sh
EOF

echo ""
echo "✅ Pendrive configurado com sucesso!"
echo ""
echo "📂 Localização: $PENDRIVE_PATH/portal-clinic-ssh/"
echo ""
echo "Para conectar de qualquer computador:"
echo "1. Conecte o pendrive"
echo "2. cd /Volumes/$PENDRIVE/portal-clinic-ssh/"
echo "3. ./conectar.sh"
echo ""
echo "⚠️  Mantenha este pendrive em local seguro!"
```

Salve como `setup-pendrive.sh` e execute:

```bash
chmod +x setup-pendrive.sh
./setup-pendrive.sh
```

---

## ❓ FAQ

**P: E se eu perder o pendrive?**
R: Você tem backup da chave em `~/.ssh/id_ed25519`. Mas precisará invalidar a chave perdida no VPS.

**P: Posso ter múltiplos pendrives?**
R: Sim! Copie para quantos quiser.

**P: Funciona no Windows?**
R: Sim, com Git Bash ou WSL instalado.

**P: E se o pendrive queimar?**
R: Por isso recomendamos ter 2 pendrives (principal + backup).

**P: Posso usar pendrive criptografado?**
R: Sim! Ainda mais seguro. Use BitLocker (Windows) ou LUKS (Linux).

---

**Criado:** 2025-11-20  
**Versão:** 1.0
