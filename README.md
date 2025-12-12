# Integrantes

- Gabriel Lucchetta Garcia Sanchez - 828513
- Guilherme César Athayde - 748175
- Leonardo Triiltz Siqueira - 811904

<h1 align="center">FIZY (Next.js Edition)</h1>

Aplicativo web para buscar, comparar e avaliar postos de combustível – migrado da versão estática (HTML/CSS/JS puro) para **Next.js 15 + Prisma + Leaflet**.

## ✨ Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- Prisma ORM (SQLite)
- Leaflet + React-Leaflet (Mapa / OSM)

## 🚀 Executando Localmente

1. Instale dependências:

```bash
npm install
```

2. Copie `.env.example` → `.env` (ajuste se quiser mudar o caminho do banco):

```bash
cp .env.example .env
```

3. Gere o cliente Prisma e crie o banco:

```bash
npm run prisma:push
```

4. Rode seed (dados iniciais de postos):

```bash
npm run db:seed
```

5. Inicie em dev:

```bash
npm run dev
```

6. Acesse:

```
http://localhost:3000/splash   # Fluxo inicial
http://localhost:3000/onboarding
http://localhost:3000/         # App (mapa)
```

## 🗺️ Endpoint Principal

`GET /api/stations/all`

Query params suportados:

| Param                         | Descrição                 | Default |
| ----------------------------- | ------------------------- | ------- |
| `page`                        | Página                    | 1       |
| `limit`                       | Limite (<=100)            | 50      |
| `search`                      | Nome ou endereço          | -       |
| `minLat,maxLat,minLng,maxLng` | Bounding box              | -       |
| `userLat,userLng`             | Para cálculo de distância | -       |

Resposta:

```json
{
  "page": 1,
  "limit": 50,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Posto...",
      "lat": -22.01,
      "lng": -47.89,
      "fuels": {
        "gasoline": { "price": 5.99, "updated": "2025-09-19T12:00:00.000Z" }
      },
      "distanceMeters": 152
    }
  ]
}
```

## 📂 Estrutura Simplificada

```
prisma/
	schema.prisma
	seed.ts
src/
	app/
		api/stations/all/route.ts
		splash/page.tsx
		onboarding/page.tsx
		config/page.tsx
		page.tsx
	components/Map/StationsMap.tsx
	lib/prisma.ts
	types/station.ts
```

## 🔮 Próximos Passos (Sugestões)

- Autenticação (NextAuth ou Lucia)
- Favoritos persistentes (tabela UserFavorite)
- Avaliações (Review model)
- Filtros avançados (preço máximo, recurso do posto)
- Modo escuro com toggle persistido
- PWA / offline para último mapa visto

## 🧪 Teste Rápido do Endpoint

```bash
curl 'http://localhost:3000/api/stations/all?userLat=-22.0195&userLng=-47.891'
```

## 🛠️ Manutenção

Regenerar client após mudar o schema:

```bash
npm run prisma:generate
npm run prisma:push
```

## 📄 Licença

Uso acadêmico / educacional.

---

Migrado automaticamente a partir da versão estática para base Next.js com backend integrado. ✨
