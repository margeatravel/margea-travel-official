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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_reference: string | null
          check_in: string
          check_out: string
          cleaning_fee: number
          created_at: string
          guest_email: string
          guest_name: string
          guest_phone: string | null
          guests: number
          id: string
          property_id: string
          status: string
          total_nights: number
          total_price: number
          updated_at: string
        }
        Insert: {
          booking_reference?: string | null
          check_in: string
          check_out: string
          cleaning_fee?: number
          created_at?: string
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          guests: number
          id?: string
          property_id: string
          status?: string
          total_nights: number
          total_price: number
          updated_at?: string
        }
        Update: {
          booking_reference?: string | null
          check_in?: string
          check_out?: string
          cleaning_fee?: number
          created_at?: string
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          guests?: number
          id?: string
          property_id?: string
          status?: string
          total_nights?: number
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      charter_requests: {
        Row: {
          aircraft: string
          aircraft_base: string
          case_number: string
          created_at: string
          departure_date: string
          destination: string
          email: string
          flight_type: string
          full_name: string
          id: string
          notes: string | null
          origin: string
          passengers: number
          phone: string | null
          requires_repositioning: boolean
          return_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          aircraft?: string
          aircraft_base?: string
          case_number?: string
          created_at?: string
          departure_date: string
          destination: string
          email: string
          flight_type?: string
          full_name: string
          id?: string
          notes?: string | null
          origin: string
          passengers?: number
          phone?: string | null
          requires_repositioning?: boolean
          return_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          aircraft?: string
          aircraft_base?: string
          case_number?: string
          created_at?: string
          departure_date?: string
          destination?: string
          email?: string
          flight_type?: string
          full_name?: string
          id?: string
          notes?: string | null
          origin?: string
          passengers?: number
          phone?: string | null
          requires_repositioning?: boolean
          return_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      concierge_requests: {
        Row: {
          case_number: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          guests: number | null
          id: string
          preferred_date: string | null
          service_type: string
          special_requests: string | null
          status: string
          updated_at: string
        }
        Insert: {
          case_number?: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          guests?: number | null
          id?: string
          preferred_date?: string | null
          service_type: string
          special_requests?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          case_number?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          guests?: number | null
          id?: string
          preferred_date?: string | null
          service_type?: string
          special_requests?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      custom_packages: {
        Row: {
          budget: number
          check_in: string | null
          check_out: string | null
          confirmation_number: string
          created_at: string
          email: string
          guests: number
          id: string
          interests: Json
          name: string
          phone: string | null
          special_requests: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget: number
          check_in?: string | null
          check_out?: string | null
          confirmation_number?: string
          created_at?: string
          email: string
          guests?: number
          id?: string
          interests?: Json
          name: string
          phone?: string | null
          special_requests?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: number
          check_in?: string | null
          check_out?: string | null
          confirmation_number?: string
          created_at?: string
          email?: string
          guests?: number
          id?: string
          interests?: Json
          name?: string
          phone?: string | null
          special_requests?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      external_bookings: {
        Row: {
          check_in: string
          check_out: string
          created_at: string | null
          external_id: string | null
          id: string
          property_id: string
          source_name: string
          source_url: string
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          property_id: string
          source_name: string
          source_url: string
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          property_id?: string
          source_name?: string
          source_url?: string
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      golf_bookings: {
        Row: {
          confirmation_number: string
          course_id: string
          course_name: string
          created_at: string
          currency: string
          id: string
          notes: string | null
          number_of_players: number
          player_email: string
          player_name: string
          player_phone: string | null
          preferred_date: string
          preferred_time: string
          price_per_player: number
          rate_type: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_price: number
          updated_at: string
        }
        Insert: {
          confirmation_number?: string
          course_id: string
          course_name: string
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          number_of_players?: number
          player_email: string
          player_name: string
          player_phone?: string | null
          preferred_date: string
          preferred_time: string
          price_per_player: number
          rate_type?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_price: number
          updated_at?: string
        }
        Update: {
          confirmation_number?: string
          course_id?: string
          course_name?: string
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          number_of_players?: number
          player_email?: string
          player_name?: string
          player_phone?: string | null
          preferred_date?: string
          preferred_time?: string
          price_per_player?: number
          rate_type?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      golf_inquiries: {
        Row: {
          case_number: string
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
          number_of_players: number
          phone: string
          preferred_course: string
          preferred_tee_time: string | null
          status: string
          updated_at: string
        }
        Insert: {
          case_number?: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
          number_of_players?: number
          phone: string
          preferred_course: string
          preferred_tee_time?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          case_number?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          number_of_players?: number
          phone?: string
          preferred_course?: string
          preferred_tee_time?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      member_articles: {
        Row: {
          category: string
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string
          id: string
          is_published: boolean
          published_at: string
          read_time: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt: string
          id?: string
          is_published?: boolean
          published_at?: string
          read_time?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          is_published?: boolean
          published_at?: string
          read_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      member_experiences: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      member_offers: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          sort_order: number
          title: string
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          sort_order?: number
          title: string
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      member_rewards: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_active: boolean
          points_cost: number
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          points_cost: number
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          points_cost?: number
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          agreed_to_marketing: boolean
          country: string
          created_at: string
          credits_balance: number
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agreed_to_marketing?: boolean
          country: string
          created_at?: string
          credits_balance?: number
          email: string
          first_name: string
          id?: string
          last_name: string
          phone: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agreed_to_marketing?: boolean
          country?: string
          created_at?: string
          credits_balance?: number
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      order_drafts: {
        Row: {
          cart_json: Json
          checkin: string
          checkout: string
          created_at: string
          email: string
          full_name: string
          id: string
          lodging: string
          notes: string | null
          phone: string
          status: string
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          cart_json: Json
          checkin: string
          checkout: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          lodging: string
          notes?: string | null
          phone: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          cart_json?: Json
          checkin?: string
          checkout?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          lodging?: string
          notes?: string | null
          phone?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      point_claims: {
        Row: {
          admin_notes: string | null
          amount_usd: number
          booking_date: string
          claim_type: string
          created_at: string
          id: string
          item_name: string
          member_email: string
          member_name: string | null
          platform: string | null
          points: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount_usd: number
          booking_date: string
          claim_type: string
          created_at?: string
          id?: string
          item_name: string
          member_email: string
          member_name?: string | null
          platform?: string | null
          points: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount_usd?: number
          booking_date?: string
          claim_type?: string
          created_at?: string
          id?: string
          item_name?: string
          member_email?: string
          member_name?: string | null
          platform?: string | null
          points?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          amenities: string[] | null
          available: boolean | null
          bathrooms: number
          bedrooms: number
          beds: number | null
          cleaning_fee: number
          created_at: string
          description: string
          external_ical_urls: string[] | null
          id: string
          image_urls: string[] | null
          location: string
          max_guests: number
          minimum_nights: number
          owner_id: string | null
          parent_property_id: string | null
          price_per_night: number
          property_type: string
          special_features: string[] | null
          title: string
          unit_type: string | null
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          available?: boolean | null
          bathrooms: number
          bedrooms: number
          beds?: number | null
          cleaning_fee?: number
          created_at?: string
          description: string
          external_ical_urls?: string[] | null
          id?: string
          image_urls?: string[] | null
          location: string
          max_guests: number
          minimum_nights?: number
          owner_id?: string | null
          parent_property_id?: string | null
          price_per_night: number
          property_type: string
          special_features?: string[] | null
          title: string
          unit_type?: string | null
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          available?: boolean | null
          bathrooms?: number
          bedrooms?: number
          beds?: number | null
          cleaning_fee?: number
          created_at?: string
          description?: string
          external_ical_urls?: string[] | null
          id?: string
          image_urls?: string[] | null
          location?: string
          max_guests?: number
          minimum_nights?: number
          owner_id?: string | null
          parent_property_id?: string | null
          price_per_night?: number
          property_type?: string
          special_features?: string[] | null
          title?: string
          unit_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_parent_property_id_fkey"
            columns: ["parent_property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_requests: {
        Row: {
          additional_info: string | null
          amenities: string[] | null
          bathrooms: number
          bedrooms: number
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          id: string
          location: string
          max_guests: number
          price_per_night: number
          property_description: string
          property_title: string
          property_type: string
          status: string
        }
        Insert: {
          additional_info?: string | null
          amenities?: string[] | null
          bathrooms: number
          bedrooms: number
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          location: string
          max_guests: number
          price_per_night: number
          property_description: string
          property_title: string
          property_type: string
          status?: string
        }
        Update: {
          additional_info?: string | null
          amenities?: string[] | null
          bathrooms?: number
          bedrooms?: number
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          location?: string
          max_guests?: number
          price_per_night?: number
          property_description?: string
          property_title?: string
          property_type?: string
          status?: string
        }
        Relationships: []
      }
      seasonal_pricing: {
        Row: {
          created_at: string
          end_date: string
          id: string
          min_nights: number | null
          name: string
          price_modifier: number
          property_id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          min_nights?: number | null
          name: string
          price_modifier: number
          property_id: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          min_nights?: number | null
          name?: string
          price_modifier?: number
          property_id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seasonal_pricing_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_carts: {
        Row: {
          cart_json: Json
          created_at: string
          expires_at: string
          id: string
          sharer_note: string | null
          total_usd: number
          updated_at: string
          used_at: string | null
        }
        Insert: {
          cart_json: Json
          created_at?: string
          expires_at?: string
          id?: string
          sharer_note?: string | null
          total_usd?: number
          updated_at?: string
          used_at?: string | null
        }
        Update: {
          cart_json?: Json
          created_at?: string
          expires_at?: string
          id?: string
          sharer_note?: string | null
          total_usd?: number
          updated_at?: string
          used_at?: string | null
        }
        Relationships: []
      }
      tour_bookings: {
        Row: {
          confirmation_number: string
          created_at: string
          guest_email: string
          guest_name: string
          guest_phone: string | null
          guests: number | null
          id: string
          requested_date: string | null
          special_requests: string | null
          status: string
          tour_name: string
          updated_at: string
        }
        Insert: {
          confirmation_number?: string
          created_at?: string
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          guests?: number | null
          id?: string
          requested_date?: string | null
          special_requests?: string | null
          status?: string
          tour_name: string
          updated_at?: string
        }
        Update: {
          confirmation_number?: string
          created_at?: string
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          guests?: number | null
          id?: string
          requested_date?: string | null
          special_requests?: string | null
          status?: string
          tour_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      transportation_requests: {
        Row: {
          airline: string
          created_at: string
          date: string
          email: string | null
          flight_number: string
          from_location: string
          full_name: string
          id: string
          notes: string | null
          passengers: number
          return_date: string | null
          return_flight_number: string | null
          return_time: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string
          time: string
          to_location: string
          total_price_mxn: number
          trip_type: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          airline: string
          created_at?: string
          date: string
          email?: string | null
          flight_number: string
          from_location: string
          full_name: string
          id?: string
          notes?: string | null
          passengers: number
          return_date?: string | null
          return_flight_number?: string | null
          return_time?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id: string
          time: string
          to_location: string
          total_price_mxn: number
          trip_type?: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          airline?: string
          created_at?: string
          date?: string
          email?: string | null
          flight_number?: string
          from_location?: string
          full_name?: string
          id?: string
          notes?: string | null
          passengers?: number
          return_date?: string | null
          return_flight_number?: string | null
          return_time?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string
          time?: string
          to_location?: string
          total_price_mxn?: number
          trip_type?: string
          updated_at?: string
          whatsapp?: string
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
      yacht_bookings: {
        Row: {
          confirmation_number: string
          created_at: string
          duration: string | null
          guest_email: string
          guest_name: string
          guest_phone: string | null
          guests: number | null
          id: string
          requested_date: string | null
          special_requests: string | null
          status: string
          updated_at: string
          yacht_name: string
          yacht_size: string
        }
        Insert: {
          confirmation_number?: string
          created_at?: string
          duration?: string | null
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          guests?: number | null
          id?: string
          requested_date?: string | null
          special_requests?: string | null
          status?: string
          updated_at?: string
          yacht_name: string
          yacht_size: string
        }
        Update: {
          confirmation_number?: string
          created_at?: string
          duration?: string | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          guests?: number | null
          id?: string
          requested_date?: string | null
          special_requests?: string | null
          status?: string
          updated_at?: string
          yacht_name?: string
          yacht_size?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_shared_cart: {
        Args: { _cart_json: Json; _total_usd: number }
        Returns: string
      }
      get_property_blocked_dates: {
        Args: { p_property_id: string }
        Returns: {
          check_in: string
          check_out: string
        }[]
      }
      get_shared_cart: {
        Args: { _id: string }
        Returns: {
          cart_json: Json
          expires_at: string
          used_at: string
        }[]
      }
      grant_admin_by_email: { Args: { _email: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      mark_shared_cart_used: { Args: { _id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
