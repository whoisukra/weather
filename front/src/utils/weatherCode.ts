export const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: 'Céu Limpo', icon: 'sun' },
  1: { label: 'Parcialmente Nublado', icon: 'sun-cloud' },
  2: { label: 'Parcialmente Nublado', icon: 'sun-cloud' },
  3: { label: 'Nublado', icon: 'cloud' },
  45: { label: 'Neblina', icon: 'fog' },
  48: { label: 'Neblina Com Geada', icon: 'fog' },
  51: { label: 'Garoa Leve', icon: 'cloud-rain' },
  53: { label: 'Garoa Moderada', icon: 'cloud-rain' },
  55: { label: 'Garoa Intensa', icon: 'cloud-rain' },
  56: { label: 'Garoa Congelante Leve', icon: 'cloud-rain' },
  57: { label: 'Garoa Congelante Intensa', icon: 'cloud-rain' },
  61: { label: 'Chuva Leve', icon: 'cloud-rain' },
  63: { label: 'Chuva Moderada', icon: 'cloud-rain' },
  65: { label: 'Chuva Intensa', icon: 'cloud-heavy-rain' },
  66: { label: 'Chuva Congelante Leve', icon: 'cloud-rain' },
  67: { label: 'Chuva Congelante Intensa', icon: 'cloud-heavy-rain' },
  71: { label: 'Neve Leve', icon: 'cloud-snow' },
  73: { label: 'Neve Moderada', icon: 'cloud-snow' },
  75: { label: 'Neve Intensa', icon: 'cloud-snow' },
  77: { label: 'Grãos De Neve', icon: 'cloud-snow' },
  80: { label: 'Pancadas De Chuva Leve', icon: 'cloud-rain' },
  81: { label: 'Pancadas De Chuva Moderada', icon: 'cloud-rain' },
  82: { label: 'Pancadas De Chuva Intensa', icon: 'cloud-heavy-rain' },
  85: { label: 'Pancadas De Neve Leve', icon: 'cloud-snow' },
  86: { label: 'Pancadas De Neve Intensa', icon: 'cloud-snow' },
  95: { label: 'Trovoada', icon: 'cloud-lightning' },
  96: { label: 'Trovoada Com Granizo Leve', icon: 'cloud-lightning' },
  99: { label: 'Trovoada Com Granizo Intenso', icon: 'cloud-lightning' },
}

export function getWeatherInfo(code: number): { label: string; icon: string } {
  return WMO_CODES[code] ?? { label: 'Desconhecido', icon: 'cloud' }
}
