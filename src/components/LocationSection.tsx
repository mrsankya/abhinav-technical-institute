import React from 'react';
import { Language, getTranslation } from '../translations/translations';

interface LocationSectionProps {
  language: Language;
  onOpenContactModal: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  language,
  onOpenContactModal,
}) => {
  const t = (key: string) => getTranslation(key, language);
  const mapsUrl = 'https://www.google.com/maps/place/Abhinav+Technical+Institute/@21.0173324,75.5636206,19z/data=!4m6!3m5!1s0x3bd90fa2e88aa277:0x7afc00903a74ff53!8m2!3d21.0173324!4d75.5642643!16s%2Fg%2F11b8vf3q30';
  const iframeSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d885.0260476088392!2d75.56362056956677!3d21.017332398789332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd90fa2e88aa277%3A0x7afc00903a74ff53!2sAbhinav%20Technical%20Institute!5e1!3m2!1sen!2sus!4v1788375445306!5m2!1sen!2sus';

  return (
    <section id="location" className="px-4 md:px-6 max-w-[1200px] mx-auto mb-16 py-8 bg-white">
      {/* Section Header */}
      <div className="text-center mb-8 md:mb-10">
        <h2 className="font-['Manrope'] text-2xl sm:text-3xl md:text-4xl text-[#002760] font-extrabold mb-3">
          {t('location.title')}
        </h2>
        <div className="w-12 h-1 bg-[#FFD21F] mx-auto rounded-full mb-4" />
        <p className="font-['Work_Sans'] text-sm md:text-base text-[#172033]/70 max-w-2xl mx-auto leading-relaxed">
          {t('location.subtitle')}
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {/* Live Embedded Map Container */}
        <div className="relative w-full h-[300px] sm:h-[360px] md:h-[420px] rounded-[24px] overflow-hidden border-2 border-[#E6ECF3] shadow-lg group bg-[#F4F8FD]">
          <iframe
            title="Abhinav Technical Institute Map Location"
            src={iframeSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full"
          />

          {/* Floating Action Button */}
          <div className="absolute bottom-4 right-4 z-10">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#002760] hover:bg-[#1557C0] text-white font-['Work_Sans'] font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-2xl hover:scale-105 transition-all text-xs sm:text-sm"
            >
              <span className="material-symbols-outlined text-base">directions</span>
              {t('location.mapBtn')}
            </a>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-md border border-[#E6ECF3]">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-full border-2 border-[#002760] flex items-center justify-center p-1 bg-[#F4F8FD]">
              <span className="material-symbols-outlined text-[#002760] text-2xl">school</span>
            </div>
            <div className="flex flex-col">
              <span className="font-['Manrope'] text-lg sm:text-xl font-extrabold text-[#002760] leading-none mb-1">
                ABHINAV
              </span>
              <span className="font-['Manrope'] text-[10px] sm:text-xs font-bold text-[#002760] tracking-widest uppercase">
                TECHNICAL INSTITUTE JALGAON
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#F4F8FD] flex items-center justify-center shrink-0 text-[#1557C0]">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <p className="text-sm md:text-base text-[#172033]/85 leading-relaxed pt-1.5 font-medium">
                {t('location.addressVal')}
              </p>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#F4F8FD] flex items-center justify-center shrink-0 text-[#1557C0]">
                <span className="material-symbols-outlined">call</span>
              </div>
              <a
                href="tel:+919423488174"
                className="text-sm md:text-base font-bold text-[#002760] hover:text-[#1557C0] transition-colors"
              >
                {t('location.helplineVal')}
              </a>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#F4F8FD] flex items-center justify-center shrink-0 text-[#1557C0]">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <p className="text-sm md:text-base text-[#172033]/85">
                <span className="text-green-600 font-bold">{t('location.hoursLabel')}:</span> {t('location.hoursVal')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-[#002760] hover:bg-[#1557C0] text-white font-['Work_Sans'] font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors text-center text-sm"
            >
              {t('location.mapBtn')}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
            <button
              onClick={onOpenContactModal}
              className="flex-1 bg-white border border-[#1557C0] text-[#1557C0] font-['Work_Sans'] font-semibold py-3.5 px-4 rounded-xl hover:bg-[#1557C0]/5 transition-colors text-sm cursor-pointer"
            >
              {t('nav.quickEnquiry')}
            </button>
          </div>

          {/* Location Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#E6ECF3]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F4F8FD] flex items-center justify-center shrink-0 text-[#1557C0]">
                <span className="material-symbols-outlined text-base">train</span>
              </div>
              <span className="text-xs font-medium text-[#172033]/80">Near Railway Station</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F4F8FD] flex items-center justify-center shrink-0 text-[#1557C0]">
                <span className="material-symbols-outlined text-base">storefront</span>
              </div>
              <span className="text-xs font-medium text-[#172033]/80">In Mansing Market</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F4F8FD] flex items-center justify-center shrink-0 text-[#1557C0]">
                <span className="material-symbols-outlined text-base">directions_walk</span>
              </div>
              <span className="text-xs font-medium text-[#172033]/80">Easy to Reach</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F4F8FD] flex items-center justify-center shrink-0 text-[#1557C0]">
                <span className="material-symbols-outlined text-base">local_parking</span>
              </div>
              <span className="text-xs font-medium text-[#172033]/80">Parking Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
