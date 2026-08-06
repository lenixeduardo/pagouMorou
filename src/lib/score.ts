import { User } from "@/types";

/**
 * Calcula o score do inquilino (0 a 1000) baseado em diversos fatores.
 * Regras:
 * - Base: 1000 pontos
 * - Perfil incompleto: -100
 * - Sem foto: -50
 * - Documentação incompleta: -150
 * - Baixa permanência/Quebra contrato: -200
 * - Atrasos no pagamento: -100 por atraso (max -300)
 * - Avaliações de proprietários: Peso 20% do score (0-200)
 * - Tempo de resposta chat: low (-100), medium (-50), high (0)
 */
export function calculateTenantScore(user: Partial<User>): number {
  let score = 800; // Começamos com uma base neutra/boa
  
  if (!user.scoreFactors) return score;

  const factors = user.scoreFactors;

  if (factors.incompleteProfile) score -= 100;
  if (factors.noAvatar || !user.avatarUrl) score -= 50;
  if (factors.incompleteDocs) score -= 150;
  if (factors.lowStability || factors.contractBreach) score -= 200;
  
  const latePaymentPenalty = (factors.latePayments || 0) * 100;
  score -= Math.min(latePaymentPenalty, 300);

  if (factors.positiveOwnerReviews !== undefined) {
    // Escala de 0-100 para 0-200 pontos bônus/ônus
    score += (factors.positiveOwnerReviews - 50) * 2;
  }

  if (factors.chatResponseTime === "low") score -= 100;
  if (factors.chatResponseTime === "medium") score -= 50;

  // Garante limites
  return Math.max(0, Math.min(1000, score));
}

export function getScoreColor(score: number): string {
  if (score >= 800) return "text-success";
  if (score >= 600) return "text-primary";
  if (score >= 400) return "text-warning";
  return "text-danger";
}

export function getScoreLabel(score: number): string {
  if (score >= 800) return "Excelente";
  if (score >= 600) return "Bom";
  if (score >= 400) return "Regular";
  return "Baixo";
}
