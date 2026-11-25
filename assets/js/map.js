/*
 * APEX Google 지도 — Maps JavaScript API용.
 * index.html 하단의 <script ... key=YOUR_GOOGLE_MAPS_API_KEY ...> 태그에
 * 실제 API 키를 넣으면 이 파일의 initMap()이 콜백으로 호출된다.
 */

const APEX_SCHOOL_LOCATION = { lat: 37.4839954, lng: 127.0057386 };

// 사이트 색상 시스템(#050505 / #0D0D0D / #262626 / #888888)에 맞춘 다크 테마.
const APEX_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0d0d0d" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#888888" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#050505" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#262626" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#262626" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#888888" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#262626" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a0a0a" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#565656" }] }
];

function initMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl || typeof google === "undefined") return;

  const map = new google.maps.Map(mapEl, {
    center: APEX_SCHOOL_LOCATION,
    zoom: 16,
    disableDefaultUI: true,
    zoomControl: true,
    styles: APEX_MAP_STYLE
  });

  new google.maps.Marker({
    position: APEX_SCHOOL_LOCATION,
    map: map,
    title: "서울고등학교",
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: "#6EA8FF",
      fillOpacity: 1,
      strokeColor: "#050505",
      strokeWeight: 2
    }
  });
}

// Maps API의 callback= 파라미터가 전역 함수를 찾으므로 window에 노출해둔다.
window.initMap = initMap;
