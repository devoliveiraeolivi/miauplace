'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import CatCard from '@/components/CatCard';
import { mockCats } from '@/lib/mock-data';

export default function Home() {
  const [filteredCity, setFilteredCity] = useState('');

  const featuredCats = mockCats.filter((cat) => cat.featured);
  const allCats = filteredCity
    ? mockCats.filter((cat) => cat.location.city === filteredCity)
    : mockCats;

  const handleSearch = (city: string) => {
    setFilteredCity(city);
    if (city) {
      document.getElementById('gatos')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Hero onSearch={handleSearch} />

      {/* Featured Section */}
      {!filteredCity && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Gatinhos em Destaque
                </h2>
                <p className="text-gray-500 mt-1">
                  Esses fofos estao esperando por voce
                </p>
              </div>
              <a
                href="#gatos"
                className="hidden sm:flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600 transition-colors"
              >
                Ver todos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCats.map((cat, index) => (
                <div
                  key={cat.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CatCard cat={cat} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {!filteredCity && (
        <section className="py-16 bg-gradient-to-r from-orange-500 to-pink-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-white/80">Gatos adotados</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-white/80">Cidades</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
                <div className="text-white/80">Familias felizes</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-white/80">Satisfacao</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Cats Section */}
      <section id="gatos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {filteredCity ? `Gatos em ${filteredCity}` : 'Todos os Gatinhos'}
              </h2>
              <p className="text-gray-500 mt-1">
                {allCats.length} gatinho{allCats.length !== 1 ? 's' : ''} disponive{allCats.length !== 1 ? 'is' : 'l'} para adocao
              </p>
            </div>

            {filteredCity && (
              <button
                onClick={() => setFilteredCity('')}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-gray-600 hover:bg-gray-100 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpar filtro
              </button>
            )}
          </div>

          {allCats.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allCats.map((cat, index) => (
                <div
                  key={cat.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CatCard cat={cat} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">😿</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum gatinho encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Nao encontramos gatinhos em {filteredCity} no momento.
              </p>
              <button
                onClick={() => setFilteredCity('')}
                className="px-6 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors"
              >
                Ver todos os gatinhos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      {!filteredCity && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Como funciona?
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Adotar um gatinho pelo MiauPlace e simples e seguro
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Encontre seu match
                </h3>
                <p className="text-gray-500">
                  Navegue pelos perfis dos gatinhos e encontre aquele que combina com voce e sua familia.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Entre em contato
                </h3>
                <p className="text-gray-500">
                  Converse com o responsavel pelo gatinho, tire suas duvidas e agende uma visita.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🏠</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  3. Leve para casa
                </h3>
                <p className="text-gray-500">
                  Apos a aprovacao, leve seu novo amigo para casa e de a ele todo amor que ele merece.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!filteredCity && (
        <section className="py-20 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-6xl mb-6 block">😻</span>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Tem um gatinho para doar?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Ajude um gatinho a encontrar um lar cheio de amor. Cadastre-o gratuitamente no MiauPlace.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all hover:-translate-y-0.5">
              Cadastrar Gatinho
            </button>
          </div>
        </section>
      )}
    </>
  );
}
