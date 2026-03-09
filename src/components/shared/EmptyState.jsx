import React from "react";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mb-5">
          <Icon className="w-7 h-7 text-stone-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-stone-800 mb-2">{title}</h3>
      {description && <p className="text-sm text-stone-400 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}