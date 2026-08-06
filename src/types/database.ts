// GENERATED — do not edit by hand.
// Regenerate via the Supabase MCP `generate_typescript_types` tool (or
// `supabase gen types typescript`) against project dtmxlemouzcfbmrqspry.
// This is the raw Postgres row shape (snake_case). The app's domain model
// (camelCase, nested address/features) lives in `src/types/index.ts`;
// `src/lib/api/mappers.ts` is the only place that should import from here.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      apartment_images: {
        Row: {
          alt: string | null;
          apartment_id: string;
          created_at: string;
          external_url: string | null;
          height: number | null;
          id: string;
          position: number;
          storage_path: string | null;
          width: number | null;
        };
        Insert: {
          alt?: string | null;
          apartment_id: string;
          created_at?: string;
          external_url?: string | null;
          height?: number | null;
          id?: string;
          position?: number;
          storage_path?: string | null;
          width?: number | null;
        };
        Update: {
          alt?: string | null;
          apartment_id?: string;
          created_at?: string;
          external_url?: string | null;
          height?: number | null;
          id?: string;
          position?: number;
          storage_path?: string | null;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "apartment_images_apartment_id_fkey";
            columns: ["apartment_id"];
            isOneToOne: false;
            referencedRelation: "apartments";
            referencedColumns: ["id"];
          },
        ];
      };
      apartments: {
        Row: {
          amenities: string[];
          area_m2: number;
          bathrooms: number;
          bedrooms: number;
          city: string;
          condo_fee: number;
          created_at: string;
          description: string;
          floor: number | null;
          furnished: boolean;
          id: string;
          iptu: number;
          legacy_id: string | null;
          metro_distance_m: number | null;
          neighborhood_id: string | null;
          neighborhood_name: string | null;
          number: string;
          owner_id: string;
          parking_spots: number;
          pet_friendly: boolean;
          property_type: Database["public"]["Enums"]["property_type"];
          published: boolean;
          rating: number;
          rent: number;
          reviews_count: number;
          search_vector: unknown;
          slug: string;
          state: string;
          status: Database["public"]["Enums"]["apartment_status"];
          street: string;
          title: string;
          updated_at: string;
          zip_code: string;
        };
        Insert: {
          amenities?: string[];
          area_m2?: number;
          bathrooms?: number;
          bedrooms?: number;
          city: string;
          condo_fee?: number;
          created_at?: string;
          description?: string;
          floor?: number | null;
          furnished?: boolean;
          id?: string;
          iptu?: number;
          legacy_id?: string | null;
          metro_distance_m?: number | null;
          neighborhood_id?: string | null;
          neighborhood_name?: string | null;
          number?: string;
          owner_id: string;
          parking_spots?: number;
          pet_friendly?: boolean;
          property_type?: Database["public"]["Enums"]["property_type"];
          published?: boolean;
          rating?: number;
          rent: number;
          reviews_count?: number;
          search_vector?: unknown;
          slug: string;
          state: string;
          status?: Database["public"]["Enums"]["apartment_status"];
          street?: string;
          title: string;
          updated_at?: string;
          zip_code?: string;
        };
        Update: {
          amenities?: string[];
          area_m2?: number;
          bathrooms?: number;
          bedrooms?: number;
          city?: string;
          condo_fee?: number;
          created_at?: string;
          description?: string;
          floor?: number | null;
          furnished?: boolean;
          id?: string;
          iptu?: number;
          legacy_id?: string | null;
          metro_distance_m?: number | null;
          neighborhood_id?: string | null;
          neighborhood_name?: string | null;
          number?: string;
          owner_id?: string;
          parking_spots?: number;
          pet_friendly?: boolean;
          property_type?: Database["public"]["Enums"]["property_type"];
          published?: boolean;
          rating?: number;
          rent?: number;
          reviews_count?: number;
          search_vector?: unknown;
          slug?: string;
          state?: string;
          status?: Database["public"]["Enums"]["apartment_status"];
          street?: string;
          title?: string;
          updated_at?: string;
          zip_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: "apartments_neighborhood_id_fkey";
            columns: ["neighborhood_id"];
            isOneToOne: false;
            referencedRelation: "neighborhood_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "apartments_neighborhood_id_fkey";
            columns: ["neighborhood_id"];
            isOneToOne: false;
            referencedRelation: "neighborhoods";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "apartments_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "apartments_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "public_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      neighborhoods: {
        Row: {
          average_rent: number;
          city: string;
          created_at: string;
          highlights: string[];
          id: string;
          legacy_id: string | null;
          name: string;
          slug: string;
          state: string;
        };
        Insert: {
          average_rent?: number;
          city: string;
          created_at?: string;
          highlights?: string[];
          id?: string;
          legacy_id?: string | null;
          name: string;
          slug: string;
          state: string;
        };
        Update: {
          average_rent?: number;
          city?: string;
          created_at?: string;
          highlights?: string[];
          id?: string;
          legacy_id?: string | null;
          name?: string;
          slug?: string;
          state?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          auth_user_id: string | null;
          avatar_path: string | null;
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          id: string;
          legacy_id: string | null;
          member_since: string;
          name: string;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"];
          score: number | null;
          score_factors: Json;
          updated_at: string;
          verification: Database["public"]["Enums"]["verification_status"];
          verified: boolean;
        };
        Insert: {
          auth_user_id?: string | null;
          avatar_path?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          legacy_id?: string | null;
          member_since?: string;
          name: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          score?: number | null;
          score_factors?: Json;
          updated_at?: string;
          verification?: Database["public"]["Enums"]["verification_status"];
          verified?: boolean;
        };
        Update: {
          auth_user_id?: string | null;
          avatar_path?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          legacy_id?: string | null;
          member_since?: string;
          name?: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          score?: number | null;
          score_factors?: Json;
          updated_at?: string;
          verification?: Database["public"]["Enums"]["verification_status"];
          verified?: boolean;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          apartment_id: string;
          author_id: string;
          comment: string;
          created_at: string;
          id: string;
          legacy_id: string | null;
          rating: number;
        };
        Insert: {
          apartment_id: string;
          author_id: string;
          comment?: string;
          created_at?: string;
          id?: string;
          legacy_id?: string | null;
          rating: number;
        };
        Update: {
          apartment_id?: string;
          author_id?: string;
          comment?: string;
          created_at?: string;
          id?: string;
          legacy_id?: string | null;
          rating?: number;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_apartment_id_fkey";
            columns: ["apartment_id"];
            isOneToOne: false;
            referencedRelation: "apartments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "public_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      neighborhood_stats: {
        Row: {
          available_properties: number | null;
          average_rent: number | null;
          city: string | null;
          highlights: string[] | null;
          id: string | null;
          name: string | null;
          slug: string | null;
          state: string | null;
        };
        Relationships: [];
      };
      public_profiles: {
        Row: {
          avatar_path: string | null;
          avatar_url: string | null;
          id: string | null;
          member_since: string | null;
          name: string | null;
          role: Database["public"]["Enums"]["user_role"] | null;
          score: number | null;
          verified: boolean | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      apartment_status: "available" | "reserved" | "rented";
      notification_kind: "message" | "visit" | "contract" | "payment" | "system";
      property_type: "apartamento" | "casa" | "studio" | "loft" | "kitnet" | "cobertura";
      proposal_status: "pending" | "approved" | "rejected";
      user_role: "tenant" | "owner";
      verification_status: "none" | "pending" | "verified" | "rejected";
    };
    CompositeTypes: Record<string, never>;
  };
};
