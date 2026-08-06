# Documentação de Telas — PagouMorou (Agosto 2026)

Este documento descreve o estado atual de cada tela do PagouMorou para ser usado como referência em ferramentas generativas de mockups.

## 1. Identidade Visual Global (Design System)
- **Paleta de Cores:** Fundo Branco Puro (`#FFFFFF`), Primária Verde Institucional (`#16A34A`), Texto Principal (`#111827`), Texto Secundário (`#6B7280`).
- **Tipografia:** Geist (Sans-serif). Escala: Display (Grande e Bold), Heading (Semi-bold), Title, Body (Normal), Caption (Pequeno).
- **Componentes:** Bordas muito arredondadas (24px para cards, 16px para botões, 18px para inputs). Sombras suaves estilo Airbnb.
- **Header:** Sticky com blur, logotipo à esquerda (ícone 3D de chaveiro + texto), barra de busca central (desktop), perfil à direita.
- **Bottom Nav (Mobile):** Estilo app com ícones de Busca, Favoritos, Mensagens e Perfil.

---

## 2. Home (Página Inicial) - `/`
A vitrine do marketplace com foco em conversão e descoberta.
- **Hero Section:** Fundo verde institucional com padrão de grade sutil. Título: "Alugou. Pagou. Morou." Subtítulo focado em zero burocracia. Grande barra de busca branca centralizada que redireciona para `/buscar`.
- **Destaques:** Grid de cards de imóveis com imagens grandes, preço em destaque e badges (ex: "Sem Fiador").
- **Exploração por Bairro:** Blocos com nomes de bairros e ticket médio de aluguel.
- **Novos Anúncios:** Listagem secundária de imóveis recentes.

---

## 3. Busca e Filtros - `/buscar`
Interface de exploração funcional com filtros dinâmicos.
- **Top Bar:** Campo de busca textual ("Onde você quer morar?") com ícone de MapPin.
- **Sidebar de Filtros (Esquerda):** 
  - Filtro por Tipo de Imóvel (Badge: Todos, Studio, Apartamento).
  - Slider de Faixa de Preço (R$ 0 - R$ 20.000).
  - Seleção de Quantidade de Quartos (1, 2, 3, 4+).
- **Grid de Resultados (Direita):** Listagem de cartões de imóveis. No topo, contador de resultados e dropdown de ordenação (Relevância, Menor Preço, Maior Preço).
- **Mobile:** Filtros em modal/gaveta acionados por botão flutuante.

---

## 4. Detalhes do Imóvel - `/apartamento/$id`
Página de conversão focada em transparência e contato.
- **Galeria:** Hero de imagem do imóvel com bordas arredondadas (3xl).
- **Informações Principais:** Título grande, endereço, área (m²).
- **Grid de Atributos:** Ícones e valores para Quartos, Banheiros, Vagas e Andar.
- **Descrição:** Bloco de texto "Sobre este imóvel".
- **Floating Sidebar (Direita):** 
  - Preço do aluguel em destaque.
  - Tabela detalhando Condomínio, IPTU e "Total do pacote".
  - Botão Primário Verde: "Quero alugar".
  - Botão Outline: "Falar com proprietário".

---

## 5. Anunciar Imóvel (Wizard) - `/anunciar`
Fluxo de 4 passos para cadastro de novos imóveis.
- **Passo 1 (Básico):** Título, Descrição, Tipo de imóvel, Quartos e Comodidades (Checkboxes: Pet-friendly, Mobiliado, etc.).
- **Passo 2 (Localização):** CEP, Endereço, Bairro e Cidade.
- **Passo 3 (Fotos):** Dropzone de upload com grid de preview das imagens.
- **Passo 4 (Valores):** Inputs para Aluguel, Condomínio, IPTU e cálculo automático do "Total por mês".
- **Sucesso:** Tela final com ícone de Check e link para gerenciar anúncio.

---

## 6. Perfil do Usuário - `/perfil`
Painel administrativo do inquilino ou proprietário.
- **Layout Sidebar:** Avatar do usuário, badge de verificação, e-mail, e menu de navegação lateral (Painel, Contratos, Mensagens, Configurações).
- **Stats Grid:** 4 cards com números (Contratos, Visitas, Mensagens, Favoritos).
- **Seção "Meus Anúncios":** Listagem dos imóveis que o usuário está oferecendo.
- **Atividade Recente:** Timeline de notificações (ex: "Verificação concluída", "Nova mensagem").

---

## 7. Login e Cadastro - `/entrar` e `/cadastro`
Telas bipartidas focadas em branding e formulário.
- **Branding (Lado Esquerdo/Direito):** Bloco sólido de cor primária com o logotipo 3D em tamanho grande, título inspiracional e padrão visual de fundo.
- **Formulário:** Design limpo, link de volta para a Home, inputs com labels claras.
- **Cadastro:** Botões de escolha de papel ("Sou Inquilino" vs "Sou Proprietário") com estilos distintos de seleção.

---

## 8. Mensagens e Favoritos - `/mensagens` e `/favoritos`
*(Placeholders funcionais)*
- **Favoritos:** Listagem em grid dos imóveis marcados com o ícone de coração.
- **Mensagens:** Lista de conversas à esquerda e chat aberto à direita (padrão desktop).
