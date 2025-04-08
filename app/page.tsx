"use client";

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles/carousel.css';

interface Article {
  id: number;
  title: string;
  body: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
      }
    };

    fetchArticles();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Section Héro */}
      <section className="relative h-[600px] w-full bg-blue-600 text-white overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop
          className="h-full"
        >
          <SwiperSlide className="relative h-full">
            <img 
              src="/IMG/img/william-wendling-PVGYTu5yAAA-unsplash.jpg" 
              alt="Image de fond SOLIHA" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/90"></div>
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">SOLIHA, Solidaires pour l'habitat</h1>
              <p className="text-xl md:text-2xl mb-8">Premier réseau associatif national de l'habitat privé à vocation sociale</p>
              <div className="flex gap-4 flex-wrap justify-center">
                <a href="#" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">Je suis un particulier</a>
                <a href="#" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">Je représente une collectivité</a>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="relative h-full">
            <img 
              src="/IMG/img/cytonn-photography-n95VMLxqM2I-unsplash.jpg" 
              alt="Image de fond SOLIHA 2" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/90"></div>
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">SOLIHA, Solidaires pour l'habitat</h1>
              <p className="text-xl md:text-2xl mb-8">Premier réseau associatif national de l'habitat privé à vocation sociale</p>
              <div className="flex gap-4 flex-wrap justify-center">
                <a href="#" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">Je suis un particulier</a>
                <a href="#" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">Je représente une collectivité</a>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Section Chiffres Clés */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">SOLIHA en chiffres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">123</div>
              <div className="text-gray-600">associations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">3 550</div>
              <div className="text-gray-600">salariés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">258 000</div>
              <div className="text-gray-600">ménages accompagnés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">des demandeurs satisfaits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Actualités */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre actualité</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="pb-12"
          >
            {articles.map((article) => (
              <SwiperSlide key={article.id} className="px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{article.title}</h3>
                    <p className="text-gray-600">{article.body}</p>
                    <a href="#" className="text-blue-600 font-semibold mt-4 inline-block hover:text-blue-800">Lire la suite →</a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
}