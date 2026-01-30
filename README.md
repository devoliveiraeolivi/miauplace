# MiauPlace

Plataforma de adocao de gatos - encontre seu novo amigo felino.

## Sobre

MiauPlace eh uma plataforma inspirada no Airbnb, onde pessoas podem:
- Postar gatos disponiveis para adocao
- Visualizar perfis completos dos gatos com fotos
- Ver localizacao de onde o gato esta
- Entrar em contato com quem esta doando

## Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Estilizacao**: Tailwind CSS
- **Linting**: ESLint

## Como rodar

```bash
# Instalar dependencias
npm install

# Rodar em desenvolvimento
npm run dev

# Build para producao
npm run build

# Rodar em producao
npm start
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Projeto

```
src/
  app/           # Rotas e paginas (App Router)
  components/    # Componentes reutilizaveis
  lib/           # Utilitarios e helpers
  types/         # Tipos TypeScript
public/          # Arquivos estaticos
```
