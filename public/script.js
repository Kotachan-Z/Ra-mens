function initMap() {
  if (!navigator.geolocation) {
    alert("位置情報が取得できません");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const userPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: userPos
      });

      new google.maps.Marker({
        position: userPos,
        map,
        title: "現在地",
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      });

      fetch(`/api/ramen?lat=${userPos.lat}&lng=${userPos.lng}`)
        .then(res => res.json())
        .then(data => {
          if (!data.results.shop) {
            alert("周辺にラーメン店が見つかりませんでした");
            return;
          }

          data.results.shop.forEach(shop => {
            const marker = new google.maps.Marker({
              position: { lat: parseFloat(shop.lat), lng: parseFloat(shop.lng) },
              map,
              title: shop.name
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `<strong>${shop.name}</strong><br><a href="${shop.urls.pc}" target="_blank">店舗ページ</a>`
            });

            marker.addListener("click", () => {
              infoWindow.open(map, marker);
            });
          });
        })
        .catch(err => {
          console.error(err);
          alert("ラーメン店情報の取得に失敗しました");
        });
    },
    error => {
      console.error(error);
      alert("位置情報の取得に失敗しました");
    }
  );
}
