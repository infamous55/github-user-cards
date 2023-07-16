export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      github_pat: {
        Row: {
          token: string
          user_id: string
        }
        Insert: {
          token?: string
          user_id: string
        }
        Update: {
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_pat_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      repo_stats: {
        Row: {
          enabled: boolean
          id: string
          user_id: string
        }
        Insert: {
          enabled?: boolean
          id?: string
          user_id: string
        }
        Update: {
          enabled?: boolean
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "repo_stats_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      top_langs: {
        Row: {
          enabled: boolean
          id: string
          user_id: string
        }
        Insert: {
          enabled?: boolean
          id?: string
          user_id: string
        }
        Update: {
          enabled?: boolean
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "top_langs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
