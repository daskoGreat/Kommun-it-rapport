import { Section, ReportRecommendation, SurveyResponse } from '@/types/survey';

const LIKERT_SCALE = [
    { value: 4, label: 'Instämmer helt' },
    { value: 3, label: 'Instämmer delvis' },
    { value: 2, label: 'Varken eller' },
    { value: 1, label: 'Instämmer inte' },
    { value: 0, label: 'Vet ej' },
];

export const surveySections: Section[] = [
    {
        id: 'intro',
        title: 'Introduktion & Nuläge',
        description: 'Svara på följande frågor om din roll och er nuvarande situation.',
        questions: [
            {
                id: 'role',
                text: '1. Vad har du för roll i organisationen?',
                type: 'text',
            },
            {
                id: 'q2_time',
                text: '2. Hur ofta uppstår utmaningar med att hålla tidsplanen för digitaliseringsprojekt och initiativ?',
                type: 'multiple-choice',
                options: [
                    { value: 'very_rare', label: 'Väldigt sällan' },
                    { value: 'rare', label: 'Sällan' },
                    { value: 'sometimes', label: 'Emellanåt' },
                    { value: 'often', label: 'Ofta' },
                    { value: 'very_often', label: 'Väldigt ofta' },
                    { value: 'dont_know', label: 'Vet ej' },
                ],
            },
            {
                id: 'q3_it_role',
                text: '3. Vilken roll upplever du att IT har i verksamheten?',
                type: 'multiple-choice',
                options: [
                    { value: 'enabler', label: 'Möjliggörare' },
                    { value: 'blocker', label: 'Hinder' },
                    { value: 'neither', label: 'Varken eller' },
                    { value: 'dont_know', label: 'Vet ej' },
                ],
            },
            {
                id: 'q4_tech_env',
                text: '4. Hur skulle du beskriva er nuvarande teknikmiljö när det gäller flexibilitet och modernitet?',
                type: 'multiple-choice',
                options: [
                    { value: 'flexible', label: 'Flexibel och modern' },
                    { value: 'functional', label: 'Fungerande' },
                    { value: 'inflexible', label: 'Inflexibel och omodern' },
                    { value: 'dont_know', label: 'Vet ej' },
                ],
            },
            {
                id: 'q5_ideas',
                text: '5. Hur fungerar samspelet mellan medarbetarnas idéer och de system som används idag?',
                type: 'multiple-choice',
                options: [
                    { value: 'very_good', label: 'Väldigt bra' },
                    { value: 'good', label: 'Bra' },
                    { value: 'ok', label: 'Okej' },
                    { value: 'bad', label: 'Dåligt' },
                    { value: 'very_bad', label: 'Väldigt dåligt' },
                    { value: 'dont_know', label: 'Vet ej' },
                ],
            },
            {
                id: 'q6_decisions',
                text: '6. Hur upplever ni beslutsprocesserna kring innovation?',
                type: 'multiple-choice',
                options: [
                    { value: 'fast', label: 'Snabba' },
                    { value: 'slow', label: 'Långsamma' },
                    { value: 'varying', label: 'Varierande' },
                    { value: 'unclear', label: 'Otydliga' },
                    { value: 'dont_know', label: 'Vet ej' },
                ],
            },
            {
                id: 'q7_maintenance',
                text: '7. Hur stor del av arbetet går åt till att hantera befintliga lösningar jämfört med att utveckla nya?',
                type: 'multiple-choice',
                options: [
                    { value: 'majority', label: 'Den absoluta majoriteten' },
                    { value: '75', label: 'ca 75%' },
                    { value: 'half', label: 'Ungefär hälften' },
                    { value: '25', label: 'ca 25%' },
                    { value: 'almost_none', label: 'Nästan inget' },
                    { value: 'dont_know', label: 'Vet ej' },
                ],
            },
            {
                id: 'q8_effects',
                text: '8. Hur väl motsvarar era digitaliseringsinvesteringar de effekter ni förväntade er?',
                type: 'multiple-choice',
                options: [
                    { value: 'very_well', label: 'Mycket väl' },
                    { value: 'well', label: 'Väl' },
                    { value: 'quite_well', label: 'Ganska väl' },
                    { value: 'partially', label: 'Till del' },
                    { value: 'not_at_all', label: 'Inte alls' },
                    { value: 'dont_know', label: 'Vet ej' },
                ],
            },
            {
                id: 'q9_priorities',
                text: '9. Hur tydliga upplever ni att prioriteringar och riktning är inom organisationen?',
                type: 'multiple-choice',
                options: [
                    { value: 'very_clear', label: 'Mycket tydliga' },
                    { value: 'clear', label: 'Tydliga' },
                    { value: 'quite_clear', label: 'Ganska tydliga' },
                    { value: 'unclear', label: 'Otydliga' },
                    { value: 'very_unclear', label: 'Mycket otydliga' },
                    { value: 'dont_know', label: 'Vet ej' },
                ],
            },
            {
                id: 'q10_methods',
                text: '10. Hur väl stämmer arbetssätten överens med de verktyg som finns tillgängliga?',
                type: 'multiple-choice',
                options: [
                    { value: 'very_well', label: 'Mycket väl' },
                    { value: 'well', label: 'Väl' },
                    { value: 'quite_well', label: 'Ganska väl' },
                    { value: 'bad', label: 'Dåligt' },
                    { value: 'very_bad', label: 'Mycket dåligt' },
                    { value: 'dont_know', label: 'Vet ej' },
                ],
            },
        ],
    },
    {
        id: 'digitalt_arv',
        title: 'Digitalt Arv',
        description: 'Hur väl stämmer följande påståenden om det digitala arvet i organisationen?',
        questions: [
            {
                id: 'q11_legacy',
                text: '11. Digitalt Arv',
                type: 'likert',
                columns: LIKERT_SCALE,
                rows: [
                    { id: 'l_competence', text: 'IT har den kompetens och de resurser som krävs för att möta verksamhetens behov, både idag och i takt med att organisationen utvecklas.' },
                    { id: 'l_environment', text: 'Arbetsmiljön är generellt bra.' },
                    { id: 'l_support', text: 'IT-avdelningen gör ett bra jobb och stöttar verksamheten på det sätt som behövs.' },
                    { id: 'l_collab', text: 'Verksamhet och IT jobbar tillsammans för att skapa fungerande systemlösningar.' },
                    { id: 'l_tech_support', text: 'System och annan teknik stöttar i det dagliga arbetet. Det är möjligt att skapa, hantera, lagra och dela data.' },
                    { id: 'l_shadow_it', text: 'Verksamheten använder system som inte är godkända/inköpa av IT-avdelningen.' }, // High value here might be bad/good depending on view, but usually implies shadow IT.
                    { id: 'l_tech_debt', text: 'Organisationen har en teknisk skuld, dvs använder system som hindrar utveckling och dyra att förvalta.' }, // High is bad
                    { id: 'l_governance', text: 'IT styrs så att det skapas förutsättningar för både effektivitet och innovation.' },
                ]
            }
        ]
    },
    {
        id: 'digital_formaga',
        title: 'Digital Förmåga',
        description: 'Hur väl stämmer följande påståenden om den digitala förmågan i organisationen?',
        questions: [
            {
                id: 'q12_capability',
                text: '12. Digital Förmåga',
                type: 'likert',
                columns: LIKERT_SCALE,
                rows: [
                    { id: 'c_strategy', text: 'Organisationens digitaliseringsinitiativ kopplas till den strategiska planeringen.' },
                    { id: 'c_maintenance', text: 'Förvaltningsorganisationen sköter den löpande hanteringen och vidareutvecklingen av system och IT-tjänster.' },
                    { id: 'c_projects', text: 'Digital utveckling sker ofta i projektform.' },
                    { id: 'c_cloud', text: 'De flesta av våra digitala lösningar och system finns idag på internet istället för på egna servrar.' },
                    { id: 'c_lifecycle', text: 'De ekonomiska ramarna för ett system omfattar hela livscykeln - utveckling, förvaltning och avveckling.' },
                    { id: 'c_security', text: 'Verksamheten har en hög nivå av säkerhet och integritet. Information hanteras utifrån krav på konfidentialitet, riktighet och tillgänglighet.' },
                    { id: 'c_standards', text: 'Vi arbetar med standarder för att skapa enhetliga och transparenta rutiner som alla kan enas kring.' },
                    { id: 'c_users', text: 'Slutanvändarna (medarbetare, medborgare, företag) involveras på resan mot den nya digitala lösningen.' },
                    { id: 'c_open_data', text: 'Vi använder öppet tillgänglig information som alla får använda för att utveckla och förbättra våra tjänster – både internt och för samhällets bästa.' },
                    { id: 'c_open_source', text: 'Vi använder program/appar med öppen källkod som alla får anpassa och vidareutveckla.' },
                    { id: 'c_culture', text: 'Vi har en kultur som präglas av nyfikenhet och lärande, uppmuntrar nya idéer och utmanar invanda sätt att göra saker på.' },
                    { id: 'c_digital_first', text: 'Digitala lösningar är förstahandsvalet vid all form av verksamhetsutveckling.' },
                    { id: 'c_spread', text: 'Vi sprider digitala initiativ från enskilda avdelningar och enheter så att de kan användas i stora delar av verksamheten och har gemensam förvaltning och drift.' },
                    { id: 'c_budget', text: 'Det finns en budget avsedd för digitaliseringsinitiativ.' },
                    { id: 'c_estimates', text: 'Vi har realistiska kostnadsestimat dom följs upp regelbundet.' },
                    { id: 'c_balance', text: 'Vi prioriterar digitala satsningar så att det blir en bra balans mellan effektiviseringssatsningar och innovation.' },
                    { id: 'c_followup', text: 'Vi följer upp och utvärderar nyttor av tidigare genomförda digitala initiativ.' },
                    { id: 'c_competence', text: 'Genom kompetensutveckling och rekrytering möjliggör vi nya arbetssätt för att kunna bygga de organisatoriska förmågor som behövs för en värdeskapande digitalisering.' },
                ]
            }
        ]
    }
];

