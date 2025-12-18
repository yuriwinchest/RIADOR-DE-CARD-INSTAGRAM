# Criador de Card Instagram

Aplicação React + Vite para criar cards (Instagram e outros formatos), com galeria de modelos e geração automática via AI (Gemini).

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:5173/`.

## Variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`.

- `GEMINI_API_KEY`: usada no deploy da Vercel (serverless function em `/api/gemini`).
- `card_key`: alternativa ao `GEMINI_API_KEY` caso você tenha criado assim na Vercel.
- `VITE_GEMINI_API_KEY`: opcional para desenvolvimento local sem `vercel dev`.

## Deploy na Vercel

1. Suba o código no GitHub.
2. Na Vercel: `New Project` → `Import Git Repository` → selecione o repositório.
3. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Em `Environment Variables`, adicione `GEMINI_API_KEY` (ou `card_key`).
5. Deploy.

Para React Router funcionar no refresh/URL direta, o projeto inclui `vercel.json` com fallback para `index.html`.

## Publicar no GitHub (primeira vez)

```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/yuriwinchest/RIADOR-DE-CARD-INSTAGRAM.git
git push -u origin main
```
