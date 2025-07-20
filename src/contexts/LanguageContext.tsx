
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { translateUi } from '@/ai/flows/translate-ui';

// Define the structure of your translations
type Translations = { [key: string]: string };

// Define the default English translations
const defaultTranslations: Translations = {
  // Nav Bar
  nav_home: 'Home',
  nav_dashboard: 'Dashboard',
  nav_irrigation_planner: 'Irrigation Planner',
  nav_crop_advisor: 'Crop Advisor',
  nav_soil_advisor: 'Soil Advisor',
  nav_govt_schemes: 'Govt. Schemes',
  nav_about_us: 'About Us',
  nav_contact_us: 'Contact Us',
  dropdown_overview: 'Overview',
  dropdown_analytics: 'Analytics',
  dropdown_new_schedule: 'New Schedule',
  dropdown_history: 'History',
  dropdown_get_suggestion: 'Get Suggestion',
  dropdown_my_crops: 'My Crops',
  dropdown_check_health: 'Check Health',
  dropdown_improvements: 'Improvements',
  dropdown_find_schemes: 'Find Schemes',
  dropdown_my_applications: 'My Applications',

  // Hero Page
  hero_title: 'Revolutionizing Agriculture with AI',
  hero_subtitle: 'JalSevak provides data-driven insights to help Indian farmers optimize irrigation, improve crop yield, and increase profitability. Sustainable farming starts here.',
  hero_cta_primary: 'Go to Dashboard',
  hero_cta_secondary: 'Learn More',

  // About Page
  about_title: 'About JalSevak',
  about_subtitle: 'Empowering Indian farmers with data-driven insights for a sustainable future.',
  our_mission_title: 'Our Mission',
  our_mission_desc: 'To revolutionize agriculture in India by providing accessible, AI-powered tools that optimize resource usage, improve crop yields, and enhance the livelihoods of farmers.',
  our_vision_title: 'Our Vision',
  our_vision_desc: 'We envision a future where every farmer in India has the power of data and technology at their fingertips, leading to a prosperous, sustainable, and food-secure nation.',
  meet_team_title: 'Meet the Team',
  meet_team_subtitle: 'The passionate minds behind JalSevak.',
  team_member_1_name: 'Dr. Aris',
  team_member_1_role: 'Lead Agronomist',
  team_member_2_name: 'Priya Singh',
  team_member_2_role: 'AI & Data Scientist',
  team_member_3_name: 'Rohan Kumar',
  team_member_3_role: 'Lead Engineer',
  team_member_4_name: 'Anjali Desai',
  team_member_4_role: 'UX/UI Designer',

  // Contact Us Page
  contact_us_title: 'Contact Us',
  contact_us_subtitle: "We'd love to hear from you! Whether you have a question about our features, pricing, or anything else, our team is ready to answer all your questions.",
  contact_info_title: 'Contact Information',
  contact_info_desc: 'Get in touch with us through the following channels.',
  contact_email_title: 'Email',
  contact_phone_title: 'Phone',
  contact_address_title: 'Office Address',
  contact_address_value: '123 Agri-Tech Avenue, Green Valley, Bangalore, Karnataka 560001',
  contact_form_title: 'Send us a Message',
  contact_form_desc: "Fill out the form and we'll get back to you shortly.",
  form_name: 'Your Name',
  form_name_placeholder: 'Enter your full name',
  form_email: 'Your Email',
  form_email_placeholder: 'Enter your email address',
  form_subject: 'Subject',
  form_subject_placeholder: 'How can we help you?',
  form_message: 'Your Message',
  form_message_placeholder: 'Type your message here...',
  send_message_button: 'Send Message',
  
  // Dashboard
  next_irrigation: 'Next Irrigation',
  in_time_prefix: 'in',
  time_hour: 'hour',
  time_hours: 'hours',
  time_minute: 'minute',
  time_minutes: 'minutes',
  time_now: 'now',
  latest_schemes: 'Latest Schemes',
  scheme_pm_kisan_title: 'PM-KISAN',
  scheme_pm_kisan_desc: 'Income support for small farmers.',
  scheme_fasal_bima_title: 'Fasal Bima Yojana',
  scheme_fasal_bima_desc: 'Crop insurance against yield loss.',
  current_weather: 'Current Weather',
  current_location: 'Current Location',
  unknown_location: 'Unknown Location',
  could_not_fetch_location: 'Could not fetch location',
  weather_temperature: 'Temperature',
  weather_rain_chance: 'Rain Chance',
  weather_humidity: 'Humidity',
  weather_wind: 'Wind',
  weather_could_not_load: 'Could not load weather data.',
  forecast_title: '5-Day Forecast',
  forecast_not_available: 'Forecast not available.',
  latest_prices_title: 'Latest Prices',
  latest_prices_description: 'Govt. MSP vs. Local Vendor Price.',
  price_msp: 'MSP',
  price_local: 'Local',
  price_comparison_title: 'Crop Price Comparison',
  price_comparison_description: 'Govt. MSP vs. Local Vendor Price (₹ per Quintal).',
  price_search_crop_placeholder: 'Search Crop',
  price_msp_full: 'Govt. MSP',
  price_local_full: 'Local Vendor',
  price_analysis_title: 'Price Analysis',
  price_analysis_description: "AI-powered insights on the selected crop's price trends.",
  price_last_year_msp: 'Last Year MSP',
  price_current_msp: 'Current MSP',
  price_local_price: 'Local Price',
  price_analysis_select_crop_prompt: 'Select a crop to see price analysis.',
  wheat: 'Wheat',
  rice: 'Rice',
  cotton: 'Cotton',
  mustard: 'Mustard',
  gram: 'Gram',
  overall: 'Overall',
  maize: 'Maize',
  sugarcane: 'Sugarcane',
  soybean: 'Soybean',
  groundnut: 'Groundnut',
  potato: 'Potato',
  onion: 'Onion',
  tomato: 'Tomato',
  mango: 'Mango',
  banana: 'Banana',
  pulses: 'Pulses',
  jute: 'Jute',
  tea: 'Tea',
  coffee: 'Coffee',
  millet: 'Millet',
  barley: 'Barley',
  lentil: 'Lentil',
  sorghum: 'Sorghum',
  bajra: 'Bajra',
  turmeric: 'Turmeric',
  ginger: 'Ginger',
  chilli: 'Chilli',
  capsicum: 'Capsicum',
  brinjal: 'Brinjal',
  okra: 'Okra',
  cabbage: 'Cabbage',
  cauliflower: 'Cauliflower',
  grapes: 'Grapes',
  apple: 'Apple',
  pomegranate: 'Pomegranate',
  guava: 'Guava',
  papaya: 'Papaya',


  // Crop Advisor
  crop_advisor_title: 'Crop Advisor',
  crop_advisor_description: 'Get AI-powered crop recommendations tailored to your farm.',
  form_location: 'Your Location',
  form_location_placeholder: 'e.g., Village, State',
  get_current_location_label: 'Get current location',
  form_farm_area: 'Farm Area (acres)',
  form_soil_type: 'Soil Type',
  form_soil_type_placeholder: 'Select soil',
  soil_loamy: 'Loamy',
  soil_clay: 'Clay',
  soil_sandy: 'Sandy',
  soil_alluvial: 'Alluvial',
  soil_black: 'Black Soil (Regur)',
  soil_red_yellow: 'Red and Yellow Soil',
  soil_laterite: 'Laterite Soil',
  form_water_availability: 'Water Availability',
  form_water_availability_placeholder: 'Select water availability',
  water_abundant: 'Abundant (Canal, River)',
  water_moderate: 'Moderate (Well, Borewell)',
  water_scarce: 'Scarce (Rain-fed)',
  form_primary_goal: 'Primary Goal',
  form_primary_goal_placeholder: 'What is your main goal?',
  goal_maximize_profit: 'Maximize Profit',
  goal_drought_resistant: 'Drought Resistant',
  goal_low_maintenance: 'Low Maintenance',
  goal_improve_soil: 'Improve Soil Health',
  form_crop_usage: 'Primary Crop Usage',
  form_crop_usage_placeholder: 'How will the crops be used?',
  usage_personal: 'Personal Use (Subsistence)',
  usage_local_market: 'Sell in Local Market',
  usage_commercial: 'Commercial Farming',
  get_recommendations_button: 'Get Recommendations',
  loading_analyzing_farm: 'Analyzing your farm...',
  loading_finding_crops: 'Our AI is finding the best crops for you.',
  results_top_recommendations: 'Top Crop Recommendations',
  results_why_suggested: 'Why we suggest this crop:',
  results_land_tip: 'Land Allocation Tip',
  results_profit_potential: 'Profit Potential',
  results_water_needs: 'Water Needs',
  results_growing_season: 'Growing Season',
  results_no_recommendations_title: 'No Specific Recommendations Found',
  results_no_recommendations_description: "We couldn't generate specific recommendations based on your inputs. Please try different criteria.",

  // Soil Advisor
  soil_advisor_title: 'Soil Quality Advisor',
  soil_advisor_description: "Get AI advice on improving your soil's health based on its history.",
  form_soil_type_determining: 'Determining soil type...',
  form_past_crops: 'Past Crop History',
  form_past_crops_placeholder: 'Selected crops appear here',
  form_past_crops_search_placeholder: 'Search and add a crop...',
  form_past_crops_description: 'List crops from the last 2-3 seasons.',
  form_primary_goal_soil: 'Primary Goal for Soil',
  form_primary_goal_soil_placeholder: 'What is your main goal?',
  goal_increase_yield: 'Increase Yield',
  goal_reduce_fertilizer: 'Reduce Fertilizer Cost',
  goal_long_term_sustainability: 'Long-term Sustainability',
  goal_improve_water_retention: 'Improve Water Retention',
  get_soil_advice_button: 'Get Soil Advice',
  loading_analyzing_soil: "Analyzing your soil's history...",
  loading_preparing_soil_recommendations: 'Our AI soil scientist is preparing your recommendations.',
  results_soil_health_analysis: 'Initial Soil Health Analysis',
  results_improvement_recommendations: 'Improvement Recommendations',
  results_what_to_do: 'What to do:',
  results_how_to_implement: 'How to implement:',
  results_why_important: "Why it's important (Benefits):",
  error_unexpected: 'An unexpected error occurred.',

  // Irrigation Planner
  irrigation_planner_title: 'Plan Your Irrigation',
  irrigation_planner_description: 'Enter your farm\'s details to get a smart, dynamic irrigation schedule.',
  form_crop_type: 'Crop Type',
  form_crop_type_placeholder: 'e.g., Wheat, Rice',
  form_water_source: 'Water Source',
  form_water_source_placeholder: 'Select a water source',
  water_source_canal: 'Canal',
  water_source_well: 'Well',
  water_source_borewell: 'Borewell',
  water_source_river: 'River',
  water_source_rainwater: 'Rainwater Harvesting',
  get_schedule_button: 'Get Schedule',
  loading_analyzing_farm_data: 'Analyzing your farm data...',
  loading_preparing_plan: 'Our AI is preparing your custom irrigation plan.',
  results_recommended_schedule: 'Recommended Schedule',
  results_schedule: 'Schedule',
  results_best_time: 'Best Time to Irrigate',
  results_precautions: 'Precautions',
  results_pesticides: 'Pesticide Recommendations',
  results_justification: 'Justification',
  error_fetching_location_weather: 'Could not fetch location or weather data. Please enter manually.',
  error_weather_data_not_available: 'Weather and soil data is not available yet. Please wait a moment and try again.',

  // Scheme Finder
  scheme_finder_title: 'Find Government Schemes',
  scheme_finder_description: 'Discover subsidies and schemes you are eligible for.',
  form_primary_crop: 'Primary Crop',
  form_land_area: 'Land Area (acres)',
  find_schemes_button: 'Find Schemes',
  loading_finding_schemes: 'Finding relevant schemes...',
  loading_searching_programs: 'Our AI is searching for programs tailored to your needs.',
  results_suggested_schemes: 'Suggested Schemes for You',
  results_description: 'Description',
  results_eligibility: 'Eligibility',
  results_benefits: 'Benefits',
  results_how_to_apply: 'How to Apply',
  results_no_schemes_title: 'No Schemes Found',
  results_no_schemes_description: "We couldn't find any specific government schemes based on the information you provided. Please try adjusting your search criteria.",
};


