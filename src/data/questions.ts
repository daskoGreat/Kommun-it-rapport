import { Section, ReportRecommendation } from '@/types/survey';

export const surveySections: Section[] = [
    {
        id: 'digitalmognad',
        title: 'Digital Mognad',
        description: 'Svara Ja om påståendet stämmer för er organisation (indikerar en utmaning).',
        questions: [
            {
                id: 'dm_1',
                text: 'Vi har ofta utmaningar med att hålla tidsplanen för digitaliseringsprojekt och initiativ.',
                type: 'yes-no',
            },
            {
                id: 'dm_2',
                text: 'IT upplevs ofta som ett hinder eller en "bromskloss" i verksamheten.',
                type: 'yes-no',
            },
            {
                id: 'dm_3',
                text: 'Vår nuvarande teknikmiljö upplevs som inflexibel och omodern.',
                type: 'yes-no',
            },
            {
                id: 'dm_4',
                text: 'Medarbetarnas idéer hämmas av de system som används idag.',
                type: 'yes-no',
            },
            {
                id: 'dm_5',
                text: 'Beslutsprocesserna kring innovation är långsamma.',
                type: 'yes-no',
            },
            {
                id: 'dm_6',
                text: 'En majoritet av arbetstiden går åt till att hantera/laga befintliga lösningar snarare än att utveckla nya.',
                type: 'yes-no',
            },
            {
                id: 'dm_7',
                text: 'Våra digitaliseringsinvesteringar motsvarar sällan de effekter vi förväntade oss.',
                type: 'yes-no',
            },
            {
                id: 'dm_8',
                text: 'Prioriteringar och riktning inom organisationen upplevs som otydliga.',
                type: 'yes-no',
            },
            {
                id: 'dm_9',
                text: 'Våra arbetssätt stämmer dåligt överens med de verktyg som finns tillgängliga.',
                type: 'yes-no',
            },
        ],
    },
    {
        id: 'digitaltarv',
        title: 'Digitalt Arv',
        description: 'Kryssa för de påståenden som stämmer.',
        questions: [
            {
                id: 'arv_org',
                text: 'Dimension Organisation',
                type: 'checkbox',
                options: [
                    { id: 'arv_org_1', label: 'IT har den kompetens som behövs för att kunna matcha verksamhetens behov.', value: 'it_kompetens' },
                    { id: 'arv_org_2', label: 'Arbetsmiljön är generellt bra.', value: 'bra_arbetsmiljo' },
                ],
            },
            {
                id: 'arv_user',
                text: 'Dimension Användare',
                type: 'checkbox',
                options: [
                    { id: 'arv_user_1', label: 'IT-avdelningen gör ett bra jobb och stöttar verksamheten på det sätt som behövs.', value: 'it_stottar' },
                    { id: 'arv_user_2', label: 'Verksamhet och IT jobbar tillsammans för att skapa fungerande systemlösningar.', value: 'samarbete' },
                ],
            },
            {
                id: 'arv_tech',
                text: 'Dimension Teknik',
                type: 'checkbox',
                options: [
                    { id: 'arv_tech_1', label: 'System och annan teknik stöttar i det dagliga arbetet; det är möjligt att skapa, hantera, laga och dela data.', value: 'teknik_stottar' },
                    { id: 'arv_tech_2', label: 'Verksamheten använder system som inte är godkända/inköpta av IT-avdelningen (skugg-IT).', value: 'skuggit' },
                    { id: 'arv_tech_3', label: 'Organisationen har en teknisk skuld (system som hindrar utveckling och är dyra).', value: 'teknisk_skuld' },
                    { id: 'arv_tech_4', label: 'IT styrs så att det skapas förutsättningar för både effektivitet och innovation.', value: 'it_styrning' },
                ],
            },
        ],
    },
    {
        id: 'digitalformaga',
        title: 'Digital Förmåga',
        description: 'Kryssa för de påståenden som stämmer.',
        questions: [
            {
                id: 'df_effektivitet',
                text: 'Dimension Effektivitet',
                type: 'checkbox',
                options: [
                    { id: 'df_eff_1', label: 'Organisationens digitaliseringsinitiativ kopplas till den strategiska planeringen.', value: 'strat_plan' },
                    { id: 'df_eff_2', label: 'Förvaltningsorganisationen sköter den löpande hanteringen och vidareutvecklingen av system och IT-tjänster.', value: 'forvaltning' },
                    { id: 'df_eff_3', label: 'Digital utveckling sker ofta i projektform.', value: 'projektform' },
                    { id: 'df_eff_4', label: 'Infrastrukturen är till största del i molnet.', value: 'molnet' },
                    { id: 'df_eff_5', label: 'De ekonomiska ramarna för ett system omfattar hela livscykeln (utveckling, förvaltning, avveckling).', value: 'livscykel' },
                    { id: 'df_eff_6', label: 'Verksamheten har en hög nivå av säkerhet och integritet.', value: 'sakerhet' },
                    { id: 'df_eff_7', label: 'Vi arbetar med standarder för att skapa enhetliga och transparenta rutiner.', value: 'standarder' },
                ],
            },
            {
                id: 'df_innovation',
                text: 'Dimension Innovation',
                type: 'checkbox',
                options: [
                    { id: 'df_inn_1', label: 'Slutanvändarna involveras på resan mot den nya digitala lösningen.', value: 'anvandar_involv' },
                    { id: 'df_inn_2', label: 'Vi använder oss av allmänt tillgängliggjord data (öppen data).', value: 'oppen_data' },
                    { id: 'df_inn_3', label: 'Vi använder öppen källkod.', value: 'open_source' },
                    { id: 'df_inn_4', label: 'Vi har en kultur som präglas av nyfikenhet och lärande.', value: 'kultur' },
                    { id: 'df_inn_5', label: 'Digitala lösningar är förstahandsvalet vid all form av verksamhetsutveckling.', value: 'digitalt_forst' },
                    { id: 'df_inn_6', label: 'Vi sprider digitala initiativ från enskilda avdelningar till hela verksamheten.', value: 'spridning' },
                ],
            },
            {
                id: 'df_balans',
                text: 'Dimension Balansering',
                type: 'checkbox',
                options: [
                    { id: 'df_bal_1', label: 'Det finns en budget avsedd för digitaliseringsinitiativ.', value: 'budget' },
                    { id: 'df_bal_2', label: 'Vi har realistiska kostnadsestimat som följs upp regelbundet.', value: 'kostnadsestimat' },
                    { id: 'df_bal_3', label: 'Vi prioriterar digitala satsningar för balans mellan effektivisering och innovation.', value: 'prioritering' },
                    { id: 'df_bal_4', label: 'Vi följer upp och utvärderar nyttor av tidigare initiativ.', value: 'uppfoljning' },
                    { id: 'df_bal_5', label: 'Vi möjliggör nya arbetssätt genom kompetensutveckling och rekrytering.', value: 'kompetens' },
                ],
            },
        ],
    },
    {
        id: 'vision',
        title: 'Verksamhetens Vision',
        description: 'Beskriv visionen för att se hur väl arbetet stämmer överens.',
        questions: [
            {
                id: 'vision_text',
                text: 'Vad är verksamhetens vision?',
                type: 'text'
            }
        ]
    }
];

