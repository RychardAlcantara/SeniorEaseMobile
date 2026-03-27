# SeniorEase 🧓

> Plataforma mobile de acessibilidade digital para idosos, desenvolvida com React Native + Expo + Firebase.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) v18 ou superior
- [Git](https://git-scm.com/)
- [Android Studio](https://developer.android.com/studio) (para emulador Android)
- Conta no [Firebase](https://console.firebase.google.com/)

---

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/RychardAlcantara/SeniorEaseMobile.git
cd seniorease
```

### 2. Crie o arquivo `.npmrc` na raiz
```
legacy-peer-deps=true
```

### 3. Instale as dependências
```bash
npm install --legacy-peer-deps
```

---

## 🔥 Configuração do Firebase

### Crie o arquivo `.env` na raiz do projeto
```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

> ⚠️ Nunca suba o arquivo `.env` para o repositório. Ele já está no `.gitignore`.

---

## 📱 Executando o projeto

### Android (emulador Android Studio)

**1. Abra o Android Studio e inicie um emulador:**
- Virtual Device Manager → selecione um dispositivo → clique em ▶

**2. Verifique se o emulador está rodando:**
```bash
adb devices
# Deve aparecer: emulator-5554   device
```

**3. Rode o projeto:**
```bash
npx expo start --android
```

---

### Limpando o cache (use sempre que mudar `.env` ou `babel.config.js`)
```bash
npx expo start --clear
```

---

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**, dividida em 4 camadas:

```
Presentation  →  Application  →  Domain  ←  Infrastructure
(screens,        (use cases,      (entities,    (Firebase,
 components,      stores)          interfaces)   AsyncStorage)
 hooks)
```

### Estrutura de pastas
```
seniorease/
├── app/                    # Rotas — Expo Router
│   ├── _layout.tsx         # Root layout + AuthGuard
│   ├── (auth)/             # Telas de autenticação
│   └── (app)/              # Telas principais
│       ├── dashboard.tsx   # Painel de personalização
│       ├── activities/     # Organizador de tarefas
│       └── profile.tsx     # Perfil + configurações
│
└── src/
    ├── domain/             # Entidades e interfaces (sem dependências)
    ├── application/        # Casos de uso
    ├── infrastructure/     # Firebase, AsyncStorage, Notificações
    ├── presentation/       # Componentes, hooks e tema
    └── store/              # Estado global (Zustand)
```

---

## ✨ Funcionalidades

### 🎨 Painel de Personalização
- Ajuste de tamanho de fonte (4 níveis)
- Nível de contraste (normal / alto / máximo)
- Espaçamento entre elementos
- Modo básico ou avançado de navegação
- Feedback visual reforçado
- Confirmação adicional antes de ações críticas

### ✅ Organizador de Atividades
- Lista de tarefas com visual simples e direto
- Etapas guiadas para execução de atividades
- Lembretes com linguagem clara
- Feedback positivo ao concluir tarefas
- Histórico de atividades realizadas

### 👤 Perfil + Configurações Persistentes
- Preferências salvas no Firestore
- Cache offline com AsyncStorage
- Sincronização automática entre sessões

---

## ♿ Acessibilidade

O projeto foi desenvolvido com foco total em acessibilidade para idosos:

| Recurso | Implementação |
|---|---|
| Área mínima clicável | 56dp (acima do mínimo WCAG 44dp) |
| Escala de fonte | 4 níveis: small → medium → large → xlarge |
| Contraste | 3 paletas: normal → high → highest |
| Feedback tátil | `expo-haptics` em todas as ações |
| Leitores de tela | `accessibilityRole` e `accessibilityLabel` em todos os componentes |
| Animações | Suaves com `react-native-reanimated` |
| Navegação | Previsível e passo a passo |

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.76.x | Framework mobile |
| Expo | ~55.0.0 | Plataforma de desenvolvimento |
| Expo Router | 4.x | Navegação baseada em arquivos |
| Firebase | ^11.0.0 | Auth + Firestore |
| Zustand | ^5.0.0 | Estado global |
| React Native Reanimated | 3.16.x | Animações |
| AsyncStorage | 2.x | Cache offline |
| Expo Haptics | latest | Feedback tátil |

---

## 📦 Scripts disponíveis

```bash
# Iniciar o projeto
npx expo start

# Iniciar no Android (emulador)
npx expo start --android

# Iniciar limpando o cache
npx expo start --clear

# Iniciar no Android limpando o cache
npx expo start --android --clear
```

---

## 🗂️ Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Chave da API do Firebase |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | ID do projeto Firebase |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Bucket de armazenamento |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ID do remetente |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | ID do app |

> Todas as variáveis devem ter o prefixo `EXPO_PUBLIC_` para serem acessíveis no cliente.

---

## 🔧 Solução de Problemas

**Erro de peer dependencies ao instalar:**
```bash
npm install --legacy-peer-deps
```

**Cache do Metro desatualizado:**
```bash
npx expo start --clear
```

**Variáveis de ambiente não carregadas:**
```bash
# Sempre rode com --clear após alterar o .env
npx expo start --clear
```

**Emulador Android não detectado:**
```bash
adb devices
# Se vazio, reinicie o emulador no Android Studio
```

---

## 📄 Licença

Este projeto foi desenvolvido para o Hackathon SeniorEase.
