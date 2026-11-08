# Instrucciones rápidas - CodeMind Nova

## 1. Descomprimir el código

```bash
unzip nova-codemind-completo-v2.zip -d nova-codemind
cd nova-codemind
```

## 2. Instalar y correr en desarrollo

```bash
pnpm install
pnpm dev
```

## 3. Generar APK Android

```bash
pnpm build
pnpm exec cap sync android
cd android
./gradlew assembleDebug
```

## 4. Firmar APK de release

Usa el keystore generado:
- Archivo: nova-release.keystore
- Alias: nova
- Password: novacodemind2026

Configura `android/app/build.gradle` con signingConfigs si quieres automatizar la firma.

## 5. Backend remoto (para que la IA funcione en el móvil)

```bash
NOVA_REMOTE_URL=https://tu-backend.com pnpm exec cap sync android
```
