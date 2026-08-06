import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const FAQ_DATA = [
  {
    question: "Preciso de fiador para alugar no PagouMorou?",
    answer: "Não. Nossa plataforma utiliza análise de crédito digital e seguros fiança simplificados, eliminando a necessidade de um fiador tradicional."
  },
  {
    question: "Como funciona a assinatura do contrato?",
    answer: "O contrato é gerado automaticamente e assinado digitalmente por ambas as partes via e-mail ou SMS, com validade jurídica garantida."
  },
  {
    question: "Quais são os custos para o inquilino?",
    answer: "O inquilino paga apenas o aluguel, condomínio e taxas acordadas. Não cobramos taxas de reserva ou taxas administrativas escondidas."
  },
  {
    question: "Posso visitar o imóvel antes de fechar?",
    answer: "Sim! Você pode agendar visitas diretamente com o proprietário através do chat da nossa plataforma."
  }
];

export function FAQSection() {
  return (
    <section className="mb-20 px-4 md:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 flex flex-col items-center text-center"
      >
        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <HelpCircle className="size-6" />
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-text md:text-4xl">
          Dúvidas Frequentes
        </h2>
        <p className="max-w-2xl text-lg text-text-secondary">
          Separamos as principais perguntas que as pessoas fazem sobre alugar um apartamento no PagouMorou.
        </p>
      </motion.div>

      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {FAQ_DATA.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-border py-2">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-text-secondary leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
