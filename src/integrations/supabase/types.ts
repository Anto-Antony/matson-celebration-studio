export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: unknown }
    | Json[];

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    created_at: string;
                    email: string | null;
                    full_name: string | null;
                    id: string;
                    role: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    email?: string | null;
                    full_name?: string | null;
                    id: string;
                    role?: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    email?: string | null;
                    full_name?: string | null;
                    id?: string;
                    role?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            wedding_data: {
                Row: {
                    created_at: string;
                    data: Json;
                    id: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    data: Json;
                    id?: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    data?: Json;
                    id?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            wedding_template: {
                Row: {
                    id: number;
                    created_at: string;
                    template_url: string;
                    template_name: string;
                    description: string | null;
                };
                Insert: {
                    id?: number;
                    created_at?: string;
                    template_url: string;
                    template_name: string;
                    description?: string | null;
                };
                Update: {
                    id?: number;
                    created_at?: string;
                    template_url?: string;
                    template_name?: string;
                    description?: string | null;
                };
                Relationships: [];
            };
            guest_wishes: {
                Row: {
                    id: string;
                    created_at: string;
                    name: string;
                    message: string;
                    variant: string; // foreign key to wedding_data.id
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    name: string;
                    message: string;
                    variant: string;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    name?: string;
                    message?: string;
                    variant?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "guest_wishes_variant_fkey";
                        columns: ["variant"];
                        referencedRelation: "web_entries";
                        referencedColumns: ["id"];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
              Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
      ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
        | keyof DefaultSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
      ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
      : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
      ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
      : never;

export const Constants = {
    public: {
        Enums: {},
    },
} as const;
