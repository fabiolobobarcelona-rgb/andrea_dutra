# Andrea Dutra — página oficial para contratação de shows

Landing page em Next.js 15, TypeScript e Tailwind CSS 4, com imagens
otimizadas extraídas do press kit.

## Publicar no Netlify

O Netlify reconhece o Next.js automaticamente e aplica o adaptador oficial
OpenNext durante o build. Não é necessário instalar nem fixar um plugin
Netlify manualmente.

1. Envie os arquivos do projeto para um repositório Git privado ou público.
2. No Netlify, escolha **Add new project → Import an existing project** e
   conecte o repositório.
3. Confirme que o **Base directory** corresponde à pasta que contém este
   `package.json` e `netlify.toml`. Se todo o projeto estiver na raiz, não
   preencha uma subpasta.
4. Defina estas variáveis em **Project configuration → Environment
   variables**:

   | Variável | Obrigatória | Uso |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | Sim | Domínio canônico, por exemplo `https://shows.seudominio.com.br`, sem barra final. |
   | `GOOGLE_MAPS_API_KEY` | Não | Distância rodoviária desde o Rio de Janeiro. |
   | `OPENAI_API_KEY` | Não | Observação gerada por IA para a estimativa. |

   `GOOGLE_MAPS_API_KEY` e `OPENAI_API_KEY` são opcionais. Sem elas, o
   orçamento continua disponível como estimativa orientativa; a logística fica
   sob consulta e a observação permanece informativa.

5. Publique usando o comando `npm run build`, definido em `netlify.toml`.
   O adaptador Next.js identifica automaticamente rotas de servidor, APIs,
   imagens e demais recursos. Não configure um diretório estático `publish`:
   este site usa Route Handlers e não é exportado como HTML estático.
6. Depois de apontar o domínio, confira a URL de `NEXT_PUBLIC_SITE_URL` e
   publique novamente para atualizar metadados, canonical e Open Graph.

**Não use o envio de uma pasta estática por drag and drop** como deploy de
produção: esse método não configura os Route Handlers nem o processamento
Next.js necessários para a calculadora e as imagens. Importe o projeto via Git
ou publique com o Netlify CLI.

## Rodar localmente

Requer Node.js 22.

```bash
npm ci
npm run dev
```

Para testar um build de produção local:

```bash
npm run build
npm run start
```

## Estimativa de contratação

Os municípios são consultados nas APIs públicas do IBGE; o PIB municipal de
2023 e a população estimada de 2024 vêm do SIDRA/IBGE. A distância rodoviária
usa Google Maps e a observação por IA usa OpenAI quando as respectivas chaves
estão configuradas. Credenciais de API não devem ser incluídas no código:
configure-as como variáveis de ambiente no Netlify.

Os valores-base de cachê são apenas referenciais e devem ser revisados pela
produção antes da publicação. O fator econômico está limitado a ±6% e também
precisa de validação comercial. A estimativa não é uma proposta ou confirmação
de disponibilidade.

## Verificação

```bash
npm run lint
npm run build
npm audit
```
