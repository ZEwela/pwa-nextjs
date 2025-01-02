import { useState, useEffect } from "react";
import { createClient } from "@/utilis/supabase/client";
import { Event } from "@/types/event";

export function useEvents(
  search: string,
  selectedType: string,
  selectedArea: string
) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        let query = (await supabase)
          .from("events")
          .select("*")
          .gte("date", new Date().toISOString().split("T")[0])
          .order("date", { ascending: true });

        if (selectedType) {
          query = query.eq("type", selectedType);
        }
        if (selectedArea) {
          query = query.eq("area", selectedArea);
        }
        if (search) {
          query = query.or(
            `title.ilike.%${search}%,description.ilike.%${search}%`
          );
        }

        const { data, error } = await query;

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [search, selectedType, selectedArea]);

  return { events, loading, error };
}
