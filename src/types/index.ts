export interface Cat {
  id: string;
  name: string;
  age: string;
  breed: string;
  gender: 'male' | 'female';
  description: string;
  personality: string[];
  images: string[];
  location: {
    city: string;
    state: string;
    neighborhood: string;
  };
  owner: {
    name: string;
    avatar: string;
    phone?: string;
    whatsapp?: string;
  };
  vaccinated: boolean;
  neutered: boolean;
  healthInfo?: string;
  goodWith: {
    kids: boolean;
    dogs: boolean;
    cats: boolean;
  };
  createdAt: string;
  featured?: boolean;
}

export interface FilterOptions {
  city?: string;
  gender?: 'male' | 'female' | 'all';
  age?: 'kitten' | 'young' | 'adult' | 'senior' | 'all';
  vaccinated?: boolean;
  neutered?: boolean;
}
