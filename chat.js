/* ============================================================
   CateringCare – Språk & Chatt
   Hanterar:
   1. Flerspråkigt innehåll (sv, en, ar, fi) via data-i18n
   2. Support-chatt mot Cloudflare Worker
   ============================================================ */

/* ── Konfig ─────────────────────────────────────────── */
var WORKER_URL = "https://cateringcare-info-site-01.andersmenyit.workers.dev/";

/* ── State ─────────────────��────────────────────────── */
var currentLang  = "sv";
var chatHistory  = [];

/* ============================================================
   ÖVERSÄTTNINGAR
   Varje nyckel matchar ett data-i18n-attribut i HTML
   ============================================================ */
var translations = {

  /* ── Svenska (standard) ───────────────────────────── */
  sv: {
    /* Header */
    tagline:       "Näringsrika måltider – enkelt och tryggt",
    navServices:   "Tjänster",
    navHow:        "Så fungerar det",
    navSupport:    "Support",
    navContact:    "Kontakta oss",
    navMenu:       "Meny / Beställ",

    /* Hero */
    heroTitle:     "Smarta måltidslösningar för äldre, företag och lokala butiker",
    heroText:      "CateringCare levererar näringsrika och färdiglagade måltider – enkelt, tryggt och flexibelt. Vi samarbetar med hemtjänst, företag och lokala butiker för att göra bra mat lättillgänglig där människor finns.",
    heroChat:      "Chatta med oss",
    heroMenu:      "Se meny / beställ",
    heroContact:   "Kontakta oss",
    heroNote:      "Maten levereras kyld och klar att värma – perfekt för en enkel och trygg måltid i vardagen.",

    /* Kort */
    card1Title:    "Hemtjänst",
    card1Text:     "Näringsrika måltider och trygg leverans som förenklar vardagen för personal och brukare.",
    card2Title:    "Företag / kontor",
    card2Text:     "Enkel lunchlösning: vi fyller kylskåp på jobbet med färska matlådor.",
    card3Title:    "Privatpersoner",
    card3Text:     "God mat utan krångel – beställ online och hämta hos återförsäljare eller partner.",
    card4Title:    "Bli återförsäljare",
    card4Text:     "Öka trafiken i butiken och skapa en extra intäktskälla med enkel hantering.",
    readMore:      "Läs mer →",

    /* Så fungerar det */
    howTitle:      "Så fungerar CateringCare",
    howIntro:      "CateringCare gör det enkelt att få tillgång till god och näringsrik mat – oavsett om du är privatperson, arbetar på kontor eller driver en verksamhet.",
    howListLabel:  "Vi lagar färdiga måltider som levereras till:",
    howItem1:      "Hemtjänstverksamheter",
    howItem2:      "Företag och kontor",
    howItem3:      "Lokala återförsäljare och mindre butiker",
    howItem4:      "Privatpersoner",
    howOutro:      "Maten levereras kyld och klar att värma – perfekt för en enkel och trygg måltid i vardagen. Färdiglagade måltidslösningar blir allt vanligare eftersom de sparar tid och gör det enklare att äta bra mat utan att behöva laga den själv.",

    /* Hemtjänst-sektion */
    homeTitle:     "För hemtjänst och omsorg",
    homeSub:       "Trygg matleverans för äldre",
    homeText:      "CateringCare levererar näringsrika måltider till personer med biståndsbeslut via hemtjänsten. Vi levererar maten till hemtjänstens lokaler där personalen enkelt kan ta med matlådor till brukarna.",
    benefitsLabel: "Fördelar",
    homeBen1:      "Näringsrika måltider anpassade för äldre",
    homeBen2:      "Enkel hantering för personal",
    homeBen3:      "Trygg och stabil leverans",
    homeBen4:      "Mindre administration för hemtjänsten",
    homeEnd:       "Vi hjälper er att göra måltiderna till en trygg del av omsorgen.",

    /* Företag-sektion */
    bizTitle:      "För företag och kontor",
    bizSub:        "Enkel lunch på jobbet",
    bizText:       "CateringCare levererar färdiga måltider direkt till kontor. Vi fyller ett kylskåp på arbetsplatsen med färska matlådor. Sedan kan medarbetare enkelt ta sin lunch när det passar.",
    bizBen1:       "Ingen lunchstress",
    bizBen2:       "Snabb och enkel måltid",
    bizBen3:       "Perfekt för mindre kontor utan egen restaurang",
    bizBen4:       "Mindre matsvinn",
    bizOutro:      "Den här typen av kontorslösningar blir allt vanligare eftersom de ger anställda enkel tillgång till bra mat utan att lämna arbetsplatsen.",

    /* Butiker-sektion */
    shopTitle:     "För butiker och återförsäljare",
    shopSub:       "Bli utlämningsställe för våra matlådor",
    shopText:      "Driver du en mindre livsmedelsbutik? Då kan du bli återförsäljare av CateringCares måltider.",
    shopStepLabel: "Konceptet fungerar ungefär som ett paketombud:",
    shopStep1:     "Kunden beställer sin mat online",
    shopStep2:     "Vi levererar till din butik",
    shopStep3:     "Kunden hämtar sin matlåda hos dig",
    shopBenLabel:  "Fördelar för butiken",
    shopBen1:      "Fler kunder i butiken",
    shopBen2:      "Extra intäktsmöjlighet",
    shopBen3:      "Enkel hantering",
    shopBen4:      "Lokal service för området",
    shopEnd:       "Ett smart sätt att kombinera matservice och lokal handel.",

    /* Privatpersoner-sektion */
    privTitle:     "För privatpersoner",
    privSub:       "God mat utan krångel",
    privText:      "För dig som vill ha en enkel och god måltid i vardagen.",
    privOpt1:      "Beställ online",
    privOpt2:      "Hämta hos återförsäljare",
    privOpt3:      "Eller via samarbetspartners",
    privForLabel:  "Perfekt för:",
    privFor1:      "äldre",
    privFor2:      "upptagna familjer",
    privFor3:      "personer som vill slippa laga mat varje dag",
    privChatBtn:   "Fråga i chatten",

    /* Chatt */
    chatTitle:       "Support & frågor",
    chatDesc:        "Har du frågor om menyer, beställning, leverans eller samarbeten? Skriv här så hjälper vi dig direkt.",
    chatPlaceholder: "Skriv din fråga…",
    chatSend:        "Skicka",
    chatHint:        "Om vi inte kan svara direkt, kontakta oss på",
    chatGreeting:    "Hej! Hur kan jag hjälpa dig idag?",
    chatThinking:    "Tänker…",
    chatErrorNet:    "Chatten är inte nåbar just nu. Försök igen senare.",
    chatErrorHttp:   "Det gick inte att kontakta chatten just nu. Försök igen senare.",
    chatErrorParse:  "Kunde inte läsa svaret. Försök igen.",
    chatErrorEmpty:  "Jag kunde inte svara just nu.",

    /* Kontakt */
    ctaTitle:   "Vill du samarbeta med oss?",
    ctaText:    "Vi söker just nu:",
    ctaItem1:   "hemtjänstverksamheter",
    ctaItem2:   "företag",
    ctaItem3:   "butiker som vill bli återförsäljare",
    ctaAction:  "Kontakta oss för mer information.",
    labelEmail: "E-post:",
    labelPhone: "Telefon:",
    ctaEmail:   "Maila oss"
  },

  /* ── English ──────────────────────────────────────── */
  en: {
    tagline:       "Nutritious meals – simple and safe",
    navServices:   "Services",
    navHow:        "How it works",
    navSupport:    "Support",
    navContact:    "Contact us",
    navMenu:       "Menu / Order",

    heroTitle:     "Smart meal solutions for the elderly, businesses and local stores",
    heroText:      "CateringCare delivers nutritious, ready-made meals – simple, safe and flexible. We partner with home care services, businesses and local stores to make good food accessible where people are.",
    heroChat:      "Chat with us",
    heroMenu:      "View menu / order",
    heroContact:   "Contact us",
    heroNote:      "Food is delivered chilled and ready to heat – perfect for a simple and safe everyday meal.",

    card1Title:    "Home care",
    card1Text:     "Nutritious meals and reliable delivery that simplifies everyday life for staff and clients.",
    card2Title:    "Business / office",
    card2Text:     "Easy lunch solution: we stock the office fridge with fresh meal boxes.",
    card3Title:    "Individuals",
    card3Text:     "Great food without hassle – order online and pick up at a retailer or partner.",
    card4Title:    "Become a retailer",
    card4Text:     "Increase store traffic and create an extra revenue stream with simple handling.",
    readMore:      "Read more →",

    howTitle:      "How CateringCare works",
    howIntro:      "CateringCare makes it easy to access good, nutritious food – whether you are an individual, work in an office or run a business.",
    howListLabel:  "We prepare ready-made meals delivered to:",
    howItem1:      "Home care services",
    howItem2:      "Businesses and offices",
    howItem3:      "Local retailers and smaller stores",
    howItem4:      "Individuals",
    howOutro:      "Food is delivered chilled and ready to heat – perfect for a simple and safe everyday meal. Ready-made meal solutions are becoming increasingly popular because they save time and make it easier to eat well without cooking yourself.",

    homeTitle:     "For home care services",
    homeSub:       "Safe meal delivery for the elderly",
    homeText:      "CateringCare delivers nutritious meals to people with home care assistance. We deliver to the home care facility where staff can easily bring meal boxes to clients.",
    benefitsLabel: "Benefits",
    homeBen1:      "Nutritious meals adapted for the elderly",
    homeBen2:      "Easy handling for staff",
    homeBen3:      "Reliable and stable delivery",
    homeBen4:      "Less administration for home care",
    homeEnd:       "We help you make mealtimes a safe part of care.",

    bizTitle:      "For businesses and offices",
    bizSub:        "Easy lunch at work",
    bizText:       "CateringCare delivers ready-made meals directly to offices. We stock a fridge at the workplace with fresh meal boxes. Employees can then easily grab their lunch when it suits them.",
    bizBen1:       "No lunch stress",
    bizBen2:       "Quick and easy meals",
    bizBen3:       "Perfect for smaller offices without a canteen",
    bizBen4:       "Less food waste",
    bizOutro:      "This type of office solution is becoming increasingly popular as it gives employees easy access to good food without leaving the workplace.",

    shopTitle:     "For stores and retailers",
    shopSub:       "Become a pick-up point for our meal boxes",
    shopText:      "Do you run a small grocery store? Then you can become a retailer of CateringCare meals.",
    shopStepLabel: "The concept works like a parcel pick-up point:",
    shopStep1:     "The customer orders food online",
    shopStep2:     "We deliver to your store",
    shopStep3:     "The customer picks up their meal box from you",
    shopBenLabel:  "Benefits for the store",
    shopBen1:      "More customers in the store",
    shopBen2:      "Extra revenue opportunity",
    shopBen3:      "Simple handling",
    shopBen4:      "Local service for the area",
    shopEnd:       "A smart way to combine food service and local trade.",

    privTitle:     "For individuals",
    privSub:       "Great food without hassle",
    privText:      "For you who want a simple and tasty everyday meal.",
    privOpt1:      "Order online",
    privOpt2:      "Pick up at a retailer",
    privOpt3:      "Or via partners",
    privForLabel:  "Perfect for:",
    privFor1:      "the elderly",
    privFor2:      "busy families",
    privFor3:      "people who want to skip cooking every day",
    privChatBtn:   "Ask in the chat",

    chatTitle:       "Support & questions",
    chatDesc:        "Do you have questions about menus, ordering, delivery or partnerships? Write here and we'll help you right away.",
    chatPlaceholder: "Type your question…",
    chatSend:        "Send",
    chatHint:        "If we can't answer right away, contact us at",
    chatGreeting:    "Hi! How can I help you today?",
    chatThinking:    "Thinking…",
    chatErrorNet:    "The chat is not reachable right now. Please try again later.",
    chatErrorHttp:   "Could not contact the chat right now. Please try again later.",
    chatErrorParse:  "Could not read the response. Please try again.",
    chatErrorEmpty:  "I couldn't answer right now.",

    ctaTitle:   "Want to partner with us?",
    ctaText:    "We are currently looking for:",
    ctaItem1:   "home care services",
    ctaItem2:   "businesses",
    ctaItem3:   "stores that want to become retailers",
    ctaAction:  "Contact us for more information.",
    labelEmail: "Email:",
    labelPhone: "Phone:",
    ctaEmail:   "Email us"
  },

  /* ── العربية ──────────────────────────────────────── */
  ar: {
    tagline:       "وجبات مغذية – بسيطة وآمنة",
    navServices:   "الخدمات",
    navHow:        "كيف يعمل",
    navSupport:    "الدعم",
    navContact:    "اتصل بنا",
    navMenu:       "القائمة / طلب",

    heroTitle:     "حلول وجبات ذكية لكبار السن والشركات والمتاجر المحلية",
    heroText:      "CateringCare تقدم وجبات مغذية وجاهزة – بسيطة وآمنة ومرنة. نتعاون مع خدمات الرعاية المنزلية والشركات والمتاجر المحلية لجعل الطعام الجيد في متناول الجميع.",
    heroChat:      "تحدث معنا",
    heroMenu:      "عرض القائمة / طلب",
    heroContact:   "اتصل بنا",
    heroNote:      "يتم توصيل الطعام مبرداً وجاهزاً للتسخين – مثالي لوجبة يومية بسيطة وآمنة.",

    card1Title:    "الرعاية المنزلية",
    card1Text:     "وجبات مغذية وتوصيل موثوق يبسط الحياة اليومية للموظفين والعملاء.",
    card2Title:    "الشركات / المكاتب",
    card2Text:     "حل غداء سهل: نملأ ثلاجة المكتب بصناديق وجبات طازجة.",
    card3Title:    "الأفراد",
    card3Text:     "طعام رائع بدون متاعب – اطلب عبر الإنترنت واستلم من بائع أو شريك.",
    card4Title:    "كن بائعاً",
    card4Text:     "زد حركة المتجر واخلق مصدر دخل إضافي بتعامل بسيط.",
    readMore:      "اقرأ المزيد ←",

    howTitle:      "كيف يعمل CateringCare",
    howIntro:      "CateringCare يجعل من السهل الحصول على طعام جيد ومغذي – سواء كنت فرداً أو تعمل في مكتب أو تدير عملاً.",
    howListLabel:  "نحضر وجبات جاهزة يتم توصيلها إلى:",
    howItem1:      "خدمات الرعاية المنزلية",
    howItem2:      "الشركات والمكاتب",
    howItem3:      "البائعون المحليون والمتاجر الصغيرة",
    howItem4:      "الأفراد",
    howOutro:      "يتم توصيل الطعام مبرداً وجاهزاً للتسخين – مثالي لوجبة يومية بسيطة وآمنة. حلول الوجبات الجاهزة أصبحت شائعة بشكل متزايد لأنها توفر الوقت وتسهل تناول طعام جيد.",

    homeTitle:     "لخدمات الرعاية المنزلية",
    homeSub:       "توصيل وجبات آمن لكبار السن",
    homeText:      "CateringCare تقدم وجبات مغذية للأشخاص الذين يحتاجون رعاية منزلية. نوصل الطعام إلى مرافق الرعاية حيث يمكن للموظفين إحضار الوجبات للعملاء.",
    benefitsLabel: "المزايا",
    homeBen1:      "وجبات مغذية مناسبة لكبار السن",
    homeBen2:      "تعامل سهل للموظفين",
    homeBen3:      "توصيل موثوق ومستقر",
    homeBen4:      "إدارة أقل للرعاية المنزلية",
    homeEnd:       "نساعدكم في جعل الوجبات جزءاً آمناً من الرعاية.",

    bizTitle:      "للشركات والمكاتب",
    bizSub:        "غداء سهل في العمل",
    bizText:       "CateringCare توصل وجبات جاهزة مباشرة إلى المكاتب. نملأ ثلاجة في مكان العمل بصناديق وجبات طازجة. يمكن للموظفين تناول غدائهم بسهولة.",
    bizBen1:       "لا ضغط وقت الغداء",
    bizBen2:       "وجبة سريعة وسهلة",
    bizBen3:       "مثالي للمكاتب الصغيرة",
    bizBen4:       "هدر طعام أقل",
    bizOutro:      "هذا النوع من حلول المكاتب يزداد شعبية لأنه يوفر للموظفين وصولاً سهلاً للطعام الجيد.",

    shopTitle:     "للمتاجر والبائعين",
    shopSub:       "كن نقطة استلام لصناديق وجباتنا",
    shopText:      "هل تدير متجر بقالة صغير؟ يمكنك أن تصبح بائعاً لوجبات CateringCare.",
    shopStepLabel: "المفهوم يعمل مثل نقطة استلام الطرود:",
    shopStep1:     "العميل يطلب الطعام عبر الإنترنت",
    shopStep2:     "نوصل إلى متجرك",
    shopStep3:     "العميل يستلم وجبته منك",
    shopBenLabel:  "مزايا للمتجر",
    shopBen1:      "المزيد من العملاء في المتجر",
    shopBen2:      "فرصة دخل إضافية",
    shopBen3:      "تعامل بسيط",
    shopBen4:      "خدمة محلية للمنطقة",
    shopEnd:       "طريقة ذكية للجمع بين خدمة الطعام والتجارة المحلية.",

    privTitle:     "للأفراد",
    privSub:       "طعام رائع بدون متاعب",
    privText:      "لك إذا كنت تريد وجبة يومية بسيطة ولذيذة.",
    privOpt1:      "اطلب عبر الإنترنت",
    privOpt2:      "استلم من بائع",
    privOpt3:      "أو عبر شركاء",
    privForLabel:  "مثالي لـ:",
    privFor1:      "كبار السن",
    privFor2:      "العائلات المشغولة",
    privFor3:      "من يريد التخلص من الطبخ اليومي",
    privChatBtn:   "اسأل في المحادثة",

    chatTitle:       "الدعم والأسئلة",
    chatDesc:        "هل لديك أسئلة حول القوائم أو الطلبات أو التوصيل أو الشراكات؟ اكتب هنا وسنساعدك مباشرة.",
    chatPlaceholder: "اكتب سؤالك…",
    chatSend:        "إرسال",
    chatHint:        "إذا لم نتمكن من الرد فوراً، تواصل معنا على",
    chatGreeting:    "مرحبًا! كيف يمكنني مساعدتك اليوم؟",
    chatThinking:    "جارٍ التفكير…",
    chatErrorNet:    "المحادثة غير متاحة حالياً. حاول مرة أخرى لاحقاً.",
    chatErrorHttp:   "تعذر الاتصال بالمحادثة. حاول مرة أخرى لاحقاً.",
    chatErrorParse:  "تعذرت قراءة الرد. حاول مرة أخرى.",
    chatErrorEmpty:  "لم أتمكن من الرد الآن.",

    ctaTitle:   "هل تريد الشراكة معنا؟",
    ctaText:    "نبحث حالياً عن:",
    ctaItem1:   "خدمات رعاية منزلية",
    ctaItem2:   "شركات",
    ctaItem3:   "متاجر تريد أن تصبح بائعين",
    ctaAction:  "تواصل معنا لمزيد من المعلومات.",
    labelEmail: "البريد:",
    labelPhone: "الهاتف:",
    ctaEmail:   "راسلنا"
  },

  /* ── Suomi ────────────────────────────────────────── */
  fi: {
    tagline:       "Ravitsevia aterioita – helposti ja turvallisesti",
    navServices:   "Palvelut",
    navHow:        "Näin se toimii",
    navSupport:    "Tuki",
    navContact:    "Ota yhteyttä",
    navMenu:       "Menu / Tilaa",

    heroTitle:     "Älykkäitä ateriaratkaisuja ikääntyneille, yrityksille ja paikallisille kaupoille",
    heroText:      "CateringCare toimittaa ravitsevia valmiita aterioita – helposti, turvallisesti ja joustavasti. Teemme yhteistyötä kotihoidon, yritysten ja paikallisten kauppojen kanssa.",
    heroChat:      "Keskustele kanssamme",
    heroMenu:      "Katso menu / tilaa",
    heroContact:   "Ota yhteyttä",
    heroNote:      "Ruoka toimitetaan jäähdytettynä ja lämmitysvalmiina – täydellinen yksinkertaiseen ja turvalliseen arkiaterialle.",

    card1Title:    "Kotihoito",
    card1Text:     "Ravitsevia aterioita ja luotettava toimitus, joka helpottaa henkilökunnan ja asiakkaiden arkea.",
    card2Title:    "Yritys / toimisto",
    card2Text:     "Helppo lounasratkaisu: täytämme toimiston jääkaapin tuoreilla aterioilla.",
    card3Title:    "Yksityishenkilöt",
    card3Text:     "Hyvää ruokaa vaivattomasti – tilaa verkosta ja nouda jälleenmyyjältä.",
    card4Title:    "Ryhdy jälleenmyyjäksi",
    card4Text:     "Lisää asiakkaita kauppaan ja luo lisätuloja helpolla käsittelyllä.",
    readMore:      "Lue lisää →",

    howTitle:      "Näin CateringCare toimii",
    howIntro:      "CateringCare tekee helpoksi saada hyvää ja ravitsevaa ruokaa – olet sitten yksityishenkilö, toimistotyöntekijä tai yrittäjä.",
    howListLabel:  "Valmistamme valmiita aterioita, jotka toimitetaan:",
    howItem1:      "Kotihoitopalvelut",
    howItem2:      "Yritykset ja toimistot",
    howItem3:      "Paikalliset jälleenmyyjät ja pienet kaupat",
    howItem4:      "Yksityishenkilöt",
    howOutro:      "Ruoka toimitetaan jäähdytettynä ja lämmitysvalmiina. Valmiit ateriaratkaisut yleistyvät, koska ne säästävät aikaa ja helpottavat syömistä.",

    homeTitle:     "Kotihoitopalveluille",
    homeSub:       "Turvallinen ateriatoimitus ikääntyneille",
    homeText:      "CateringCare toimittaa ravitsevia aterioita kotihoidon asiakkaille. Toimitamme ruoan kotihoidon tiloihin, josta henkilökunta vie ateriat asiakkaille.",
    benefitsLabel: "Edut",
    homeBen1:      "Ikääntyneille sopivat ravitsevat ateriat",
    homeBen2:      "Helppo käsittely henkilökunnalle",
    homeBen3:      "Luotettava ja vakaa toimitus",
    homeBen4:      "Vähemmän hallintoa kotihoidolle",
    homeEnd:       "Autamme tekemään aterioista turvallisen osan hoitoa.",

    bizTitle:      "Yrityksille ja toimistoille",
    bizSub:        "Helppo lounas töissä",
    bizText:       "CateringCare toimittaa valmiita aterioita suoraan toimistoihin. Täytämme jääkaapin tuoreilla aterioilla. Työntekijät voivat helposti ottaa lounaansa.",
    bizBen1:       "Ei lounasstressiä",
    bizBen2:       "Nopea ja helppo ateria",
    bizBen3:       "Täydellinen pienille toimistoille",
    bizBen4:       "Vähemmän ruokahävikkiä",
    bizOutro:      "Tämäntyyppiset toimistoratkaisut yleistyvät, koska ne tarjoavat työntekijöille helpon pääsyn hyvään ruokaan.",

    shopTitle:     "Kaupoille ja jälleenmyyjille",
    shopSub:       "Ryhdy noutopisteeksi ateriaboxeillemme",
    shopText:      "Pidätkö pientä ruokakauppaa? Voit ryhtyä CateringCare-jälleenmyyjäksi.",
    shopStepLabel: "Konsepti toimii kuin pakettiautomaatti:",
    shopStep1:     "Asiakas tilaa ruoan verkosta",
    shopStep2:     "Toimitamme kauppaasi",
    shopStep3:     "Asiakas noutaa ateriaboxinsa sinulta",
    shopBenLabel:  "Edut kaupalle",
    shopBen1:      "Enemmän asiakkaita kaupassa",
    shopBen2:      "Lisätuloja",
    shopBen3:      "Helppo käsittely",
    shopBen4:      "Paikallista palvelua alueelle",
    shopEnd:       "Älykäs tapa yhdistää ruokapalvelu ja paikallinen kauppa.",

    privTitle:     "Yksityishenkilöille",
    privSub:       "Hyvää ruokaa vaivattomasti",
    privText:      "Sinulle, joka haluat helpon ja herkullisen arkiaterian.",
    privOpt1:      "Tilaa verkosta",
    privOpt2:      "Nouda jälleenmyyjältä",
    privOpt3:      "Tai kumppanien kautta",
    privForLabel:  "Sopii erityisesti:",
    privFor1:      "ikääntyneille",
    privFor2:      "kiireisille perheille",
    privFor3:      "niille, jotka haluavat välttää päivittäisen ruoanlaiton",
    privChatBtn:   "Kysy chatissa",

    chatTitle:       "Tuki & kysymykset",
    chatDesc:        "Onko sinulla kysyttävää menusta, tilauksesta, toimituksesta tai yhteistyöstä? Kirjoita tähän niin autamme heti.",
    chatPlaceholder: "Kirjoita kysymyksesi…",
    chatSend:        "Lähetä",
    chatHint:        "Jos emme voi vastata heti, ota yhteyttä osoitteeseen",
    chatGreeting:    "Hei! Kuinka voin auttaa tänään?",
    chatThinking:    "Mietitään…",
    chatErrorNet:    "Chat ei ole tavoitettavissa juuri nyt. Yritä myöhemmin.",
    chatErrorHttp:   "Yhteyttä chattiin ei saatu. Yritä myöhemmin.",
    chatErrorParse:  "Vastausta ei voitu lukea. Yritä uudelleen.",
    chatErrorEmpty:  "En pystynyt vastaamaan juuri nyt.",

    ctaTitle:   "Haluatko tehdä yhteistyötä?",
    ctaText:    "Etsimme juuri nyt:",
    ctaItem1:   "kotihoitopalveluita",
    ctaItem2:   "yrityksiä",
    ctaItem3:   "kauppoja, jotka haluavat ryhtyä jälleenmyyjiksi",
    ctaAction:  "Ota yhteyttä lisätietoja varten.",
    labelEmail: "Sähköposti:",
    labelPhone: "Puhelin:",
    ctaEmail:   "Lähetä sähköposti"
  }
};


