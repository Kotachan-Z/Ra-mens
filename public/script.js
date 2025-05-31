let map;

function initMap(lat, lng) {
  const center = { lat, lng };
  map = new google.maps.Map(document.getElementById("map"), {
    center,
    zoom: 15,
  });

  // 現在地にマーカーを置く
  new google.maps.Marker({
    position: center,
    map,
    title: "現在地",
  });

  // ホットペッパーAPIで周辺ラーメン店を取得
  fetch(`/api/ramen?lat=${lat}&lng=${lng}`)
    .then(res => res.json())
    .then(data => {
      data.results.shop.forEach(shop => {
        const position = {
          lat: parseFloat(shop.lat),
          lng: parseFloat(shop.lng),
        };

        const marker = new google.maps.Marker({
          position,
          map,
          title: shop.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<strong>${shop.name}</strong><br>${shop.address}`,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });
    })
    .catch(err => {
      console.error("ラーメン情報の取得に失敗しました:", err);
    });
}

// 現在地取得 → Google Maps APIスクリプトを動的に読み込み
function loadMapScript(apiKey, lat, lng) {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=onGoogleMapsLoaded`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  // 地図初期化のために global 関数として登録
  window.onGoogleMapsLoaded = () => initMap(lat, lng);
}

// 現在地を取得して API キーで地図をロード
fetch('/api/config')  // Vercel の Edge Function/API Routes で Google API キーを提供
  .then(res => res.json())
  .then(config => {
    const apiKey = config.googleMapsApiKey;

    // 現在地取得
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          loadMapScript(apiKey, latitude, longitude);
        },
        () => {
          alert("位置情報を取得できませんでした。");
        }
      );
    } else {
      alert("このブラウザでは位置情報取得がサポートされていません。");
    }
  })
  .catch(err => {
    console.error("設定の取得に失敗しました:", err);
  });
