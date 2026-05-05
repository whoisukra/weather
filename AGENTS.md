# oc-sample - Project Conventions

## Tech Stack

### Backend

- **Runtime:** Node.js (ESM)
- **Framework:** Fastify
- **Language:** TypeScript (strict mode)
- **Config:** dotenv (.env files)
- **Test:** Vitest
- **Runner:** tsx (dev), node (prod)

### Frontend

- **Framework:** Vue 3 (Composition API + `<script setup>`)
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide Vue Next
- **Font:** Inter (Google Fonts)
- **Design:** Dark mode, glassmorphism, ambient glow

## Project Structure

Feature-based architecture. Cada módulo é autocontido com suas rotas, controller, service, types e errors.

```
src/
├── index.ts                          # Entry point, graceful shutdown
├── shared/
│   ├── config/env.ts                 # Variáveis de ambiente centralizadas
│   └── http/error-handler.ts         # Error handler global do Fastify
└── modules/
    └── <feature>/
        ├── <feature>.routes.ts       # Registro de rotas com JSON Schema
        ├── <feature>.controller.ts   # Recebe request, chama service
        ├── <feature>.service.ts      # Regra de negócio e chamadas externas
        ├── <feature>.types.ts        # Interfaces e tipos
        └── <feature>.errors.ts       # Erros customizados da feature

tests/
├── helper.ts                         # Factory do app Fastify para testes
└── modules/
    └── <feature>/
        ├── <feature>.service.test.ts     # Testes unitários do service
        ├── <feature>.controller.test.ts  # Testes unitários do controller
        └── <feature>.routes.test.ts      # Testes de integração (Fastify inject)
```

## Rules

### 1. Feature-Based Structure

- Sempre crie features em `src/modules/<feature>/`
- Cada feature deve ter no mínimo: `routes`, `controller`, `service`
- Use `shared/` para código que é reutilizado por múltiplas features
- Nunca crie controllers ou services soltos fora de um módulo

### 2. Dependency Injection

- Services são injetados nos controllers via construtor
- Instancie na feature de rotas e passe para o controller
- Nunca use `new Service()` dentro de um controller

```ts
// routes
const service = new MyService()
const controller = new MyController(service)
```

### 3. Environment Variables

- Todas as configurações vão em `src/shared/config/env.ts`
- Adicione a variável no `.env` e `.env.example`
- Nunca use `process.env` diretamente fora do `env.ts`

### 4. Error Handling

- Crie erros customizados por feature estendendo uma classe base com `statusCode`
- Lance erros no service, trate no error handler global
- Nunca retorne erros diretamente no controller

```ts
export class MyFeatureError extends Error {
  constructor(message: string, public readonly statusCode: number = 500) {
    super(message)
    this.name = 'MyFeatureError'
  }
}
```

### 5. JSON Schema Validation

- Toda rota deve ter schema de response no mínimo
- Use `description` e `tags` para documentação
- Adicione schema de body/query/params quando aplicável

### 6. Type Safety

- Interfaces exportadas em `*.types.ts`
- Sempre tipar responses de APIs externas
- Usar `as` cast apenas quando necessário, preferir type guards

### 7. Imports

- Sempre usar extensão `.js` nos imports (ESM com verbatimModuleSyntax)
- Imports relativos devem ser explícitos

## Creating a New Feature

Quando solicitado a criar uma nova feature:

1. Criar pasta `src/modules/<feature>/`
2. Criar arquivos na ordem: `types` → `errors` → `service` → `controller` → `routes`
3. Registrar a rota em `src/index.ts` (se não usar auto-register)
4. Criar testes espelhando a estrutura em `tests/modules/<feature>/`
5. Rodar `npm run typecheck` e `npm test`
6. Nunca esquecer de atualizar `.env.example` se houver novas variáveis

## Creating Tests

- Testes espelham a estrutura de `src/modules/` em `tests/modules/`
- **Service tests:** mock `fetch` para APIs externas, testar sucesso e erros
- **Controller tests:** mock do service, testar resposta formatada e propagação de erros
- **Route tests:** usar `fastify.inject()`, testar status codes e body
- Usar `helper.ts` para build do app com `setErrorHandler` e rotas registradas
- Sempre testar: happy path, erros de serviço, erros inesperados, rotas inexistentes

## Scripts

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Dev server com hot reload      |
| `npm run build`   | Compila TypeScript para dist/  |
| `npm start`       | Roda build em produção         |
| `npm run typecheck` | Verifica tipos sem compilar  |
| `npm test`        | Roda todos os testes           |
| `npm run test:watch` | Testes em modo watch        |
| `npm run test:coverage` | Testes com relatório de cobertura |

## Frontend Conventions

### Structure

```
front/src/
├── components/          # Componentes Vue reutilizáveis
├── composables/         # Composition API hooks (useXxx)
├── types/              # TypeScript interfaces
├── App.vue             # Root component
├── main.ts             # Entry point
└── index.css           # Tailwind + design tokens
```

### Design System

- **Dual mode** — dark (default) e light com toggle
- **Dark mode** — fundo `#0a0a0a` com ambient glow
- **Light mode** — fundo `gray-50` com cards brancos e sombras
- **Glassmorphism** — usar classes `.glass` e `.glass-strong`
- **Gradient text** — usar `.text-gradient` e `.text-gradient-blue`
- **Animations** — `.animate-fade-in`, `.animate-slide-up` com delays escalonados
- **Border radius** — `rounded-2xl` (16px) para cards, `rounded-3xl` (24px) para hero
- **Spacing** — `space-y-*` para vertical gap consistente
- **Theme persistence** — localStorage via `useTheme()`

### Theme Utilities

| Class | Dark Mode | Light Mode |
| ----- | --------- | ---------- |
| `.card-bg` | `bg-white/[0.05]` + border | `bg-white` + border + shadow |
| `.row-bg` | `bg-white/[0.03]` + hover | `bg-white` + hover |
| `.text-subtle` | `text-white/50` | `text-gray-500` |
| `.text-muted` | `text-white/30` | `text-gray-400` |
| `.text-faint` | `text-white/20` | `text-gray-300` |
| `.divider` | `border-white/[0.08]` | `border-gray-200` |
| `.icon-bg` | `bg-white/[0.06]` | `bg-gray-100` |
| `.toggle-bg` | `border-white/[0.08]` | `border-black/[0.08]` |
| `.bg-ambient` | `hidden` (dark: block) | `hidden` |

### Component Rules

- Sempre usar `<script setup lang="ts">`
- Props tipadas com `defineProps<{ ... }>()`
- Emit tipado com `defineEmits<{ ... }>()`
- Usar Lucide icons para ícones inline
- Loading states com `LoadingSkeleton.vue`
- Error states com `ErrorState.vue`

### API Calls

- Sempre via composables (`useXxx`)
- Usar `ref()` para estado reativo
- Retornar `{ data, loading, error, fetch }` pattern
- Proxy `/api` configurado no Vite → `http://localhost:3000`
