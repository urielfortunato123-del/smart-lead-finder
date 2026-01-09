import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sector, location } = await req.json();
    
    if (!sector) {
      return new Response(
        JSON.stringify({ error: 'Setor é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const locationContext = location ? ` em ${location}` : ' no Brasil';
    
    const systemPrompt = `Você é um especialista em prospecção B2B no Brasil. 
Sua tarefa é gerar dados realistas de empresas brasileiras para fins de demonstração de um sistema de prospecção.
Gere empresas fictícias mas realistas do setor solicitado, com CNPJs formatados corretamente (XX.XXX.XXX/0001-XX), 
endereços brasileiros reais, telefones no formato brasileiro e emails corporativos.

IMPORTANTE: Retorne APENAS um array JSON válido, sem texto adicional, seguindo este formato exato:
[
  {
    "name": "Nome da Empresa LTDA",
    "cnpj": "12.345.678/0001-90",
    "address": "Rua Example, 123",
    "city": "São Paulo",
    "state": "SP",
    "phone": "(11) 99999-9999",
    "email": "contato@empresa.com.br",
    "website": "https://www.empresa.com.br",
    "sector": "Setor",
    "size": "Pequena/Média/Grande"
  }
]`;

    const userPrompt = `Gere 25 empresas do setor "${sector}"${locationContext}. 
Inclua variedade de portes (microempresa, pequena, média, grande).
Use cidades e bairros reais. Gere CNPJs únicos e formatados corretamente.
Retorne APENAS o array JSON, sem explicações.`;

    console.log('Calling Lovable AI for sector:', sector);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente em alguns minutos.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos esgotados. Por favor, adicione créditos à sua conta.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI response received, parsing...');

    // Parse the JSON response
    let companies;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        companies = JSON.parse(jsonMatch[0]);
      } else {
        companies = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Add unique IDs to companies
    const companiesWithIds = companies.map((company: any, index: number) => ({
      ...company,
      id: `company-${Date.now()}-${index}`,
    }));

    console.log(`Successfully generated ${companiesWithIds.length} companies`);

    return new Response(
      JSON.stringify({ companies: companiesWithIds }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in search-companies function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro ao buscar empresas' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});