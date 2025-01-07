'use client';
import { useState } from 'react';
import { InstallPrompt } from '../components/InstallPrompt';
import { useEvents } from '@/hooks/useEvents';
import { LoadingSpinner } from '@/components/loading-spinner';
import { EventCard } from '@/components/event-card';
import { EventFilters } from '@/components/event-filters';

export default function Home() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const { events, loading, error } = useEvents(
    search,
    selectedType,
    selectedArea,
  );

  return (
    <div className="flex flex-grow flex-col gap-16 p-8 pb-20 sm:p-20">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
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
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-lg text-gray-500">
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
