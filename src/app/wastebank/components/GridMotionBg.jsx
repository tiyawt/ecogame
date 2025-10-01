import GridMotion from "@/components/GridMotion";

function GridMotionBg() {
  const items = [
    "https://images.squarespace-cdn.com/content/v1/5bd462a701232cf431767ab5/1548296789872-OM0DZ275106VCZQSOECD/upload.jpeg",
    "https://images.squarespace-cdn.com/content/v1/5bd462a701232cf431767ab5/1548296789872-OM0DZ275106VCZQSOECD/upload.jpeg",
    "https://assetd.kompas.id/ugYPVvl_xIcyCwtRwbwrK3XGzcM=/fit-in/1024x853/filters:format(webp):quality(80)/https://kompas.id/wp-content/uploads/2019/02/20190219SEM1-BANK-SAMPAH-BANDUNG_1550576147.jpg",
    "https://asset.kompas.com/crops/hEvPd8Bm1iPUzwJXp2gfjUn0iYI=/0x0:3444x2296/375x240/data/photo/2025/03/27/67e4be758c57a.jpg",
    "https://images.squarespace-cdn.com/content/v1/5bd462a701232cf431767ab5/1548296789872-OM0DZ275106VCZQSOECD/upload.jpeg",
    "https://images.squarespace-cdn.com/content/v1/5bd462a701232cf431767ab5/1548296789872-OM0DZ275106VCZQSOECD/upload.jpeg",
    "https://setda.badungkab.go.id/storage/setda/image/KSN%20(4).jpeg",
    "https://setda.badungkab.go.id/storage/setda/image/KSN%20(4).jpeg",
    "https://persitkopassus.com/wp-content/uploads/2025/06/Gambar-2-Bank-Sampah-Cabang-V-1024x768.jpg",
    "https://setda.badungkab.go.id/storage/setda/image/KSN%20(4).jpeg",
    "https://argosari.bantulkab.go.id/assets/files/artikel/sedang_1739263552DSC07457.jpeg",
    "https://assetd.kompas.id/ZOKGpz_N98LCy3xW-ZQo3_7h3sQ=/fit-in/1024x853/filters:format(webp):quality(80)/https://kompas.id/wp-content/uploads/2019/02/20190219SEM2-BANK-SAMPAH-BANDUNG_1550576237-1.jpg",
    "https://cdn.rri.co.id/berita/Tanjung_Balai/o/1744484315850-1000491741/0kmh6k2r6m700mu.jpeg",
    "https://cdn.rri.co.id/berita/Tanjung_Balai/o/1744484315850-1000491741/0kmh6k2r6m700mu.jpeg",
    "https://asset.kompas.com/crops/hEvPd8Bm1iPUzwJXp2gfjUn0iYI=/0x0:3444x2296/375x240/data/photo/2025/03/27/67e4be758c57a.jpg",
    "https://asset.kompas.com/crops/hEvPd8Bm1iPUzwJXp2gfjUn0iYI=/0x0:3444x2296/375x240/data/photo/2025/03/27/67e4be758c57a.jpg",
    "https://assetd.kompas.id/xHSL5LrThfXLlBH-4dgT1jibLTw=/fit-in/1024x853/filters:format(webp):quality(80)/https://kompas.id/wp-content/uploads/2019/02/20190219SEM3-BANK-SAMPAH-BANDUNG_1550576338-1.jpg",
    "https://setda.badungkab.go.id/storage/setda/image/KSN%20(4).jpeg",
    "https://argosari.bantulkab.go.id/assets/files/artikel/sedang_1739263552DSC07457.jpeg",
    "https://www.krajan.id/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-19-at-19.30.34-scaled.jpeg",
    "https://www.krajan.id/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-19-at-19.30.34-scaled.jpeg",
    "https://images.squarespace-cdn.com/content/v1/5bd462a701232cf431767ab5/1548296789872-OM0DZ275106VCZQSOECD/upload.jpeg",
    "https://images.squarespace-cdn.com/content/v1/5bd462a701232cf431767ab5/1548296789872-OM0DZ275106VCZQSOECD/upload.jpeg",
    "https://images.squarespace-cdn.com/content/v1/5bd462a701232cf431767ab5/1548296789872-OM0DZ275106VCZQSOECD/upload.jpeg",
    "https://images.squarespace-cdn.com/content/v1/5bd462a701232cf431767ab5/1548296789872-OM0DZ275106VCZQSOECD/upload.jpeg",
    "https://www.krajan.id/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-19-at-19.30.34-scaled.jpeg",
    "https://www.krajan.id/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-19-at-19.30.34-scaled.jpeg",
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
      <GridMotion items={items} gradientColor="rgba(0, 0, 0, 0.7)" />
    </div>
  );
}

export default GridMotionBg;
