export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      apartment_images: {
        Row: {
          alt: string | null
          apartment_id: string
          created_at: string | null
          external_url: string | null
          height: number | null
          id: string
          position: number | null
          storage_path: string | null
          width: number | null
        }
        Insert: {
          alt?: string | null
          apartment_id: string
          created_at?: string | null
          external_url?: string | null
          height?: number | null
          id?: string
          position?: number | null
          storage_path?: string | null
          width?: number | null
        }
        Update: {
          alt?: string | null
          apartment_id?: string
          created_at?: string | null
          external_url?: string | null
          height?: number | null
          id?: string
          position?: number | null
          storage_path?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "apartment_images_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
        ]
      }
      apartments: {
        Row: {
          amenities: string[] | null
          area_m2: number
          bathrooms: number
          bedrooms: number
          city: string
          condo_fee: number | null
          created_at: string | null
          description: string | null
          floor: number | null
          furnished: boolean | null
          id: string
          iptu: number | null
          metro_distance_m: number | null
          neighborhood_id: string | null
          number: string | null
          owner_id: string
          parking_spots: number | null
          pet_friendly: boolean | null
          property_type: Database["public"]["Enums"]["property_type"]
          published: boolean | null
          rating: number | null
          rent: number
          reviews_count: number | null
          slug: string
          state: string
          status: Database["public"]["Enums"]["apartment_status"]
          street: string
          title: string
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          amenities?: string[] | null
          area_m2: number
          bathrooms?: number
          bedrooms?: number
          city: string
          condo_fee?: number | null
          created_at?: string | null
          description?: string | null
          floor?: number | null
          furnished?: boolean | null
          id?: string
          iptu?: number | null
          metro_distance_m?: number | null
          neighborhood_id?: string | null
          number?: string | null
          owner_id: string
          parking_spots?: number | null
          pet_friendly?: boolean | null
          property_type?: Database["public"]["Enums"]["property_type"]
          published?: boolean | null
          rating?: number | null
          rent: number
          reviews_count?: number | null
          slug: string
          state: string
          status?: Database["public"]["Enums"]["apartment_status"]
          street: string
          title: string
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          amenities?: string[] | null
          area_m2?: number
          bathrooms?: number
          bedrooms?: number
          city?: string
          condo_fee?: number | null
          created_at?: string | null
          description?: string | null
          floor?: number | null
          furnished?: boolean | null
          id?: string
          iptu?: number | null
          metro_distance_m?: number | null
          neighborhood_id?: string | null
          number?: string | null
          owner_id?: string
          parking_spots?: number | null
          pet_friendly?: boolean | null
          property_type?: Database["public"]["Enums"]["property_type"]
          published?: boolean | null
          rating?: number | null
          rent?: number
          reviews_count?: number | null
          slug?: string
          state?: string
          status?: Database["public"]["Enums"]["apartment_status"]
          street?: string
          title?: string
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "apartments_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apartments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          apartment_id: string
          created_at: string | null
          profile_id: string
        }
        Insert: {
          apartment_id: string
          created_at?: string | null
          profile_id: string
        }
        Update: {
          apartment_id?: string
          created_at?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhoods: {
        Row: {
          average_rent: number | null
          city: string
          created_at: string | null
          highlights: string[] | null
          id: string
          name: string
          slug: string
          state: string
        }
        Insert: {
          average_rent?: number | null
          city: string
          created_at?: string | null
          highlights?: string[] | null
          id?: string
          name: string
          slug: string
          state: string
        }
        Update: {
          average_rent?: number | null
          city?: string
          created_at?: string | null
          highlights?: string[] | null
          id?: string
          name?: string
          slug?: string
          state?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auth_user_id: string | null
          avatar_path: string | null
          avatar_url: string | null
          created_at: string | null
          document_urls: Json | null
          email: string | null
          id: string
          member_since: string | null
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          score: number | null
          score_factors: Json | null
          updated_at: string | null
          verification:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified: boolean | null
        }
        Insert: {
          auth_user_id?: string | null
          avatar_path?: string | null
          avatar_url?: string | null
          created_at?: string | null
          document_urls?: Json | null
          email?: string | null
          id?: string
          member_since?: string | null
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          score?: number | null
          score_factors?: Json | null
          updated_at?: string | null
          verification?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified?: boolean | null
        }
        Update: {
          auth_user_id?: string | null
          avatar_path?: string | null
          avatar_url?: string | null
          created_at?: string | null
          document_urls?: Json | null
          email?: string | null
          id?: string
          member_since?: string | null
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          score?: number | null
          score_factors?: Json | null
          updated_at?: string | null
          verification?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified?: boolean | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          apartment_id: string
          contract_url: string | null
          counter_rent_amount: number | null
          created_at: string
          id: string
          message: string | null
          owner_id: string
          payment_proof_url: string | null
          rent_amount: number
          signed_contract_url: string | null
          status: Database["public"]["Enums"]["proposal_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          apartment_id: string
          contract_url?: string | null
          counter_rent_amount?: number | null
          created_at?: string
          id?: string
          message?: string | null
          owner_id: string
          payment_proof_url?: string | null
          rent_amount: number
          signed_contract_url?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          apartment_id?: string
          contract_url?: string | null
          counter_rent_amount?: number | null
          created_at?: string
          id?: string
          message?: string | null
          owner_id?: string
          payment_proof_url?: string | null
          rent_amount?: number
          signed_contract_url?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      apartment_status: "available" | "rented" | "pending" | "inactive"
      notification_kind:
        | "proposal_received"
        | "proposal_accepted"
        | "proposal_rejected"
        | "message_received"
        | "kyc_update"
        | "system"
      property_type: "apartment" | "house" | "studio" | "kitnet"
      proposal_status: "pending" | "accepted" | "rejected" | "canceled"
      user_role: "tenant" | "owner" | "admin"
      verification_status: "unverified" | "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      apartment_status: ["available", "rented", "pending", "inactive"],
      notification_kind: [
        "proposal_received",
        "proposal_accepted",
        "proposal_rejected",
        "message_received",
        "kyc_update",
        "system",
      ],
      property_type: ["apartment", "house", "studio", "kitnet"],
      proposal_status: ["pending", "accepted", "rejected", "canceled"],
      user_role: ["tenant", "owner", "admin"],
      verification_status: ["unverified", "pending", "verified", "rejected"],
    },
  },
} as const
