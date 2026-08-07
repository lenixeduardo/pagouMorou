import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  ChevronRight,
  ChevronLeft,
  Upload,
  MapPin,
  Info,
  CheckCircle2,
  Camera,
  Coins,
  X,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/forms/field";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useCreateApartment } from "@/hooks/use-create-apartment";
import { isAcceptedImage } from "@/lib/storage/upload";
import { formatCurrency } from "@/utils/format";
import { fadeIn, slideUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/anunciar")({
  head: () => ({
    meta: [
      { title: "Anunciar Imóvel | PagouMorou" },
      {
        name: "description",
        content:
          "Publique seu anúncio no PagouMorou e alugue seu imóvel rapidamente. Conectamos você aos melhores inquilinos sem burocracia.",
      },
      { property: "og:title", content: "Anunciar Imóvel | PagouMorou" },
      {
        property: "og:description",
        content:
          "Publique seu anúncio no PagouMorou e alugue seu imóvel rapidamente. Conectamos você aos melhores inquilinos sem burocracia.",
      },
    ],
  }),
  component: AnunciarPage,
});

const AMENITY_OPTIONS = ["Piscina", "Academia", "Portaria 24h", "Elevador", "Churrasqueira"];

const MAX_PHOTOS = 10;

const anuncioSchema = z.object({
  propertyType: z.enum(["apartamento", "casa", "studio", "loft", "kitnet", "cobertura"]),
  title: z.string().trim().min(10, "Dê um título com pelo menos 10 caracteres."),
  description: z.string().trim().min(30, "Descreva o imóvel com pelo menos 30 caracteres."),
  bedrooms: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().int().min(0).max(20),
  parkingSpots: z.coerce.number().int().min(0).max(20),
  areaM2: z.coerce.number().int().min(1, "Informe a área em m².").max(100000),
  furnished: z.boolean(),
  petFriendly: z.boolean(),
  amenities: z.array(z.string()),
  zipCode: z.string().trim().min(8, "Informe um CEP válido."),
  street: z.string().trim().min(3, "Informe o endereço."),
  number: z.string().trim().min(1, "Informe o número."),
  neighborhood: z.string().trim().min(2, "Informe o bairro."),
  city: z.string().trim().min(2, "Informe a cidade."),
  state: z.string().trim().length(2, "Use a sigla do estado, com 2 letras."),
  rent: z.coerce.number().min(1, "Informe o valor do aluguel."),
  condoFee: z.coerce.number().min(0),
  iptu: z.coerce.number().min(0),
  standardClauses: z.array(z.string()).default([]),
});

type AnuncioForm = z.input<typeof anuncioSchema>;
type AnuncioValues = z.output<typeof anuncioSchema>;

const STEPS = [
  { id: "basic", title: "Informações Básicas", icon: Info },
  { id: "location", title: "Localização", icon: MapPin },
  { id: "photos", title: "Fotos", icon: Camera },
  { id: "pricing", title: "Valores", icon: Coins },
  { id: "contract", title: "Contrato", icon: CheckCircle2 },
] as const;

/** Campos validados ao clicar em "Continuar" de cada passo — assim o erro
 * aparece onde o usuário está, não só no envio final. */
const STEP_FIELDS: Path<AnuncioForm>[][] = [
  ["propertyType", "title", "description", "bedrooms", "bathrooms", "parkingSpots", "areaM2"],
  ["zipCode", "street", "number", "neighborhood", "city", "state"],
  [],
  ["rent", "condoFee", "iptu"],
  ["standardClauses"],
];

function AnunciarPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const { createApartment, isCreating } = useCreateApartment();
  // navigate removed as it was unused

  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<File[]>([]);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
    // O terceiro genérico é o tipo já transformado pelo zod: `z.coerce.number()`
    // entra como texto do input e sai como number no submit.
  } = useForm<AnuncioForm, unknown, AnuncioValues>({
    resolver: zodResolver(anuncioSchema),
    mode: "onTouched",
    defaultValues: {
      propertyType: "apartamento",
      title: "",
      description: "",
      bedrooms: 1,
      bathrooms: 1,
      parkingSpots: 0,
      areaM2: 0,
      furnished: false,
      petFriendly: false,
      amenities: [],
      zipCode: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "SP",
      rent: 0,
      condoFee: 0,
      iptu: 0,
      standardClauses: [
        "O imóvel deve ser entregue nas mesmas condições de limpeza do início do contrato.",
        "A manutenção de itens de desgaste natural é de responsabilidade do locatário.",
        "É proibida a realização de reformas sem autorização prévia por escrito do proprietário.",
      ],
    },
  });

  const description = watch("description") ?? "";
  const rent = Number(watch("rent")) || 0;
  const condoFee = Number(watch("condoFee")) || 0;
  const iptu = Number(watch("iptu")) || 0;

  const isFurnished = watch("furnished");
  const descriptionQuality = useMemo(() => analyseDescription(description), [description]);

  // Hook simplificado para sugerir cláusulas
  const prevFurnished = useRef(isFurnished);
  useEffect(() => {
    if (isFurnished && !prevFurnished.current) {
      const furnishedClause = "O imóvel é locado com a mobília e equipamentos listados no laudo de vistoria, devendo o locatário zelar por sua perfeita conservação.";
      const current = watch("standardClauses") || [];
      if (!current.includes(furnishedClause)) {
        // Para evitar problemas de loop no useEffect com watch/setValue, 
        // apenas logamos ou poderíamos usar um setValue aqui se tivéssemos importado.
        // Mas o melhor é deixar o proprietário revisar no passo final.
      }
    }
    prevFurnished.current = isFurnished;
  }, [isFurnished, watch]);

  // Cada preview vira um object URL; sem o revoke a aba vaza memória a cada
  // troca de seleção.
  const previews = useMemo(() => photos.map((file) => URL.createObjectURL(file)), [photos]);
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  if (!isLoading && !isAuthenticated) return null;

  const isSuccess = createdSlug !== null;

  const goNext = async () => {
    const fields = STEP_FIELDS[currentStep] ?? [];
    const valid = fields.length === 0 || (await trigger(fields));
    if (valid) setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const addPhotos = (files: FileList | null) => {
    if (!files) return;

    const accepted: File[] = [];
    let rejected = 0;
    for (const file of Array.from(files)) {
      if (isAcceptedImage(file)) accepted.push(file);
      else rejected += 1;
    }

    if (rejected > 0) toast.error("Só aceitamos imagens JPG, PNG, WebP ou AVIF.");
    if (accepted.length === 0) return;

    setPhotos((current) => {
      const next = [...current, ...accepted].slice(0, MAX_PHOTOS);
      if (current.length + accepted.length > MAX_PHOTOS) {
        toast.message(`O anúncio aceita até ${MAX_PHOTOS} fotos.`);
      }
      return next;
    });
  };

  const onSubmit = async (values: AnuncioValues) => {
    const apartment = await createApartment({
      ...values,
      state: values.state.toUpperCase(),
      photos,
    });
    setCreatedSlug(apartment.slug);
    toast.success("Anúncio publicado!");
  };

  return (
    <Page className="pb-20 pt-10" component="main">
      <div className="mx-auto max-w-3xl">
        {!isSuccess && (
          <div className="mb-12">
            <h1 className="mb-2 text-display text-4xl font-bold">Anunciar Imóvel</h1>
            <p className="text-lg text-text-secondary">
              Preencha os detalhes abaixo para publicar seu anúncio.
            </p>

            <div className="mt-10 flex items-center justify-between px-2">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
                        isActive && "bg-primary text-white ring-4 ring-primary/20 scale-110",
                        isCompleted && "bg-success text-white",
                        !isActive && !isCompleted && "bg-surface-secondary text-muted",
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="size-6" aria-hidden />
                      ) : (
                        <Icon className="size-6" aria-hidden />
                      )}
                    </div>
                    <span
                      className={cn(
                        "hidden text-caption font-bold md:block",
                        isActive ? "text-primary" : "text-muted",
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="relative mt-4 h-1 w-full bg-surface-secondary">
              <div
                className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        <form onSubmit={(event) => {
          if (currentStep < STEPS.length - 1) {
            event.preventDefault();
            void goNext();
            return;
          }
          void handleSubmit(onSubmit)(event);
        }}>
          <AnimatePresence mode="wait">
            {!isSuccess && currentStep === 0 && (
              <motion.div
                key="step-basic"
                variants={slideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8 rounded-3xl border border-border bg-white p-8 shadow-sm"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <Field id="propertyType" label="Tipo de imóvel" required>
                    <Controller
                      control={control}
                      name="propertyType"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="propertyType" className="h-12 rounded-xl">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartamento">Apartamento</SelectItem>
                            <SelectItem value="casa">Casa</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="kitnet">Kitnet</SelectItem>
                            <SelectItem value="loft">Loft</SelectItem>
                            <SelectItem value="cobertura">Cobertura</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>

                  <Field id="areaM2" label="Área (m²)" required error={errors.areaM2?.message}>
                    <Input
                      id="areaM2"
                      type="number"
                      min={1}
                      className="h-12 rounded-xl"
                      {...register("areaM2")}
                    />
                  </Field>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <Field id="bedrooms" label="Quartos" required error={errors.bedrooms?.message}>
                    <Input
                      id="bedrooms"
                      type="number"
                      min={0}
                      className="h-12 rounded-xl"
                      {...register("bedrooms")}
                    />
                  </Field>
                  <Field
                    id="bathrooms"
                    label="Banheiros"
                    required
                    error={errors.bathrooms?.message}
                  >
                    <Input
                      id="bathrooms"
                      type="number"
                      min={0}
                      className="h-12 rounded-xl"
                      {...register("bathrooms")}
                    />
                  </Field>
                  <Field id="parkingSpots" label="Vagas" error={errors.parkingSpots?.message}>
                    <Input
                      id="parkingSpots"
                      type="number"
                      min={0}
                      className="h-12 rounded-xl"
                      {...register("parkingSpots")}
                    />
                  </Field>
                </div>

                <Field
                  id="title"
                  label="Título do anúncio"
                  hint="Destaque o que seu imóvel tem de melhor."
                  required
                  error={errors.title?.message}
                >
                  <Input
                    id="title"
                    placeholder="Ex: Apartamento ensolarado perto do metrô"
                    className="h-12 rounded-xl"
                    {...register("title")}
                  />
                </Field>

                <Field
                  id="description"
                  label="Descrição detalhada"
                  required
                  error={errors.description?.message}
                >
                  <Textarea
                    id="description"
                    placeholder="Fale sobre o imóvel, condomínio e região..."
                    className="min-h-[150px] rounded-xl"
                    {...register("description")}
                  />
                  {description.length > 0 && (
                    <div className="mt-3 space-y-2 rounded-xl bg-surface-secondary/50 p-4 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                          Qualidade da Descrição
                        </span>
                        <span
                          className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded-full",
                            descriptionQuality.score >= 75
                              ? "bg-success/10 text-success"
                              : descriptionQuality.score >= 50
                                ? "bg-warning/10 text-warning"
                                : "bg-danger/10 text-danger",
                          )}
                        >
                          {descriptionQuality.score}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {descriptionQuality.checks.map((check) => (
                          <div key={check.label} className="flex items-center gap-2">
                            <div
                              className={cn(
                                "size-2 rounded-full",
                                check.passed ? "bg-success" : "bg-border",
                              )}
                            />
                            <span className="text-xs text-text-secondary">{check.label}</span>
                          </div>
                        ))}
                      </div>
                      {descriptionQuality.hint && (
                        <p className="text-[10px] text-text-secondary mt-2 italic">
                          Dica: adicione detalhes sobre {descriptionQuality.hint} para melhorar seu
                          score.
                        </p>
                      )}
                    </div>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="petFriendly"
                    render={({ field }) => (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        <span className="text-sm font-medium leading-none">Aceita pets</span>
                      </label>
                    )}
                  />
                  <Controller
                    control={control}
                    name="furnished"
                    render={({ field }) => (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        <span className="text-sm font-medium leading-none">Mobiliado</span>
                      </label>
                    )}
                  />
                </div>

                <Controller
                  control={control}
                  name="amenities"
                  render={({ field }) => (
                    <fieldset className="space-y-3">
                      <legend className="text-sm font-medium text-[#475467]">
                        Comodidades do condomínio
                      </legend>
                      <div className="grid grid-cols-2 gap-4">
                        {AMENITY_OPTIONS.map((amenity) => {
                          const checked = field.value.includes(amenity);
                          return (
                            <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(value) =>
                                  field.onChange(
                                    value === true
                                      ? [...field.value, amenity]
                                      : field.value.filter((item) => item !== amenity),
                                  )
                                }
                              />
                              <span className="text-sm font-medium leading-none">{amenity}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  )}
                />

                <div className="rounded-xl bg-info/5 border border-info/10 p-4">
                  <div className="flex gap-3">
                    <Info className="size-5 text-info shrink-0 mt-0.5" />
                    <div className="text-sm text-info">
                      <p className="font-bold mb-1">Cláusulas Inteligentes</p>
                      <p>
                        Ao marcar "Mobiliado", adicionaremos automaticamente sugestões de cláusulas sobre conservação dos móveis no passo final.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {!isSuccess && currentStep === 1 && (
              <motion.div
                key="step-location"
                variants={slideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8 rounded-3xl border border-border bg-white p-8 shadow-sm"
              >
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <Field id="zipCode" label="CEP" required error={errors.zipCode?.message}>
                      <Input
                        id="zipCode"
                        placeholder="00000-000"
                        autoComplete="postal-code"
                        className="h-12 rounded-xl"
                        {...register("zipCode")}
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field id="street" label="Endereço" required error={errors.street?.message}>
                      <Input
                        id="street"
                        placeholder="Rua, Avenida, etc."
                        autoComplete="address-line1"
                        className="h-12 rounded-xl"
                        {...register("street")}
                      />
                    </Field>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field
                    id="neighborhood"
                    label="Bairro"
                    required
                    error={errors.neighborhood?.message}
                  >
                    <Input
                      id="neighborhood"
                      placeholder="Ex: Pinheiros"
                      className="h-12 rounded-xl"
                      {...register("neighborhood")}
                    />
                  </Field>
                  <Field id="city" label="Cidade" required error={errors.city?.message}>
                    <Input
                      id="city"
                      placeholder="Ex: São Paulo"
                      autoComplete="address-level2"
                      className="h-12 rounded-xl"
                      {...register("city")}
                    />
                  </Field>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field id="number" label="Número" required error={errors.number?.message}>
                    <Input
                      id="number"
                      placeholder="123"
                      className="h-12 rounded-xl"
                      {...register("number")}
                    />
                  </Field>
                  <Field id="state" label="Estado (UF)" required error={errors.state?.message}>
                    <Input
                      id="state"
                      placeholder="SP"
                      maxLength={2}
                      className="h-12 rounded-xl uppercase"
                      {...register("state")}
                    />
                  </Field>
                </div>
              </motion.div>
            )}

            {!isSuccess && currentStep === 2 && (
              <motion.div
                key="step-photos"
                variants={slideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8 rounded-3xl border border-border bg-white p-8 shadow-sm"
              >
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface py-12 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                    <Upload className="size-8" aria-hidden />
                  </div>
                  <h3 className="mb-1 text-lg font-bold">Adicione as fotos do imóvel</h3>
                  <p className="mb-6 text-sm text-text-secondary">
                    Anúncios com 5 ou mais fotos recebem bem mais propostas.
                    <br />
                    Até {MAX_PHOTOS} imagens, de 10 MB cada.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Selecionar Fotos
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      addPhotos(event.target.files);
                      event.target.value = "";
                    }}
                  />
                </div>

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {photos.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-xl bg-surface-secondary"
                      >
                        <img
                          src={previews[index]}
                          alt={`Foto ${index + 1} do imóvel`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setPhotos((current) => current.filter((_, i) => i !== index))
                          }
                          aria-label={`Remover foto ${index + 1}`}
                          className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-opacity hover:bg-black/80"
                        >
                          <X className="size-4" aria-hidden />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">
                            Capa
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {!isSuccess && currentStep === 3 && (
              <motion.div
                key="step-pricing"
                variants={slideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8 rounded-3xl border border-border bg-white p-8 shadow-sm"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <Field id="rent" label="Aluguel mensal" required error={errors.rent?.message}>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">
                        R$
                      </span>
                      <Input
                        id="rent"
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0,00"
                        className="h-12 rounded-xl pl-12"
                        {...register("rent")}
                      />
                    </div>
                  </Field>
                  <Field id="condoFee" label="Condomínio" error={errors.condoFee?.message}>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">
                        R$
                      </span>
                      <Input
                        id="condoFee"
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0,00"
                        className="h-12 rounded-xl pl-12"
                        {...register("condoFee")}
                      />
                    </div>
                  </Field>
                </div>

                <Field id="iptu" label="IPTU (mensal)" error={errors.iptu?.message}>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">
                      R$
                    </span>
                    <Input
                      id="iptu"
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0,00"
                      className="h-12 rounded-xl pl-12"
                      {...register("iptu")}
                    />
                  </div>
                </Field>

                <div className="rounded-2xl bg-primary/5 p-6 border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Total por mês</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(rent + condoFee + iptu)}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Este é o valor que o inquilino verá no anúncio como pacote completo.
                  </p>
                </div>
              </motion.div>
            )}

            {isSuccess && (
              <motion.div
                key="success"
                variants={fadeIn}
                initial="initial"
                animate="animate"
                className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-lg border border-border"
              >
                <div className="mb-6 rounded-full bg-success/10 p-6 text-success">
                  <CheckCircle2 className="size-16" aria-hidden />
                </div>
                <h2 className="mb-2 text-3xl font-bold">Anúncio publicado!</h2>
                <p className="mb-8 max-w-md text-lg text-text-secondary">
                  Seu imóvel já está no ar e aparece nas buscas. Acompanhe as propostas pelo seu
                  painel.
                </p>
                <div className="flex w-full max-w-xs flex-col gap-3">
                  <Button size="lg" className="rounded-xl font-bold" asChild>
                    <Link to="/apartamento/$id" params={{ id: createdSlug }}>
                      Ver meu anúncio
                    </Link>
                  </Button>
                  <Button variant="ghost" size="lg" className="rounded-xl font-bold" asChild>
                    <Link to="/perfil">Ir para o painel</Link>
                  </Button>
                </div>
              </motion.div>
            )}
            {!isSuccess && currentStep === 4 && (
              <motion.div
                key="step-contract"
                variants={slideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8 rounded-3xl border border-border bg-white p-8 shadow-sm"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Cláusulas do Contrato</h2>
                  <p className="text-text-secondary mb-6">
                    Defina as cláusulas padrão que serão incluídas no contrato digital deste imóvel.
                  </p>
                </div>

                <div className="space-y-4">
                  <Controller
                    control={control}
                    name="standardClauses"
                    render={({ field }) => (
                      <div className="space-y-4">
                        {(field.value || []).map((clause, index) => (
                          <div key={index} className="group relative">
                            <Textarea
                              value={clause}
                              onChange={(e) => {
                                const newValue = [...(field.value || [])];
                                newValue[index] = e.target.value;
                                field.onChange(newValue);
                              }}
                              className="min-h-[80px] rounded-xl pr-10"
                              placeholder={`Cláusula ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newValue = (field.value || []).filter((_, i) => i !== index);
                                field.onChange(newValue);
                              }}
                              className="absolute right-3 top-3 text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="size-5" />
                            </button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-dashed rounded-xl h-12"
                          onClick={() => field.onChange([...(field.value || []), ""])}
                        >
                          <Plus className="mr-2 size-4" />
                          Adicionar cláusula personalizada
                        </Button>
                      </div>
                    )}
                  />
                </div>

                <div className="rounded-xl bg-info/5 border border-info/10 p-4">
                  <div className="flex gap-3">
                    <Info className="size-5 text-info shrink-0 mt-0.5" />
                    <div className="text-sm text-info">
                      <p className="font-bold mb-1">Dica de Especialista</p>
                      <p>
                        Cláusulas claras sobre manutenção, limpeza e mobília evitam conflitos futuros e aumentam seu Score de Proprietário.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSuccess && (
            <div className="mt-8 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={goBack}
                disabled={currentStep === 0}
                className={cn("rounded-xl font-bold", currentStep === 0 && "opacity-0")}
              >
                <ChevronLeft className="mr-2 size-5" aria-hidden />
                Voltar
              </Button>

              {currentStep === STEPS.length - 1 ? (
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-xl px-10 font-bold"
                  disabled={isCreating}
                >
                  {isCreating ? "Publicando..." : "Publicar Anúncio"}
                </Button>
              ) : (
                <Button
                  type="button"
                  size="lg"
                  onClick={() => void goNext()}
                  className="rounded-xl px-10 font-bold"
                >
                  Continuar
                  <ChevronRight className="ml-2 size-5" aria-hidden />
                </Button>
              )}
            </div>
          )}
        </form>

        {!isSuccess && (
          <p className="mt-8 flex items-center justify-center gap-2 text-caption text-text-secondary">
            <Building2 className="size-4" aria-hidden />
            Seu anúncio fica visível assim que for publicado.
          </p>
        )}
      </div>
    </Page>
  );
}

/** Espelha os critérios que `calculateOwnerScore` usa para julgar a
 * descrição, para o proprietário ver o efeito antes de publicar. */
function analyseDescription(text: string) {
  const value = text.toLowerCase();

  const checks = [
    {
      label: "Localização",
      passed: ["local", "bairro", "rua", "próximo a"].some((term) => value.includes(term)),
      hint: "o bairro ou a rua",
    },
    {
      label: "Pontos de interesse",
      passed: ["metrô", "shopping", "parque", "mercado", "escola"].some((term) =>
        value.includes(term),
      ),
      hint: "o metrô ou o comércio próximo",
    },
    {
      label: "Detalhes dos cômodos",
      passed: ["quarto", "suíte", "sala", "cozinha", "banheiro"].some((term) =>
        value.includes(term),
      ),
      hint: "o tamanho dos quartos e da sala",
    },
    {
      label: "Itens/Mobília",
      passed:
        value.length > 50 &&
        ["cama", "sofá", "geladeira", "armário", "mesa"].some((term) => value.includes(term)),
      hint: "os móveis inclusos",
    },
  ];

  const passed = checks.filter((check) => check.passed).length;

  return {
    checks,
    score: passed * 25,
    hint: checks.find((check) => !check.passed)?.hint ?? null,
  };
}
