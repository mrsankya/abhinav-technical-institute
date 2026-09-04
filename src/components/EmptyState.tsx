import React from 'react';
import type { Language } from '../translations/translations';

interface EmptyStateProps {
  icon?: string;
  title: string;
  titleMr?: string;
  description: string;
  descriptionMr?: string;
  language: Language;
  primaryActionLabel?: string;
  primaryActionLabelMr?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionLabelMr?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'search_off',
  title,
  titleMr,
  description,
  descriptionMr,
  language,
  primaryActionLabel,
  primaryActionLabelMr,
  onPrimaryAction,
  secondaryActionLabel,
  secondaryActionLabelMr,
  onSecondaryAction,
  className = '',
}) => {
  const displayTitle = language === 'mr' && titleMr ? titleMr : title;
  const displayDesc = language === 'mr' && descriptionMr ? descriptionMr : description;
  const primaryLabel = language === 'mr' && primaryActionLabelMr ? primaryActionLabelMr : primaryActionLabel;
  const secondaryLabel = language === 'mr' && secondaryActionLabelMr ? secondaryActionLabelMr : secondaryActionLabel;

  return (
    <div
      className={`bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-dashed border-[#CBD5E1] shadow-xs max-w-xl mx-auto my-6 space-y-4 animate-fadeIn ${className}`}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F4F8FD] text-[#1557C0] rounded-full flex items-center justify-center mx-auto border-2 border-[#E2E8F0] shadow-xs">
        <span className="material-symbols-outlined text-3xl sm:text-4xl">{icon}</span>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-['Manrope'] text-lg sm:text-xl font-extrabold text-[#002760]">
          {displayTitle}
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-md mx-auto">
          {displayDesc}
        </p>
      </div>

      {(onPrimaryAction || onSecondaryAction) && (
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {onPrimaryAction && primaryLabel && (
            <button
              onClick={onPrimaryAction}
              className="px-5 py-2.5 bg-[#002760] hover:bg-[#1557C0] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>{primaryLabel}</span>
            </button>
          )}

          {onSecondaryAction && secondaryLabel && (
            <button
              onClick={onSecondaryAction}
              className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#002760] text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 border border-[#CBD5E1]"
            >
              <span>{secondaryLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
