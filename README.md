# CodeMind Nova

Companion AI 3D con **Capacitor** (Android APK), Three.js, chat con IA, voz en español, memoria local y zonas de interacción táctil.

> El código fuente completo está dentro del archivo **`nova-codemind-completo-v2.zip`**.

## Cómo obtener el código fuente

1. Descarga el zip desde este repositorio.
2. Descomprime:
   ```bash
   unzip nova-codemind-completo-v2.zip -d nova-codemind
   cd nova-codemind
   ```
3. Instala y ejecuta:
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
./gradlew assembleDebug          # APK de prueba
# o
./gradlew assembleRelease        # APK firmada (necesitas keystore)
```

El APK queda en:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

### Llave de firma (keystore)

Se generó una llave de release:
- Archivo: `nova-release.keystore`
- Alias: `nova`
- Contraseña: `novacodemind2026`

(Si la necesitas, pídemela y te la paso de forma segura).

## Apuntar a un backend remoto

```bash
NOVA_REMOTE_URL=https://tu-dominio.com pnpm exec cap sync android
```

## Estructura del proyecto (dentro del zip)

```
├── android/          # Proyecto Capacitor listo para APK
├── client/           # Frontend React + Three.js + UI
│   └── public/assets/  # Modelos GLB (nova-animated.glb) y audio
├── server/           # Backend Express + tRPC + LLM
├── shared/           # Tipos y constantes compartidas
├── drizzle/          # Base de datos
└── package.json
```

## Características principales

- Personaje 3D Nova con animaciones reales (idle, walk, standing_relax)
- Física, gravedad, movimiento, salto y arrastre
- Habitación cyberpunk interactiva
- Chat con IA (modos Asistente / Compañera / Autónoma)
- Voz en español + clip de presentación
- Sistema de memoria y preferencias locales
- Zonas sensibles de tacto con límites de consentimiento
- Rate limiting y backend seguro

## Notas

- No se incluyen `node_modules`, `.env` ni claves de API.
- Los archivos `.glb` son pesados (~10 MB cada uno). Usa Git LFS si los subes al repo.
- Para Windows (.exe) el proyecto no está configurado (habría que añadir Electron).

## Licencia

MIT
