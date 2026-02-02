import { NextRequest, NextResponse } from 'next/server';
import { surveySections } from '@/data/questions';

const allQuestions = surveySections.flatMap(s => s.questions);

function findQuestion(id: string) {
    return allQuestions.find(q => q.id === id);
}

function formatAnswer(answer: any, question: any) {
    if (question.type === 'yes-no') {
        return answer ? 'JA' : 'NEJ';
    }
    if (question.type === 'checkbox' && Array.isArray(answer)) {
        return answer.join(', ');
    }
    return answer || 'Inget svar';
}

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

3. **EVENTUELLA MOTSÄGELSER**: Identifiera logiska inkonsekvenser eller motsägelsefulla svar, både inom en enskild roll och mellan olika roller.
   - Om inkonsekvenser finns, lista dem under rubriken med formateringen: 🔴 [Beskrivning av motsägelsen]
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

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gemma3:4b',
                prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error('Ollama API error');
        }

        const data = await response.json();
        return NextResponse.json({ analysis: data.response });
    } catch (error) {
        console.error('Error in analyze route:', error);
        return NextResponse.json(
            { error: 'Failed to generate analysis' },
            { status: 500 }
        );
    }
}