/* ============================================================
   SPRÅKBYTE
   Hittar alla element med data-i18n och uppdaterar textContent.
   Placeholder-texter hanteras via data-i18n-placeholder.
   ============================================================ */

/**
 * setLang – Byter språk på hela sidan
 * @param {string} lang – Språkkod: "sv", "en", "ar" eller "fi"
 */
function setLang(lang) {
  /* Validera att språket finns */
  if (!translations[lang]) return;

  currentLang = lang;
  var t = translations[lang];

  /* Uppdatera html lang-attribut */
  document.documentElement.lang = lang;

  /* Sätt textrikting för arabiska */
  document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";

  /* Uppdatera alla data-i18n-element */
  var elements = document.querySelectorAll("[data-i18n]");
  for (var i = 0; i < elements.length; i++) {
    var key = elements[i].getAttribute("data-i18n");
    if (t[key]) {
      elements[i].textContent = t[key];
    }
  }

  /* Uppdatera alla data-i18n-placeholder (input-fält) */
  var placeholders = document.querySelectorAll("[data-i18n-placeholder]");
  for (var j = 0; j < placeholders.length; j++) {
    var pKey = placeholders[j].getAttribute("data-i18n-placeholder");
    if (t[pKey]) {
      placeholders[j].placeholder = t[pKey];
    }
  }

  /* Uppdatera aktiv flaggknapp */
  var buttons = document.querySelectorAll(".lang-btn");
  for (var k = 0; k < buttons.length; k++) {
    buttons[k].classList.remove("active");
    if (buttons[k].getAttribute("data-lang") === lang) {
      buttons[k].classList.add("active");
    }
  }

  /* Nollställ chatten med nytt välkomstmeddelande */
  chatHistory = [];
  var chatEl = document.getElementById("chatMessages");
  if (chatEl) {
    chatEl.innerHTML = "";
    addMessage("assistant", t.chatGreeting);
  }
}


