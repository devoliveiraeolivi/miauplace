'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockCats } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CatProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const cat = mockCats.find((c) => c.id === id);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  if (!cat) {
    notFound();
  }

  const otherCats = mockCats.filter((c) => c.id !== id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-500 transition-colors">
              Inicio
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/#gatos" className="text-gray-500 hover:text-orange-500 transition-colors">
              Gatos
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{cat.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              {!imageError[currentImage] ? (
                <Image
                  src={cat.images[currentImage]}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  priority
                  onError={() => setImageError(prev => ({ ...prev, [currentImage]: true }))}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100">
                  <span className="text-9xl">🐱</span>
                </div>
              )}

              {/* Like Button */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <svg
                  className={`w-6 h-6 transition-all ${
                    isLiked ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-gray-600'
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>

              {/* Navigation Arrows */}
              {cat.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev - 1 + cat.images.length) % cat.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev + 1) % cat.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {cat.images.length > 1 && (
              <div className="flex gap-3">
                {cat.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden ${
                      idx === currentImage ? 'ring-2 ring-orange-500' : 'opacity-60 hover:opacity-100'
                    } transition-all`}
                  >
                    {!imageError[idx] ? (
                      <Image
                        src={image}
                        alt={`${cat.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                        onError={() => setImageError(prev => ({ ...prev, [idx]: true }))}
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100">
                        <span className="text-2xl">🐱</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  cat.gender === 'female'
                    ? 'bg-pink-100 text-pink-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {cat.gender === 'female' ? '♀ Femea' : '♂ Macho'}
                </span>
                {cat.featured && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                    Destaque
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {cat.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{cat.location.neighborhood}, {cat.location.city} - {cat.location.state}</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border">
                <div className="text-sm text-gray-500 mb-1">Idade</div>
                <div className="font-semibold text-gray-900">{cat.age}</div>
              </div>
              <div className="p-4 bg-white rounded-xl border">
                <div className="text-sm text-gray-500 mb-1">Raca</div>
                <div className="font-semibold text-gray-900">{cat.breed}</div>
              </div>
            </div>

            {/* Health Tags */}
            <div className="flex flex-wrap gap-2">
              {cat.vaccinated && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Vacinado
                </span>
              )}
              {cat.neutered && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Castrado
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Sobre {cat.name}</h2>
              <p className="text-gray-600 leading-relaxed">{cat.description}</p>
            </div>

            {/* Personality */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Personalidade</h2>
              <div className="flex flex-wrap gap-2">
                {cat.personality.map((trait) => (
                  <span
                    key={trait}
                    className="px-4 py-2 bg-gradient-to-r from-orange-50 to-pink-50 text-orange-700 rounded-full text-sm font-medium"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Good With */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Convive bem com</h2>
              <div className="flex gap-4">
                <div className={`flex items-center gap-2 ${cat.goodWith.kids ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className="text-2xl">👶</span>
                  <span className="text-sm font-medium">Criancas</span>
                  {cat.goodWith.kids ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className={`flex items-center gap-2 ${cat.goodWith.dogs ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className="text-2xl">🐕</span>
                  <span className="text-sm font-medium">Caes</span>
                  {cat.goodWith.dogs ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className={`flex items-center gap-2 ${cat.goodWith.cats ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className="text-2xl">🐱</span>
                  <span className="text-sm font-medium">Gatos</span>
                  {cat.goodWith.cats ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Health Info */}
            {cat.healthInfo && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚕️</span>
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-1">Informacao de saude</h3>
                    <p className="text-amber-700 text-sm">{cat.healthInfo}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Owner Card */}
            <div className="p-6 bg-white rounded-2xl border shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={cat.owner.avatar}
                    alt={cat.owner.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{cat.owner.name}</div>
                  <div className="text-sm text-gray-500">Responsavel por {cat.name}</div>
                </div>
              </div>

              <div className="space-y-3">
                {cat.owner.whatsapp && (
                  <a
                    href={`https://wa.me/55${cat.owner.whatsapp}?text=Ola! Vi o perfil do(a) ${cat.name} no MiauPlace e gostaria de saber mais sobre a adocao.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Conversar no WhatsApp
                  </a>
                )}
                <button
                  onClick={() => setShowPhone(!showPhone)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {showPhone && cat.owner.whatsapp
                    ? `(${cat.owner.whatsapp.slice(0, 2)}) ${cat.owner.whatsapp.slice(2, 7)}-${cat.owner.whatsapp.slice(7)}`
                    : 'Ver telefone'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Other Cats */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Outros gatinhos para adocao</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherCats.map((otherCat) => (
              <Link key={otherCat.id} href={`/gato/${otherCat.id}`} className="group block">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                  <Image
                    src={otherCat.images[0]}
                    alt={otherCat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                    {otherCat.name}
                  </h3>
                  <p className="text-sm text-gray-500">{otherCat.location.city}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
