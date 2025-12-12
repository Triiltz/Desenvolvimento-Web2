# Integrantes

- Gabriel Lucchetta Garcia Sanchez - 828513
- Guilherme César Athayde - 748175
- Leonardo Triiltz Siqueira - 811904

# FIZY - Aplicativo de Busca de Combustíveis

## 📱 Sobre o Projeto

O FIZY é um aplicativo web responsivo para buscar, visualizar e avaliar postos de combustível. O projeto foi desenvolvido como parte da disciplina de Desenvolvimento Web 2, implementando todas as telas projetadas no Figma usando apenas HTML, CSS e Javascript.

## 🎯 Objetivo

Desenvolver um protótipo funcional e responsivo que permita aos usuários:

- Encontrar postos de combustível próximos
- Comparar preços de diferentes combustíveis
- Visualizar informações detalhadas dos postos
- Avaliar e navegar entre opções disponíveis

## ✨ Funcionalidades Principais

### 🗺️ **Mapa Interativo**

- **Mapa real** integrado com OpenStreetMap via Leaflet.js
- **Geolocalização** automática do usuário
- **Marcadores dinâmicos** para postos de combustível
- **Popups informativos** com prévia dos preços
- **Navegação fluida** com zoom e pan

### 🔍 **Busca Inteligente**

- Campo de busca com funcionalidade em tempo real
- Botão de localização para centralizar no usuário
- Filtros por nome do posto e endereço
- Interface responsiva e acessível

### 🏪 **Detalhes dos Postos**

- **Modal detalhado** com informações completas
- Sistema de avaliação com estrelas
- Preços atualizados de combustíveis (Gasolina, Etanol, Diesel)
- Distância calculada em tempo real
- Botões de ação (Favoritar, Como chegar)

### 🚀 **Onboarding Responsivo**

- Telas de apresentação totalmente responsivas
- **Ilustrações vetoriais** substituindo imagens estáticas
- Animações suaves e interativas
- Navegação intuitiva entre etapas
- Adaptação perfeita para desktop e mobile

## 🛠️ Tecnologias Utilizadas

### **Frontend Core**

- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilização moderna com custom properties, grid e flexbox
- **JavaScript ES6+** - Lógica da aplicação e interatividade

### **APIs e Bibliotecas**

- **Leaflet.js** - Biblioteca de mapas interativos
- **OpenStreetMap** - Dados de mapa gratuitos e atualizados
- **Geolocation API** - Localização do usuário em tempo real

### **Design System**

- **Google Fonts** (Inter, Poppins) - Tipografia moderna
- **CSS Variables** - Sistema de cores e espaçamentos consistente
- **Mobile-first** - Abordagem responsiva progressiva

### **Ferramentas de Desenvolvimento**

- **Git** - Controle de versão
- **VS Code** - Ambiente de desenvolvimento
- **Browser DevTools** - Debug e testes

## 📁 Estrutura do Projeto

```
├── public/                          # Pontos de entrada da aplicação
│   ├── index.html                   # Página principal do app
│   └── splash.html                  # Tela de abertura
├── src/                             # Código fonte organizado
│   ├── assets/                      # Recursos estáticos
│   │   ├── images/                  # Imagens organizadas por contexto
│   │   └── icons/                   # Ícones SVG centralizados
│   ├── components/                  # Páginas organizadas por função
│   │   ├── auth/                    # Login e cadastro
│   │   ├── onboarding/              # First steps
│   │   └── config.html              # Configurações
│   ├── scripts/                     # JavaScript
│   │   └── app.js                   # Lógica principal
│   └── styles/                      # CSS estruturado
│       ├── base/                    # Reset, variáveis, utilidades
│       ├── pages/                   # Estilos específicos
│       └── main.css                 # Arquivo principal
├── docs/                            # Documentação
└── README.md
```

## 🎨 Fluxo de Navegação

1. **public/splash.html** → **Onboarding** → **Auth** → **App Principal**
2. **public/index.html** ⇄ **src/components/config.html**
3. Navegação fluida entre todas as páginas

## 🔧 Como Executar

### 🚀 Início Rápido

```bash
# Se tiver Python instalado
python -m http.server 8080

# Se tiver Node.js instalado
npx http-server

# Acesse a aplicação
http://localhost:8080/public/splash.html    # Fluxo completo
http://localhost:8080/public/index.html     # Direto para o app
```

### �️ Backend (API de Postos)

O backend fornece os dados dos postos via API REST usando **Express + Prisma (SQLite)**.

#### 1. Instalar dependências

```bash
cd backend
npm install
```

#### 2. Configurar ambiente

Crie um arquivo `.env` dentro de `backend/` (ou copie o exemplo):

```bash
cp .env.example .env
```

Conteúdo padrão:

```
DATABASE_URL="file:./prisma/dev.db"
```

#### 3. Aplicar migrações (se necessário)

Caso altere o schema Prisma no futuro:

```bash
npx prisma migrate dev
```

#### 4. Rodar o servidor

```bash
npm start
```

O servidor sobe (por padrão) em: `http://localhost:3000`.

#### 5. Estrutura principal

