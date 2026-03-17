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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          company_name: string | null
          phone: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          company_name?: string | null
          phone?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          company_name?: string | null
          phone?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          client_id: string
          title: string
          description: string | null
          status: string
          portal_token: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          title: string
          description?: string | null
          status?: string
          portal_token?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          title?: string
          description?: string | null
          status?: string
          portal_token?: string
          created_at?: string
        }
      }
      project_sections: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          sort_order?: number
        }
      }
      project_fields: {
        Row: {
          id: string
          section_id: string
          label: string
          field_type: string
          is_required: boolean
          placeholder: string | null
          help_text: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          section_id: string
          label: string
          field_type: string
          is_required?: boolean
          placeholder?: string | null
          help_text?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          section_id?: string
          label?: string
          field_type?: string
          is_required?: boolean
          placeholder?: string | null
          help_text?: string | null
          sort_order?: number
        }
      }
      field_responses: {
        Row: {
          id: string
          field_id: string
          value_text: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          field_id: string
          value_text?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          field_id?: string
          value_text?: string | null
          updated_at?: string
        }
      }
    }
  }
}
