export type ID = string;

export interface Neighborhood {
  id: ID;
  name: string;
  city: string;
  state: string;
  slug: string;
  averageRent: number;
  highlights: string[];
}

export type UserRole = "tenant" | "owner";

export interface User {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  verified: boolean;
  memberSince: string;
  score?: number;
  scoreFactors?: {
    lowStability?: boolean;
    contractBreach?: boolean;
    positiveOwnerReviews?: number; // 0-100
    latePayments?: number;
    incompleteDocs?: boolean;
    incompleteProfile?: boolean;
    noAvatar?: boolean;
    kycVerified?: boolean; // Novo campo para validação de documentos
    chatResponseTime?: "low" | "medium" | "high";
  };
}

export type ApartmentStatus = "available" | "reserved" | "rented";

export type PropertyType = "apartamento" | "casa" | "studio" | "loft" | "kitnet" | "cobertura";

export interface ApartmentFeatures {
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  areaM2: number;
  furnished: boolean;
  petFriendly: boolean;
  floor?: number;
}

export interface Apartment {
  id: ID;
  slug: string;
  title: string;
  description: string;
  status: ApartmentStatus;
  propertyType: PropertyType;
  rent: number;
  condoFee: number;
  iptu: number;
  images: string[];
  address: {
    street: string;
    number: string;
    neighborhoodId: ID;
    neighborhoodName: string;
    city: string;
    state: string;
    zipCode: string;
  };
  features: ApartmentFeatures;
  amenities: string[];
  ownerId: ID;
  rating: number;
  reviewsCount: number;
  metroDistanceM?: number;
  createdAt: string;
}

export interface Review {
  id: ID;
  apartmentId: ID;
  authorId: ID;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Favorite {
  id: ID;
  userId: ID;
  apartmentId: ID;
  createdAt: string;
}

export interface Message {
  id: ID;
  conversationId: ID;
  senderId: ID;
  content: string;
  sentAt: string;
  read: boolean;
}

export interface Conversation {
  id: ID;
  apartmentId: ID;
  participantIds: ID[];
  messages: Message[];
  updatedAt: string;
  unreadCount: number;
}

export type NotificationKind = "message" | "visit" | "contract" | "payment" | "system";

export interface AppNotification {
  id: ID;
  kind: NotificationKind;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export type SortOption = "relevance" | "recent" | "price_asc" | "price_desc" | "rating" | "metro";

/**
 * Vocabulário de filtro compartilhado por `/buscar` (via `validateSearch`),
 * pela server function de busca e pela tool MCP `search_properties` — os
 * três consomem os mesmos nomes de campo contra a mesma função SQL
 * `search_apartments`. Todos os campos são opcionais aqui porque este tipo
 * representa uma especificação de filtro parcial; quem resolve os defaults
 * (ex.: `sort: "relevance"`, `page: 1`) é o schema Zod em
 * `src/lib/search/filters.ts`.
 */
export interface SearchFilters {
  query?: string;
  city?: string;
  neighborhood?: string;
  propertyType?: PropertyType | "todos";
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  furnished?: boolean;
  petFriendly?: boolean;
  sort?: SortOption;
  page?: number;
  perPage?: number;
}
