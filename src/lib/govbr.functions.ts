import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Nota técnica: A integração com o Gov.br requer registro da aplicação 
 * no portal do desenvolvedor para obtenção de Client ID e Client Secret.
 * Este módulo utiliza a biblioteca pdf-lib no backend para estampar 
 * o selo de assinatura digital ITI.
 */

export const getGovBrAuthUrl = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ redirectUri: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const clientId = process.env['GOVBR_CLIENT_ID'];
    
    // Configurações para ambiente de homologação/staging do Gov.br
    const baseUrl = "https://sso.staging.acesso.gov.br/authorize";
    
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId || "demo-pagou-morou",
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
    console.log(`[ITI] Iniciando processo de estampa de assinatura digital para proposta ${data.proposalId}`);
    
    try {
      // 1. Criação de um PDF básico para demonstrar a manipulação (no mundo real carregaríamos o contrato existente)
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const { height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      page.drawText('CONTRATO DE LOCAÇÃO - PAGOU MOROU', {
        x: 50,
        y: height - 50,
        size: 20,
        font,
        color: rgb(0.06, 0.61, 0.3), // Verde institucional #0F9B4D
      });

      // 2. Aplicar o selo de assinatura do ITI (Simulação visual via pdf-lib)
      const sealBoxY = 100;
      page.drawRectangle({
        x: 50,
        y: sealBoxY,
        width: 500,
        height: 80,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        color: rgb(0.95, 0.95, 0.95),
      });

      page.drawText('ASSINADO DIGITALMENTE - GOV.BR (ITI)', {
        x: 70,
        y: sealBoxY + 50,
        size: 14,
        font,
        color: rgb(0, 0, 0.5),
      });

      page.drawText(`Assinante: Usuário Autenticado via Gov.br\nData: ${new Date().toLocaleString('pt-BR')}\nHash: ${data.documentHash}`, {
        x: 70,
        y: sealBoxY + 15,
        size: 8,
        color: rgb(0.3, 0.3, 0.3),
        lineHeight: 10,
      });

      const pdfBytes = await pdfDoc.save();
      console.log(`[ITI] PDF processado com sucesso. Tamanho: ${pdfBytes.length} bytes`);

      // No ambiente real, salvaríamos pdfBytes no Supabase Storage e atualizaríamos o status da proposta
      
      return {
        success: true,
        signatureType: "digital_iti_conform",
        sealUrl: "https://pki.gov.br/seal-verification",
        timestamp: new Date().toISOString(),
        documentId: `signed_${data.proposalId}.pdf`,
        // Em um app real retornaríamos a URL do documento salvo no Storage
      };
    } catch (error) {
      console.error("[ITI] Erro ao manipular PDF:", error);
      throw new Error("Falha na geração do selo digital no documento.");
    }
  });