// Helper to check for "bad" answers safe-guarded against missing data
const hasValue = (response: SurveyResponse, id: string, values: string[]) => {
    const val = response[id] as string; // Cast as string for simple checks
    return values.includes(val);
};

export const recommendations: ReportRecommendation[] = [
    {
        id: 'rec_basic_it',
        title: 'Modernisera grundläggande IT-miljö',
        description: 'Era svar indikerar utmaningar med grundläggande stabilitet och tidsplaner. Fokusera på att bygga en stabil, modern bas.',
        priority: 'high',
        trigger: (r) => {
            return (
                hasValue(r, 'q2_time', ['often', 'very_often']) ||
                hasValue(r, 'q3_it_role', ['blocker']) ||
                hasValue(r, 'q4_tech_env', ['inflexible'])
            );
        },
    },
    {
        id: 'rec_platform',
        title: 'Skapa en modern plattform',
        description: 'Era beslutsprocesser och gamla system verkar hämma innovationen. Prioritera att fasa ut "Legacy" och effektivisera förvaltningen.',
        priority: 'high',
        trigger: (r) => {
            return (
                hasValue(r, 'q5_ideas', ['bad', 'very_bad']) ||
                hasValue(r, 'q6_decisions', ['slow', 'unclear']) ||
                hasValue(r, 'q7_maintenance', ['majority', '75'])
            );
        },
    },
    {
        id: 'rec_direction',
        title: 'Gemensam riktning och styrning',
        description: 'Det verkar finnas otydlighet kring prioriteringar och effekter. Stärk styrningen och matcha verktyg med arbetssätt.',
        priority: 'high',
        trigger: (r) => {
            return (
                hasValue(r, 'q8_effects', ['partially', 'not_at_all']) ||
                hasValue(r, 'q9_priorities', ['unclear', 'very_unclear']) ||
                hasValue(r, 'q10_methods', ['bad', 'very_bad'])
            );
        },
    },
];