/* ============================================================
   CHATT-FUNKTIONER
   Kommunikation med Cloudflare Worker via POST
   ============================================================ */

/**
 * addMessage – Skapar en chatbubbla i chattfönstret
 * @param {string} role – "user" eller "assistant"
 * @param {string} text – Meddelandetext (visas som ren text, ej HTML)
 */
function addMessage(role, text) {
  var chatEl = document.getElementById("chatMessages");
  if (!chatEl) return;

  var row = document.createElement("div");
  row.className = "msg " + role;

  var bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  row.appendChild(bubble);
  chatEl.appendChild(row);
  chatEl.scrollTop = chatEl.scrollHeight;
}

/**
 * ask – Skickar fråga till Cloudflare Worker och visar svaret
 * @param {string} question – Användarens fråga
 */
async function ask(question) {
  var t = translations[currentLang];

  /* Visa laddningsindikator */
  addMessage("assistant", t.chatThinking);

  var payload = {
    question: question,
    history:  chatHistory.slice(-10),
    lang:     currentLang
  };

  /* Skicka till Worker */
  var res;
  try {
    res = await fetch(WORKER_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload)
    });
  } catch (err) {
    /* Nätverksfel */
    removeLastMessage();
    addMessage("assistant", t.chatErrorNet);
    return;
  }

  /* Ta bort laddningsbubblan */
  removeLastMessage();

  /* HTTP-fel */
  if (!res.ok) {
    addMessage("assistant", t.chatErrorHttp);
    return;
  }

  /* Parsa JSON-svar */
  var data;
  try {
    data = await res.json();
  } catch (parseErr) {
    addMessage("assistant", t.chatErrorParse);
    return;
  }

  var answer = (data && data.answer) ? data.answer : t.chatErrorEmpty;

  /* Spara i lokal historik */
  chatHistory.push({ role: "user",      content: question });
  chatHistory.push({ role: "assistant",  content: answer });

  /* Begränsa historikstorlek */
  if (chatHistory.length > 20) {
    chatHistory = chatHistory.slice(-20);
  }

  addMessage("assistant", answer);
}

