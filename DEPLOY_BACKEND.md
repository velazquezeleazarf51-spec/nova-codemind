# Desplegar backend de CodeMind Nova

El chat de IA necesita este backend en internet + una clave de API.

## Requisitos

- Cuenta en [Railway](https://railway.app) (recomendado) o [Render](https://render.com)
- Clave de OpenAI: https://platform.openai.com/api-keys  
  (o MANUS_API_URL + MANUS_API_KEY si usas Manus)

## Paso 1 — Preparar el código

```bash
unzip nova-codemind-completo-v2.zip -d nova
cd nova

# Aplicar parche OpenAI (si aún no está en el zip)
cp ../backend-patch/env.ts server/_core/env.ts
cp ../backend-patch/llm.ts server/_core/llm.ts
cp ../backend-patch/routers.ts server/routers.ts
cp ../backend-patch/.env.example .
cp ../backend-patch/railway.toml .
```

## Paso 2 — Railway (recomendado)

1. Entra a https://railway.app → New Project
2. **Deploy from GitHub** o sube la carpeta `nova`
3. Variables de entorno:
   ```
   OPENAI_API_KEY=sk-proj-tu-clave
   NOVA_MODEL=gpt-4o-mini
   NODE_ENV=production
   JWT_SECRET=un-secreto-largo-aleatorio
   PORT=3000
   ```
4. Settings → Networking → **Generate Domain**
5. Copia la URL, ejemplo: `https://nova-production.up.railway.app`

## Paso 3 — Probar

```bash
curl https://TU-URL/api/health
# → {"status":"ok"}
```

## Paso 4 — Conectar el APK

1. Actions → **2 - Build APK Android** → Run workflow
2. En `nova_remote_url` pega la URL del backend (sin `/` final)
3. Descarga el APK nuevo

## Notas

- El chat funciona **sin base de datos**
- Modelo por defecto: `gpt-4o-mini`
- Cualquier API compatible con OpenAI: usa `OPENAI_BASE_URL`
