'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ImageUpload from '@/components/forms/ImageUpload';
import { fetchAddressByCEP, formatCEP, formatPhone } from '@/lib/cep';

interface FormData {
  // Cat Info
  name: string;
  age: string;
  ageUnit: 'months' | 'years';
  breed: string;
  gender: 'male' | 'female';
  description: string;
  personality: string[];
  images: string[];

  // Health
  vaccinated: boolean;
  neutered: boolean;
  healthInfo: string;

  // Compatibility
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;

  // Location
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;

  // Owner
  ownerName: string;
  ownerPhone: string;
  ownerWhatsapp: string;
  ownerEmail: string;
}

const initialFormData: FormData = {
  name: '',
  age: '',
  ageUnit: 'years',
  breed: '',
  gender: 'female',
  description: '',
  personality: [],
  images: [],
  vaccinated: false,
  neutered: false,
  healthInfo: '',
  goodWithKids: true,
  goodWithDogs: true,
  goodWithCats: true,
  cep: '',
  street: '',
  neighborhood: '',
  city: '',
  state: '',
  ownerName: '',
  ownerPhone: '',
  ownerWhatsapp: '',
  ownerEmail: '',
};

const personalityOptions = [
  'Carinhoso',
  'Brincalhao',
  'Calmo',
  'Energetico',
  'Independente',
  'Curioso',
  'Timido',
  'Sociavel',
  'Dorminhoco',
  'Falante',
  'Protetor',
  'Afetuoso',
];

const breedOptions = [
  'Vira-lata',
  'Siames',
  'Persa',
  'Maine Coon',
  'Angorá',
  'Bengal',
  'Ragdoll',
  'British Shorthair',
  'Laranjinha',
  'Frajola',
  'Malhado',
  'Outro',
];

