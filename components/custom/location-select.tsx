import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Import JSON data directly
import countries from "@/components/custom/data/countries.json";
import states from "@/components/custom/data/states.json";

export interface Timezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}

export interface CountryProps {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  region_id: string;
  subregion: string;
  subregion_id: string;
  nationality: string;
  timezones: Timezone[];
  translations: Record<string, string>;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
}

export interface StateProps {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  state_code: string;
  type: string | null;
  latitude: string;
  longitude: string;
}

interface LocationSelectorProps {
  disabled?: boolean;
  onCountryChange?: (country: CountryProps | null) => void;
  onStateChange?: (state: StateProps | null) => void;
  defaultCountry?: CountryProps | string | null;
  defaultState?: StateProps | string | null;
}

const LocationSelector = ({
  disabled,
  onCountryChange,
  onStateChange,
  defaultCountry = null,
  defaultState = null,
}: LocationSelectorProps) => {
  // Cast imported JSON data to their respective types
  const countriesData = countries as CountryProps[];
  const statesData = states as StateProps[];

  // Helper function to find country by name or return the object if it's already a CountryProps
  const findCountry = (countryInput: CountryProps | string | null): CountryProps | null => {
    if (!countryInput) return null;
    if (typeof countryInput === 'string') {
      return countriesData.find(c => c.name.toLowerCase() === countryInput.toLowerCase()) || null;
    }
    return countryInput;
  };

  // Helper function to find state by name or return the object if it's already a StateProps
  const findState = (stateInput: StateProps | string | null, countryId?: number): StateProps | null => {
    if (!stateInput) return null;
    if (typeof stateInput === 'string') {
      const statesByName = statesData.filter(s => s.name.toLowerCase() === stateInput.toLowerCase());
      if (countryId) {
        return statesByName.find(s => s.country_id === countryId) || null;
      }
      return statesByName[0] || null;
    }
    return stateInput;
  };

  const [selectedCountry, setSelectedCountry] = useState<CountryProps | null>(() => 
    findCountry(defaultCountry)
  );
  const [selectedState, setSelectedState] = useState<StateProps | null>(() => 
    findState(defaultState, findCountry(defaultCountry)?.id)
  );
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [openStateDropdown, setOpenStateDropdown] = useState(false);

  // Update internal state when default props change
  useEffect(() => {
    const country = findCountry(defaultCountry);
    setSelectedCountry(country);
    
    // If country changed, reset state or try to find matching state
    const state = findState(defaultState, country?.id);
    setSelectedState(state);
  }, [defaultCountry, defaultState]);

  // Filter states for selected country
  const availableStates = statesData.filter(
    (state) => state.country_id === selectedCountry?.id
  );

  const handleCountrySelect = (country: CountryProps | null) => {
    setSelectedCountry(country);
    setSelectedState(null); // Reset state when country changes
    onCountryChange?.(country);
    onStateChange?.(null);
  };

  const handleStateSelect = (state: StateProps | null) => {
    setSelectedState(state);
    onStateChange?.(state);
  };

  return (
    <div className={`grid gap-4 ${availableStates.length > 0 ? "grid-cols-2" : "grid-cols-1"}`}>
      {/* Country Selector */}
      <Popover open={openCountryDropdown} onOpenChange={setOpenCountryDropdown}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCountryDropdown}
            disabled={disabled}
            className="w-full justify-between h-10"
          >
            {selectedCountry ? (
              <div className="flex items-center gap-2">
                <span>{selectedCountry.emoji}</span>
                <span>{selectedCountry.name}</span>
              </div>
            ) : (
              <span>Select Country...</span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <ScrollArea className="h-72">
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countriesData.map((country) => (
                    <CommandItem
                      key={country.id}
                      value={country.name}
                      onSelect={() => {
                        handleCountrySelect(country);
                        setOpenCountryDropdown(false);
                      }}
                      className="flex cursor-pointer items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span>{country.emoji}</span>
                        <span>{country.name}</span>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedCountry?.id === country.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* State Selector - Only shown if selected country has states */}
      {availableStates.length > 0 && (
        <Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStateDropdown}
              disabled={!selectedCountry}
              className="w-full justify-between h-10"
            >
              {selectedState ? (
                <span>{selectedState.name}</span>
              ) : (
                <span>Select State...</span>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search state..." />
              <CommandList>
                <ScrollArea className="h-72">
                  <CommandEmpty>No state found.</CommandEmpty>
                  <CommandGroup>
                    {availableStates.map((state) => (
                      <CommandItem
                        key={state.id}
                        value={state.name}
                        onSelect={() => {
                          handleStateSelect(state);
                          setOpenStateDropdown(false);
                        }}
                        className="flex cursor-pointer items-center justify-between text-sm"
                      >
                        <span>{state.name}</span>
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedState?.id === state.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default LocationSelector;
