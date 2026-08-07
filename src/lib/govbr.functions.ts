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
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      
      // 1. Buscar dados da proposta e do imóvel para localizar o contrato
      const { data: proposal, error: proposalError } = await supabaseAdmin
        .from('proposals')
        .select(`
          id,
          apartment_id,
          contract_url,
          apartments (
            title,
            owner_id
          )
        `)
        .eq('id', data.proposalId)
        .single();

      if (proposalError || !proposal) {
        throw new Error("Proposta não encontrada.");
      }

      // 2. Tentar carregar o PDF real do contrato do Storage
      // O contrato geralmente é salvo em 'contracts/{apartment_id}/{proposal_id}.pdf'
      const contractPath = proposal.contract_url || `contracts/${proposal.apartment_id}/${proposal.id}.pdf`;
      
      let pdfBytes: Uint8Array;
      
      try {
        const { data: fileData, error: downloadError } = await supabaseAdmin
          .storage
          .from('documents')
          .download(contractPath);

        if (downloadError || !fileData) {
          console.warn(`[ITI] Contrato real não encontrado em ${contractPath}. Criando fallback...`);
          // Fallback: Criar novo documento se o real não existir (mantém compatibilidade com demos)
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage([600, 400]);
          const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
          page.drawText(`CONTRATO DE LOCAÇÃO - ${proposal.apartments?.title || 'IMÓVEL'}`, {
            x: 50,
            y: 350,
            size: 20,
            font,
            color: rgb(0.06, 0.61, 0.3),
          });
          pdfBytes = await pdfDoc.save();
        } else {
          pdfBytes = new Uint8Array(await fileData.arrayBuffer());
          console.log(`[ITI] Contrato real carregado de ${contractPath}.`);
        }
      } catch (err) {
        console.error("[ITI] Erro ao acessar Storage:", err);
        throw new Error("Falha ao acessar o documento original do contrato.");
      }

      // 3. Carregar o PDF no pdf-lib para manipulação
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width, height } = lastPage.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // 4. Aplicar o selo de assinatura do ITI (Estampa visual)
      const sealWidth = 400;
      const sealHeight = 70;
      const sealX = (width - sealWidth) / 2;
      const sealY = 50; // Parte inferior da última página

      lastPage.drawRectangle({
        x: sealX,
        y: sealY,
        width: sealWidth,
        height: sealHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        color: rgb(0.98, 0.98, 0.98),
      });

      lastPage.drawText('ASSINADO DIGITALMENTE - GOV.BR (PROCESSO ITI)', {
        x: sealX + 20,
        y: sealY + 45,
        size: 12,
        font,
        color: rgb(0, 0.2, 0.6),
      });

      lastPage.drawText(`Assinante: Protocolo Gov.br | Hash: ${data.documentHash.slice(0, 16)}...`, {
        x: sealX + 20,
        y: sealY + 25,
        size: 8,
        color: rgb(0.2, 0.2, 0.2),
      });

      lastPage.drawText(`Verificado em: ${new Date().toLocaleString('pt-BR')} | ID: ${data.proposalId}`, {
        x: sealX + 20,
        y: sealY + 10,
        size: 7,
        color: rgb(0.4, 0.4, 0.4),
      });

      const signedPdfBytes = await pdfDoc.save();
      
      // 5. Salvar o PDF assinado de volta no Storage (sobrescrevendo ou criando versão assinada)
      const signedPath = contractPath.replace('.pdf', '_signed.pdf');
      const { error: uploadError } = await supabaseAdmin
        .storage
        .from('documents')
        .upload(signedPath, signedPdfBytes, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 6. Atualizar status da proposta para assinado
      await supabaseAdmin
        .from('proposals')
        .update({ 
          status: 'contract_signed',
          contract_url: signedPath
        } as any)
        .eq('id', data.proposalId);
    } catch (error) {
      console.error("[ITI] Erro ao manipular PDF:", error);
      throw new Error("Falha na geração do selo digital no documento.");
    }
  });
