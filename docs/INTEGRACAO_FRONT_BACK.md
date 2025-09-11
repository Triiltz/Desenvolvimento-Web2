### 🔄 Integração Frontend ↔ Backend

O arquivo `src/scripts/app.js` agora:

1. Removeu a lista mock local de postos.
2. Busca os dados via `fetch` em `GET /api/stations/all`.
3. Envia parâmetros de bounding box (`minLat`, `maxLat`, `minLng`, `maxLng`).
4. Reenvia a busca ao mover o mapa (debounce 300ms em `moveend`).
5. Aplica busca textual via parâmetro `search` (debounce ~350ms ao digitar).
6. Recalcula distâncias no backend quando coordenadas do usuário estão disponíveis.
7. Remove e recria marcadores a cada atualização.

Resumo do fluxo:

```
Mapa carrega → Obtém bounds → Chama API → Renderiza marcadores → Usuário move/zooma → Novos bounds → Nova requisição
```

### ✅ Mudanças Técnicas Recentes

| Área     | Alteração                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------ |
| Backend  | Controller `getAll` agora aceita filtros (bounding box, busca, userLat/userLng) e ordena por distância |
| Backend  | Seed evita duplicação ao checar se já existem registros                                                |
| Frontend | Removido mock e adicionada função `loadStationsFromAPI`                                                |
| Frontend | Busca reativa com debounce e atualização de marcadores                                                 |
| Frontend | Atualização automática ao mover o mapa (`moveend`)                                                     |
| Docs     | Adicionada seção completa sobre backend e integração                                                   |
