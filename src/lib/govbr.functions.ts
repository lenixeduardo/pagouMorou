import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Nota técnica: A integração com o Gov.br requer registro da aplicação 
 * no portal do desenvolvedor para obtenção de Client ID e Client Secret.
 * Este módulo estrutura as chamadas de backend protegidas.
 */

export const getGovBrAuthUrl = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ redirectUri: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const clientId = process.env['GOVBR_CLIENT_ID'];
    if (!clientId) {
       // Fallback para demonstração se a chave não estiver configurada
       return "https://sso.staging.acesso.gov.br/authorize?response_type=code&client_id=demo&scope=openid+profile+govbr_confiabilidade&redirect_uri=" + encodeURIComponent(data.redirectUri);
    }
    
    const baseUrl = "https://sso.acesso.gov.br/authorize";
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: "openid profile govbr_confiabilidade",
      redirect_uri: data.redirectUri,
      state: crypto.randomUUID(),
    });

    return `${baseUrl}?${params.toString()}`;
  });

export const signDocumentWithGovBr = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    documentHash: z.string(),
    accessToken: z.string(),
    proposalId: z.string()
  }).parse(data))
  .handler(async ({ data }) => {
    // 1. Verificar hash do documento (PDF gerado)
    // 2. Chamar API de Assinatura Digital do Gov.br (Assinador ITI)
    // 3. Atualizar status da proposta no banco via Supabase
    
    console.log(`Iniciando assinatura para proposta ${data.proposalId}`);
    
    // Simulação de chamada externa
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      signatureType: "digital_iti",
      timestamp: new Date().toISOString()
    };
  });