// Define the context shape
interface LanguageContextType {
  language: string;
  translations: Translations;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  loading: boolean;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to chunk an object into smaller objects
function chunkObject<T extends {}>(obj: T, size: number): Partial<T>[] {
  const keys = Object.keys(obj) as (keyof T)[];
  const chunks: Partial<T>[] = [];
  for (let i = 0; i < keys.length; i += size) {
    const chunkKeys = keys.slice(i, i + size);
    const chunk: Partial<T> = {};
    for (const key of chunkKeys) {
      chunk[key] = obj[key];
    }
    chunks.push(chunk);
  }
  return chunks;
}


// Create the provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('English');
  const [translations, setTranslations] = useState<Translations>(defaultTranslations);
  const [loading, setLoading] = useState(false);

  const setLanguage = useCallback(async (lang: string) => {
    if (lang === 'English') {
      setTranslations(defaultTranslations);
      setLanguageState(lang);
      return;
    }
    setLoading(true);
    setLanguageState(lang);
    try {
      // Chunk the translations object into smaller pieces
      const translationChunks = chunkObject(defaultTranslations, 50);
      
      const promises = translationChunks.map(chunk => 
        translateUi({ texts: chunk as Translations, language: lang })
      );

      const results = await Promise.all(promises);
      
      // Merge the results from all chunks
      const finalTranslations = results.reduce((acc, current) => {
        return { ...acc, ...current };
      }, {});

      setTranslations(finalTranslations);
    } catch (error) {
      console.error('Translation failed:', error);
      // Fallback to default if translation fails
      setTranslations(defaultTranslations);
    } finally {
      setLoading(false);
    }
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key] || defaultTranslations[key] || key;
  }, [translations]);

  const value = { language, translations, setLanguage, t, loading };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a custom hook for using the context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
