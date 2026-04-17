export type UserRole = "CUSTOMER" | "PROVIDER" | "MANAGER" | "ADMIN";

export interface SafeUser {
  id: string;
  email: string;
  role: UserRole;
  authProvider: "LOCAL" | "GOOGLE";
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  emailVerifiedAt: string | Date | null;
  createdAt: string | Date;
}

export interface AuthResponse {
  user: SafeUser;
  accessToken: string;
  refreshToken?: string;
}

export interface ForgotPasswordResponse {
  message: string;
  debugResetToken?: string;
  debugResetUrl?: string;
}

export interface ReferenceEntity {
  id: string;
  name: string;
  slug: string;
}

export interface ReferenceDataResponse {
  categories: ReferenceEntity[];
  cities: ReferenceEntity[];
  emotionTags: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  subscriptionPlans: Array<{
    id: string;
    code: string;
    name: string;
    description?: string | null;
    priceAmount: number;
    currency: string;
    intervalMonths: number;
    paymentProviders?: string[];
  }>;
}

export interface PublicServiceCardDto {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  emotionTag: string;
  priceAmount: number;
  currency: string;
  durationMinutes: number;
  coverImageUrl: string | null;
  category: ReferenceEntity;
  city: ReferenceEntity;
  provider: {
    id: string;
    brandName: string;
    averageRating: number;
    totalReviews: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BookingResponseDto {
  id: string;
  status: string;
  totalAmount: number;
  currency: string;
  notes: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  refundAmount: number | null;
  paymentExpiresAt: string | null;
  createdAt: string;
  slot: {
    id: string;
    startsAt: string;
    endsAt: string;
    emotionTag: string;
    priceAmount: number;
    currency: string;
    service: {
      id: string;
      title: string;
      coverImageUrl: string | null;
    };
    provider: {
      id: string;
      brandName: string;
    };
  };
}

export interface CustomerProfileDto {
  id: string;
  userId: string;
  age: number | null;
  city: ReferenceEntity | null;
  moodNotes: string | null;
  preferredRadiusKm: number | null;
  onboardingDone: boolean;
  emotionPreferences: Array<{
    emotion: string;
    score: number;
  }>;
}

export interface ProviderProfileDto {
  id: string;
  userId: string;
  brandName: string;
  bio: string | null;
  city: ReferenceEntity | null;
  addressLine: string | null;
  latitude: number | null;
  longitude: number | null;
  websiteUrl: string | null;
  instagramUrl: string | null;
  approvalStatus: string;
  approvalSubmittedAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  includeInJoyMap: boolean;
}
