import React from "react";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center mb-5">
          <Icon className="w-7 h-7 text-[#6B6B6B]" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#6B6B6B] max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}