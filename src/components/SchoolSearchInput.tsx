'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Building2, Check, X, ChevronDown, Sparkles, MapPin, Hash, Edit3 } from 'lucide-react';

export interface UKSchoolRecord {
  urn: string;
  name: string;
  phase?: string;
  type?: string;
  local_authority?: string;
  address_line1?: string;
  address_line2?: string;
  town_city?: string;
  postcode?: string;
  phone?: string;
  headteacher_name?: string;
  headteacher_email?: string;
  office_email?: string;
}

interface SchoolSearchInputProps {
  onSelectSchool: (school: UKSchoolRecord) => void;
  selectedSchoolName?: string;
  placeholder?: string;
  allowManualEntry?: boolean;
  onToggleManual?: (isManual: boolean) => void;
  isManualMode?: boolean;
}

export default function SchoolSearchInput({
  onSelectSchool,
  selectedSchoolName = '',
  placeholder = 'Search by school name, postcode (e.g. W8), or DfE URN...',
  allowManualEntry = true,
  onToggleManual,
  isManualMode = false,
}: SchoolSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<UKSchoolRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<string>(selectedSchoolName);
  const [manual, setManual] = useState(isManualMode);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync selectedSchoolName
  useEffect(() => {
    if (selectedSchoolName) {
      setSelected(selectedSchoolName);
    }
  }, [selectedSchoolName]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (manual) return;
    const handler = setTimeout(() => {
      fetchSchools(searchTerm);
    }, 220);

    return () => clearTimeout(handler);
  }, [searchTerm, manual]);

  const fetchSchools = async (q: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/schools/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success && data.schools) {
        setResults(data.schools);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (school: UKSchoolRecord) => {
    setSelected(school.name);
    setSearchTerm('');
    setIsOpen(false);
    onSelectSchool(school);
  };

  const handleEnableManual = () => {
    setManual(true);
    setSelected('');
    setIsOpen(false);
    if (onToggleManual) onToggleManual(true);
  };

  const handleSwitchToSearch = () => {
    setManual(false);
    if (onToggleManual) onToggleManual(false);
  };

  if (manual) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-500 font-medium">Entering school details manually</span>
          <button
            type="button"
            onClick={handleSwitchToSearch}
            className="text-[#096556] hover:underline font-semibold flex items-center gap-1"
          >
            <Search className="w-3 h-3" /> Search UK Schools Directory Instead
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Selected Card View */}
      {selected ? (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#096556] text-white flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0c2340] leading-snug">{selected}</p>
              <p className="text-[11px] text-emerald-800">Verified from UK Government GIAS Directory</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelected('');
              setSearchTerm('');
              setIsOpen(true);
            }}
            className="text-xs font-semibold text-[#096556] hover:text-[#075145] hover:underline px-2.5 py-1 rounded-lg border border-emerald-300 bg-white shadow-2xs flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" /> Change
          </button>
        </div>
      ) : (
        /* Search Input */
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#096556] bg-stone-50/50 shadow-2xs placeholder:text-stone-400"
          />

          {isLoading ? (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
              <div className="w-4 h-4 border-2 border-[#096556] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : searchTerm ? (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setIsOpen(true);
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && !selected && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden max-h-80 flex flex-col">
          <div className="p-2.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-semibold px-4">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#096556]" />
              {searchTerm ? `Results matching "${searchTerm}"` : 'Pre-populated UK Educational Institutions'}
            </span>
            <span>{results.length} found</span>
          </div>

          <div className="overflow-y-auto divide-y divide-stone-100">
            {results.length === 0 && !isLoading ? (
              <div className="p-6 text-center text-xs text-stone-500">
                <p>No educational institutions found matching &ldquo;{searchTerm}&rdquo;</p>
                {allowManualEntry && (
                  <button
                    type="button"
                    onClick={handleEnableManual}
                    className="mt-3 px-4 py-2 rounded-full bg-[#f0faf7] border border-[#c6eee3] text-[#096556] font-bold text-xs hover:bg-[#e0f5ef] transition-colors"
                  >
                    + Enter School Manually (Other)
                  </button>
                )}
              </div>
            ) : (
              results.map((school) => {
                const isIndependent = school.type?.toLowerCase().includes('independent');
                const isGrammar = school.type?.toLowerCase().includes('grammar');
                const isAcademy = school.type?.toLowerCase().includes('academy');

                return (
                  <button
                    key={school.urn}
                    type="button"
                    onClick={() => handleSelect(school)}
                    className="w-full text-left p-3.5 hover:bg-emerald-50/50 transition-colors flex items-start justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-[#0c2340] group-hover:text-[#096556] transition-colors">
                          {school.name}
                        </span>
                        {school.phase && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold">
                            {school.phase}
                          </span>
                        )}
                        {isGrammar ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                            Grammar
                          </span>
                        ) : isIndependent ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-semibold">
                            Independent / Private
                          </span>
                        ) : isAcademy ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-[#096556] border border-teal-200 font-semibold">
                            Academy
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                            {school.type || 'Maintained'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          {school.address_line1 ? `${school.address_line1}, ` : ''}{school.town_city} {school.postcode}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-stone-400">URN: {school.urn}</span>
                      </div>
                    </div>

                    <span className="text-xs text-[#096556] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                      Select &rarr;
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {allowManualEntry && (
            <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs px-4">
              <span className="text-stone-500">Can&apos;t find your school?</span>
              <button
                type="button"
                onClick={handleEnableManual}
                className="text-[#096556] hover:underline font-bold"
              >
                Enter School Manually (Other) &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
