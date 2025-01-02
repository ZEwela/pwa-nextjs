"use client";
import { useState } from "react";
import { InstallPrompt } from "../components/InstallPrompt";
import { useEvents } from "@/hooks/useEvents";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EventCard } from "@/components/event-card";
import { EventFilters } from "@/components/event-filters";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  const { events, loading, error } = useEvents(
    search,
    selectedType,
    selectedArea
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px]  min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <EventFilters
            search={search}
            setSearch={setSearch}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
          />
        </div>

        <div className="lg:col-span-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No events found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <InstallPrompt />
    </div>
  );
}
