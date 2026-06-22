"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Languages, 
  BookOpen, 
  Camera, 
  Compass, 
  Mic, 
  MicOff,
  Volume2, 
  Settings as SettingsIcon, 
  History as HistoryIcon,
  ChevronRight, 
  Upload, 
  Plus, 
  Sparkles, 
  ArrowRight,
  BookOpenCheck,
  CheckCircle,
  FileText,
  HelpCircle,
  UserCheck,
  LogOut,
  RefreshCw
} from "lucide-react";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const BACKEND_URL = "http://localhost:8000";

const LANGUAGES = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada", 
  "Malayalam", "Bengali", "Marathi", "Gujarati", "Punjabi", "Odia"
];

const PERSONAS = [
  { id: "general", label: "General", desc: "Simple practical explanation" },
  { id: "child", label: "Child", desc: "Explain like a 10-year-old" },
  { id: "student", label: "Student", desc: "Examples and learning support" },
  { id: "senior", label: "Senior Citizen", desc: "Slow and conversational" }
];

const CAREER_SUGGESTIONS = [
  "What jobs will be important in 2030?",
  "Career pathways in Renewable Energy",
  "How to become a Robotics Technician?",
  "Emerging careers in AI and Space Technology",
  "Cybersecurity skills in demand"
];

