# CodeMind Nova

Companion AI 3D con Capacitor (Android APK), Three.js, chat, voz en español, memoria local y zonas de interacción.

## Descripción

Aplicación híbrida (web + Android) que incluye:

- Personaje 3D **Nova** con modelo GLB animado (idle, walk, standing_relax)
- Física, gravedad, movimiento spring-damper, salto y arrastre
- Cámara orbitable y habitación cyberpunk
- Chat conversacional con IA (modo Asistente / Compañera / Autónoma)
- Síntesis de voz y clip de presentación
- Sistema de memoria local y preferencias
- Zonas sensibles de tacto con límites de consentimiento
- Backend con rate limiting, tRPC y soporte para LLM

## Requisitos

- Node.js 20+
- pnpm
- Android Studio / SDK (solo para generar la APK)

## Instalación y desarrollo

```bash
pnpm install
pnpm dev
```

Abre http://localhost:3000

## Generar APK (Android)

```bash
pnpm build
pnpm exec cap sync android
cd android
./gradlew assembleDebug
```

El APK debug queda en:
`android/app/build/outputs/apk/debug/app-debug.apk`

### Apuntar a un backend remoto

```bash
NOVA_REMOTE_URL=https://tu-dominio.com pnpm exec cap sync android
```

## Estructura principal

- `client/` — Frontend React + Three.js + UI
- `server/` — Backend Express + tRPC + LLM
- `shared/` — Tipos y constantes compartidas
- `android/` — Proyecto Capacitor listo para compilar
- `client/public/assets/` — Modelos GLB y audio

## Notas importantes

- No se incluyen `node_modules`, `.env` ni claves de API.
- La APK necesita un backend publicado para usar el LLM real.
- Los modelos 3D (`.glb`) son pesados; se recomienda Git LFS si se suben por git.

## Licencia

MIT
