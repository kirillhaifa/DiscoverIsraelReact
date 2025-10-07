import React from 'react';
import MapOutline from "./Map";
import './distanceFilter.module.scss';



// Координаты центра Израиля (Тель-Авив)
const CENTER_LAT = 32.0853;
const CENTER_LNG = 34.7818;

// Границы Израиля (примерные)
const MIN_LAT = 29.5;
const MAX_LAT = 33.3;
const MIN_LNG = 34.2;
const MAX_LNG = 35.9;

// Преобразование координат в SVG
function latLngToSvg(lat: number, lng: number, width: number, height: number) {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * width;
  const y = height - ((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * height;
  return { x, y };
}

interface IsraelMapProps {
  userLocation: { lat: number; lng: number } | null;
  radiusKm: number;
  svgWidth?: number;
  svgHeight?: number;
}

const IsraelMap: React.FC<IsraelMapProps> = ({ userLocation, radiusKm, svgWidth = 400, svgHeight = 800 }) => {
  // Центр круга — координаты пользователя или центра Израиля
  const center = userLocation || { lat: CENTER_LAT, lng: CENTER_LNG };
  const { x, y } = latLngToSvg(center.lat, center.lng, svgWidth, svgHeight);

  // Преобразуем радиус в километрах в радиус SVG (очень приблизительно)
  // 1 градус широты ≈ 111 км, долготы ≈ 90 км (в Израиле)
  const avgKmPerDegree = 100;
  const radiusDegrees = radiusKm / avgKmPerDegree;
  // SVG радиус по широте
  const radiusSvg = (radiusDegrees / (MAX_LAT - MIN_LAT)) * svgHeight;

  return (
    <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto' }}>
      {/* Карта Израиля через MapOutline с масштабом 1.5 и сдвигом */}
      <g transform="translate(-170,-320) scale(2)">
        <MapOutline width={svgWidth} height={svgHeight} strokeWidth={2} />
      </g>
      {/* Круг покрытия */}
      <circle cx={x} cy={y} r={radiusSvg} fill="rgba(0,123,255,0.2)" stroke="#007bff" strokeWidth={2} />
      {/* Точка пользователя */}
      <circle cx={x} cy={y} r={7} fill="#007bff" stroke="#fff" strokeWidth={2} />
    </svg>
  );
};

export default IsraelMap;