// Multilingual UI Translation Dictionary
const TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    subtitle: "Understand Anything. In Any Indian Language.",
    tab_translate: "Translate",
    tab_explain: "Explain",
    tab_scan: "Scan",
    tab_career: "Careers",
    tab_history: "History",
    tab_settings: "Settings",
    label_my_language: "App Language / मेरी भाषा",
    label_persona: "Explanation Persona",
    translate_title: "Translate & Voice Assistant",
    explain_title: "Simplify Notice or Document",
    scan_title: "Scan & Understand Documents",
    career_title: "Emerging Career Guide Agent",
    settings_title: "Preferences & Accessibility",
    history_title: "Interaction History",
    btn_translate_speak: "Translate & Speak",
    btn_explain_simply: "Explain Simply",
    btn_scan_explain: "Scan & Explain",
    placeholder_translate: "Type or click the microphone to speak naturally...",
    placeholder_explain: "Paste a complex notice, message, document text, or official notification here...",
    placeholder_career: "Ask about careers...",
    label_high_contrast: "High Contrast Mode",
    label_font_size: "Display Font Size",
    btn_search: "Search Roadmap",
    label_suggested: "Suggested Queries",
    label_clear: "Clear All",
    label_history_empty: "No history found yet. Start interacting with the assistant!",
    label_accessibility: "Accessibility Layout",
    label_speech_config: "Translation & Speech Configuration",
    label_input_txt: "Input Text / Write or Speak",
    label_output_txt: "Output",
    label_original_summary: "Summary",
    label_action_items: "What you need to do (Action Items)",
    label_direct_translation: "Direct Translation",
    label_extracted_text: "Extracted Text",
    label_scan_empty: "Upload or capture a document to see OCR, translation, explanation, and action items.",
    label_career_empty: "Type an interest or click a suggestion query to see futuristic jobs and study roadmaps.",
    label_career_roadmap: "Learning Roadmap",
    label_career_skills: "Required Skills",
    label_career_resources: "Suggested Free Resources",
    label_voice_rate: "Preferred Voice Readback Rate",
    label_detected_lang: "Detected Source Language"
  },
  Hindi: {
    subtitle: "कुछ भी समझें। किसी भी भारतीय भाषा में।",
    tab_translate: "अनुवाद",
    tab_explain: "सरल करें",
    tab_scan: "स्कैन करें",
    tab_career: "करियर",
    tab_history: "इतिहास",
    tab_settings: "सेटिंग्स",
    label_my_language: "ऐप की भाषा / App Language",
    label_persona: "स्पष्टीकरण का तरीका (Persona)",
    translate_title: "अनुवाद और आवाज सहायक",
    explain_title: "सूचना या दस्तावेज़ को सरल बनाएं",
    scan_title: "दस्तावेज़ स्कैन करें और समझें",
    career_title: "भविष्य करियर गाइड",
    settings_title: "प्राथमिकताएं और सुगमता",
    history_title: "गतिविधि इतिहास",
    btn_translate_speak: "अनुवाद करें और बोलें",
    btn_explain_simply: "सरल भाषा में समझाएं",
    btn_scan_explain: "स्कैन करें और समझाएं",
    placeholder_translate: "लिखें या बोलने के लिए माइक दबाएं...",
    placeholder_explain: "सरकारी सूचना, संदेश, या कोई अन्य कठिन दस्तावेज़ यहाँ पेस्ट करें...",
    placeholder_career: "भविष्य के करियर के बारे में पूछें...",
    label_high_contrast: "हाई कंट्रास्ट मोड",
    label_font_size: "अक्षर का आकार",
    btn_search: "रोडमैप खोजें",
    label_suggested: "सुझाए गए प्रश्न",
    label_clear: "सब साफ़ करें",
    label_history_empty: "अभी तक कोई इतिहास नहीं मिला। बातचीत शुरू करें!",
    label_accessibility: "सुगमता (Accessibility) सेटिंग्स",
    label_speech_config: "अनुवाद और आवाज सेटिंग्स",
    label_input_txt: "इनपुट टेक्स्ट / लिखें या बोलें",
    label_output_txt: "परिणाम",
    label_original_summary: "सारांश (Summary)",
    label_action_items: "आपको क्या करना है (महत्वपूर्ण कार्य)",
    label_direct_translation: "सीधा अनुवाद",
    label_extracted_text: "निकाला गया टेक्स्ट",
    label_scan_empty: "दस्तावेज़ की तस्वीर अपलोड या कैप्चर करें और अपनी भाषा में व्याख्या देखें।",
    label_career_empty: "भविष्य के करियर और पढ़ाई का रोडमैप देखने के लिए कोई रुचि टाइप करें या सुझाव पर क्लिक करें।",
    label_career_roadmap: "पढ़ाई का रोडमैप (कदम दर कदम)",
    label_career_skills: "आवश्यक कौशल (Skills)",
    label_career_resources: "मुफ़्त शिक्षण संसाधन (Resources)",
    label_voice_rate: "आवाज की गति",
    label_detected_lang: "पहचानी गई मूल भाषा"
  },
  Tamil: {
    subtitle: "எதையும் புரிந்து கொள்ளுங்கள். எந்த இந்திய மொழியிலும்.",
    tab_translate: "மொழிபெயர்ப்பு",
    tab_explain: "விளக்கு",
    tab_scan: "ஸ்கேன்",
    tab_career: "தொழில்",
    tab_history: "வரலாறு",
    tab_settings: "அமைப்புகள்",
    label_my_language: "பயன்பாட்டு மொழி / App Language",
    label_persona: "விளக்கத்தின் வகை (Persona)",
    translate_title: "மொழிபெயர்ப்பு & குரல் உதவியாளர்",
    explain_title: "அறிவிப்பு அல்லது ஆவணத்தை எளிதாக்குங்கள்",
    scan_title: "ஆவணங்களை ஸ்கேன் செய்து புரிந்து கொள்ளுங்கள்",
    career_title: "எதிர்கால தொழில் வழிகாட்டி",
    settings_title: "விருப்பங்கள் & அணுகல்தன்மை",
    history_title: "செயல்பாட்டு வரலாறு",
    btn_translate_speak: "மொழிபெயர்த்து பேசு",
    btn_explain_simply: "எளிமையாக விளக்கு",
    btn_scan_explain: "ஸ்கேன் செய்து விளக்கு",
    placeholder_translate: "எழுதவும் அல்லது பேச மைக்ரோஃபோனைக் கிளிக் செய்யவும்...",
    placeholder_explain: "அரசு அறிவிப்பு அல்லது கடினமான ஆவணத்தை இங்கே ஒட்டவும்...",
    placeholder_career: "எதிர்கால தொழில்களைப் பற்றி கேளுங்கள்...",
    label_high_contrast: "உயர் மாறுபாடு பயன்முறை",
    label_font_size: "எழுத்து அளவு",
    btn_search: "வழித்தடத்தைத் தேடு",
    label_suggested: "பரிந்துரைக்கப்பட்ட கேள்விகள்",
    label_clear: "அனைத்தையும் அழி",
    label_history_empty: "வரலாறு எதுவும் இல்லை. உரையாடலைத் தொடங்குங்கள்!",
    label_accessibility: "அணுகல்தன்மை அமைப்புகள்",
    label_speech_config: "மொழிபெயர்ப்பு & குரல் அமைப்புகள்",
    label_input_txt: "உள்ளீட்டு உரை / எழுதவும் அல்லது பேசவும்",
    label_output_txt: "முடிவு",
    label_original_summary: "சுருக்கம்",
    label_action_items: "நீங்கள் செய்ய வேண்டியவை (செயல்பாடுகள்)",
    label_direct_translation: "நேரடி மொழிபெயர்ப்பு",
    label_extracted_text: "பிரித்தெடுக்கப்பட்ட உரை",
    label_scan_empty: "ஆவணத்தை பதிவேற்றவும் அல்லது புகைப்படம் எடுக்கவும்.",
    label_career_empty: "எதிர்கால வேலைகள் மற்றும் படிப்பு வழிகளைப் பார்க்க ஏதேனும் விருப்பத்தைத் தட்டச்சு செய்யவும்.",
    label_career_roadmap: "படிப்பு வழிகாட்டி (படி படியாக)",
    label_career_skills: "தேவைப்படும் திறன்கள்",
    label_career_resources: "இலவச கற்றல் வளங்கள்",
    label_voice_rate: "குரல் வேகம்",
    label_detected_lang: "கண்டறியப்பட்ட மூல மொழி"
  },
  Telugu: {
    subtitle: "ఏదైనా అర్థం చేసుకోండి. ఏ భారతీయ భాషలోనైనా.",
    tab_translate: "అనువాదం",
    tab_explain: "వివరించు",
    tab_scan: "స్కాన్",
    tab_career: "కెరీర్",
    tab_history: "చరిత్ర",
    tab_settings: "సెట్టింగులు",
    label_my_language: "యాప్ భాష / App Language",
    label_persona: "వివరణాత్మక విధానం",
    translate_title: "అనువాదం & వాయిస్ అసిస్టెంట్",
    explain_title: "పత్రాన్ని సులభతరం చేయండి",
    scan_title: "పత్రాలను స్కాన్ చేసి అర్థం చేసుకోండి",
    career_title: "ఉద్భవిస్తున్న కెరీర్ గైడ్",
    settings_title: "ప్రాధాన్యతలు & ప్రాప్యత",
    history_title: "చర్యల చరిత్ర",
    btn_translate_speak: "అనువదించి మాట్లాడు",
    btn_explain_simply: "సులభంగా వివరించు",
    btn_scan_explain: "స్కాన్ చేసి వివరించు",
    placeholder_translate: "టైప్ చేయండి లేదా మాట్లాడటానికి మైక్ క్లిక్ చేయండి...",
    placeholder_explain: "ప్రభుత్వ నోటీసు లేదా కఠినమైన పత్రాన్ని ఇక్కడ పేస్ట్ చేయండి...",
    placeholder_career: "భవిష్యత్తు కెరీర్ల గురించి అడగండి...",
    label_high_contrast: "హై కాంట్రాస్ట్ మోడ్",
    label_font_size: "అక్షరాల పరిమాణం",
    btn_search: "రోడ్‌మ్యాప్ వెతకండి",
    label_suggested: "సూచించబడిన ప్రశ్నలు",
    label_clear: "అన్నీ తొలగించు",
    label_history_empty: "చరిత్ర ఏమీ లేదు. సంభాషణ ప్రారంభించండి!",
    label_accessibility: "యాక్సెసిబిలిటీ సెట్టింగులు",
    label_speech_config: "అనువాద & వాయిస్ సెట్టింగులు",
    label_input_txt: "ఇన్‌పుట్ టెక్స్ట్ / రాయండి లేదా మాట్లాడండి",
    label_output_txt: "ఫలితం",
    label_original_summary: "సారాంశం",
    label_action_items: "మీరు చేయవలసిన పనులు",
    label_direct_translation: "నేరుగా అనువాదం",
    label_extracted_text: "సేకరించిన వచనం",
    label_scan_empty: "పత్రాన్ని స్కాన్ చేసి మీ భాషలో వివరణ పొందండి.",
    label_career_empty: "భవిష్యత్తు కెరీర్లు మరియు అధ్యయన రోడ్‌మ్యాప్‌లను చూడటానికి ఇక్కడ టైప్ చేయండి.",
    label_career_roadmap: "నేర్చుకునే రోడ్‌మ్యాప్ (దశలవారీగా)",
    label_career_skills: "కావలసిన నైపుణ్యాలు",
    label_career_resources: "ఉచిత అభ్యాస వనరులు",
    label_voice_rate: "వాయిస్ వేగం",
    label_detected_lang: "గుర్తించబడిన మూల భాష"
  },
  Kannada: {
    subtitle: "ಏನನ್ನಾದರೂ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಯಾವುದೇ ಭಾರತೀಯ ಭಾಷೆಯಲ್ಲಿ.",
    tab_translate: "ಅನುವಾದ",
    tab_explain: "ವಿವರಿಸಿ",
    tab_scan: "ಸ್ಕ್ಯಾನ್",
    tab_career: "ವೃತ್ತಿಜೀವನ",
    tab_history: "ಇತಿಹಾಸ",
    tab_settings: "ಸಂಯೋಜನೆಗಳು",
    label_my_language: "ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ / App Language",
    label_persona: "ವಿವರಣೆಯ ಶೈಲಿ",
    translate_title: "ಅನುವಾದ ಮತ್ತು ಧ್ವನಿ ಸಹಾಯಕ",
    explain_title: "ನೋಟಿಸ್ ಅಥವಾ ದಾಖಲೆಗಳನ್ನು ಸರಳಗೊಳಿಸಿ",
    scan_title: "ದಾಖಲೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಮತ್ತು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ",
    career_title: "ಉದಯೋನ್ಮುಖ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶಿ",
    settings_title: "ಆದ್ಯತೆಗಳು ಮತ್ತು ಪ್ರವೇಶಸಾಧ್ಯತೆ",
    history_title: "ಚಟುವಟಿಕೆ ಇತಿಹಾಸ",
    btn_translate_speak: "ಅನುವಾದಿಸಿ ಮತ್ತು ಮಾತನಾಡಿ",
    btn_explain_simply: "ಸರಳವಾಗಿ ವಿವರಿಸಿ",
    btn_scan_explain: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ವಿವರಿಸಿ",
    placeholder_translate: "ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಲು ಮೈಕ್ರೊಫೋನ್ ಕ್ಲಿಕ್ ಮಾಡಿ...",
    placeholder_explain: "ಸರ್ಕಾರಿ ನೋಟಿಸ್ ಅಥವಾ ಕಠಿಣ ದಾಖಲೆ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ...",
    placeholder_career: "ಭವಿಷ್ಯದ ವೃತ್ತಿಜೀವನದ ಬಗ್ಗೆ ಕೇಳಿ...",
    label_high_contrast: "ಹೈ ಕಾಂಟ್ರಾಸ್ಟ್ ಮೋಡ್",
    label_font_size: "ಅಕ್ಷರ ಗಾತ್ರ",
    btn_search: "ರೋಡ್‌ಮ್ಯಾಪ್ ಹುಡುಕಿ",
    label_suggested: "ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು",
    label_clear: "ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ",
    label_history_empty: "ಇನ್ನೂ ಯಾವುದೇ ಇತಿಹಾಸವಿಲ್ಲ. ಸಂಭಾಷಣೆ ಪ್ರಾರಂಭಿಸಿ!",
    label_accessibility: "ಅಕ್ಸೆಸಿಬಿಲಿಟಿ ಸೆಟ್ಟಿಂಗ್ಸ್",
    label_speech_config: "ಅನುವಾದ ಮತ್ತು ಧ್ವನಿ ಸೆಟ್ಟಿಂಗ್ಸ್",
    label_input_txt: "ಪಠ್ಯ ಇನ್‌ಪುಟ್ / ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ",
    label_output_txt: "ಫಲಿತಾಂಶ",
    label_original_summary: "ಸಾರಾಂಶ",
    label_action_items: "ನೀವು ಮಾಡಬೇಕಾದ ಕೆಲಸಗಳು",
    label_direct_translation: "ನೇರ ಅನುವಾದ",
    label_extracted_text: "ತೆಗೆಯಲಾದ ಪಠ್ಯ",
    label_scan_empty: "ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸರಳ ವಿವರಣೆ ಪಡೆಯಿರಿ.",
    label_career_empty: "ಭವಿಷ್ಯದ ವೃತ್ತಿಗಳು ಮತ್ತು ಅಧ್ಯಯನ ರೋಡ್‌ಮ್ಯಾಪ್ ನೋಡಲು ಟೈಪ್ ಮಾಡಿ.",
    label_career_roadmap: "ಕಲಿಕೆಯ ರೋಡ್‌ಮ್ಯಾಪ್ (ಹಂತ ಹಂತವಾಗಿ)",
    label_career_skills: "ಅಗತ್ಯ ಕೌಶಲ್ಯಗಳು",
    label_career_resources: "ಉಚಿತ ಕಲಿಕಾ ಸಂಪನ್ಮೂಲಗಳು",
    label_voice_rate: "ಧ್ವನಿಯ ವೇಗ",
    label_detected_lang: "ಪತ್ತೆಯಾದ ಮೂಲ ಭಾಷೆ"
  },
  Malayalam: {
    subtitle: "എന്തും മനസ്സിലാക്കുക. ഏതൊരു ഇന്ത്യൻ ഭാഷയിലും.",
    tab_translate: "തർജ്ജമ",
    tab_explain: "വ്യക്തമാക്കുക",
    tab_scan: "സ്കാൻ",
    tab_career: "കരിയർ",
    tab_history: "ചരിത്രം",
    tab_settings: "ക്രമീകരണങ്ങൾ",
    label_my_language: "ആപ്പ് ഭാഷ / App Language",
    label_persona: "വിശദീകരണ രീതി",
    translate_title: "പരിഭാഷയും വോയ്‌സ് അസിസ്റ്റന്റും",
    explain_title: "രേഖകൾ ലളിതമാക്കുക",
    scan_title: "ഡോക്യുമെന്റുകൾ സ്കാൻ ചെയ്ത് മനസ്സിലാക്കുക",
    career_title: "കരിയർ ഗൈഡ് ഏജന്റ്",
    settings_title: "ക്രമീകരണങ്ങളും ആക്സസിബിലിറ്റിയും",
    history_title: "പ്രവർത്തന ചരിത്രം",
    btn_translate_speak: "പരിഭാഷപ്പെടുത്തി സംസാരിക്കുക",
    btn_explain_simply: "ലളിതമായി വിശദീകരിക്കുക",
    btn_scan_explain: "സ്കാൻ ചെയ്ത് വിശദീകരിക്കുക",
    placeholder_translate: "ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സംസാരിക്കാൻ മൈക്ക് ക്ലിക്ക് ചെയ്യുക...",
    placeholder_explain: "നോട്ടീസോ സങ്കീർണ്ണമായ രേഖയോ ഇവിടെ പേസ്റ്റ് ചെയ്യുക...",
    placeholder_career: "ഭാവി കരിയറിനെക്കുറിച്ച് ചോദിക്കുക...",
    label_high_contrast: "ഹൈ കോൺട്രാസ്റ്റ് മോഡ്",
    label_font_size: "ഫോണ്ട് വലുപ്പം",
    btn_search: "റോഡ്മാപ്പ് തിരയുക",
    label_suggested: "നിർദ്ദേശിച്ച ചോദ്യങ്ങൾ",
    label_clear: "എല്ലാം മായ്ക്കുക",
    label_history_empty: "ചരിത്രം ഒന്നും കണ്ടെത്തിയില്ല. സംഭാഷണം ആരംഭിക്കുക!",
    label_accessibility: "ലേയൗട്ട് ക്രമീകരണങ്ങൾ",
    label_speech_config: "പരിഭാഷയും ശബ്ദ ക്രമീകരണങ്ങളും",
    label_input_txt: "ഇൻപുട്ട് ടെക്സ്റ്റ് / എഴുതുകയോ സംസാരിക്കുകയോ ചെയ്യുക",
    label_output_txt: "ഫലം",
    label_original_summary: "ചുരുക്കം",
    label_action_items: "നിങ്ങൾ ചെയ്യേണ്ട കാര്യങ്ങൾ",
    label_direct_translation: "നേരിട്ടുള്ള തർജ്ജമ",
    label_extracted_text: "എടുത്ത ടെക്സ്റ്റ്",
    label_scan_empty: "രേഖ അപ്‌ലോഡ് ചെയ്യുകയോ ക്യാപ്‌ചർ ചെയ്യുകയോ ചെയ്യുക.",
    label_career_empty: "ഭാവിയിലെ ജോലികളും പഠന റോഡ്മാപ്പുകളും കാണാൻ ഇവിടെ ടൈപ്പ് ചെയ്യുക.",
    label_career_roadmap: "പഠന റോഡ്മാപ്പ് (ഘട്ടം ഘട്ടമായി)",
    label_career_skills: "ആവശ്യമായ കഴിവുകൾ",
    label_career_resources: "സൗജന്യ പഠന വിഭവങ്ങൾ",
    label_voice_rate: "ശബ്ദ വേഗത",
    label_detected_lang: "കണ്ടെത്തിയ ഭാഷ"
  },
  Bengali: {
    subtitle: "যেকোনো কিছু বুঝুন। যেকোনো ভারতীয় ভাষায়।",
    tab_translate: "অনুবাদ",
    tab_explain: "ব্যাখ্যা করুন",
    tab_scan: "স্ক্যান",
    tab_career: "ক্যারিয়ার",
    tab_history: "ইতিহাস",
    tab_settings: "সেটিংস",
    label_my_language: "অ্যাপের ভাষা / App Language",
    label_persona: "ব্যাখ্যার ধরন (Persona)",
    translate_title: "অনুবাদ এবং ভয়েস অ্যাসিস্ট্যান্ট",
    explain_title: "নোটিশ বা নথি সহজ করুন",
    scan_title: "নথি স্ক্যান করুন এবং বুঝুন",
    career_title: "ভবিষ্যত ক্যারিয়ার গাইড",
    settings_title: "পছন্দ এবং অ্যাক্সেসিবিলিটি",
    history_title: "কাজের ইতিহাস",
    btn_translate_speak: "অনুবাদ এবং শুনুন",
    btn_explain_simply: "সহজভাবে বুঝিয়ে বলুন",
    btn_scan_explain: "স্ক্যান এবং ব্যাখ্যা করুন",
    placeholder_translate: "লিখুন অথবা কথা বলার জন্য মাইক্রোফোন টিপুন...",
    placeholder_explain: "যেকোনো জটিল সরকারি নোটিশ বা নথি এখানে পেস্ট করুন...",
    placeholder_career: "ভবিষ্যত ক্যারিয়ার সম্পর্কে জিজ্ঞাসা করুন...",
    label_high_contrast: "হাই কন্ট্রাস্ট মোড",
    label_font_size: "ফন্ট সাইজ",
    btn_search: "রোডম্যাপ খুঁজুন",
    label_suggested: "পরামর্শিত প্রশ্নাবলী",
    label_clear: "সব মুছে ফেলুন",
    label_history_empty: "কোনো ইতিহাস পাওয়া যায়নি। কথা বলা শুরু করুন!",
    label_accessibility: "অ্যাক্সেসিবিলিটি সেটিংস",
    label_speech_config: "অনুবাদ এবং ভয়েস সেটিংস",
    label_input_txt: "ইনপুট টেক্সট / লিখুন বা বলুন",
    label_output_txt: "ফলাফল",
    label_original_summary: "সারসংক্ষেপ",
    label_action_items: "আপনার করণীয় পদক্ষেপসমূহ",
    label_direct_translation: "সরাসরি অনুবাদ",
    label_extracted_text: "উদ্ধৃত টেক্সট",
    label_scan_empty: "যেকোনো নথি আপলোড বা ছবি তুলে নিজের ভাষায় ব্যাখ্যা শুনুন।",
    label_career_empty: "ভবিষ্যত ক্যারিয়ার এবং পড়াশোনার রোডম্যাপ দেখতে এখানে লিখুন।",
    label_career_roadmap: "পড়ার রোডম্যাপ (ধাপে ধাপে)",
    label_career_skills: "প্রয়োজনীয় দক্ষতা",
    label_career_resources: "বিনামূল্যে শেখার সোর্স",
    label_voice_rate: "ভয়েসের গতি",
    label_detected_lang: "সনাক্তকৃত মূল ভাষা"
  },
  Marathi: {
    subtitle: "काहीही समजून घ्या. कोणत्याही भारतीय भाषेत.",
    tab_translate: "भाषांतर",
    tab_explain: "स्पष्ट करा",
    tab_scan: "स्कॅन",
    tab_career: "करिअर",
    tab_history: "इतिहास",
    tab_settings: "सेटिंग्ज",
    label_my_language: "अ‍ॅपची भाषा / App Language",
    label_persona: "स्पष्टीकरण पद्धत",
    translate_title: "भाषांतर आणि आवाज सहाय्यक",
    explain_title: "सरकारी नोटीस किंवा दस्तऐवज सोपे करा",
    scan_title: "दस्तऐवज स्कॅन करा आणि समजून घ्या",
    career_title: "भविष्यातील करिअर मार्गदर्शक",
    settings_title: "प्राधान्ये आणि सुलभता",
    history_title: "इतिहास",
    btn_translate_speak: "भाषांतर करा आणि बोला",
    btn_explain_simply: "सोप्या भाषेत स्पष्ट करा",
    btn_scan_explain: "स्कॅन करून स्पष्ट करा",
    placeholder_translate: "टाईप करा किंवा बोलण्यासाठी माईकवर क्लिक करा...",
    placeholder_explain: "शासकीय नोटीस किंवा क्लिष्ट दस्तऐवज येथे पेस्ट करा...",
    placeholder_career: "भविष्यातील करिअरबद्दल विचारा...",
    label_high_contrast: "हाय कॉन्ट्रास्ट मोड",
    label_font_size: "फॉन्ट आकार",
    btn_search: "रोडमॅप शोधा",
    label_suggested: "सुचवलेले प्रश्न",
    label_clear: "सर्व साफ करा",
    label_history_empty: "इतिहास आढळला नाही. संवाद सुरू करा!",
    label_accessibility: "अ‍ॅक्सेसिबिलिटी सेटिंग्ज",
    label_speech_config: "भाषांतर आणि आवाज सेटिंग्ज",
    label_input_txt: "इनपुट टेक्स्ट / लिहा किंवा बोला",
    label_output_txt: "निकाल",
    label_original_summary: "सारांश",
    label_action_items: "आपल्याला काय करावे लागेल",
    label_direct_translation: "थेट भाषांतर",
    label_extracted_text: "दस्तऐवजातील मजकूर",
    label_scan_empty: "दस्तऐवज अपलोड किंवा कॅप्चर करा आणि सोपे स्पष्टीकरण मिळवा.",
    label_career_empty: "भविष्यातील नोकऱ्या आणि करिअर रोडमॅप पाहण्यासाठी टाईप करा.",
    label_career_roadmap: "करिअर रोडमॅप (टप्प्याटप्प्याने)",
    label_career_skills: "आवश्यक कौशल्ये",
    label_career_resources: "विनामूल्य शिकण्याचे स्त्रोत",
    label_voice_rate: "आवाजाचा वेग",
    label_detected_lang: "ओळखलेली मूळ भाषा"
  },
  Gujarati: {
    subtitle: "કંઈપણ સમજો. કોઈપણ ભારતીય ભાષામાં.",
    tab_translate: "અનુવાદ",
    tab_explain: "સરળ બનાવો",
    tab_scan: "સ્કેન",
    tab_career: "કરિયર",
    tab_history: "ઇતિહાસ",
    tab_settings: "સેટિંગ્સ",
    label_my_language: "એપની ભાષા / App Language",
    label_persona: "સ્પષ્ટીકરણની પદ્ધતિ",
    translate_title: "અનુવાદ અને અવાજ સહાયક",
    explain_title: "સરકારી નોટિસ કે દસ્તાવેજ સરળ બનાવો",
    scan_title: "દસ્તાવેજ સ્કેન કરો અને સમજો",
    career_title: "ભવિષ્ય કરિયર ગાઈડ",
    settings_title: "પસંદગીઓ અને સુગમતા",
    history_title: "પ્રવૃત્તિ ઇતિહાસ",
    btn_translate_speak: "અનુવાદ કરો અને સાંભળો",
    btn_explain_simply: "સરળ ભાષામાં સમજાવો",
    btn_scan_explain: "સ્કેન કરી સમજાવો",
    placeholder_translate: "લખો અથવા બોલવા માટે માઈક દબાવો...",
    placeholder_explain: "કોઈપણ અઘરો દસ્તાવેજ કે નોટિસ અહીં પેસ્ટ કરો...",
    placeholder_career: "ભવિષ્યના કરિયર વિશે પૂછો...",
    label_high_contrast: "હાઇ કોન્ટ્રાસ્ટ મોડ",
    label_font_size: "અક્ષર સાઈઝ",
    btn_search: "રોડમેપ શોધો",
    label_suggested: "સૂચવેલા પ્રશ્નો",
    label_clear: "બધું સાફ કરો",
    label_history_empty: "કોઈ ઇતિહાસ મળ્યો નથી. વાતચીત શરૂ કરો!",
    label_accessibility: "સુગમતા સેટિંગ્સ",
    label_speech_config: "અનુવાદ અને અવાજ સેટિંગ્સ",
    label_input_txt: "ઇનપુટ લખાણ / લખો અથવા બોલો",
    label_output_txt: "પરિણામ",
    label_original_summary: "સારાંશ",
    label_action_items: "તમારે કરવાના થતા કામો",
    label_direct_translation: "સીધો અનુવાદ",
    label_extracted_text: "દસ્તાવેજમાંથી ટેક્સ્ટ",
    label_scan_empty: "દસ્તાવેજ અપલોડ કરો અને તમારી ભાષામાં સરળ સમજૂતી મેળવો.",
    label_career_empty: "ભવિષ્યની નોકરીઓ અને રોડમેપ જોવા માટે અહીં લખો.",
    label_career_roadmap: "અભ્યાસ રોડમેપ (પગલાવાર)",
    label_career_skills: "જરૂરી કૌશલ્ય",
    label_career_resources: "મફત શૈક્ષણિક સ્ત્રોતો",
    label_voice_rate: "અવાજની ઝડપ",
    label_detected_lang: "ઓળખાયેલી મૂળ ભાષા"
  },
  Punjabi: {
    subtitle: "ਕੁਝ ਵੀ ਸਮਝੋ। ਕਿਸੇ ਵੀ ਭਾਰਤੀ ਭਾਸ਼ਾ ਵਿੱਚ।",
    tab_translate: "ਅਨੁਵਾਦ",
    tab_explain: "ਸਰਲ ਕਰੋ",
    tab_scan: "ਸਕੈਨ",
    tab_career: "ਕਰੀਅਰ",
    tab_history: "ਇਤਿਹਾਸ",
    tab_settings: "ਸੈਟਿੰਗਜ਼",
    label_my_language: "ਐਪ ਦੀ ਭਾਸ਼ਾ / App Language",
    label_persona: "ਸਪਸ਼ਟੀਕਰਨ ਵਿਧੀ",
    translate_title: "ਅਨੁਵਾਦ ਅਤੇ ਆਵਾਜ਼ ਸਹਾਇਕ",
    explain_title: "ਸਰਕਾਰੀ ਨੋਟਿਸ ਜਾਂ ਦਸਤਾਵੇਜ਼ ਸਰਲ ਕਰੋ",
    scan_title: "ਦਸਤਾਵੇਜ਼ ਸਕੈਨ ਕਰੋ ਤੇ ਸਮਝੋ",
    career_title: "ਭਵਿੱਖ ਕਰੀਅਰ ਗਾਈਡ",
    settings_title: "ਤਰਜੀਹਾਂ ਤੇ ਸੁਗਮਤਾ",
    history_title: "ਗਤੀਵਿਧੀ ਇਤਿਹਾਸ",
    btn_translate_speak: "ਅਨੁਵਾਦ ਕਰੋ ਤੇ ਬੋਲੋ",
    btn_explain_simply: "ਸਰਲ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾਓ",
    btn_scan_explain: "ਸਕੈਨ ਕਰਕੇ ਸਮਝਾਓ",
    placeholder_translate: "ਲਿਖੋ ਜਾਂ ਬੋਲਣ ਲਈ ਮਾਈਕ ਦਬਾਓ...",
    placeholder_explain: "ਕੋਈ ਵੀ ਔਖਾ ਦਸਤਾਵੇਜ਼ ਜਾਂ ਨੋਟਿਸ ਇੱਥੇ ਪੇਸਟ ਕਰੋ...",
    placeholder_career: "ਭਵਿੱਖ ਦੇ ਕਰੀਅਰ ਬਾਰੇ ਪੁੱਛੋ...",
    label_high_contrast: "ਹਾਈ ਕੰਟਰਾਸਟ ਮੋਡ",
    label_font_size: "ਅੱਖਰਾਂ ਦਾ ਅਕਾਰ",
    btn_search: "ਰੋਡਮੈਪ ਲੱਭੋ",
    label_suggested: "ਸੁਝਾਏ ਗਏ ਸਵਾਲ",
    label_clear: "ਸਭ ਸਾਫ਼ ਕਰੋ",
    label_history_empty: "ਕੋਈ ਇਤਿਹਾਸ ਨਹੀਂ ਮਿਲਿਆ। ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰੋ!",
    label_accessibility: "ਸੁਗਮਤਾ ਸੈਟਿੰਗਾਂ",
    label_speech_config: "ਅਨੁਵਾਦ ਤੇ ਆਵਾਜ਼ ਸੈਟਿੰਗਾਂ",
    label_input_txt: "ਇਨਪੁਟ ਟੈਕਸਟ / ਲਿਖੋ ਜਾਂ ਬੋਲੋ",
    label_output_txt: "ਨਤੀਜਾ",
    label_original_summary: "ਸੰਖੇਪ",
    label_action_items: "ਤੁਹਾਡੇ ਕਰਨ ਵਾਲੇ ਕੰਮ",
    label_direct_translation: "ਸਿੱਧਾ ਅਨੁਵਾਦ",
    label_extracted_text: "ਕੱਢਿਆ ਗਿਆ ਟੈਕਸਟ",
    label_scan_empty: "ਦਸਤਾਵੇਜ਼ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ ਅਤੇ ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਰਲ ਵਿਆਖਿਆ ਦੇਖੋ.",
    label_career_empty: "ਭਵਿੱਖ ਦੀਆਂ ਨੌਕਰੀਆਂ ਅਤੇ ਰੋਡਮੈਪ ਦੇਖਣ ਲਈ ਇੱਥੇ ਲਿਖੋ।",
    label_career_roadmap: "ਪੜ੍ਹਾਈ ਦਾ ਰੋਡਮੈਪ (ਕਦਮ ਦਰ ਕਦਮ)",
    label_career_skills: "ਲੋੜੀਂਦੇ ਹੁਨਰ",
    label_career_resources: "ਮੁਫ਼ਤ ਸਿੱਖਣ ਦੇ ਸਾਧਨ",
    label_voice_rate: "ਆਵਾਜ਼ ਦੀ ਰਫ਼ਤਾਰ",
    label_detected_lang: "ਪਛਾਣੀ ਗਈ ਮੂਲ ਭਾਸ਼ਾ"
  },
  Odia: {
    subtitle: "ଯେକୌଣସି ଜିନିଷ ବୁଝନ୍ତୁ। ଯେକୌଣସି ଭାରତୀୟ ଭାଷାରେ।",
    tab_translate: "ଅନୁବାଦ",
    tab_explain: "ସରଳ କରନ୍ତୁ",
    tab_scan: "ସ୍କାନ",
    tab_career: "କ୍ୟାରିୟର",
    tab_history: "ଇତିହାସ",
    tab_settings: "ସେଟିଂସ",
    label_my_language: "ଆପ୍ ଭାଷା / App Language",
    label_persona: "ବୁଝାଇବା ଶୈଳୀ",
    translate_title: "ଅନୁବାଦ ଏବଂ ସ୍ୱର ସହାୟକ",
    explain_title: "ସରକାରୀ ନୋଟିସ ବା ଦସ୍ତାବିଜ ସରଳ କରନ୍ତୁ",
    scan_title: "ଦସ୍ତାବିଜ ସ୍କାନ କରି ବୁଝନ୍ତୁ",
    career_title: "ଭବିଷ୍ୟତ କ୍ୟାରିୟର ଗାଇଡ",
    settings_title: "ପସନ୍ଦ ଓ ସୁଗମତା",
    history_title: "କାର୍ଯ୍ୟକଳାପ ଇତିହାସ",
    btn_translate_speak: "ଅନୁବାଦ କରି ଶୁଣନ୍ତୁ",
    btn_explain_simply: "ସରଳ ଭାଷାରେ ବୁଝାନ୍ତୁ",
    btn_scan_explain: "ସ୍କାନ କରି ବୁଝାନ୍ତୁ",
    placeholder_translate: "ଲେଖନ୍ତୁ କିମ୍ବା କହିବା ପାଇଁ ମାଇକ୍ ଦବାନ୍ତୁ...",
    placeholder_explain: "କୌଣସି କଠିନ ନୋଟିସ କିମ୍ବା ଦସ୍ତାବିଜ ଏଠାରେ ପେଷ୍ଟ କରନ୍ତୁ...",
    placeholder_career: "ଭବିଷ୍ୟତ କ୍ୟାରિୟର ବିଷୟରେ ପଚାରନ୍ତୁ...",
    label_high_contrast: "ହାଇ କଣ୍ଟ୍ରାଷ୍ଟ ମୋଡ୍",
    label_font_size: "ଅକ୍ଷର ସାଇଜ୍",
    btn_search: "ରୋଡମ୍ୟାପ୍ ଖୋଜନ୍ତୁ",
    label_suggested: "ସୁପାରିଶ ପ୍ରଶ୍ନ",
    label_clear: "ସବୁ ସଫା କରନ୍ତୁ",
    label_history_empty: "କୌଣସି ଇତିହାସ ମିଳିଲା ନାହିଁ। ବାର୍ତ୍ତାଳାପ ଆରମ୍ଭ କରନ୍ତୁ!",
    label_accessibility: "ସୁଗମତା ସେଟିଂସ",
    label_speech_config: "ଅନୁବାଦ ଓ ସ୍ୱର ସେଟିଂସ",
    label_input_txt: "ଇନପୁଟ୍ ଲେଖା / ଲେଖନ୍ତୁ କିମ୍ବା କୁହନ୍ତୁ",
    label_output_txt: "ଫଳାଫଳ",
    label_original_summary: "ସାରାଂଶ",
    label_action_items: "ଆପଣଙ୍କର କରିବାକୁ ଥିବା କାର୍ଯ୍ୟ",
    label_direct_translation: "ସିଧା ଅନুবাদ",
    label_extracted_text: "ବାହାର କରାଯାଇଥିବା ଲେଖା",
    label_scan_empty: "ଦସ୍ତାବିଜ ଅପଲୋଡ୍ କରନ୍ତୁ ଏବଂ ନିଜ ଭାଷାରେ ସରଳ ବ୍ୟାଖ୍ୟା ପାଆନ୍ତୁ।",
    label_career_empty: "ଭବିଷ୍ୟତ ଚାକିରି ଓ ପାଠପଢା ରୋଡମ୍ୟାପ୍ ଦେଖିବାକୁ ଏଠାରେ ଲେଖନ୍ତୁ।",
    label_career_roadmap: "ପାଠପଢା ରୋଡମ୍ୟାପ୍ (ପାହାଚ ପରେ ପାହାଚ)",
    label_career_skills: "ଆବଶ୍ୟକୀୟ ଦକ୍ଷତା",
    label_career_resources: "ମାଗଣା ଶିକ୍ଷା ସମ୍ବଳ",
    label_voice_rate: "ସ୍ୱର ଗତି",
    label_detected_lang: "ଚିହ୍ନଟ ହୋଇଥିବା ମୂଳ ଭାଷା"
  }
};

