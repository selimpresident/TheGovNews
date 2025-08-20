# TheGovNews – Resmi Hükümet Haber Toplayıcı

[Türkçe] | [English](README.md)

Resmi hükümet haber kaynaklarını akıllı biçimde toplayan, zenginleştiren ve modern, duyarlı (responsive) bir arayüzde güvenilir, aranabilir ve filtrelenebilir kamu bilgisi sunan açık kaynak bir projedir.

## Özellikler
- Resmi kaynak toplama (bakanlıklar, kurumlar) ve zenginleştirilmiş içerik
- i18next ile çok dilli arayüz ve otomatik dil algılama
- Ülke keşfi için etkileşimli dünya haritası (react-simple-maps)
- World Bank, NOAA, OECD, ReliefWeb ve daha fazlası için paneller
- Tailwind CSS ile mobil öncelikli, responsive tasarım
- Web uygulamasını iOS ve Android için paketlemek üzere Capacitor desteği

## Teknoloji Yığını
- React 18, TypeScript, Vite 6
- Tailwind CSS (özelleştirilmiş temalar, animasyonlar)
- i18next, i18next-browser-languagedetector, i18next-http-backend
- react-simple-maps, react-tooltip
- Capacitor (Android/iOS)

## Hızlı Başlangıç
Gereksinimler: Node.js 18+ ve npm.

1) Projeyi klonlayın ve bağımlılıkları yükleyin
```bash
git clone <fork- veya repo-adresi>
cd Devlet
npm install
```

2) Ortam değişkenleri (SECURITY.md dosyasına bakın)
```bash
cp .env.example .env.local
# .env.local dosyasını düzenleyin
VITE_GEMINI_API_KEY=gercek_api_anahtariniz
```

3) Geliştirme
```bash
npm run dev
```

4) Derleme ve önizleme
```bash
npm run build
npm run preview
```

## Mobil (Capacitor)
Android:
```bash
npm run build:android
npm run open:android
```

iOS (macOS + Xcode gerektirir):
```bash
npm run build:ios
npm run open:ios
```

## Yerelleştirme (i18n)
- Çeviriler `locales/` ve `public/locales/` içinde tutulur
- Yeni bir `<dil>.json` ekleyin, gerekirse i18n yapılandırmasını güncelleyin
- Çeviri katkılarına açığız

## Katkıda Bulunma
Issue, tartışma ve PR’larınızı bekliyoruz!
- Depoyu forklayın, bir özellik dalı açın (feat/ozellik-adi)
- Kod standartları: `npm run lint`, `npm run lint:fix`, `npm run format`
- UI değişikliklerinde ekran görüntüsü ekleyin

## Güvenlik
Lütfen güvenlik yönergelerini okuyun: SECURITY.md dosyasına bakın.

## Lisans
Lisans proje sahibi tarafından belirlenecektir. Katkı planlıyorsanız, lisans seçimini görüşmek için lütfen bir issue açın.
