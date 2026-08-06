import { defineMcp } from "@lovable.dev/mcp-js";
import searchPropertiesTool from "./tools/search-properties";
import getPropertyTool from "./tools/get-property";
import listNeighborhoodsTool from "./tools/list-neighborhoods";

export default defineMcp({
  name: "pagoumorou",
  title: "PagouMorou",
  version: "0.1.0",
  instructions:
    "Ferramentas do PagouMorou, plataforma brasileira de locação residencial. Use `search_properties` para buscar imóveis para alugar com filtros de cidade, bairro, aluguel e dormitórios; `get_property` para obter os detalhes completos de um imóvel pelo id; e `list_neighborhoods` para conhecer os bairros atendidos, aluguel médio e disponibilidade. Todos os dados expostos são do catálogo público de imóveis.",
  tools: [searchPropertiesTool, getPropertyTool, listNeighborhoodsTool],
});