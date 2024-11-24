export function toCamelCase(str: string): string {
  return str
    .replace(/\s(.)/g, function (match, group1) {
      return group1.toUpperCase();
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, function (match, group1) {
      return group1.toLowerCase();
    });
}

export const handleOpenInNewTab = (url: string) => {
  const newTab = window.open(url, '_blank', 'noopener,noreferrer');
  if (newTab) {
    newTab.opener = null; // Для безопасности
  }
};

// to mix array
export function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

// check if element in veiwport
export function isElementInViewport (element) {
  const rect = element.getBoundingClientRect()
  return (
    rect.bottom >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight)
  )
}

//to find distance between two point on map 
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Радиус Земли в километрах
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = Math.round(R * c);
  return distance;
}