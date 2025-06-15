# Task Master

Um aplicativo moderno de gerenciamento de tarefas (To-Do) construído com Next.js, TypeScript, TailwindCSS e Jest.

## 🚀 Funcionalidades

- ✨ **Interface moderna e responsiva** - Design elegante que funciona em todos os dispositivos
- ➕ **Adicionar tarefas** - Crie novas tarefas com título, descrição, prioridade e categoria
- ✏️ **Editar tarefas** - Modifique tarefas existentes facilmente
- ✅ **Marcar como concluída** - Acompanhe o progresso das suas tarefas
- 🗑️ **Excluir tarefas** - Remova tarefas que não são mais necessárias
- 🔍 **Filtrar tarefas** - Visualize todas, pendentes ou concluídas
- 📊 **Estatísticas** - Veja métricas de produtividade em tempo real
- 🏷️ **Categorias e prioridades** - Organize suas tarefas por tipo e importância
- 💾 **Persistência local** - Suas tarefas são salvas automaticamente no navegador
- 🌙 **Tema escuro/claro** - Suporte automático baseado na preferência do sistema

## 🛠️ Tecnologias

- **[Next.js 15](https://nextjs.org/)** - Framework React para produção
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Jest](https://jestjs.io/)** - Framework de testes
- **[Testing Library](https://testing-library.com/)** - Utilitários para testes de componentes React

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd task-master-jest
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Execute o projeto em modo de desenvolvimento**
   ```bash
   pnpm dev
   ```

4. **Abra no navegador**
   
   Acesse [http://localhost:3000](http://localhost:3000)

## 🧪 Testes

### Executar todos os testes
```bash
pnpm test
```

### Executar testes em modo watch
```bash
pnpm test:watch
```

### Executar testes com cobertura
```bash
pnpm test:coverage
```

### Componentes testados
- ✅ **TaskForm** - Formulário de criação/edição de tarefas
- ✅ **TaskItem** - Componente individual de tarefa
- ✅ **TaskStats** - Estatísticas e métricas
- ✅ **TaskFilter** - Filtros de visualização

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── TaskManager.tsx    # Gerenciador principal
│   ├── TaskForm.tsx       # Formulário de tarefas
│   ├── TaskList.tsx       # Lista de tarefas
│   ├── TaskItem.tsx       # Item individual
│   ├── TaskFilter.tsx     # Filtros
│   └── TaskStats.tsx      # Estatísticas
├── types/                 # Definições TypeScript
│   └── Task.ts           # Tipos relacionados a tarefas
└── __tests__/            # Testes unitários
    ├── TaskForm.test.tsx
    ├── TaskItem.test.tsx
    ├── TaskStats.test.tsx
    └── TaskFilter.test.tsx
```

## 💡 Como Usar

### 1. Adicionar uma nova tarefa
- Preencha o título (obrigatório)
- Adicione uma descrição opcional
- Escolha a prioridade (baixa, média, alta)
- Defina uma categoria opcional
- Clique em "Adicionar Tarefa"

### 2. Gerenciar tarefas existentes
- **Marcar como concluída**: Clique na checkbox
- **Editar**: Clique no ícone de edição
- **Excluir**: Clique no ícone de lixeira

### 3. Filtrar tarefas
Use os botões de filtro para visualizar:
- **Todas**: Mostra todas as tarefas
- **Pendentes**: Apenas tarefas não concluídas
- **Concluídas**: Apenas tarefas finalizadas

### 4. Acompanhar progresso
O painel de estatísticas mostra:
- Total de tarefas
- Tarefas pendentes e concluídas
- Taxa de conclusão
- Tarefas de alta prioridade pendentes
- Categorias utilizadas

## 🎨 Personalização

### Cores e Temas
O projeto usa TailwindCSS com suporte automático a tema escuro. As cores podem ser personalizadas no arquivo `tailwind.config.js`.

### Prioridades
As prioridades são definidas em `src/types/Task.ts`:
- `low` - Baixa (verde)
- `medium` - Média (amarelo)
- `high` - Alta (vermelho)

## 🔧 Scripts Disponíveis

```bash
pnpm dev          # Inicia servidor de desenvolvimento
pnpm build        # Cria build de produção
pnpm start        # Inicia servidor de produção
pnpm lint         # Executa linting
pnpm test         # Executa testes
pnpm test:watch   # Executa testes em modo watch
pnpm test:coverage # Executa testes com cobertura
```

## 📱 Recursos Responsivos

- **Mobile First**: Interface otimizada para dispositivos móveis
- **Breakpoints**: Adaptação automática para tablet e desktop
- **Touch Friendly**: Botões e elementos adaptados para toque

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente se necessário
3. Deploy automático a cada push

### Outros Provedores
O projeto pode ser deployado em qualquer provedor que suporte Next.js:
- Netlify
- AWS Amplify
- Google Cloud
- Railway

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 🐛 Problemas Conhecidos

- As tarefas são armazenadas apenas no localStorage (não há sincronização entre dispositivos)
- Não há validação de tarefas duplicadas

## 🔮 Próximas Funcionalidades

- [ ] Sincronização com banco de dados
- [ ] Autenticação de usuário
- [ ] Notificações de prazo
- [ ] Anexos em tarefas
- [ ] Compartilhamento de listas
- [ ] Exportação de dados
- [ ] Modo offline

---

Feito com ❤️ usando Next.js e TypeScript
