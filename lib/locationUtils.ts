export const FALLBACK_CITIES = [
  // Brasil - Capitais e grandes cidades
  { name: "São Paulo, SP", lat: -23.55052, lon: -46.633308 },
  { name: "Rio de Janeiro, RJ", lat: -22.906847, lon: -43.172896 },
  { name: "Brasília, DF", lat: -15.797515, lon: -47.891887 },
  { name: "Salvador, BA", lat: -12.9714, lon: -38.5014 },
  { name: "Fortaleza, CE", lat: -3.7319, lon: -38.5267 },
  { name: "Belo Horizonte, MG", lat: -19.9167, lon: -43.9345 },
  { name: "Manaus, AM", lat: -3.119, lon: -60.0217 },
  { name: "Curitiba, PR", lat: -25.4284, lon: -49.2733 },
  { name: "Recife, PE", lat: -8.0543, lon: -34.8813 },
  { name: "Porto Alegre, RS", lat: -30.0346, lon: -51.2177 },
  { name: "Belém, PA", lat: -1.4558, lon: -48.4902 },
  { name: "Goiânia, GO", lat: -16.6869, lon: -49.2648 },
  { name: "São Luís, MA", lat: -2.5307, lon: -44.3068 },
  { name: "Maceió, AL", lat: -9.6658, lon: -35.735 },
  { name: "Natal, RN", lat: -5.7945, lon: -35.211 },
  { name: "Teresina, PI", lat: -5.092, lon: -42.8038 },
  { name: "João Pessoa, PB", lat: -7.1198, lon: -34.845 },
  { name: "Aracaju, SE", lat: -10.9111, lon: -37.0717 },
  { name: "Cuiabá, MT", lat: -15.601, lon: -56.097 },
  { name: "Campo Grande, MS", lat: -20.4428, lon: -54.646 },
  { name: "Florianópolis, SC", lat: -27.5954, lon: -48.548 },
  { name: "Macapá, AP", lat: 0.035, lon: -51.07 },
  { name: "Porto Velho, RO", lat: -8.7619, lon: -63.9039 },
  { name: "Rio Branco, AC", lat: -9.974, lon: -67.808 },
  { name: "Boa Vista, RR", lat: 2.82, lon: -60.67 },
  { name: "Vitória, ES", lat: -20.3155, lon: -40.3128 },
  { name: "Palmas, TO", lat: -10.167, lon: -48.327 },
  // Portugal
  { name: "Lisboa, Portugal", lat: 38.7223, lon: -9.1393 },
  { name: "Porto, Portugal", lat: 41.1579, lon: -8.6291 },
  // EUA / Outros
  { name: "Nova York, NY", lat: 40.7128, lon: -74.0060 },
  { name: "Miami, FL", lat: 25.7617, lon: -80.1918 },
  { name: "Luanda, Angola", lat: -8.839, lon: 13.289 },
  { name: "Maputo, Moçambique", lat: -25.969, lon: 32.573 }
];

export function getFallbackCityState(latitude: number, longitude: number): string {
  let minDistance = Infinity;
  let closestCity = "São Paulo, SP";
  
  for (const city of FALLBACK_CITIES) {
    const dLat = city.lat - latitude;
    const dLon = city.lon - longitude;
    const dist = dLat * dLat + dLon * dLon;
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = city.name;
    }
  }
  
  return closestCity;
}
