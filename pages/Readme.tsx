import React from 'react';
import ReactMarkdown from 'react-markdown';

export const Readme = () => {
  const markdownContent = `
# CineMaster AI - Master Project

Netflix, IMDb ve Letterboxd'un en iyi özelliklerini tek bir çatı altında toplayan, yapay zeka destekli yeni nesil film ve dizi platformu.

## 🚀 Proje Hakkında

Bu proje, modern web teknolojilerini ve üretken yapay zekayı (Generative AI) kullanarak zengin, interaktif ve kişiselleştirilmiş bir medya deneyimi sunar. Kullanıcılar sadece film aramaz; yapay zeka ile sohbet eder gibi karmaşık sorgular ("90'ların en iyi psikolojik gerilim filmleri") yaparak sonuç alır.

### Temel Özellikler

1.  **Netflix Tarzı UI/UX:**
    *   Akıcı, mobil öncelikli responsive tasarım.
    *   Dark mode odaklı "Sinematik" arayüz.
    *   Hero section ve yatay kaydırılabilir listeler.
    *   Hover efektleri ile hızlı önizleme ve aksiyonlar.

2.  **Yapay Zeka Destekli Arama (Simulated ElasticSearch):**
    *   Google Gemini API kullanılarak oluşturulan "Akıllı Arama" motoru.
    *   Standart anahtar kelime araması yerine doğal dil işleme (NLP).
    *   Örnek: "Beni ağlatacak drama filmleri" yazdığınızda AI bunu analiz eder ve uygun listeyi döndürür.

3.  **Kütüphane Yönetimi (Letterboxd/IMDb):**
    *   **Watchlist (İzlenecekler):** Merak ettiğiniz içerikleri saklayın.
    *   **Watched (İzlenenler):** İzlediğiniz filmleri arşivleyin.
    *   Local Storage ile veri kalıcılığı.

4.  **Akıllı Analiz:**
    *   Her film detayında, Gemini AI tarafından anlık olarak oluşturulan "Neden izlemelisiniz?" analizi.

## 🛠️ Teknoloji Yığını (Tech Stack)

*   **Frontend:** React 18, TypeScript, Tailwind CSS
*   **AI/Backend:** Google Gemini API (@google/genai)
*   **İkonlar:** Lucide React
*   **State Management:** React Context API + LocalStorage
*   **Veri:** Gemini 3 Flash Preview (Mock Data Fallback ile)

## 📂 Dosya Yapısı ve Mimari

\`\`\`
/
├── components/       # Tekrar kullanılabilir UI bileşenleri (Card, Modal, Navbar)
├── context/          # Global state (Favoriler, İzlenenler)
├── pages/            # Ana sayfa görünümleri (Home, Search, Library)
├── services/         # API servisleri (Gemini entegrasyonu)
├── types.ts          # TypeScript arayüzleri
└── App.tsx           # Ana yönlendirme ve layout
\`\`\`

## 💡 Best Practices & Use Cases

1.  **Context API & Custom Hooks:** \`useMovies\` hook'u ile state'e tip güvenli erişim sağlandı. Prop-drilling önlendi.
2.  **Service Layer Pattern:** API çağrıları \`services/geminiService.ts\` içinde izole edildi. UI bileşenleri veri kaynağını bilmez.
3.  **Error Handling & Fallbacks:** API anahtarı yoksa veya hata verirse uygulama çökmez, mock (sahte) veriye döner (Graceful Degradation).
4.  **Responsive Design:** Tailwind'in \`md:\`, \`lg:\` prefixleri ile her ekrana uyumlu grid ve layout yapıları.
5.  **Performance:** Görseller için \`picsum.photos\` ve lazy-loading teknikleri.

## 📝 Nasıl Kullanılır?

1.  **Ana Sayfa:** Trendleri ve kategorileri inceleyin.
2.  **Keşfet:** Arama çubuğuna detaylı bir istek yazın (örn: "Christopher Nolan filmleri"). Filtreleri (Tür, Yıl, Puan) kullanarak daraltın.
3.  **Detaylar:** Bir filme tıklayın, AI analizini okuyun.
4.  **Kütüphane:** "+" butonu ile listenize ekleyin, "Play" butonu ile izlendi olarak işaretleyin.

---
*Geliştirici Notu: Bu proje, tek bir XML blok çıktısı içerisinde tam fonksiyonel bir SPA (Single Page Application) simülasyonudur.*
  `;

  return (
    <div className="min-h-screen pt-8 px-4 md:px-16 pb-20 bg-brand-black">
      <div className="max-w-4xl mx-auto bg-[#181818] p-8 rounded-xl border border-white/10 shadow-2xl">
        <article className="prose prose-invert prose-lg max-w-none">
            {/* Simple Markdown Rendering Logic since we can't install react-markdown in this environment easily without package.json, 
                I will simulate the rendering visually with standard HTML for this demo if the library wasn't available, 
                but here I assume standard HTML structure for the 'content' prop logic above. 
                Actually, since I cannot import 'react-markdown' really without npm install, I will render raw HTML for the demo 
                or just map the string. For this specific output constraint, I will render a structured HTML view.
            */}
            <div className="space-y-6 text-gray-300">
                <h1 className="text-4xl font-bold text-brand-red border-b border-gray-700 pb-4">CineMaster AI - Master Project</h1>
                <p className="text-xl text-gray-400 leading-relaxed">
                    Netflix, IMDb ve Letterboxd'un en iyi özelliklerini tek bir çatı altında toplayan, yapay zeka destekli yeni nesil film ve dizi platformu.
                </p>

                <div className="bg-brand-black/50 p-6 rounded-lg border-l-4 border-brand-red">
                    <h3 className="text-white font-bold text-lg mb-2">🚀 Proje Amacı</h3>
                    <p>Modern web teknolojilerini ve üretken yapay zekayı birleştirerek statik veritabanları yerine "konuşan" bir film kütüphanesi oluşturmak.</p>
                </div>

                <h2 className="text-2xl font-bold text-white mt-8">🔥 Temel Özellikler</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-white">Netflix UI:</strong> Dark mode, Hero banner, Yatay kaydırma.</li>
                    <li><strong className="text-white">AI Search:</strong> "Beni ağlatacak filmler" gibi doğal dil sorguları.</li>
                    <li><strong className="text-white">Smart Library:</strong> İzlenecekler ve İzlenenler listesi (Local Storage).</li>
                    <li><strong className="text-white">Gemini Analiz:</strong> Her film için anlık yapay zeka yorumu.</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mt-8">🛠️ Mimari ve Teknoloji</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#222] p-4 rounded">
                        <span className="text-brand-red font-bold">Frontend</span>
                        <p className="text-sm mt-1">React 18, TypeScript, Tailwind CSS</p>
                    </div>
                    <div className="bg-[#222] p-4 rounded">
                        <span className="text-brand-red font-bold">Intelligence</span>
                        <p className="text-sm mt-1">Google Gemini API (Flash Preview)</p>
                    </div>
                    <div className="bg-[#222] p-4 rounded">
                        <span className="text-brand-red font-bold">State</span>
                        <p className="text-sm mt-1">Context API + LocalStorage Persistence</p>
                    </div>
                </div>

                 <h2 className="text-2xl font-bold text-white mt-8">💡 Best Practices</h2>
                 <p>Proje genelinde <strong>Service Layer Pattern</strong> kullanılarak API mantığı arayüzden ayrılmıştır. Hata yönetimi (Graceful Degradation) sayesinde API key olmasa bile uygulama mock veri ile çalışmaya devam eder.</p>
            </div>
        </article>
      </div>
    </div>
  );
};