export const recommendations: ReportRecommendation[] = [
    {
        id: 'rec_basic_it',
        title: 'Modernisera grundläggande IT-miljö',
        description: 'Era svar indikerar utmaningar med grundläggande stabilitet, tidsplaner och IT-rollens funktion. Fokusera på att bygga en stabil, modern bas innan ni skalar upp innovation.',
        priority: 'high',
        trigger: (r) => Boolean(r['dm_1']) && Boolean(r['dm_2']) && Boolean(r['dm_3']), // 1-3
    },
    {
        id: 'rec_platform',
        title: 'Skapa en modern plattform',
        description: 'Era system verkar hämma idéer och beslutsprocesser. Prioritera att fasa ut gamla system ("Legacy") och införa en plattform som stödjer snabbare förändring.',
        priority: 'high',
        trigger: (r) => Boolean(r['dm_4']) && Boolean(r['dm_5']) && Boolean(r['dm_6']), // 4-6
    },
    {
        id: 'rec_direction',
        title: 'Gemensam riktning och styrning',
        description: 'Det verkar finnas otydlighet kring effekter och riktning. Stärk styrningen och säkerställ att arbetssätt matchar verktygen för att få ut värde av investeringar.',
        priority: 'high',
        trigger: (r) => Boolean(r['dm_7']) && Boolean(r['dm_8']) && Boolean(r['dm_9']), // 7-9
    },
];