```
backend/
 ├── src/
 │   ├── server.ts          # Inicialização do Express + seed
 │   ├── routes/            # Agrupamento das rotas
 │   ├── controllers/       # Lógica das requisições
 │   ├── services/prisma.ts # Cliente Prisma
 │   └── utils/seed.ts      # Inserção inicial de postos (executa 1x)
 └── prisma/
		 ├── schema.prisma      # Modelo Station
		 └── dev.db             # Banco SQLite
```

#### 6. Endpoint principal

`GET /api/stations/all`

Parâmetros suportados (query string):
| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `page` | Página de resultados (paginação) | `1` |
| `limit` | Limite por página (máx 100) | `50` |
| `minLat`, `maxLat`, `minLng`, `maxLng` | Bounding box do mapa para filtrar postos | `minLat=-22.05` |
| `search` | Texto para buscar por nome ou endereço | `search=ipiranga` |
| `userLat`, `userLng` | Coordenadas do usuário para cálculo de distância | `userLat=-22.02` |

Resposta (exemplo simplificado):

```json
{
	"page": 1,
	"limit": 50,
	"count": 12,
	"data": [
		{
			"id": 1,
			"name": "Posto Petrobras Centro",
			"address": "Av Prof Luiz A.de Oliveira, 366 - Vila Marina",
			"lat": -22.0195,
			"lng": -47.891,
			"rating": 4.5,
			"fuels": { "gasoline": { "price": 5.99, "updated": "há 2h" }, ... },
			"features": ["Conveniência", "Borracharia"],
			"createdAt": "2025-09-11T19:45:00.000Z",
			"updatedAt": "2025-09-11T19:45:00.000Z",
			"distanceMeters": 152
		}
	]
}
```

Notas:

- Se `userLat`/`userLng` forem enviados, a API retorna `distanceMeters` e ordena por proximidade.
- Se o bounding box for enviado, restringe os resultados à área visível do mapa.
- O seed só roda se o banco estiver vazio (evita duplicações).

### �📱 Testando

1. **Fluxo Completo**: Comece em `public/splash.html`
2. **App Principal**: Acesse diretamente `public/index.html`
3. **Responsividade**: Use DevTools para testar diferentes telas

## 📱 Responsividade e Compatibilidade

### **Breakpoints Suportados**

- 📱 **Mobile**: 320px - 480px
- 📱 **Mobile Large**: 481px - 768px
- 💻 **Tablet**: 769px - 1024px
- 🖥️ **Desktop**: 1025px+

### **Funcionalidades Responsivas**

- **Layout Grid Adaptativo**: Reorganização automática de elementos
- **Ilustrações Escaláveis**: Gráficos vetoriais que se adaptam a qualquer tela
- **Navegação Touch**: Gestos otimizados para dispositivos móveis
- **Modais Responsivos**: Popups que se ajustam ao tamanho da tela
- **Mapa Interativo**: Controles touch para zoom e navegação

### **Browsers Suportados**

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### **APIs Utilizadas**

- **Geolocation API**: Localização automática do usuário
- **Fetch API**: Comunicação com APIs externas (futuro)
- **Local Storage**: Persistência de preferências (futuro)

## 🎨 Design System

### Cores Principais:

- **Primária**: `#FE4F02` (Laranja)
- **Cinza**: `#33302F` (Textos/Botões)
- **Terciária**: `#6B6867` (Subtextos)
- **Background**: `#FFE4D6` (Fundo claro)

### Tipografia:

- **Títulos**: Inter Bold
- **Textos**: Inter Regular
- **Preços**: Poppins Regular

## 🔄 Melhorias Implementadas na Versão Atual

### ✅ **Telas de Onboarding Responsivas**

- Substituição de imagens estáticas por ilustrações CSS/SVG
- Layout grid que adapta para desktop e mobile
- Animações interativas e suaves
- Navegação funcional entre etapas

### ✅ **Mapa Real Integrado**

- **Leaflet.js** com tiles do OpenStreetMap
- **Geolocalização automática** do usuário
- **Marcadores interativos** nos postos de combustível
- **Popups informativos** com prévia de preços
- **Modal detalhado** para informações completas do posto

### ✅ **Interface Melhorada**

- Design consistente e moderno
- Componentes reutilizáveis
- Feedback visual para todas as interações
- Acessibilidade aprimorada

## 🚀 Próximas Melhorias

- Integração com APIs de postos reais para preços dinâmicos
- Sistema de autenticação funcional
- Base de dados para avaliações de usuários
- PWA (Progressive Web App) com funcionamento offline
- Sistema de favoritos persistente
- Notificações push para variações de preço
- Dark mode
- Filtros avançados de busca

## 📋 Critérios de Avaliação Atendidos

- ✅ Aplicação responsiva
- ✅ Uso de HTML e CSS
- ✅ Interface moderna e intuitiva
- ✅ Navegação funcional
- ✅ Organização de código
- ✅ Estrutura de arquivos adequada

## 👨‍💻 Desenvolvimento

Projeto desenvolvido para a disciplina de **Desenvolvimento Web 2** - UFSCar.

---

_Última atualização: 05 de Setembro de 2025_
