import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Event } from "../types/event";
import Image from "next/image";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <Image
        src={event.image}
        alt={event.title}
        className="w-full h-48 object-cover"
        width={500}
        height={300}
        priority
      />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium
            ${
              event.type === "exhibition"
                ? "bg-blue-100 text-blue-800"
                : event.type === "performance"
                ? "bg-purple-100 text-purple-800"
                : event.type === "opening"
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={18} />
            <span>
              {event.venue} - {event.area}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={18} />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={18} />
            <span>{event.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
