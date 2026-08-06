import { User, Apartment } from "@/types";

/**
 * Calcula o score do inquilino (0 a 1000) baseado em diversos fatores.
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
    score += (factors.positiveOwnerReviews - 50) * 2;
  }

  if (factors.chatResponseTime === "low") score -= 100;
  if (factors.chatResponseTime === "medium") score -= 50;

  return Math.max(0, Math.min(1000, score));
}

/**
 * Calcula o score do proprietário (0 a 1000)
 */
export function calculateOwnerScore(owner: Partial<User>, properties: Apartment[]): number {
  let score = 700; // Base para proprietário

  // 1. Qualidade dos Anúncios (Fotos e Descrição)
  properties.forEach(apt => {
    if (apt.images.length >= 5) score += 20;
    if (apt.images.length < 3) score -= 30;
    
    // Validação de descrição (mínimo de palavras/presença de termos chave)
    const desc = apt.description.toLowerCase();
    const hasLocation = desc.includes("local") || desc.includes("bairro") || desc.includes("rua");
    const hasPOI = desc.includes("perto") || desc.includes("metrô") || desc.includes("próximo");
    const hasRooms = desc.includes("quarto") || desc.includes("sala") || desc.includes("cozinha");
    const hasFurnished = apt.features.furnished ? (desc.includes("cama") || desc.includes("sofá") || desc.includes("geladeira")) : true;

    if (hasLocation && hasPOI && hasRooms && hasFurnished) {
      score += 40;
    } else {
      score -= 20;
    }
  });

  // 2. Tempo de Resposta e Revisão
  if (owner.scoreFactors) {
    if (owner.scoreFactors.chatResponseTime === "high") score += 100;
    if (owner.scoreFactors.chatResponseTime === "low") score -= 100;
  }

  // 3. Documentação
  if (owner.verified) score += 150;
  
  // 4. Avaliações de Inquilinos
  const avgRating = properties.reduce((acc, apt) => acc + apt.rating, 0) / (properties.length || 1);
  score += (avgRating - 3) * 100; // Se nota for 5, +200. Se for 1, -200.

  return Math.max(0, Math.min(1000, Math.round(score)));
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
