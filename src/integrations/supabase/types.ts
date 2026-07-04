export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admin_banned_devices: {
        Row: {
          banned_at: string;
          device_fingerprint: string;
          reason: string | null;
        };
        Insert: {
          banned_at?: string;
          device_fingerprint: string;
          reason?: string | null;
        };
        Update: {
          banned_at?: string;
          device_fingerprint?: string;
          reason?: string | null;
        };
        Relationships: [];
      };
      admin_login_attempts: {
        Row: {
          created_at: string;
          device_fingerprint: string;
          id: string;
          success: boolean;
        };
        Insert: {
          created_at?: string;
          device_fingerprint: string;
          id?: string;
          success: boolean;
        };
        Update: {
          created_at?: string;
          device_fingerprint?: string;
          id?: string;
          success?: boolean;
        };
        Relationships: [];
      };
      chats: {
        Row: {
          created_at: string;
          id: string;
          message: string;
          read: boolean;
          sender: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          message: string;
          read?: boolean;
          sender: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          message?: string;
          read?: boolean;
          sender?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      deployment_env: {
        Row: {
          deployment_id: string;
          id: string;
          key: string;
          user_id: string;
          value: string;
        };
        Insert: {
          deployment_id: string;
          id?: string;
          key: string;
          user_id: string;
          value: string;
        };
        Update: {
          deployment_id?: string;
          id?: string;
          key?: string;
          user_id?: string;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "deployment_env_deployment_id_fkey";
            columns: ["deployment_id"];
            isOneToOne: false;
            referencedRelation: "deployments";
            referencedColumns: ["id"];
          },
        ];
      };
      deployment_logs: {
        Row: {
          created_at: string;
          deployment_id: string;
          id: string;
          level: string;
          message: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          deployment_id: string;
          id?: string;
          level?: string;
          message: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          deployment_id?: string;
          id?: string;
          level?: string;
          message?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "deployment_logs_deployment_id_fkey";
            columns: ["deployment_id"];
            isOneToOne: false;
            referencedRelation: "deployments";
            referencedColumns: ["id"];
          },
        ];
      };
      deployments: {
        Row: {
          branch: string | null;
          build_cmd: string | null;
          created_at: string;
          deploy_cmd: string | null;
          id: string;
          is_banned: boolean;
          name: string;
          port: number | null;
          repo_url: string | null;
          runtime: string | null;
          source_type: Database["public"]["Enums"]["deploy_source"];
          status: Database["public"]["Enums"]["deploy_status"];
          status_message: string | null;
          updated_at: string;
          user_id: string;
          zip_path: string | null;
        };
        Insert: {
          branch?: string | null;
          build_cmd?: string | null;
          created_at?: string;
          deploy_cmd?: string | null;
          id?: string;
          is_banned?: boolean;
          name: string;
          port?: number | null;
          repo_url?: string | null;
          runtime?: string | null;
          source_type: Database["public"]["Enums"]["deploy_source"];
          status?: Database["public"]["Enums"]["deploy_status"];
          status_message?: string | null;
          updated_at?: string;
          user_id: string;
          zip_path?: string | null;
        };
        Update: {
          branch?: string | null;
          build_cmd?: string | null;
          created_at?: string;
          deploy_cmd?: string | null;
          id?: string;
          is_banned?: boolean;
          name?: string;
          port?: number | null;
          repo_url?: string | null;
          runtime?: string | null;
          source_type?: Database["public"]["Enums"]["deploy_source"];
          status?: Database["public"]["Enums"]["deploy_status"];
          status_message?: string | null;
          updated_at?: string;
          user_id?: string;
          zip_path?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          is_banned: boolean;
          referral_code: string;
          referred_by: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          is_banned?: boolean;
          referral_code?: string;
          referred_by?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          is_banned?: boolean;
          referral_code?: string;
          referred_by?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey";
            columns: ["referred_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      referral_earnings: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          plan_name: string | null;
          referee_id: string;
          referrer_id: string;
          status: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          plan_name?: string | null;
          referee_id: string;
          referrer_id: string;
          status?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          plan_name?: string | null;
          referee_id?: string;
          referrer_id?: string;
          status?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      wallet_transactions: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          metadata: Json | null;
          reason: string;
          type: Database["public"]["Enums"]["tx_type"];
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          reason: string;
          type: Database["public"]["Enums"]["tx_type"];
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          reason?: string;
          type?: Database["public"]["Enums"]["tx_type"];
          user_id?: string;
        };
        Relationships: [];
      };
      wallets: {
        Row: {
          balance_inr: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          balance_inr?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          balance_inr?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      credit_referral_commission: {
        Args: { _buyer: string; _plan_amount: number; _plan_name: string };
        Returns: undefined;
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "user" | "admin";
      deploy_source: "github" | "zip";
      deploy_status: "queued" | "building" | "running" | "stopped" | "failed" | "crashed";
      tx_type: "credit" | "debit";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "admin"],
      deploy_source: ["github", "zip"],
      deploy_status: ["queued", "building", "running", "stopped", "failed", "crashed"],
      tx_type: ["credit", "debit"],
    },
  },
} as const;