export default function DoarPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const totalSteps = 4;

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const clearedErrors: Partial<Record<keyof FormData, string>> = {};
    Object.keys(updates).forEach((key) => {
      clearedErrors[key as keyof FormData] = '';
    });
    setErrors((prev) => ({ ...prev, ...clearedErrors }));
  }, []);

  const handleCEPChange = useCallback(
    async (value: string) => {
      const formatted = formatCEP(value);
      updateFormData({ cep: formatted });

      const cleanCEP = value.replace(/\D/g, '');
      if (cleanCEP.length === 8) {
        setIsLoadingCEP(true);
        const address = await fetchAddressByCEP(cleanCEP);
        setIsLoadingCEP(false);

        if (address) {
          updateFormData({
            street: address.street,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
          });
        }
      }
    },
    [updateFormData]
  );

  const togglePersonality = useCallback(
    (trait: string) => {
      const current = formData.personality;
      const updated = current.includes(trait)
        ? current.filter((t) => t !== trait)
        : [...current, trait];
      updateFormData({ personality: updated });
    },
    [formData.personality, updateFormData]
  );

  const validateStep = useCallback(
    (stepNumber: number): boolean => {
      const newErrors: Partial<Record<keyof FormData, string>> = {};

      if (stepNumber === 1) {
        if (!formData.name.trim()) newErrors.name = 'Nome e obrigatorio';
        if (!formData.age.trim()) newErrors.age = 'Idade e obrigatoria';
        if (!formData.breed) newErrors.breed = 'Selecione uma raca';
        if (!formData.description.trim()) newErrors.description = 'Descricao e obrigatoria';
        if (formData.description.length < 20) newErrors.description = 'Descricao deve ter pelo menos 20 caracteres';
        if (formData.personality.length === 0) newErrors.personality = 'Selecione pelo menos uma caracteristica';
      }

      if (stepNumber === 2) {
        if (formData.images.length === 0) newErrors.images = 'Adicione pelo menos uma foto';
      }

      if (stepNumber === 3) {
        if (!formData.cep.trim()) newErrors.cep = 'CEP e obrigatorio';
        if (!formData.city.trim()) newErrors.city = 'Cidade e obrigatoria';
        if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Bairro e obrigatorio';
      }

      if (stepNumber === 4) {
        if (!formData.ownerName.trim()) newErrors.ownerName = 'Seu nome e obrigatorio';
        if (!formData.ownerWhatsapp.trim()) newErrors.ownerWhatsapp = 'WhatsApp e obrigatorio';
        const phoneClean = formData.ownerWhatsapp.replace(/\D/g, '');
        if (phoneClean.length < 10) newErrors.ownerWhatsapp = 'WhatsApp invalido';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  const nextStep = useCallback(() => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  }, [step, validateStep]);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(step)) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save to localStorage (temporary until backend is ready)
    const cats = JSON.parse(localStorage.getItem('miauplace_cats') || '[]');
    const newCat = {
      id: Date.now().toString(),
      ...formData,
      age: `${formData.age} ${formData.ageUnit === 'months' ? 'meses' : 'anos'}`,
      location: {
        city: formData.city,
        state: formData.state,
        neighborhood: formData.neighborhood,
      },
      owner: {
        name: formData.ownerName,
        whatsapp: formData.ownerWhatsapp.replace(/\D/g, ''),
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      },
      goodWith: {
        kids: formData.goodWithKids,
        dogs: formData.goodWithDogs,
        cats: formData.goodWithCats,
      },
      createdAt: new Date().toISOString(),
    };
    cats.push(newCat);
    localStorage.setItem('miauplace_cats', JSON.stringify(cats));

    setIsSubmitting(false);
    setIsSuccess(true);
  }, [formData, step, validateStep]);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Anuncio Criado!</h1>
          <p className="text-gray-600 mb-6">
            O perfil de <strong>{formData.name}</strong> foi publicado com sucesso.
            Em breve ele encontrara um novo lar cheio de amor!
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Ver Anuncio
            </Link>
            <button
              onClick={() => {
                setFormData(initialFormData);
                setStep(1);
                setIsSuccess(false);
              }}
              className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cadastrar Outro Gatinho
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doar um Gatinho</h1>
          <p className="text-gray-600">
            Preencha as informacoes abaixo para ajudar seu gatinho a encontrar um novo lar
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  s === step
                    ? 'bg-orange-500 text-white'
                    : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s < step ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              {s < 4 && (
                <div
                  className={`w-12 h-1 mx-2 rounded ${
                    s < step ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-center gap-8 mb-8 text-sm">
          <span className={step === 1 ? 'text-orange-500 font-medium' : 'text-gray-500'}>
            Sobre o gato
          </span>
          <span className={step === 2 ? 'text-orange-500 font-medium' : 'text-gray-500'}>
            Fotos
          </span>
          <span className={step === 3 ? 'text-orange-500 font-medium' : 'text-gray-500'}>
            Localizacao
          </span>
          <span className={step === 4 ? 'text-orange-500 font-medium' : 'text-gray-500'}>
            Contato
          </span>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
          {/* Step 1: Cat Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do gatinho *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    placeholder="Ex: Luna, Simba, Mia..."
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* Breed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raca *
                  </label>
                  <select
                    value={formData.breed}
                    onChange={(e) => updateFormData({ breed: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.breed ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  >
                    <option value="">Selecione</option>
                    {breedOptions.map((breed) => (
                      <option key={breed} value={breed}>
                        {breed}
                      </option>
                    ))}
                  </select>
                  {errors.breed && <p className="mt-1 text-sm text-red-500">{errors.breed}</p>}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={formData.age}
                      onChange={(e) => updateFormData({ age: e.target.value })}
                      placeholder="Ex: 2"
                      className={`flex-1 px-4 py-3 rounded-xl border ${
                        errors.age ? 'border-red-500' : 'border-gray-200'
                      } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    />
                    <select
                      value={formData.ageUnit}
                      onChange={(e) => updateFormData({ ageUnit: e.target.value as 'months' | 'years' })}
                      className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      <option value="months">Meses</option>
                      <option value="years">Anos</option>
                    </select>
                  </div>
                  {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexo *
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => updateFormData({ gender: 'female' })}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        formData.gender === 'female'
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      ♀ Femea
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFormData({ gender: 'male' })}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        formData.gender === 'male'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      ♂ Macho
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descricao *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder="Conte um pouco sobre o gatinho, sua historia, como ele chegou ate voce..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.description ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none`}
                />
                <div className="flex justify-between mt-1">
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  <p className="text-sm text-gray-400 ml-auto">{formData.description.length} caracteres</p>
                </div>
              </div>

              {/* Personality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personalidade * <span className="text-gray-400 font-normal">(selecione ate 5)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {personalityOptions.map((trait) => (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => togglePersonality(trait)}
                      disabled={
                        !formData.personality.includes(trait) && formData.personality.length >= 5
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.personality.includes(trait)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
                {errors.personality && <p className="mt-1 text-sm text-red-500">{errors.personality}</p>}
              </div>

              {/* Health */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Saude
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.vaccinated}
                      onChange={(e) => updateFormData({ vaccinated: e.target.checked })}
                      className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">Vacinado</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.neutered}
                      onChange={(e) => updateFormData({ neutered: e.target.checked })}
                      className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">Castrado</span>
                  </label>
                </div>
              </div>

              {/* Health Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Informacoes de saude <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={formData.healthInfo}
                  onChange={(e) => updateFormData({ healthInfo: e.target.value })}
                  placeholder="Ex: Precisa de racao especial, tem alergia, etc."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Compatibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Convive bem com
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.goodWithKids}
                      onChange={(e) => updateFormData({ goodWithKids: e.target.checked })}
                      className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">👶 Criancas</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.goodWithDogs}
                      onChange={(e) => updateFormData({ goodWithDogs: e.target.checked })}
                      className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">🐕 Caes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.goodWithCats}
                      onChange={(e) => updateFormData({ goodWithCats: e.target.checked })}
                      className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">🐱 Outros gatos</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Photos */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Fotos de {formData.name || 'seu gatinho'}
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Adicione fotos bonitas para aumentar as chances de adocao
                </p>
                <ImageUpload
                  images={formData.images}
                  onChange={(images) => updateFormData({ images })}
                  maxImages={5}
                />
                {errors.images && <p className="mt-2 text-sm text-red-500">{errors.images}</p>}
              </div>

              {/* Tips */}
              <div className="bg-orange-50 rounded-xl p-4">
                <h3 className="font-medium text-orange-800 mb-2">Dicas para boas fotos:</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Use luz natural sempre que possivel</li>
                  <li>• Mostre o rosto do gatinho claramente</li>
                  <li>• Tire fotos em diferentes angulos</li>
                  <li>• Inclua fotos do corpo inteiro</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Onde {formData.name || 'o gatinho'} esta?
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Informe a localizacao para que interessados proximos possam encontra-lo
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CEP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.cep}
                      onChange={(e) => handleCEPChange(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.cep ? 'border-red-500' : 'border-gray-200'
                      } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    />
                    {isLoadingCEP && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="animate-spin w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {errors.cep && <p className="mt-1 text-sm text-red-500">{errors.cep}</p>}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateFormData({ state: e.target.value })}
                    placeholder="UF"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-gray-50"
                    readOnly
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData({ city: e.target.value })}
                    placeholder="Sua cidade"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.city ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>

                {/* Neighborhood */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => updateFormData({ neighborhood: e.target.value })}
                    placeholder="Seu bairro"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.neighborhood ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  />
                  {errors.neighborhood && <p className="mt-1 text-sm text-red-500">{errors.neighborhood}</p>}
                </div>

                {/* Street */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rua <span className="text-gray-400 font-normal">(opcional - nao sera exibido publicamente)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => updateFormData({ street: e.target.value })}
                    placeholder="Sua rua"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Suas informacoes de contato
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Interessados entraram em contato com voce por aqui
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seu nome *
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => updateFormData({ ownerName: e.target.value })}
                    placeholder="Como voce quer ser chamado"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.ownerName ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  />
                  {errors.ownerName && <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={formData.ownerWhatsapp}
                    onChange={(e) => updateFormData({ ownerWhatsapp: formatPhone(e.target.value) })}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.ownerWhatsapp ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  />
                  {errors.ownerWhatsapp && <p className="mt-1 text-sm text-red-500">{errors.ownerWhatsapp}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={(e) => updateFormData({ ownerPhone: formatPhone(e.target.value) })}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => updateFormData({ ownerEmail: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Preview Card */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Preview do anuncio:</h3>
                <div className="bg-gray-50 rounded-xl p-4 flex gap-4">
                  {formData.images[0] && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={formData.images[0]}
                        alt={formData.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{formData.name || 'Nome do gato'}</h4>
                    <p className="text-sm text-gray-500">
                      {formData.breed || 'Raca'} · {formData.age} {formData.ageUnit === 'months' ? 'meses' : 'anos'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formData.neighborhood}, {formData.city} - {formData.state}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {formData.vaccinated && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Vacinado
                        </span>
                      )}
                      {formData.neutered && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          Castrado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-all"
              >
                Voltar
              </button>
            ) : (
              <Link
                href="/"
                className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-all"
              >
                Cancelar
              </Link>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all"
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Publicando...
                  </>
                ) : (
                  'Publicar Anuncio'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
