import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.station.count();
  if (count > 0) {
    console.log('Seed: banco já possui registros, abortando.');
    return;
  }

  const now = new Date();
  // Inserção com relações
  const stationsData = [
    {
      name: 'Posto Petrobras Centro',
      address: 'Av Prof Luiz A.de Oliveira, 366 - Vila Marina',
      lat: -22.0195,
      lng: -47.891,
      rating: 4.5,
      features: ['Conveniência', 'Borracharia', 'Lava-jato'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.99,
        },
        {
          type: 'ETHANOL',
          price: 4.29,
        },
        {
          type: 'DIESEL',
          price: 5.49,
        },
      ],
    },
    {
      name: 'Shell São Carlos',
      address: 'Rua Conde do Pinhal, 1252 - Centro',
      lat: -22.0245,
      lng: -47.8912,
      rating: 4.3,
      features: ['Conveniência', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.05,
        },
        {
          type: 'ETHANOL',
          price: 4.35,
        },
        {
          type: 'DIESEL',
          price: 5.59,
        },
      ],
    },
    {
      name: 'Ipiranga Express',
      address: 'Av São Carlos, 2800 - Jardim Macarengo',
      lat: -22.0178,
      lng: -47.8935,
      rating: 4.7,
      features: ['Conveniência', 'Lava-jato', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.89,
        },
        {
          type: 'ETHANOL',
          price: 4.19,
        },
        {
          type: 'DIESEL',
          price: 5.39,
        },
      ],
    },
    {
      name: 'Auto Posto Bandeirantes',
      address: 'Rua Marechal Deodoro, 1520 - Centro',
      lat: -22.0212,
      lng: -47.8856,
      rating: 4,
      features: ['Borracharia', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.93,
        },
        {
          type: 'ETHANOL',
          price: 4.25,
        },
        {
          type: 'DIESEL',
          price: 5.45,
        },
      ],
    },
    {
      name: 'Posto BR Universitário',
      address: 'Rod Washington Luiz, Km 235 - Jardim Guanabara',
      lat: -22.0283,
      lng: -47.9012,
      rating: 4.6,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo', 'Restaurante'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.97,
        },
        {
          type: 'ETHANOL',
          price: 4.22,
        },
        {
          type: 'DIESEL',
          price: 5.47,
        },
      ],
    },
    {
      name: 'Rede Graal São Carlos',
      address: 'Rod Washington Luiz, Km 237 - Bairro Planalto',
      lat: -22.0356,
      lng: -47.9102,
      rating: 4.8,
      features: [
        'Conveniência',
        'Restaurante',
        'Banheiro',
        'Chuveiro',
        'Hotel',
      ],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.09,
        },
        {
          type: 'ETHANOL',
          price: 4.39,
        },
        {
          type: 'DIESEL',
          price: 5.55,
        },
      ],
    },
    {
      name: 'Posto Ale Vila Prado',
      address: 'Av Getulio Vargas, 752 - Vila Prado',
      lat: -22.0412,
      lng: -47.8953,
      rating: 3.9,
      features: ['Conveniência', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.85,
        },
        {
          type: 'ETHANOL',
          price: 4.15,
        },
        {
          type: 'DIESEL',
          price: 5.35,
        },
      ],
    },
    {
      name: 'Auto Posto São Carlos',
      address: 'Rua Dona Alexandrina, 960 - Centro',
      lat: -22.0221,
      lng: -47.8925,
      rating: 4.2,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.95,
        },
        {
          type: 'ETHANOL',
          price: 4.24,
        },
        {
          type: 'DIESEL',
          price: 5.42,
        },
      ],
    },
    {
      name: 'Petrobras Vila Nery',
      address: 'Rua 15 de Novembro, 1540 - Vila Nery',
      lat: -22.0169,
      lng: -47.8842,
      rating: 4.4,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.98,
        },
        {
          type: 'ETHANOL',
          price: 4.28,
        },
        {
          type: 'DIESEL',
          price: 5.48,
        },
      ],
    },
    {
      name: 'Shell Select Botafogo',
      address: 'Av Dr Carlos Botelho, 1320 - Vila Pureza',
      lat: -22.0189,
      lng: -47.8876,
      rating: 4.5,
      features: ['Conveniência', 'Lava-jato', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.03,
        },
        {
          type: 'ETHANOL',
          price: 4.33,
        },
        {
          type: 'DIESEL',
          price: 5.53,
        },
      ],
    },
    {
      name: 'Posto Ipiranga UFSCar',
      address: 'Rod Washington Luiz, Km 233 - Monjolinho',
      lat: -22.0056,
      lng: -47.8932,
      rating: 4.6,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h', 'Restaurante'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.92,
        },
        {
          type: 'ETHANOL',
          price: 4.21,
        },
        {
          type: 'DIESEL',
          price: 5.43,
        },
      ],
    },
    {
      name: 'Auto Posto Cidade Jardim',
      address: 'Av Bruno Ruggiero Filho, 325 - Cidade Jardim',
      lat: -22.0312,
      lng: -47.9045,
      rating: 4.1,
      features: ['Conveniência', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.18,
        },
        {
          type: 'DIESEL',
          price: 5.41,
        },
      ],
    },
    {
      name: 'Posto BR Santa Felícia',
      address: 'Av Miguel Petroni, 2350 - Santa Felícia',
      lat: -22.0034,
      lng: -47.9076,
      rating: 4.3,
      features: ['Conveniência', 'Lava-jato', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.96,
        },
        {
          type: 'ETHANOL',
          price: 4.26,
        },
        {
          type: 'DIESEL',
          price: 5.46,
        },
      ],
    },
    {
      name: 'Shell Jardim Medeiros',
      address: 'Av Trabalhador São-carlense, 1750 - Jardim Medeiros',
      lat: -22.0213,
      lng: -47.9002,
      rating: 4,
      features: ['Conveniência', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.01,
        },
        {
          type: 'ETHANOL',
          price: 4.31,
        },
        {
          type: 'DIESEL',
          price: 5.51,
        },
      ],
    },
    {
      name: 'Posto Petrobras Redenção',
      address: 'Av Francisco Pereira Lopes, 2850 - Redenção',
      lat: -22.0326,
      lng: -47.8795,
      rating: 4.7,
      features: ['Conveniência', 'Lava-jato', 'Calibragem', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.94,
        },
        {
          type: 'ETHANOL',
          price: 4.24,
        },
        {
          type: 'DIESEL',
          price: 5.44,
        },
      ],
    },
    {
      name: 'Auto Posto Santa Paula',
      address: 'Rua Major Manuel Antônio de Mattos, 1200 - Santa Paula',
      lat: -22.0418,
      lng: -47.9021,
      rating: 3.8,
      features: ['Calibragem', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.88,
        },
        {
          type: 'ETHANOL',
          price: 4.17,
        },
        {
          type: 'DIESEL',
          price: 5.38,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Bela Vista',
      address: 'Av Bela Cintra, 780 - Bela Vista',
      lat: -22.0265,
      lng: -47.8735,
      rating: 4.4,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.91,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Shell Box Santa Marta',
      address: 'Rua José Bonifácio, 950 - Santa Marta',
      lat: -22.0354,
      lng: -47.8823,
      rating: 4.2,
      features: ['Conveniência', 'Caixa 24h', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.04,
        },
        {
          type: 'ETHANOL',
          price: 4.34,
        },
        {
          type: 'DIESEL',
          price: 5.54,
        },
      ],
    },
    {
      name: 'Posto BR Vila Isabel',
      address: 'Av Getúlio Vargas, 560 - Vila Isabel',
      lat: -22.0398,
      lng: -47.8912,
      rating: 3.9,
      features: ['Borracharia', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.95,
        },
        {
          type: 'ETHANOL',
          price: 4.25,
        },
        {
          type: 'DIESEL',
          price: 5.45,
        },
      ],
    },
    {
      name: 'Auto Posto Castelo',
      address: 'Rua São Sebastião, 1870 - Vila Monteiro',
      lat: -22.0187,
      lng: -47.8798,
      rating: 4.3,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.93,
        },
        {
          type: 'ETHANOL',
          price: 4.23,
        },
        {
          type: 'DIESEL',
          price: 5.43,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Morumbi',
      address: 'Av Morumbi, 3500 - Jardim Morumbi',
      lat: -22.045,
      lng: -47.885,
      rating: 4.6,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo', 'Restaurante'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Shell Vila Nery',
      address: 'Rua 13 de Maio, 1200 - Vila Nery',
      lat: -22.018,
      lng: -47.884,
      rating: 4.4,
      features: ['Conveniência', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6,
        },
        {
          type: 'ETHANOL',
          price: 4.3,
        },
        {
          type: 'DIESEL',
          price: 5.5,
        },
      ],
    },
    {
      name: 'Posto BR Planalto',
      address: 'Av João Dario, 450 - Planalto',
      lat: -22.036,
      lng: -47.91,
      rating: 4.1,
      features: ['Conveniência', 'Lava-jato', 'Restaurante'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.85,
        },
        {
          type: 'ETHANOL',
          price: 4.15,
        },
        {
          type: 'DIESEL',
          price: 5.35,
        },
      ],
    },
    {
      name: 'Auto Posto São Carlos 2',
      address: 'Rua São Carlos, 2000 - Jardim São Carlos',
      lat: -22.017,
      lng: -47.895,
      rating: 4.7,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.92,
        },
        {
          type: 'ETHANOL',
          price: 4.21,
        },
        {
          type: 'DIESEL',
          price: 5.43,
        },
      ],
    },
    {
      name: 'Shell Select São Carlos',
      address: 'Av São Carlos, 1500 - Centro',
      lat: -22.024,
      lng: -47.8915,
      rating: 4.3,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.05,
        },
        {
          type: 'ETHANOL',
          price: 4.35,
        },
        {
          type: 'DIESEL',
          price: 5.55,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Centro',
      address: 'Rua XV de Novembro, 500 - Centro',
      lat: -22.022,
      lng: -47.891,
      rating: 4.6,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Auto Posto Bandeirantes 2',
      address: 'Av Bandeirantes, 1000 - Jardim Bandeirantes',
      lat: -22.03,
      lng: -47.9,
      rating: 4.2,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.93,
        },
        {
          type: 'ETHANOL',
          price: 4.25,
        },
        {
          type: 'DIESEL',
          price: 5.45,
        },
      ],
    },
    {
      name: 'Shell Vila Prado',
      address: 'Av Washington Luís, 1500 - Vila Prado',
      lat: -22.041,
      lng: -47.895,
      rating: 4.4,
      features: ['Conveniência', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6,
        },
        {
          type: 'ETHANOL',
          price: 4.3,
        },
        {
          type: 'DIESEL',
          price: 5.5,
        },
      ],
    },
    {
      name: 'Posto BR Redenção',
      address: 'Av Redenção, 2500 - Redenção',
      lat: -22.032,
      lng: -47.879,
      rating: 4.7,
      features: ['Conveniência', 'Lava-jato', 'Calibragem', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.94,
        },
        {
          type: 'ETHANOL',
          price: 4.24,
        },
        {
          type: 'DIESEL',
          price: 5.44,
        },
      ],
    },
    {
      name: 'Auto Posto Santa Terezinha',
      address: 'Rua Santa Terezinha, 300 - Jardim Santa Terezinha',
      lat: -22.045,
      lng: -47.885,
      rating: 4.1,
      features: ['Conveniência', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Jardim São Carlos',
      address: 'Av São Carlos, 1800 - Jardim São Carlos',
      lat: -22.018,
      lng: -47.895,
      rating: 4.6,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.92,
        },
        {
          type: 'ETHANOL',
          price: 4.21,
        },
        {
          type: 'DIESEL',
          price: 5.43,
        },
      ],
    },
    {
      name: 'Shell Select Jardim Planalto',
      address: 'Av Planalto, 1200 - Jardim Planalto',
      lat: -22.036,
      lng: -47.91,
      rating: 4.3,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.05,
        },
        {
          type: 'ETHANOL',
          price: 4.35,
        },
        {
          type: 'DIESEL',
          price: 5.55,
        },
      ],
    },
    {
      name: 'Posto BR Santa Eudóxia',
      address: 'Av Santa Eudóxia, 500 - Santa Eudóxia',
      lat: -22.045,
      lng: -47.87,
      rating: 4.2,
      features: ['Conveniência', 'Lava-jato', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.96,
        },
        {
          type: 'ETHANOL',
          price: 4.26,
        },
        {
          type: 'DIESEL',
          price: 5.46,
        },
      ],
    },
    {
      name: 'Auto Posto São Carlos 3',
      address: 'Rua São Carlos, 2500 - Jardim São Carlos',
      lat: -22.017,
      lng: -47.895,
      rating: 4.7,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Shell Vila Marina',
      address: 'Av Prof Luiz A.de Oliveira, 1500 - Vila Marina',
      lat: -22.0195,
      lng: -47.891,
      rating: 4.4,
      features: ['Conveniência', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6,
        },
        {
          type: 'ETHANOL',
          price: 4.3,
        },
        {
          type: 'DIESEL',
          price: 5.5,
        },
      ],
    },
    {
      name: 'Posto BR Universitário 2',
      address: 'Rod Washington Luiz, Km 236 - Jardim Guanabara',
      lat: -22.0283,
      lng: -47.9012,
      rating: 4.6,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo', 'Restaurante'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.97,
        },
        {
          type: 'ETHANOL',
          price: 4.22,
        },
        {
          type: 'DIESEL',
          price: 5.47,
        },
      ],
    },
    {
      name: 'Rede Graal São Carlos 2',
      address: 'Rod Washington Luiz, Km 238 - Bairro Planalto',
      lat: -22.0356,
      lng: -47.9102,
      rating: 4.8,
      features: [
        'Conveniência',
        'Restaurante',
        'Banheiro',
        'Chuveiro',
        'Hotel',
      ],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.09,
        },
        {
          type: 'ETHANOL',
          price: 4.39,
        },
        {
          type: 'DIESEL',
          price: 5.55,
        },
      ],
    },
    {
      name: 'Posto Ale Vila Prado 2',
      address: 'Av Getulio Vargas, 800 - Vila Prado',
      lat: -22.0412,
      lng: -47.8953,
      rating: 3.9,
      features: ['Conveniência', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.85,
        },
        {
          type: 'ETHANOL',
          price: 4.15,
        },
        {
          type: 'DIESEL',
          price: 5.35,
        },
      ],
    },
    {
      name: 'Auto Posto São Carlos 4',
      address: 'Rua Dona Alexandrina, 1100 - Centro',
      lat: -22.0221,
      lng: -47.8925,
      rating: 4.2,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.95,
        },
        {
          type: 'ETHANOL',
          price: 4.24,
        },
        {
          type: 'DIESEL',
          price: 5.42,
        },
      ],
    },
    {
      name: 'Petrobras Vila Nery 2',
      address: 'Rua 15 de Novembro, 1600 - Vila Nery',
      lat: -22.0169,
      lng: -47.8842,
      rating: 4.4,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.98,
        },
        {
          type: 'ETHANOL',
          price: 4.28,
        },
        {
          type: 'DIESEL',
          price: 5.48,
        },
      ],
    },
    {
      name: 'Shell Select Botafogo 2',
      address: 'Av Dr Carlos Botelho, 1400 - Vila Pureza',
      lat: -22.0189,
      lng: -47.8876,
      rating: 4.5,
      features: ['Conveniência', 'Lava-jato', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.03,
        },
        {
          type: 'ETHANOL',
          price: 4.33,
        },
        {
          type: 'DIESEL',
          price: 5.53,
        },
      ],
    },
    {
      name: 'Posto Ipiranga UFSCar 2',
      address: 'Rod Washington Luiz, Km 234 - Monjolinho',
      lat: -22.0056,
      lng: -47.8932,
      rating: 4.6,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h', 'Restaurante'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.92,
        },
        {
          type: 'ETHANOL',
          price: 4.21,
        },
        {
          type: 'DIESEL',
          price: 5.43,
        },
      ],
    },
    {
      name: 'Auto Posto Cidade Jardim 2',
      address: 'Av Bruno Ruggiero Filho, 350 - Cidade Jardim',
      lat: -22.0312,
      lng: -47.9045,
      rating: 4.1,
      features: ['Conveniência', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.18,
        },
        {
          type: 'DIESEL',
          price: 5.41,
        },
      ],
    },
    {
      name: 'Posto BR Santa Felícia 2',
      address: 'Av Miguel Petroni, 2400 - Santa Felícia',
      lat: -22.0034,
      lng: -47.9076,
      rating: 4.3,
      features: ['Conveniência', 'Lava-jato', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.96,
        },
        {
          type: 'ETHANOL',
          price: 4.26,
        },
        {
          type: 'DIESEL',
          price: 5.46,
        },
      ],
    },
    {
      name: 'Shell Jardim Medeiros 2',
      address: 'Av Trabalhador São-carlense, 1800 - Jardim Medeiros',
      lat: -22.0213,
      lng: -47.9002,
      rating: 4,
      features: ['Conveniência', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.01,
        },
        {
          type: 'ETHANOL',
          price: 4.31,
        },
        {
          type: 'DIESEL',
          price: 5.51,
        },
      ],
    },
    {
      name: 'Posto Petrobras Redenção 2',
      address: 'Av Francisco Pereira Lopes, 2900 - Redenção',
      lat: -22.0326,
      lng: -47.8795,
      rating: 4.7,
      features: ['Conveniência', 'Lava-jato', 'Calibragem', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.94,
        },
        {
          type: 'ETHANOL',
          price: 4.24,
        },
        {
          type: 'DIESEL',
          price: 5.44,
        },
      ],
    },
    {
      name: 'Auto Posto Santa Paula 2',
      address: 'Rua Major Manuel Antônio de Mattos, 1300 - Santa Paula',
      lat: -22.0418,
      lng: -47.9021,
      rating: 3.8,
      features: ['Calibragem', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.88,
        },
        {
          type: 'ETHANOL',
          price: 4.17,
        },
        {
          type: 'DIESEL',
          price: 5.38,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Bela Vista 2',
      address: 'Av Bela Cintra, 800 - Bela Vista',
      lat: -22.0265,
      lng: -47.8735,
      rating: 4.4,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.91,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Shell Box Santa Marta 2',
      address: 'Rua José Bonifácio, 1000 - Santa Marta',
      lat: -22.0354,
      lng: -47.8823,
      rating: 4.2,
      features: ['Conveniência', 'Caixa 24h', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.04,
        },
        {
          type: 'ETHANOL',
          price: 4.34,
        },
        {
          type: 'DIESEL',
          price: 5.54,
        },
      ],
    },
    {
      name: 'Posto BR Vila Isabel 2',
      address: 'Av Getúlio Vargas, 600 - Vila Isabel',
      lat: -22.0398,
      lng: -47.8912,
      rating: 3.9,
      features: ['Borracharia', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.95,
        },
        {
          type: 'ETHANOL',
          price: 4.25,
        },
        {
          type: 'DIESEL',
          price: 5.45,
        },
      ],
    },
    {
      name: 'Auto Posto Castelo 2',
      address: 'Rua São Sebastião, 1900 - Vila Monteiro',
      lat: -22.0187,
      lng: -47.8798,
      rating: 4.3,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.93,
        },
        {
          type: 'ETHANOL',
          price: 4.23,
        },
        {
          type: 'DIESEL',
          price: 5.43,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Morumbi 2',
      address: 'Av Morumbi, 3600 - Jardim Morumbi',
      lat: -22.045,
      lng: -47.885,
      rating: 4.6,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo', 'Restaurante'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Shell Vila Nery 2',
      address: 'Rua 13 de Maio, 1300 - Vila Nery',
      lat: -22.018,
      lng: -47.884,
      rating: 4.4,
      features: ['Conveniência', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6,
        },
        {
          type: 'ETHANOL',
          price: 4.3,
        },
        {
          type: 'DIESEL',
          price: 5.5,
        },
      ],
    },
    {
      name: 'Posto BR Planalto 2',
      address: 'Av João Dario, 500 - Planalto',
      lat: -22.036,
      lng: -47.91,
      rating: 4.1,
      features: ['Conveniência', 'Lava-jato', 'Restaurante'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.85,
        },
        {
          type: 'ETHANOL',
          price: 4.15,
        },
        {
          type: 'DIESEL',
          price: 5.35,
        },
      ],
    },
    {
      name: 'Auto Posto São Carlos 5',
      address: 'Rua São Carlos, 3000 - Jardim São Carlos',
      lat: -22.017,
      lng: -47.895,
      rating: 4.7,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.92,
        },
        {
          type: 'ETHANOL',
          price: 4.21,
        },
        {
          type: 'DIESEL',
          price: 5.43,
        },
      ],
    },
    {
      name: 'Shell Select São Carlos 2',
      address: 'Av São Carlos, 2000 - Centro',
      lat: -22.024,
      lng: -47.8915,
      rating: 4.3,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.05,
        },
        {
          type: 'ETHANOL',
          price: 4.35,
        },
        {
          type: 'DIESEL',
          price: 5.55,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Centro 2',
      address: 'Rua XV de Novembro, 600 - Centro',
      lat: -22.022,
      lng: -47.891,
      rating: 4.6,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Auto Posto Bandeirantes 3',
      address: 'Av Bandeirantes, 1200 - Jardim Bandeirantes',
      lat: -22.03,
      lng: -47.9,
      rating: 4.2,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.93,
        },
        {
          type: 'ETHANOL',
          price: 4.25,
        },
        {
          type: 'DIESEL',
          price: 5.45,
        },
      ],
    },
    {
      name: 'Shell Vila Prado 2',
      address: 'Av Washington Luís, 2000 - Vila Prado',
      lat: -22.041,
      lng: -47.895,
      rating: 4.4,
      features: ['Conveniência', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6,
        },
        {
          type: 'ETHANOL',
          price: 4.3,
        },
        {
          type: 'DIESEL',
          price: 5.5,
        },
      ],
    },
    {
      name: 'Posto BR Redenção 3',
      address: 'Av Redenção, 3000 - Redenção',
      lat: -22.032,
      lng: -47.879,
      rating: 4.7,
      features: ['Conveniência', 'Lava-jato', 'Calibragem', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.94,
        },
        {
          type: 'ETHANOL',
          price: 4.24,
        },
        {
          type: 'DIESEL',
          price: 5.44,
        },
      ],
    },
    {
      name: 'Auto Posto Santa Terezinha 2',
      address: 'Rua Santa Terezinha, 400 - Jardim Santa Terezinha',
      lat: -22.045,
      lng: -47.885,
      rating: 4.1,
      features: ['Conveniência', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Jardim São Carlos 2',
      address: 'Av São Carlos, 2000 - Jardim São Carlos',
      lat: -22.018,
      lng: -47.895,
      rating: 4.6,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.92,
        },
        {
          type: 'ETHANOL',
          price: 4.21,
        },
        {
          type: 'DIESEL',
          price: 5.43,
        },
      ],
    },
    {
      name: 'Shell Select Jardim Planalto 2',
      address: 'Av Planalto, 1300 - Jardim Planalto',
      lat: -22.036,
      lng: -47.91,
      rating: 4.3,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.05,
        },
        {
          type: 'ETHANOL',
          price: 4.35,
        },
        {
          type: 'DIESEL',
          price: 5.55,
        },
      ],
    },
    {
      name: 'Posto BR Santa Eudóxia 2',
      address: 'Av Santa Eudóxia, 600 - Santa Eudóxia',
      lat: -22.045,
      lng: -47.87,
      rating: 4.2,
      features: ['Conveniência', 'Lava-jato', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.96,
        },
        {
          type: 'ETHANOL',
          price: 4.26,
        },
        {
          type: 'DIESEL',
          price: 5.46,
        },
      ],
    },
    {
      name: 'Auto Posto São Carlos 6',
      address: 'Rua São Carlos, 3500 - Jardim São Carlos',
      lat: -22.017,
      lng: -47.895,
      rating: 4.7,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Shell Vila Marina 2',
      address: 'Av Prof Luiz A.de Oliveira, 2000 - Vila Marina',
      lat: -22.0195,
      lng: -47.891,
      rating: 4.4,
      features: ['Conveniência', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6,
        },
        {
          type: 'ETHANOL',
          price: 4.3,
        },
        {
          type: 'DIESEL',
          price: 5.5,
        },
      ],
    },
    {
      name: 'Posto BR Universitário 3',
      address: 'Rod Washington Luiz, Km 237 - Jardim Guanabara',
      lat: -22.0283,
      lng: -47.9012,
      rating: 4.6,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo', 'Restaurante'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.97,
        },
        {
          type: 'ETHANOL',
          price: 4.22,
        },
        {
          type: 'DIESEL',
          price: 5.47,
        },
      ],
    },
    {
      name: 'Rede Graal São Carlos 3',
      address: 'Rod Washington Luiz, Km 239 - Bairro Planalto',
      lat: -22.0356,
      lng: -47.9102,
      rating: 4.8,
      features: [
        'Conveniência',
        'Restaurante',
        'Banheiro',
        'Chuveiro',
        'Hotel',
      ],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.09,
        },
        {
          type: 'ETHANOL',
          price: 4.39,
        },
        {
          type: 'DIESEL',
          price: 5.55,
        },
      ],
    },
    {
      name: 'Posto Ale Vila Prado 3',
      address: 'Av Getulio Vargas, 900 - Vila Prado',
      lat: -22.0412,
      lng: -47.8953,
      rating: 3.9,
      features: ['Conveniência', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.85,
        },
        {
          type: 'ETHANOL',
          price: 4.15,
        },
        {
          type: 'DIESEL',
          price: 5.35,
        },
      ],
    },
    {
      name: 'Auto Posto São Carlos 7',
      address: 'Rua Dona Alexandrina, 1200 - Centro',
      lat: -22.0221,
      lng: -47.8925,
      rating: 4.2,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.95,
        },
        {
          type: 'ETHANOL',
          price: 4.24,
        },
        {
          type: 'DIESEL',
          price: 5.42,
        },
      ],
    },
    {
      name: 'Petrobras Vila Nery 3',
      address: 'Rua 15 de Novembro, 1700 - Vila Nery',
      lat: -22.0169,
      lng: -47.8842,
      rating: 4.4,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.98,
        },
        {
          type: 'ETHANOL',
          price: 4.28,
        },
        {
          type: 'DIESEL',
          price: 5.48,
        },
      ],
    },
    {
      name: 'Shell Select Botafogo 3',
      address: 'Av Dr Carlos Botelho, 1500 - Vila Pureza',
      lat: -22.0189,
      lng: -47.8876,
      rating: 4.5,
      features: ['Conveniência', 'Lava-jato', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.03,
        },
        {
          type: 'ETHANOL',
          price: 4.33,
        },
        {
          type: 'DIESEL',
          price: 5.53,
        },
      ],
    },
    {
      name: 'Posto Ipiranga UFSCar 3',
      address: 'Rod Washington Luiz, Km 235 - Monjolinho',
      lat: -22.0056,
      lng: -47.8932,
      rating: 4.6,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h', 'Restaurante'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.92,
        },
        {
          type: 'ETHANOL',
          price: 4.21,
        },
        {
          type: 'DIESEL',
          price: 5.43,
        },
      ],
    },
    {
      name: 'Auto Posto Cidade Jardim 3',
      address: 'Av Bruno Ruggiero Filho, 400 - Cidade Jardim',
      lat: -22.0312,
      lng: -47.9045,
      rating: 4.1,
      features: ['Conveniência', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.18,
        },
        {
          type: 'DIESEL',
          price: 5.41,
        },
      ],
    },
    {
      name: 'Posto BR Santa Felícia 3',
      address: 'Av Miguel Petroni, 2500 - Santa Felícia',
      lat: -22.0034,
      lng: -47.9076,
      rating: 4.3,
      features: ['Conveniência', 'Lava-jato', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.96,
        },
        {
          type: 'ETHANOL',
          price: 4.26,
        },
        {
          type: 'DIESEL',
          price: 5.46,
        },
      ],
    },
    {
      name: 'Shell Jardim Medeiros 3',
      address: 'Av Trabalhador São-carlense, 1900 - Jardim Medeiros',
      lat: -22.0213,
      lng: -47.9002,
      rating: 4,
      features: ['Conveniência', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.01,
        },
        {
          type: 'ETHANOL',
          price: 4.31,
        },
        {
          type: 'DIESEL',
          price: 5.51,
        },
      ],
    },
    {
      name: 'Posto Petrobras Redenção 3',
      address: 'Av Francisco Pereira Lopes, 2950 - Redenção',
      lat: -22.0326,
      lng: -47.8795,
      rating: 4.7,
      features: ['Conveniência', 'Lava-jato', 'Calibragem', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.94,
        },
        {
          type: 'ETHANOL',
          price: 4.24,
        },
        {
          type: 'DIESEL',
          price: 5.44,
        },
      ],
    },
    {
      name: 'Auto Posto Santa Paula 3',
      address: 'Rua Major Manuel Antônio de Mattos, 1400 - Santa Paula',
      lat: -22.0418,
      lng: -47.9021,
      rating: 3.8,
      features: ['Calibragem', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.88,
        },
        {
          type: 'ETHANOL',
          price: 4.17,
        },
        {
          type: 'DIESEL',
          price: 5.38,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Bela Vista 3',
      address: 'Av Bela Cintra, 900 - Bela Vista',
      lat: -22.0265,
      lng: -47.8735,
      rating: 4.4,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.91,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Shell Box Santa Marta 3',
      address: 'Rua José Bonifácio, 1100 - Santa Marta',
      lat: -22.0354,
      lng: -47.8823,
      rating: 4.2,
      features: ['Conveniência', 'Caixa 24h', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.04,
        },
        {
          type: 'ETHANOL',
          price: 4.34,
        },
        {
          type: 'DIESEL',
          price: 5.54,
        },
      ],
    },
    {
      name: 'Posto BR Vila Isabel 3',
      address: 'Av Getúlio Vargas, 640 - Vila Isabel',
      lat: -22.0398,
      lng: -47.8912,
      rating: 3.9,
      features: ['Borracharia', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.95,
        },
        {
          type: 'ETHANOL',
          price: 4.25,
        },
        {
          type: 'DIESEL',
          price: 5.45,
        },
      ],
    },
    {
      name: 'Auto Posto Castelo 3',
      address: 'Rua São Sebastião, 2000 - Vila Monteiro',
      lat: -22.0187,
      lng: -47.8798,
      rating: 4.3,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.93,
        },
        {
          type: 'ETHANOL',
          price: 4.23,
        },
        {
          type: 'DIESEL',
          price: 5.43,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Morumbi 3',
      address: 'Av Morumbi, 3700 - Jardim Morumbi',
      lat: -22.045,
      lng: -47.885,
      rating: 4.6,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo', 'Restaurante'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Shell Vila Nery 3',
      address: 'Rua 13 de Maio, 1400 - Vila Nery',
      lat: -22.018,
      lng: -47.884,
      rating: 4.4,
      features: ['Conveniência', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6,
        },
        {
          type: 'ETHANOL',
          price: 4.3,
        },
        {
          type: 'DIESEL',
          price: 5.5,
        },
      ],
    },
    {
      name: 'Posto BR Planalto 3',
      address: 'Av João Dario, 600 - Planalto',
      lat: -22.036,
      lng: -47.91,
      rating: 4.1,
      features: ['Conveniência', 'Lava-jato', 'Restaurante'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.85,
        },
        {
          type: 'ETHANOL',
          price: 4.15,
        },
        {
          type: 'DIESEL',
          price: 5.35,
        },
      ],
    },
    {
      name: 'Auto Posto São Carlos 8',
      address: 'Rua São Carlos, 4000 - Jardim São Carlos',
      lat: -22.017,
      lng: -47.895,
      rating: 4.7,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.92,
        },
        {
          type: 'ETHANOL',
          price: 4.21,
        },
        {
          type: 'DIESEL',
          price: 5.43,
        },
      ],
    },
    {
      name: 'Shell Select São Carlos 3',
      address: 'Av São Carlos, 2500 - Centro',
      lat: -22.024,
      lng: -47.8915,
      rating: 4.3,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.05,
        },
        {
          type: 'ETHANOL',
          price: 4.35,
        },
        {
          type: 'DIESEL',
          price: 5.55,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Centro 3',
      address: 'Rua XV de Novembro, 700 - Centro',
      lat: -22.022,
      lng: -47.891,
      rating: 4.6,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Auto Posto Bandeirantes 4',
      address: 'Av Bandeirantes, 1400 - Jardim Bandeirantes',
      lat: -22.03,
      lng: -47.9,
      rating: 4.2,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.93,
        },
        {
          type: 'ETHANOL',
          price: 4.25,
        },
        {
          type: 'DIESEL',
          price: 5.45,
        },
      ],
    },
    {
      name: 'Shell Vila Prado 3',
      address: 'Av Washington Luís, 2500 - Vila Prado',
      lat: -22.041,
      lng: -47.895,
      rating: 4.4,
      features: ['Conveniência', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6,
        },
        {
          type: 'ETHANOL',
          price: 4.3,
        },
        {
          type: 'DIESEL',
          price: 5.5,
        },
      ],
    },
    {
      name: 'Posto BR Redenção 4',
      address: 'Av Redenção, 3500 - Redenção',
      lat: -22.032,
      lng: -47.879,
      rating: 4.7,
      features: ['Conveniência', 'Lava-jato', 'Calibragem', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.94,
        },
        {
          type: 'ETHANOL',
          price: 4.24,
        },
        {
          type: 'DIESEL',
          price: 5.44,
        },
      ],
    },
    {
      name: 'Auto Posto Santa Terezinha 3',
      address: 'Rua Santa Terezinha, 500 - Jardim Santa Terezinha',
      lat: -22.045,
      lng: -47.885,
      rating: 4.1,
      features: ['Conveniência', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.9,
        },
        {
          type: 'ETHANOL',
          price: 4.2,
        },
        {
          type: 'DIESEL',
          price: 5.4,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Jardim São Carlos 3',
      address: 'Av São Carlos, 2200 - Jardim São Carlos',
      lat: -22.018,
      lng: -47.895,
      rating: 4.6,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 5.92,
        },
        {
          type: 'ETHANOL',
          price: 4.21,
        },
        {
          type: 'DIESEL',
          price: 5.43,
        },
      ],
    },
    {
      name: 'Shell Select Jardim Planalto 3',
      address: 'Av Planalto, 1400 - Jardim Planalto',
      lat: -22.036,
      lng: -47.91,
      rating: 4.3,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.05,
        },
        {
          type: 'ETHANOL',
          price: 4.35,
        },
        {
          type: 'DIESEL',
          price: 5.55,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Paulista',
      address: 'Av. Paulista, 1500 - Bela Vista, São Paulo',
      lat: -23.5629,
      lng: -46.6544,
      rating: 4.5,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h', 'Lava-jato'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.29,
        },
        {
          type: 'ETHANOL',
          price: 4.59,
        },
        {
          type: 'DIESEL',
          price: 5.79,
        },
      ],
    },
    {
      name: 'Shell Select Pinheiros',
      address: 'Rua dos Pinheiros, 950 - Pinheiros, São Paulo',
      lat: -23.5661,
      lng: -46.6911,
      rating: 4.7,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.35,
        },
        {
          type: 'ETHANOL',
          price: 4.65,
        },
        {
          type: 'DIESEL',
          price: 5.85,
        },
      ],
    },
    {
      name: 'Petrobras Vila Mariana',
      address: 'Rua Domingos de Morais, 2500 - Vila Mariana, São Paulo',
      lat: -23.5877,
      lng: -46.6382,
      rating: 4.3,
      features: ['Conveniência', 'Borracharia', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.25,
        },
        {
          type: 'ETHANOL',
          price: 4.55,
        },
        {
          type: 'DIESEL',
          price: 5.75,
        },
      ],
    },
    {
      name: 'Auto Posto Moema',
      address: 'Av. Ibirapuera, 1800 - Moema, São Paulo',
      lat: -23.6006,
      lng: -46.6618,
      rating: 4.6,
      features: ['Conveniência', 'Lava-jato', 'Caixa 24h', 'Restaurante'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.32,
        },
        {
          type: 'ETHANOL',
          price: 4.62,
        },
        {
          type: 'DIESEL',
          price: 5.82,
        },
      ],
    },
    {
      name: 'Posto BR Faria Lima',
      address: 'Av. Brigadeiro Faria Lima, 3500 - Itaim Bibi, São Paulo',
      lat: -23.5868,
      lng: -46.6835,
      rating: 4.8,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.39,
        },
        {
          type: 'ETHANOL',
          price: 4.69,
        },
        {
          type: 'DIESEL',
          price: 5.89,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Morumbi',
      address: 'Av. Giovanni Gronchi, 5400 - Morumbi, São Paulo',
      lat: -23.6088,
      lng: -46.7221,
      rating: 4.4,
      features: ['Conveniência', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.27,
        },
        {
          type: 'ETHANOL',
          price: 4.57,
        },
        {
          type: 'DIESEL',
          price: 5.77,
        },
      ],
    },
    {
      name: 'Shell Jardins',
      address: 'Rua Estados Unidos, 1200 - Jardins, São Paulo',
      lat: -23.5706,
      lng: -46.661,
      rating: 4.7,
      features: ['Conveniência', 'Lava-jato', 'Caixa 24h', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.36,
        },
        {
          type: 'ETHANOL',
          price: 4.66,
        },
        {
          type: 'DIESEL',
          price: 5.86,
        },
      ],
    },
    {
      name: 'Auto Posto Brooklin',
      address: 'Av. Engenheiro Luís Carlos Berrini, 1500 - Brooklin, São Paulo',
      lat: -23.607,
      lng: -46.6936,
      rating: 4.5,
      features: ['Conveniência', 'Calibragem', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.3,
        },
        {
          type: 'ETHANOL',
          price: 4.6,
        },
        {
          type: 'DIESEL',
          price: 5.8,
        },
      ],
    },
    {
      name: 'Posto Petrobras Avenida Brasil',
      address: 'Av. Brasil, 1800 - Jardim América, São Paulo',
      lat: -23.5745,
      lng: -46.6737,
      rating: 4.3,
      features: ['Conveniência', 'Troca de Óleo', 'Calibragem'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.28,
        },
        {
          type: 'ETHANOL',
          price: 4.58,
        },
        {
          type: 'DIESEL',
          price: 5.78,
        },
      ],
    },
    {
      name: 'Shell Select Vila Olímpia',
      address: 'Rua Funchal, 500 - Vila Olímpia, São Paulo',
      lat: -23.5953,
      lng: -46.6869,
      rating: 4.6,
      features: ['Conveniência', 'Lava-jato', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.37,
        },
        {
          type: 'ETHANOL',
          price: 4.67,
        },
        {
          type: 'DIESEL',
          price: 5.87,
        },
      ],
    },
    {
      name: 'Posto Ipiranga Santana',
      address: 'Av. Cruzeiro do Sul, 3500 - Santana, São Paulo',
      lat: -23.5025,
      lng: -46.6252,
      rating: 4.2,
      features: ['Conveniência', 'Calibragem', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.24,
        },
        {
          type: 'ETHANOL',
          price: 4.54,
        },
        {
          type: 'DIESEL',
          price: 5.74,
        },
      ],
    },
    {
      name: 'Auto Posto Tatuapé',
      address: 'Rua Tuiuti, 2500 - Tatuapé, São Paulo',
      lat: -23.5367,
      lng: -46.5719,
      rating: 4.4,
      features: ['Conveniência', 'Lava-jato', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.26,
        },
        {
          type: 'ETHANOL',
          price: 4.56,
        },
        {
          type: 'DIESEL',
          price: 5.76,
        },
      ],
    },
    {
      name: 'Posto BR Lapa',
      address: 'Rua Clélia, 1800 - Lapa, São Paulo',
      lat: -23.5292,
      lng: -46.7012,
      rating: 4.3,
      features: ['Conveniência', 'Calibragem', 'Caixa 24h'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.29,
        },
        {
          type: 'ETHANOL',
          price: 4.59,
        },
        {
          type: 'DIESEL',
          price: 5.79,
        },
      ],
    },
    {
      name: 'Shell Select Cidade Jardim',
      address: 'Av. Cidade Jardim, 1000 - Jardim Europa, São Paulo',
      lat: -23.5785,
      lng: -46.6856,
      rating: 4.8,
      features: [
        'Conveniência',
        'Lava-jato',
        'Troca de Óleo',
        'Calibragem',
        'Caixa 24h',
      ],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.38,
        },
        {
          type: 'ETHANOL',
          price: 4.68,
        },
        {
          type: 'DIESEL',
          price: 5.88,
        },
      ],
    },
    {
      name: 'Posto Petrobras Higienópolis',
      address: 'Rua Piauí, 700 - Higienópolis, São Paulo',
      lat: -23.5418,
      lng: -46.6558,
      rating: 4.5,
      features: ['Conveniência', 'Calibragem', 'Troca de Óleo'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.31,
        },
        {
          type: 'ETHANOL',
          price: 4.61,
        },
        {
          type: 'DIESEL',
          price: 5.81,
        },
      ],
    },
    {
      name: 'Auto Posto Liberdade',
      address: 'Rua Vergueiro, 1500 - Liberdade, São Paulo',
      lat: -23.5698,
      lng: -46.6378,
      rating: 4.2,
      features: ['Conveniência', 'Calibragem', 'Borracharia'],
      fuels: [
        {
          type: 'GASOLINE',
          price: 6.27,
        },
        {
          type: 'ETHANOL',
          price: 4.57,
        },
        {
          type: 'DIESEL',
          price: 5.77,
        },
      ],
    },
  ] as const;

  for (const st of stationsData) {
    await prisma.station.create({
      data: {
        name: st.name,
        address: st.address,
        lat: st.lat,
        lng: st.lng,
        rating: st.rating,
        features: { create: st.features.map((f) => ({ name: f })) },
        fuels: {
          create: st.fuels.map((f) => ({
            type: f.type,
            price: f.price,
            updated: now,
          })),
        },
      },
    });
  }
  console.log('Seed: estações e relações inseridas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