/**
 * removeLastMessage – Tar bort sista bubblan (laddningsindikatorn)
 */
function removeLastMessage() {
  var chatEl = document.getElementById("chatMessages");
  if (chatEl && chatEl.lastChild) {
    chatEl.lastChild.remove();
  }
}

/**
 * escapeHtml – Skyddar mot XSS genom att konvertera HTML-tecken
 * @param {string} text – Råtext
 * @returns {string} – Säker text
 */
function escapeHtml(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


/* ============================================================
   INIT – Körs när sidan laddar
   ============================================================ */
(function init() {
  /* Sätt aktuellt år i footer */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Visa worker-host i chip */
  var chipEl = document.getElementById("workerChip");
  if (chipEl) {
    try {
      chipEl.textContent = "Worker: " + new URL(WORKER_URL).host;
    } catch (e) {
      chipEl.textContent = "Worker: ej konfigurerad";
    }
  }

  /* Koppla flaggknappar */
  var langButtons = document.querySelectorAll(".lang-btn");
  for (var i = 0; i < langButtons.length; i++) {
    langButtons[i].addEventListener("click", function () {
      var lang = this.getAttribute("data-lang");
      if (lang) setLang(lang);
    });
  }

  /* Koppla chattformuläret */
  var formEl = document.getElementById("chatForm");
  if (formEl) {
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      var inputEl = document.getElementById("chatInput");
      if (!inputEl) return;

      var q = inputEl.value.trim();
      if (!q) return;

      addMessage("user", q);
      inputEl.value = "";
      ask(q);
    });
  }

  /* Visa välkomstmeddelande */
  setLang("sv");
})();
