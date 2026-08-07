import { test, expect } from '@playwright/test';

test.describe('Fluxo de Proposta e Contrato', () => {
  test.beforeEach(async ({ page }) => {
    // Simular login ou usar sessão injetada se necessário
    await page.goto('/perfil');
  });

  test('deve permitir visualizar e gerenciar propostas', async ({ page }) => {
    // Verificar se a aba de propostas existe
    const proposalsTab = page.getByRole('tab', { name: /Propostas/i });
    await expect(proposalsTab).toBeVisible();
    await proposalsTab.click();

    // Verificar se a lista de propostas é carregada (seja vazia ou com itens)
    const emptyState = page.getByText(/Nenhuma proposta recebida/i);
    const proposalCard = page.locator('div.border-border').first();
    
    await expect(emptyState.or(proposalCard)).toBeVisible();
  });

  test('deve mostrar seção de documentos KYC', async ({ page }) => {
    await expect(page.getByText(/Segurança KYC/i)).toBeVisible();
    
    // Se estiver verificado, deve mostrar botões de download
    const verifiedStatus = page.getByText(/Verificado/i);
    if (await verifiedStatus.isVisible()) {
      await expect(page.getByText(/Documento ID/i)).toBeVisible();
      await expect(page.getByText(/Baixar Todos/i)).toBeVisible();
    }
  });
});
