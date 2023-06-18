export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      repo_stats: {
        Row: {
          enabled: boolean;
          id: string;
          user_id: string;
        };
        Insert: {
          enabled?: boolean;
          id?: string;
          user_id: string;
        };
        Update: {
          enabled?: boolean;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'repo_stats_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
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
}
