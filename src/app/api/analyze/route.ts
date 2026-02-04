import { NextRequest, NextResponse } from 'next/server';
import { surveySections } from '@/data/questions';

const allQuestions = surveySections.flatMap(s => s.questions);

function findQuestion(id: string) {
    return allQuestions.find(q => q.id === id);
}

function formatAnswer(answer: any, question: any) {
    if (!answer) return 'Inget svar';

    if (question.type === 'multiple-choice') {
        const option = question.options?.find((opt: any) => opt.value === answer);
        return option ? option.label : answer;
    }

    if (question.type === 'likert') {
        if (typeof answer === 'object') {
            return Object.entries(answer).map(([rowId, colValue]) => {
                const row = question.rows?.find((r: any) => r.id === rowId);
                const col = question.columns?.find((c: any) => c.value == colValue); // loose eq
                return `${row?.text || rowId}: ${col?.label || colValue}`;
            }).join('\n   ');
        }
    }

    // Fallback for text
    return answer;
}

import { generateItReport } from '@/lib/llm';

export const maxDuration = 60; // Allow up to 60 seconds for LLM generation
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { responses, aggregatedResponses, kommunName } = body;

        let responseSummary = '';

        if (aggregatedResponses) {
            responseSummary = `ARBETSPLATS: ${kommunName}\n\nDATA FRÅN FLERA ROLLER:\n`;
            aggregatedResponses.forEach((res: any) => {
                responseSummary += `--- ROLL: ${res.role} (Användare: ${res.user}) ---\n`;
                Object.entries(res.answers).forEach(([qId, answer]) => {
                    const question = findQuestion(qId);
                    if (question) {
                        responseSummary += `F: ${question.text}\nS: ${formatAnswer(answer, question)}\n`;
                    }
                });
                responseSummary += '\n';
            });
        } else if (responses) {
            responseSummary = 'ENSTAKA SVAR:\n';
            Object.entries(responses).forEach(([qId, answer]) => {
                const question = findQuestion(qId);
                if (question) {
                    responseSummary += `F: ${question.text}\nS: ${formatAnswer(answer, question)}\n`;
                }
            });
        } else {
            return NextResponse.json({ error: 'No data provided' }, { status: 400 });
        }

        const prompt = `Du är en senior IT-strateg och rådgivare som analyserar IT-mognad för organisationer.

${responseSummary}

UPPGIFT:
Analysera samtliga svar och skapa en formell rapport som är direkt lämpad för en ledningsgrupp eller styrgrupp. 
${aggregatedResponses ? 'Då detta är en sammanvägd rapport från FLERA olika roller ska du särskilt uppmärksamma var deras perspektiv skiljer sig åt eller var de är eniga.' : ''}

Rapporten SKA bestå av exakt dessa tre delar:

1. **ÖVERSIKT**: En kort, kärnfull sammanfattning (max 5-6 meningar) av verksamhetens övergripande digitala mognad och strategiska läge.

2. **NULÄGESBESKRIVNING**: En sammanhängande text i löpande stil (professionell prosa) som beskriver nuläget. Texten ska vara saklig, ha en professionell ton och ge en helhetsbild av styrkor, utmaningar och förutsättningar. Lyft fram olika rollperspektiv om relevant.

3. **EVENTUELLA MOTSÄGELSER OCH OSÄKERHET**: Identifiera logiska inkonsekvenser eller motsägelsefulla svar. 
   - Notera även om det förekommer många svar med "Vet ej". Tolka detta som osäkerhet, otydlig kommunikation eller bristande kunskap inom organisationen.
   - Om inkonsekvenser eller hög osäkerhet finns, lista dem under rubriken med formateringen: 🔴 [Beskrivning av motsägelsen/osäkerheten]
   - Om INGA motsägelser hittas, ska du svara med exakt texten: "INGA_MOTSÄGELSER_HITTADE"

FORMAT:
Använd dessa rubriker exakt:
# ÖVERSIKT
[Text här]

# NULÄGESBESKRIVNING
[Text här]

# MOTSÄGELSER
[Text eller INGA_MOTSÄGELSER_HITTADE här]

Skriv på svenska.`;

        // Use the new server-side LLM service
        const analysis = await generateItReport(prompt);
        return NextResponse.json({ analysis });

    } catch (error) {
        console.error('Error in analyze route:', error);
        return NextResponse.json(
            { error: 'Failed to generate analysis', details: (error as Error).message },
            { status: 500 }
        );
    }
}
