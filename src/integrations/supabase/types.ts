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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          meta: Json
          reason: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          meta?: Json
          reason?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          meta?: Json
          reason?: string
        }
        Relationships: []
      }
      jeweler_feed: {
        Row: {
          buyback_gram: number | null
          change_pct: number | null
          country: string
          currency: string
          day: string
          fetched_at: string
          gold_gram: number | null
          id: string
          silver_gram: number | null
          source: string
          source_url: string
        }
        Insert: {
          buyback_gram?: number | null
          change_pct?: number | null
          country: string
          currency: string
          day?: string
          fetched_at?: string
          gold_gram?: number | null
          id?: string
          silver_gram?: number | null
          source: string
          source_url: string
        }
        Update: {
          buyback_gram?: number | null
          change_pct?: number | null
          country?: string
          currency?: string
          day?: string
          fetched_at?: string
          gold_gram?: number | null
          id?: string
          silver_gram?: number | null
          source?: string
          source_url?: string
        }
        Relationships: []
      }
      notification_prefs: {
        Row: {
          countries: string[]
          daily_digest: boolean
          email: boolean
          in_app: boolean
          metals: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          countries?: string[]
          daily_digest?: boolean
          email?: boolean
          in_app?: boolean
          metals?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          countries?: string[]
          daily_digest?: boolean
          email?: boolean
          in_app?: boolean
          metals?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          country: string
          created_at: string
          id: string
          kind: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string
          country?: string
          created_at?: string
          id?: string
          kind: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          country?: string
          created_at?: string
          id?: string
          kind?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      price_submissions: {
        Row: {
          ai_summary: string | null
          auto_approved: boolean
          buyback_gram: number | null
          city: string
          country: string
          created_at: string
          currency: string
          gold_gram: number | null
          id: string
          metal: string
          note: string
          quality: number | null
          review_reason: string
          reviewed_at: string | null
          reviewed_by: string | null
          silver_gram: number | null
          source: string
          status: string
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          auto_approved?: boolean
          buyback_gram?: number | null
          city?: string
          country: string
          created_at?: string
          currency: string
          gold_gram?: number | null
          id?: string
          metal?: string
          note?: string
          quality?: number | null
          review_reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          silver_gram?: number | null
          source?: string
          status?: string
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          auto_approved?: boolean
          buyback_gram?: number | null
          city?: string
          country?: string
          created_at?: string
          currency?: string
          gold_gram?: number | null
          id?: string
          metal?: string
          note?: string
          quality?: number | null
          review_reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          silver_gram?: number | null
          source?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      price_votes: {
        Row: {
          created_at: string
          id: string
          submission_id: string
          user_id: string
          vote: number
        }
        Insert: {
          created_at?: string
          id?: string
          submission_id: string
          user_id: string
          vote: number
        }
        Update: {
          created_at?: string
          id?: string
          submission_id?: string
          user_id?: string
          vote?: number
        }
        Relationships: [
          {
            foreignKeyName: "price_votes_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "price_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string
          contact: string
          country: string
          created_at: string
          display_name: string
          id: string
          license: string
          org: string
        }
        Insert: {
          city?: string
          contact?: string
          country?: string
          created_at?: string
          display_name?: string
          id: string
          license?: string
          org?: string
        }
        Update: {
          city?: string
          contact?: string
          country?: string
          created_at?: string
          display_name?: string
          id?: string
          license?: string
          org?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_trusted: { Args: { _user_id: string }; Returns: boolean }
      jeweler_leaderboard: {
        Args: { _country?: string }
        Returns: {
          accuracy: number
          approved: number
          country: string
          display_name: string
          down_votes: number
          org: string
          points: number
          up_votes: number
          user_id: string
        }[]
      }
      verify_job_token: {
        Args: { _name: string; _token: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "jeweler" | "ambassador" | "volunteer"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "jeweler", "ambassador", "volunteer"],
    },
  },
} as const