function AppContent() {
  const { user, loginAnonymously, logout } = useAuth();
  
  // App state
  const [activeTab, setActiveTab] = useState<"translate" | "explain" | "scan" | "career" | "settings" | "history">("translate");
  const [selectedLang, setSelectedLang] = useState<string>("Hindi");
  const [persona, setPersona] = useState<string>("general");
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xl">("large"); // Default to large for accessibility
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Speech synthesis state
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [listening, setListening] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);

  // Tab states
  // 1. Translate State
  const [translateInput, setTranslateInput] = useState<string>("");
  const [translateOutput, setTranslateOutput] = useState<string>("");
  const [detectedLang, setDetectedLang] = useState<string>("");

  // 2. Explain State
  const [explainInput, setExplainInput] = useState<string>("");
  const [explainOutput, setExplainOutput] = useState<string>("");
  const [explainSummary, setExplainSummary] = useState<string>("");

  // 3. Scan State
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [scanTranslation, setScanTranslation] = useState<string>("");
  const [scanExplanation, setScanExplanation] = useState<string>("");
  const [scanActions, setScanActions] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  // 4. Career State
  const [careerQuery, setCareerQuery] = useState<string>("");
  const [careerResults, setCareerResults] = useState<any[]>([]);

  // Load preferences from local storage
  useEffect(() => {
    const savedLang = localStorage.getItem("bs_lang");
    const savedPersona = localStorage.getItem("bs_persona");
    const savedFontSize = localStorage.getItem("bs_fontSize");
    const savedContrast = localStorage.getItem("bs_contrast");
    const savedHistory = localStorage.getItem("bs_history");

    if (savedLang) setSelectedLang(savedLang);
    if (savedPersona) setPersona(savedPersona);
    if (savedFontSize) setFontSize(savedFontSize as any);
    if (savedContrast) setHighContrast(savedContrast === "true");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Localization translator helper
  const t = (key: string): string => {
    const langDict = TRANSLATIONS[selectedLang] || TRANSLATIONS["English"];
    return langDict[key] || TRANSLATIONS["English"][key] || key;
  };

  // Save history helper
  const addHistoryItem = (type: string, input: string, output: any) => {
    const newItem = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleDateString(),
      type,
      input,
      output
    };
    const updated = [newItem, ...history.slice(0, 19)];
    setHistory(updated);
    localStorage.setItem("bs_history", JSON.stringify(updated));
  };

  // Text-To-Speech (TTS)
  const speakText = (text: string) => {
    if (!text) return;
    window.speechSynthesis.cancel(); // Stop any running speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      "English": "en-IN",
      "Hindi": "hi-IN",
      "Tamil": "ta-IN",
      "Telugu": "te-IN",
      "Kannada": "kn-IN",
      "Malayalam": "ml-IN",
      "Bengali": "bn-IN",
      "Marathi": "mr-IN",
      "Gujarati": "gu-IN",
      "Punjabi": "pa-IN",
      "Odia": "or-IN"
    };

    utterance.lang = langMap[selectedLang] || "en-IN";
    
    // Slow down speaking rate for Senior persona
    if (persona === "senior") {
      utterance.rate = 0.8;
    } else {
      utterance.rate = 1.0;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Speech-To-Text (STT)
  const startListening = (targetInputSetter: (val: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    window.speechSynthesis.cancel(); // Stop talking when listening starts
    const recognition = new SpeechRecognition();
    const langMap: Record<string, string> = {
      "English": "en-IN",
      "Hindi": "hi-IN",
      "Tamil": "ta-IN",
      "Telugu": "te-IN",
      "Kannada": "kn-IN",
      "Malayalam": "ml-IN",
      "Bengali": "bn-IN",
      "Marathi": "mr-IN",
      "Gujarati": "gu-IN",
      "Punjabi": "pa-IN",
      "Odia": "or-IN"
    };

    recognition.lang = langMap[selectedLang] || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setMicError(null);
    };

    recognition.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      targetInputSetter(resultText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setMicError(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  // Call Translate Endpoint
  const handleTranslate = async () => {
    if (!translateInput.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translateInput, target_lang: selectedLang })
      });
      if (!response.ok) throw new Error("Translation failed");
      const data = await response.json();
      setTranslateOutput(data.translated_text);
      setDetectedLang(data.detected_lang);
      addHistoryItem("Translation", translateInput, {
        translated: data.translated_text,
        from: data.detected_lang,
        to: selectedLang
      });
      // Auto speak response
      speakText(data.translated_text);
    } catch (error) {
      console.error(error);
      alert("Error contacting the Translation server. Please verify the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Call Explain Endpoint
  const handleExplain = async () => {
    if (!explainInput.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: explainInput, 
          persona: persona,
          target_lang: selectedLang 
        })
      });
      if (!response.ok) throw new Error("Explanation failed");
      const data = await response.json();
      setExplainOutput(data.explanation);
      setExplainSummary(data.original_summary);
      addHistoryItem("Explanation", explainInput, {
        explanation: data.explanation,
        summary: data.original_summary,
        persona,
        lang: selectedLang
      });
      speakText(data.explanation);
    } catch (error) {
      console.error(error);
      alert("Error contacting the Explanation server. Please verify the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Call Career Guide Endpoint
  const handleCareerSearch = async (queryText?: string) => {
    const q = queryText || careerQuery;
    if (!q.trim()) return;
    if (queryText) setCareerQuery(queryText);
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/career`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, target_lang: selectedLang })
      });
      if (!response.ok) throw new Error("Career advice failed");
      const data = await response.json();
      setCareerResults(data.careers);
      addHistoryItem("Career Guide", q, {
        careers: data.careers,
        lang: selectedLang
      });
    } catch (error) {
      console.error(error);
      alert("Error contacting the Career Guide server. Please verify the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Document Scanner Files & Camera
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScanFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCameraActive(false);
    }
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      setScanFile(null);
      setPreviewUrl(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Could not access camera. Please upload an image instead.");
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured_doc.jpg", { type: "image/jpeg" });
            setScanFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            // Stop camera stream
            const stream = video.srcObject as MediaStream;
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
            }
            setCameraActive(false);
          }
        }, "image/jpeg");
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
    setCameraActive(false);
  };

  const handleDocumentScan = async () => {
    if (!scanFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", scanFile);
      formData.append("target_lang", selectedLang);
      formData.append("persona", persona);

      const response = await fetch(`${BACKEND_URL}/api/document`, {
        method: "POST",
        body: formData
      });
      if (!response.ok) throw new Error("Document analysis failed");
      const data = await response.json();
      setOcrText(data.ocr_text);
      setScanTranslation(data.translation);
      setScanExplanation(data.explanation);
      setScanActions(data.action_items);
      addHistoryItem("Scan Document", scanFile.name, {
        translation: data.translation,
        explanation: data.explanation,
        actions: data.action_items
      });
      speakText(data.explanation);
    } catch (error) {
      console.error(error);
      alert("Error scanning document. Please verify the backend is running and Gemini API key is configured.");
    } finally {
      setLoading(false);
    }
  };

  // Preference updates
  const savePreference = (key: string, value: string) => {
    localStorage.setItem(key, value);
    if (key === "bs_lang") setSelectedLang(value);
    if (key === "bs_persona") setPersona(value);
    if (key === "bs_fontSize") setFontSize(value as any);
  };

  // Font-size helper classes
  const getFontSizeClass = (element: "title" | "text" | "btn") => {
    if (fontSize === "xl") {
      if (element === "title") return "text-3xl sm:text-4xl font-bold";
      if (element === "text") return "text-xl sm:text-2xl leading-relaxed";
      return "text-xl px-6 py-4 font-semibold";
    }
    if (fontSize === "large") {
      if (element === "title") return "text-2xl sm:text-3xl font-bold";
      if (element === "text") return "text-lg sm:text-xl leading-relaxed";
      return "text-lg px-5 py-3 font-medium";
    }
    if (element === "title") return "text-xl sm:text-2xl font-bold";
    if (element === "text") return "text-base sm:text-lg";
    return "text-base px-4 py-2 font-medium";
  };

  return (
    <div className={`flex flex-col flex-1 min-h-screen ${highContrast ? "bg-black text-white" : "bg-slate-50 text-slate-900"}`}>
      {/* Top Banner */}
      <header className={`sticky top-0 z-30 border-b ${highContrast ? "border-slate-800 bg-black" : "border-slate-100 bg-white"} shadow-sm`}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-saffron to-indian-green flex items-center justify-center p-0.5 shadow-md">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-navy animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-navy flex items-center gap-1.5">
                BhashaSetu <span className="bg-saffron text-white text-xs px-2 py-0.5 rounded font-bold uppercase tracking-widest shadow-sm">AI</span>
              </h1>
              <p className="text-xs font-bold text-slate-500 tracking-wide uppercase">{t("subtitle")}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg p-0.5 bg-slate-100 dark:bg-zinc-800">
              <button 
                onClick={() => savePreference("bs_fontSize", "normal")} 
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${fontSize === "normal" ? "bg-white text-navy shadow" : "text-slate-500"}`}
              >
                A
              </button>
              <button 
                onClick={() => savePreference("bs_fontSize", "large")} 
                className={`px-2 py-1 rounded text-sm font-bold transition-all ${fontSize === "large" ? "bg-white text-navy shadow" : "text-slate-500"}`}
              >
                A+
              </button>
              <button 
                onClick={() => savePreference("bs_fontSize", "xl")} 
                className={`px-2 py-1 rounded text-base font-extrabold transition-all ${fontSize === "xl" ? "bg-white text-navy shadow" : "text-slate-500"}`}
              >
                A++
              </button>
            </div>

            {user ? (
              <button 
                onClick={logout} 
                title="Logout"
                className="p-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            ) : (
              <button 
                onClick={loginAnonymously}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-navy text-navy font-bold text-xs hover:bg-slate-50 transition-all uppercase tracking-wide"
              >
                <UserCheck className="h-3.5 w-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-6">
        
        {/* Quick Config Selector Bar */}
        <div className={`p-4 rounded-2xl border ${highContrast ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-100"} shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between`}>
          <div className="w-full sm:w-auto flex items-center gap-3">
            <Languages className="text-saffron h-5 w-5 shrink-0" />
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{t("label_my_language")}</label>
              <select 
                value={selectedLang} 
                onChange={(e) => savePreference("bs_lang", e.target.value)}
                className={`w-full sm:w-48 p-2 rounded-lg border font-bold ${highContrast ? "bg-black border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-navy"} focus:outline-none focus:ring-2 focus:ring-navy`}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <BookOpenCheck className="text-indian-green h-5 w-5 shrink-0" />
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{t("label_persona")}</label>
              <select 
                value={persona} 
                onChange={(e) => savePreference("bs_persona", e.target.value)}
                className={`w-full sm:w-48 p-2 rounded-lg border font-semibold ${highContrast ? "bg-black border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-navy"} focus:outline-none focus:ring-2 focus:ring-navy`}
              >
                {PERSONAS.map(p => (
                  <option key={p.id} value={p.id}>{p.label} - {p.desc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Panel */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* 1. TRANSLATION MODE */}
          {activeTab === "translate" && (
            <div className="flex flex-col gap-4">
              <h2 className={`${getFontSizeClass("title")} text-navy`}>{t("translate_title")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input Card */}
                <div className={`p-5 rounded-3xl border flex flex-col gap-4 shadow-sm ${highContrast ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-100"}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">{t("label_input_txt")}</span>
                    <button 
                      onClick={() => startListening(setTranslateInput)}
                      className={`p-2 rounded-full transition-all ${listening ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                      title="Speak naturally"
                    >
                      {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={translateInput}
                    onChange={(e) => setTranslateInput(e.target.value)}
                    placeholder={t("placeholder_translate")}
                    className={`w-full p-4 rounded-2xl border resize-none focus:outline-none focus:ring-2 focus:ring-navy ${getFontSizeClass("text")} ${highContrast ? "bg-black border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                  />
                  {micError && (
                    <p className="text-red-500 text-xs font-semibold">Microphone status: {micError}. Ensure microphone permissions are allowed.</p>
                  )}
                  <button 
                    onClick={handleTranslate}
                    disabled={loading || !translateInput.trim()}
                    className={`w-full bg-navy text-white hover:bg-blue-900 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all ${getFontSizeClass("btn")} disabled:opacity-50`}
                  >
                    {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : t("btn_translate_speak")}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Output Card */}
                <div className={`p-5 rounded-3xl border flex flex-col gap-4 shadow-sm ${highContrast ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-100"}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold tracking-wider text-saffron uppercase">{t("label_output_txt")}</span>
                    {translateOutput && (
                      <button 
                        onClick={() => speakText(translateOutput)}
                        className={`p-2 rounded-full transition-all ${speaking ? "bg-saffron text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className={`flex-1 p-4 rounded-2xl border flex flex-col justify-between ${highContrast ? "bg-zinc-900 border-zinc-800 text-white" : "bg-slate-50 border-slate-100 text-navy"}`}>
                    <p className={`${getFontSizeClass("text")} min-h-[100px] whitespace-pre-wrap font-bold`}>
                      {translateOutput || "Translation output will appear here. Tap Speak to read aloud."}
                    </p>
                    {detectedLang && (
                      <p className="text-xs font-bold text-slate-400 mt-2">{t("label_detected_lang")}: {detectedLang}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. EXPLAIN MODE */}
          {activeTab === "explain" && (
            <div className="flex flex-col gap-4">
              <h2 className={`${getFontSizeClass("title")} text-navy`}>{t("explain_title")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-5 rounded-3xl border flex flex-col gap-4 shadow-sm ${highContrast ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-100"}`}>
                  <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">{t("label_input_txt")}</span>
                  <textarea
                    rows={6}
                    value={explainInput}
                    onChange={(e) => setExplainInput(e.target.value)}
                    placeholder={t("placeholder_explain")}
                    className={`w-full p-4 rounded-2xl border resize-none focus:outline-none focus:ring-2 focus:ring-navy ${getFontSizeClass("text")} ${highContrast ? "bg-black border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                  />
                  <button 
                    onClick={handleExplain}
                    disabled={loading || !explainInput.trim()}
                    className={`w-full bg-navy text-white hover:bg-blue-900 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all ${getFontSizeClass("btn")} disabled:opacity-50`}
                  >
                    {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : t("btn_explain_simply")}
                    <Sparkles className="h-5 w-5" />
                  </button>
                </div>

                <div className={`p-5 rounded-3xl border flex flex-col gap-4 shadow-sm ${highContrast ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-100"}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold tracking-wider text-indian-green uppercase">{t("label_output_txt")} ({persona})</span>
                    {explainOutput && (
                      <button 
                        onClick={() => speakText(explainOutput)}
                        className={`p-2 rounded-full transition-all ${speaking ? "bg-indian-green text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className={`flex-grow p-4 rounded-2xl border flex flex-col gap-3 justify-between ${highContrast ? "bg-zinc-900 border-zinc-800" : "bg-slate-50 border-slate-100"}`}>
                    {explainSummary && (
                      <div className="border-b pb-2 border-slate-200 dark:border-zinc-800">
                        <span className="text-xs font-bold text-slate-400 block uppercase">{t("label_original_summary")}</span>
                        <p className={`${getFontSizeClass("text")} font-bold text-saffron`}>{explainSummary}</p>
                      </div>
                    )}
                    <p className={`${getFontSizeClass("text")} font-medium text-slate-800 dark:text-zinc-100`}>
                      {explainOutput || "Simplified explanation will appear here in your target language."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. SMART CAMERA & DOCUMENT UNDERSTANDING */}
          {activeTab === "scan" && (
            <div className="flex flex-col gap-4">
              <h2 className={`${getFontSizeClass("title")} text-navy`}>{t("scan_title")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Camera / Capture Side */}
                <div className={`p-5 rounded-3xl border flex flex-col gap-4 shadow-sm ${highContrast ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-100"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Image Input</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={startCamera} 
                        className="px-3 py-1.5 rounded-lg border text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center gap-1"
                      >
                        <Camera className="h-4.5 w-4.5 text-navy" /> Camera
                      </button>
                      {cameraActive && (
                        <button 
                          onClick={stopCamera} 
                          className="px-2 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                        >
                          Stop
                        </button>
                      )}
                    </div>
                  </div>

                  {cameraActive ? (
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <button 
                        onClick={capturePhoto}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full bg-white border-4 border-navy shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                      >
                        <div className="h-6 w-6 rounded-full bg-saffron" />
                      </button>
                    </div>
                  ) : previewUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center max-h-[300px]">
                      <img src={previewUrl} alt="Document preview" className="max-w-full max-h-[300px] object-contain" />
                      <button 
                        onClick={() => { setPreviewUrl(null); setScanFile(null); }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-zinc-900 transition-all">
                      <Upload className="h-10 w-10 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-500 text-center">Click Camera Mode above or upload a document photo</p>
                      <label className="cursor-pointer bg-navy text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-900 transition-all shadow-sm">
                        Upload Image
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                  )}

                  <canvas ref={canvasRef} className="hidden" />

                  <button
                    onClick={handleDocumentScan}
                    disabled={loading || !scanFile}
                    className={`w-full bg-navy text-white hover:bg-blue-900 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all ${getFontSizeClass("btn")} disabled:opacity-50`}
                  >
                    {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : t("btn_scan_explain")}
                    <Sparkles className="h-5 w-5" />
                  </button>
                </div>

                {/* Explanation / Result Side */}
                <div className={`p-5 rounded-3xl border flex flex-col gap-4 shadow-sm ${highContrast ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-100"}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold tracking-wider text-indian-green uppercase">{t("label_output_txt")}</span>
                    {scanExplanation && (
                      <button 
                        onClick={() => speakText(scanExplanation)}
                        className={`p-2 rounded-full transition-all ${speaking ? "bg-indian-green text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className={`flex-1 p-4 rounded-2xl border flex flex-col gap-4 max-h-[400px] overflow-y-auto ${highContrast ? "bg-zinc-900 border-zinc-800" : "bg-slate-50 border-slate-100"}`}>
                    {scanExplanation ? (
                      <div className="flex flex-col gap-4">
                        <div>
                          <span className="text-xs font-bold text-saffron block uppercase mb-1">Simple Explanation</span>
                          <p className={`${getFontSizeClass("text")} font-semibold text-slate-800 dark:text-zinc-100`}>{scanExplanation}</p>
                        </div>
                        {scanActions.length > 0 && (
                          <div>
                            <span className="text-xs font-bold text-indian-green block uppercase mb-2">{t("label_action_items")}</span>
                            <ul className="flex flex-col gap-2">
                              {scanActions.map((action, i) => (
                                <li key={i} className="flex gap-2 items-start text-sm sm:text-base font-semibold text-slate-700 dark:text-zinc-200">
                                  <CheckCircle className="h-5 w-5 text-indian-green shrink-0 mt-0.5" />
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {scanTranslation && (
                          <div className="border-t pt-3 border-slate-200 dark:border-zinc-800">
                            <span className="text-xs font-bold text-slate-400 block uppercase mb-1">{t("label_direct_translation")}</span>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium whitespace-pre-wrap">{scanTranslation}</p>
                          </div>
                        )}
                        {ocrText && (
                          <div className="border-t pt-3 border-slate-200 dark:border-zinc-800">
                            <span className="text-xs font-bold text-slate-400 block uppercase mb-1">{t("label_extracted_text")}</span>
                            <p className="text-xs text-slate-400 font-mono whitespace-pre-wrap">{ocrText}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className={`${getFontSizeClass("text")} text-slate-400 text-center font-bold my-auto`}>
                        {t("label_scan_empty")}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 4. EMERGING CAREER GUIDE */}
          {activeTab === "career" && (
            <div className="flex flex-col gap-4">
              <h2 className={`${getFontSizeClass("title")} text-navy`}>{t("career_title")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Search / Suggestions Column */}
                <div className={`md:col-span-1 p-5 rounded-3xl border flex flex-col gap-4 shadow-sm ${highContrast ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-100"}`}>
                  <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Explore Careers</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={careerQuery}
                      onChange={(e) => setCareerQuery(e.target.value)}
                      placeholder={t("placeholder_career")}
                      className={`flex-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-navy text-sm font-semibold ${highContrast ? "bg-black border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                    />
                    <button 
                      onClick={() => startListening(setCareerQuery)}
                      className={`p-2.5 rounded-xl transition-all ${listening ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleCareerSearch()}
                    disabled={loading || !careerQuery.trim()}
                    className="w-full bg-navy text-white hover:bg-blue-900 font-bold p-3 rounded-xl text-sm flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : t("btn_search")}
                    <Sparkles className="h-4 w-4" />
                  </button>

                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t("label_suggested")}</span>
                    {CAREER_SUGGESTIONS.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCareerSearch(suggestion)}
                        className={`text-left text-xs font-semibold p-2.5 rounded-lg border hover:bg-slate-50 transition-all ${highContrast ? "border-zinc-800 hover:bg-zinc-900" : "border-slate-100 bg-white"}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recommendations Roadmap Column */}
                <div className={`md:col-span-2 p-5 rounded-3xl border flex flex-col gap-4 shadow-sm ${highContrast ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-100"}`}>
                  <span className="text-xs font-bold tracking-wider text-indian-green uppercase">Future Career Roadmaps ({selectedLang})</span>
                  
                  <div className="flex-1 max-h-[500px] overflow-y-auto flex flex-col gap-4">
                    {careerResults.length > 0 ? (
                      careerResults.map((career, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl border flex flex-col gap-3 ${highContrast ? "bg-zinc-900 border-zinc-800" : "bg-slate-50 border-slate-100"}`}>
                          <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-zinc-800">
                            <h3 className="text-lg font-bold text-navy">{career.title}</h3>
                            <span className="text-xs bg-saffron text-white font-extrabold px-2 py-0.5 rounded-full">{career.stream}</span>
                          </div>
                          
                          <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{career.description}</p>
                          
                          <div>
                            <span className="text-xs font-bold text-slate-400 block uppercase mb-1">{t("label_career_skills")}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {career.required_skills.map((skill: string, sIdx: number) => (
                                <span key={sIdx} className="text-xs bg-slate-200 dark:bg-zinc-800 px-2.5 py-1 rounded-md font-bold text-slate-800 dark:text-zinc-200">{skill}</span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-bold text-slate-400 block uppercase mb-1">{t("label_career_roadmap")}</span>
                            <div className="flex flex-col gap-2 mt-1">
                              {career.roadmap.map((step: string, rIdx: number) => (
                                <div key={rIdx} className="flex gap-2 items-center text-sm font-semibold text-slate-700 dark:text-zinc-300">
                                  <div className="h-5 w-5 rounded-full bg-navy text-white flex items-center justify-center text-xs shrink-0 font-bold">{rIdx + 1}</div>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {career.resources && career.resources.length > 0 && (
                            <div>
                              <span className="text-xs font-bold text-slate-400 block uppercase mb-1">{t("label_career_resources")}</span>
                              <div className="flex flex-wrap gap-1.5">
                                {career.resources.map((res: string, resIdx: number) => (
                                  <span key={resIdx} className="text-xs border text-indian-green border-indian-green px-2 py-0.5 rounded font-extrabold">{res}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="my-auto text-center flex flex-col items-center justify-center gap-3">
                        <Compass className="h-10 w-10 text-slate-300" />
                        <p className={`${getFontSizeClass("text")} text-slate-400 font-bold`}>
                          {t("label_career_empty")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 5. HISTORY */}
          {activeTab === "history" && (
            <div className="flex flex-col gap-4">
              <h2 className={`${getFontSizeClass("title")} text-navy`}>{t("history_title")}</h2>
              <div className={`p-5 rounded-3xl border flex flex-col gap-4 shadow-sm ${highContrast ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-100"}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Previous Activities</span>
                  {history.length > 0 && (
                    <button 
                      onClick={() => { setHistory([]); localStorage.removeItem("bs_history"); }}
                      className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
                    >
                      {t("label_clear")}
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
                  {history.length > 0 ? (
                    history.map((item) => (
                      <div key={item.id} className={`p-4 rounded-2xl border flex flex-col gap-2 ${highContrast ? "bg-zinc-900 border-zinc-800" : "bg-slate-50 border-slate-100"}`}>
                        <div className="flex justify-between items-center text-xs border-b pb-1.5 border-slate-200 dark:border-zinc-800">
                          <span className="font-extrabold uppercase text-navy">{item.type}</span>
                          <span className="text-slate-400 font-medium">{item.timestamp}</span>
                        </div>
                        <div className="text-sm">
                          <p className="font-semibold text-slate-500 mb-1">Input / इनपुट:</p>
                          <p className="font-bold text-slate-800 dark:text-zinc-100">{item.input}</p>
                        </div>
                        <div className="text-sm bg-white dark:bg-black p-3 rounded-xl border border-slate-100 dark:border-zinc-800 mt-1">
                          <p className="font-semibold text-slate-500 mb-1">Output / परिणाम:</p>
                          {item.type === "Translation" && (
                            <p className="font-bold text-navy">{item.output.translated}</p>
                          )}
                          {item.type === "Explanation" && (
                            <div className="flex flex-col gap-1.5">
                              <p className="font-bold text-saffron">{item.output.summary}</p>
                              <p className="font-semibold text-slate-700 dark:text-zinc-300">{item.output.explanation}</p>
                            </div>
                          )}
                          {item.type === "Career Guide" && (
                            <p className="font-bold text-indian-green">{item.output.careers.map((c: any) => c.title).join(", ")}</p>
                          )}
                          {item.type === "Scan Document" && (
                            <p className="font-semibold text-slate-700 dark:text-zinc-300">{item.output.explanation}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                      <HistoryIcon className="h-8 w-8 text-slate-300" />
                      <p className="text-sm font-bold text-slate-400">{t("label_history_empty")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 6. SETTINGS */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-4">
              <h2 className={`${getFontSizeClass("title")} text-navy`}>{t("settings_title")}</h2>
              <div className={`p-5 rounded-3xl border flex flex-col gap-6 shadow-sm ${highContrast ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-100"}`}>
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-navy">{t("label_accessibility")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                    <div className={`p-4 rounded-xl border ${highContrast ? "border-zinc-800" : "border-slate-200"}`}>
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-2">{t("label_high_contrast")}</span>
                      <button 
                        onClick={() => { setHighContrast(!highContrast); localStorage.setItem("bs_contrast", String(!highContrast)); }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${highContrast ? "bg-white text-black border border-black hover:bg-slate-100" : "bg-slate-800 text-white hover:bg-slate-900"}`}
                      >
                        {highContrast ? "Switch to Normal" : "Switch to High Contrast"}
                      </button>
                    </div>

                    <div className={`p-4 rounded-xl border ${highContrast ? "border-zinc-800" : "border-slate-200"}`}>
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-2">{t("label_font_size")}</span>
                      <div className="flex gap-2">
                        {(["normal", "large", "xl"] as const).map(sz => (
                          <button
                            key={sz}
                            onClick={() => savePreference("bs_fontSize", sz)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${fontSize === sz ? "bg-navy text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                          >
                            {sz === "normal" ? "A" : sz === "large" ? "A+" : "A++"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-navy">{t("label_speech_config")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                    <div className={`p-4 rounded-xl border ${highContrast ? "border-zinc-800" : "border-slate-200"}`}>
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-2">{t("label_voice_rate")}</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-zinc-300 block mb-2">
                        {persona === "senior" ? "Slow and Clear (0.8x)" : "Standard (1.0x)"} (Determined by Persona)
                      </span>
                    </div>

                    <div className={`p-4 rounded-xl border ${highContrast ? "border-zinc-800" : "border-slate-200"}`}>
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-2">{t("label_my_language")}</span>
                      <select 
                        value={selectedLang} 
                        onChange={(e) => savePreference("bs_lang", e.target.value)}
                        className={`w-full p-2.5 rounded-lg border font-bold text-sm ${highContrast ? "bg-black border-zinc-700 text-white" : "bg-slate-50 border-slate-200 text-navy"}`}
                      >
                        {LANGUAGES.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* Bottom Sticky Tab Navigation */}
      <nav className={`sticky bottom-0 border-t ${highContrast ? "border-slate-800 bg-black" : "border-slate-100 bg-white"} shadow-lg z-30`}>
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
          <button 
            onClick={() => setActiveTab("translate")} 
            className={`flex flex-col items-center gap-1.5 flex-1 p-2 rounded-xl transition-all ${activeTab === "translate" ? "text-navy" : "text-slate-400 hover:text-slate-600"}`}
          >
            <Languages className="h-5.5 w-5.5" />
            <span className="text-[10px] font-extrabold uppercase tracking-wide">{t("tab_translate")}</span>
          </button>

          <button 
            onClick={() => setActiveTab("explain")} 
            className={`flex flex-col items-center gap-1.5 flex-1 p-2 rounded-xl transition-all ${activeTab === "explain" ? "text-saffron" : "text-slate-400 hover:text-slate-600"}`}
          >
            <BookOpen className="h-5.5 w-5.5" />
            <span className="text-[10px] font-extrabold uppercase tracking-wide">{t("tab_explain")}</span>
          </button>

          <button 
            onClick={() => setActiveTab("scan")} 
            className={`flex flex-col items-center gap-1.5 flex-1 p-2 rounded-xl transition-all ${activeTab === "scan" ? "text-indian-green" : "text-slate-400 hover:text-slate-600"}`}
          >
            <Camera className="h-5.5 w-5.5" />
            <span className="text-[10px] font-extrabold uppercase tracking-wide">{t("tab_scan")}</span>
          </button>

          <button 
            onClick={() => setActiveTab("career")} 
            className={`flex flex-col items-center gap-1.5 flex-1 p-2 rounded-xl transition-all ${activeTab === "career" ? "text-navy" : "text-slate-400 hover:text-slate-600"}`}
          >
            <Compass className="h-5.5 w-5.5" />
            <span className="text-[10px] font-extrabold uppercase tracking-wide">{t("tab_career")}</span>
          </button>

          <button 
            onClick={() => setActiveTab("history")} 
            className={`flex flex-col items-center gap-1.5 flex-1 p-2 rounded-xl transition-all ${activeTab === "history" ? "text-slate-700" : "text-slate-400 hover:text-slate-600"}`}
          >
            <HistoryIcon className="h-5.5 w-5.5" />
            <span className="text-[10px] font-extrabold uppercase tracking-wide">{t("tab_history")}</span>
          </button>

          <button 
            onClick={() => setActiveTab("settings")} 
            className={`flex flex-col items-center gap-1.5 flex-1 p-2 rounded-xl transition-all ${activeTab === "settings" ? "text-slate-700" : "text-slate-400 hover:text-slate-600"}`}
          >
            <SettingsIcon className="h-5.5 w-5.5" />
            <span className="text-[10px] font-extrabold uppercase tracking-wide">{t("tab_settings")}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
