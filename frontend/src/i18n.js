// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Basic resources: English (en) and Hindi (hi)
const resources = {
    en: {
        translation: {
            nav: {
                dashboard: 'Dashboard',
                questionnaires: 'Questionnaires',
                ai_recommendation: 'AI Recommendation',
                emergency_contact: 'Emergency Contact',
                analytics: 'Analytics & Reporting',
                lifestyle: 'Lifestyle'
            },
            common: {
                go_home: 'Go to Home',
                processing: 'Processing...',
                submit: 'Submit',
                next_question: 'Next Question',
                previous: 'Previous',
                question: 'Question',
                answered: 'answered'
            },
            phq9: {
                title: 'PHQ-9 Questionnaire',
                intro: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
                options: {
                    o0: 'Not at all',
                    o1: 'A few days',
                    o2: 'Most days',
                    o3: 'Every day'
                }
            },
            gad7: {
                title: 'GAD-7 Questionnaire',
                intro: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
                options: {
                    o0: 'Not at all',
                    o1: 'A few days',
                    o2: 'Most days',
                    o3: 'Every day'
                }
            }
        }
    },
    hi: {
        translation: {
            nav: {
                dashboard: 'डैशबोर्ड',
                questionnaires: 'प्रश्नावली',
                ai_recommendation: 'एआई सिफारिश',
                emergency_contact: 'आपातकालीन संपर्क',
                analytics: 'एनालिटिक्स और रिपोर्टिंग',
                lifestyle: 'लाइफस्टाइल'
            },
            common: {
                go_home: 'होम पर जाएँ',
                processing: 'प्रोसेस हो रहा है...',
                submit: 'सबमिट करें',
                next_question: 'अगला प्रश्न',
                previous: 'पिछला',
                question: 'प्रश्न',
                answered: 'उत्तर दिए'
            },
            phq9: {
                title: 'पीएचक्यू‑9 प्रश्नावली',
                intro: 'पिछले 2 सप्ताह में, निम्न समस्याओं ने आपको कितनी बार परेशान किया है?',
                options: {
                    o0: 'बिल्कुल नहीं',
                    o1: 'कुछ दिन',
                    o2: 'अधिकतर दिन',
                    o3: 'हर दिन'
                }
            },
            gad7: {
                title: 'जीएडी‑7 प्रश्नावली',
                intro: 'पिछले 2 सप्ताह में, निम्न समस्याओं ने आपको कितनी बार परेशान किया है?',
                options: {
                    o0: 'बिल्कुल नहीं',
                    o1: 'कुछ दिन',
                    o2: 'अधिकतर दिन',
                    o3: 'हर दिन'
                }
            }
        }
    },
    te: {
        translation: {
            nav: {
                dashboard: 'డ్యాష్‌బోర్డ్',
                questionnaires: 'ప్రశ్నావళి',
                ai_recommendation: 'ఏఐ సిఫారసు',
                emergency_contact: 'అత్యవసర సంప్రదింపు',
                analytics: 'విశ్లేషణ & నివేదికలు',
                lifestyle: 'జీవనశైలి'
            },
            common: {
                go_home: 'హోమ్‌కు వెళ్లండి',
                processing: 'ప్రాసెసింగ్...',
                submit: 'సబ్మిట్',
                next_question: 'తదుపరి ప్రశ్న',
                previous: 'మునుపటి',
                question: 'ప్రశ్న',
                answered: 'సమాధానాలు'
            },
            phq9: {
                title: 'PHQ‑9 ప్రశ్నావళి',
                intro: 'గత 2 వారాల్లో, క్రింది సమస్యలు మీకు ఎంత తరచుగా ఇబ్బంది పెట్టాయి?',
                options: {
                    o0: 'అసలు కాదు',
                    o1: 'కొన్ని రోజులు',
                    o2: 'చాలా రోజులు',
                    o3: 'ప్రతి రోజు'
                }
            },
            gad7: {
                title: 'GAD‑7 ప్రశ్నావళి',
                intro: 'గత 2 వారాల్లో, క్రింది సమస్యలు మీకు ఎంత తరచుగా ఇబ్బంది పెట్టాయి?',
                options: {
                    o0: 'అసలు కాదు',
                    o1: 'కొన్ని రోజులు',
                    o2: 'చాలా రోజులు',
                    o3: 'ప్రతి రోజు'
                }
            }
        }
    },
    ta: {
        translation: {
            nav: {
                dashboard: 'டாஷ்போர்டு',
                questionnaires: 'வினாக்கள்',
                ai_recommendation: 'ஏஐ பரிந்துரை',
                emergency_contact: 'அவசர தொடர்பு',
                analytics: 'பகுப்பாய்வு & அறிக்கைகள்',
                lifestyle: 'வாழ்க்கை முறை'
            },
            common: {
                go_home: 'முகப்புக்கு செல்ல',
                processing: 'செயலாக்கப்படுகிறது...',
                submit: 'சமர்ப்பிக்க',
                next_question: 'அடுத்த கேள்வி',
                previous: 'முந்தையது',
                question: 'கேள்வி',
                answered: 'பதிலளிக்கப்பட்டது'
            },
            phq9: {
                title: 'PHQ‑9 வினாத்தாள்',
                intro: 'கடந்த 2 வாரங்களில், பின்வரும் பிரச்சினைகள் எவ்வளவு அடிக்கடி உங்களை சிரமப்படுத்தின?',
                options: {
                    o0: 'எப்போதுமில்லை',
                    o1: 'சில நாட்கள்',
                    o2: 'பெரும்பாலான நாட்கள்',
                    o3: 'தினமும்'
                }
            },
            gad7: {
                title: 'GAD‑7 வினாத்தாள்',
                intro: 'கடந்த 2 வாரங்களில், பின்வரும் பிரச்சினைகள் எவ்வளவு அடிக்கடி உங்களை சிரமப்படுத்தின?',
                options: {
                    o0: 'எப்போதுமில்லை',
                    o1: 'சில நாட்கள்',
                    o2: 'பெரும்பாலான நாட்கள்',
                    o3: 'தினமும்'
                }
            }
        }
    },
    kn: {
        translation: {
            nav: {
                dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
                questionnaires: 'ಪ್ರಶ್ನಾವಳಿಗಳು',
                ai_recommendation: 'ಎಐ ಶಿಫಾರಸು',
                emergency_contact: 'ತುರ್ತು ಸಂಪರ್ಕ',
                analytics: 'ವಿಶ್ಲೇಷಣೆ & ವರದಿಗಳು',
                lifestyle: 'ಜೀವನಶೈಲಿ'
            },
            common: {
                go_home: 'ಹೋಮ್‌ಗೆ ಹೋಗಿ',
                processing: 'ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...',
                submit: 'ಸಲ್ಲಿಸಿ',
                next_question: 'ಮುಂದಿನ ಪ್ರಶ್ನೆ',
                previous: 'ಹಿಂದಿನದು',
                question: 'ಪ್ರಶ್ನೆ',
                answered: 'ಉತ್ತರಿಸಲಾಗಿದೆ'
            },
            phq9: {
                title: 'PHQ‑9 ಪ್ರಶ್ನಾವಳಿ',
                intro: 'ಕಳೆದ 2 ವಾರಗಳಲ್ಲಿ, ಕೆಳಗಿನ ಸಮಸ್ಯೆಗಳು ನಿಮಗೆ ಎಷ್ಟು ಬಾರಿ ತೊಂದರೆ ಕೊಟ್ಟಿವೆ?',
                options: {
                    o0: 'ಸಂಪೂರ್ಣ ಇಲ್ಲ',
                    o1: 'ಕೆಲವು ದಿನಗಳು',
                    o2: 'ಹೆಚ್ಚಿನ ದಿನಗಳು',
                    o3: 'ಪ್ರತಿದಿನ'
                }
            },
            gad7: {
                title: 'GAD‑7 ಪ್ರಶ್ನಾವಳಿ',
                intro: 'ಕಳೆದ 2 ವಾರಗಳಲ್ಲಿ, ಕೆಳಗಿನ ಸಮಸ್ಯೆಗಳು ನಿಮಗೆ ಎಷ್ಟು ಬಾರಿ ತೊಂದರೆ ಕೊಟ್ಟಿವೆ?',
                options: {
                    o0: 'ಸಂಪೂರ್ಣ ಇಲ್ಲ',
                    o1: 'ಕೆಲವು ದಿನಗಳು',
                    o2: 'ಹೆಚ್ಚಿನ ದಿನಗಳು',
                    o3: 'ಪ್ರತಿದಿನ'
                }
            }
        }
    },
    ml: {
        translation: {
            nav: {
                dashboard: 'ഡാഷ്‌ബോർഡ്',
                questionnaires: 'ചോദനപ്പട്ടികകൾ',
                ai_recommendation: 'എഐ ശുപാർശ',
                emergency_contact: 'അടിയന്തിര ബന്ധം',
                analytics: 'വിശകലനം & റിപ്പോർട്ടുകൾ',
                lifestyle: 'ജീവിതശൈലി'
            },
            common: {
                go_home: 'ഹോത്തിലേക്ക് പോകുക',
                processing: 'പ്രോസസ്സ് ചെയ്യുന്നു...',
                submit: 'സമർപ്പിക്കുക',
                next_question: 'അടുത്ത ചോദ്യം',
                previous: 'മുമ്പത്തെത്',
                question: 'ചോദ്യം',
                answered: 'ഉത്തരം നൽകി'
            },
            phq9: {
                title: 'PHQ‑9 ചോദനപ്പട്ടിക',
                intro: 'കഴിഞ്ഞ 2 ആഴ്ചകളിൽ, താഴെപ്പറയുന്ന പ്രശ്നങ്ങൾ എത്രത്തോളം നിങ്ങളെ ബുദ്ധിമുട്ടിച്ചു?',
                options: {
                    o0: 'ഒരിക്കലും ഇല്ല',
                    o1: 'ചില ദിവസങ്ങൾ',
                    o2: 'പല ദിവസങ്ങൾ',
                    o3: 'എല്ലാ ദിവസവും'
                }
            },
            gad7: {
                title: 'GAD‑7 ചോദനപ്പട്ടിക',
                intro: 'കഴിഞ്ഞ 2 ആഴ്ചകളിൽ, താഴെപ്പറയുന്ന പ്രശ്നങ്ങൾ എത്രത്തോളം നിങ്ങളെ ബുദ്ധിമുട്ടിച്ചു?',
                options: {
                    o0: 'ഒരിക്കലും ഇല്ല',
                    o1: 'ചില ദിവസങ്ങൾ',
                    o2: 'പല ദിവസങ്ങൾ',
                    o3: 'എല്ലാ ദിവസവും'
                }
            }
        }
    }
};

// Determine initial language from localStorage or browser
const saved = (typeof window !== 'undefined') ? localStorage.getItem('i18n:lang') : null;
const browserPref = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en';
const fallbackLng = saved ? saved : (
    browserPref.startsWith('hi') ? 'hi' :
        browserPref.startsWith('te') ? 'te' :
            browserPref.startsWith('ta') ? 'ta' :
                browserPref.startsWith('kn') ? 'kn' :
                    browserPref.startsWith('ml') ? 'ml' :
                        'en'
);

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: fallbackLng,
        fallbackLng: 'en',
        interpolation: { escapeValue: false }
    });

export default i18n;
