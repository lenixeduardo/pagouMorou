import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signDocumentWithGovBr } from "@/lib/govbr.functions";

const callbackSchema = z.object({
  code: z.string().optional(),
  state: z.string().optional(),
  error: z.string().optional(),
});

export const Route = createFileRoute("/auth/callback")({
  validateSearch: (search) => callbackSchema.parse(search),
});

function AuthCallback() {
  const { code, state, error } = useSearch({ from: "/auth/callback" });
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processando autenticação do Gov.br...");
  const navigate = useNavigate();

  useEffect(() => {
    async function processCallback() {
      if (error) {
        setStatus("error");
        setMessage(`Erro na autenticação: ${error}`);
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("Código de autorização não recebido.");
        return;
      }

      try {
        // No mundo real, aqui trocaríamos o 'code' por um 'access_token' via backend
        // Como é uma simulação de MVP funcional:
        const mockAccessToken = "mock_govbr_token_" + Math.random().toString(36).substring(7);
        
        // Recuperamos a proposta que estava sendo assinada (armazenada em localStorage ou state)
        const pendingProposalId = localStorage.getItem("pending_signature_proposal_id");
        
        if (pendingProposalId) {
          setMessage("Autenticação concluída. Aplicando assinatura digital ao contrato...");
          
          const result = await signDocumentWithGovBr({
            data: {
              accessToken: mockAccessToken,
              documentHash: "hash_" + pendingProposalId,
              proposalId: pendingProposalId
            }
          });

          if (result && result.success) {
            setStatus("success");
            setMessage("Documento assinado com sucesso via Gov.br!");
            toast.success("Assinatura digital concluída!");
            localStorage.removeItem("pending_signature_proposal_id");
          } else {
            throw new Error("Falha ao aplicar assinatura.");
          }
        } else {
          setStatus("success");
          setMessage("Autenticação Gov.br realizada com sucesso.");
        }
      } catch (err) {
        console.error("Erro no callback do Gov.br:", err);
        setStatus("error");
        setMessage("Ocorreu um erro ao processar sua assinatura.");
        toast.error("Erro na assinatura digital.");
      }
    }

    void processCallback();
  }, [code, error, state]);

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Assinatura Gov.br</CardTitle>
          <CardDescription>
            Integração oficial com a rede de confiança do ITI
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 py-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-text-secondary animate-pulse">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="rounded-full bg-success/10 p-4">
                <CheckCircle2 className="h-16 w-16 text-success" />
              </div>
              <p className="font-medium text-lg text-foreground">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="rounded-full bg-danger/10 p-4">
                <XCircle className="h-16 w-16 text-danger" />
              </div>
              <p className="font-medium text-lg text-danger">{message}</p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status !== "loading" && (
            <Button 
              onClick={() => navigate({ to: "/perfil" })}
              className="w-full sm:w-auto px-10"
            >
              Voltar ao Painel
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default AuthCallback;
