# Reportes Juli

Aplicación web para documentar formación comercial mediante voz. Transcribe audio, procesa con Claude AI para estructurar reportes estilo "diagnóstico clínico", y permite exportar a PDF/Excel.

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env.local` con tu API key de Claude:
```
VITE_CLAUDE_API_KEY=sk-ant-your-api-key-here
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Uso

1. **Grabar Reporte**: Pulsa el botón de micrófono y describe tu día comercial
2. **Procesar con IA**: Claude estructurará automáticamente la transcripción
3. **Revisar y Editar**: Los campos son editables haciendo clic
4. **Exportar**: Descarga en PDF o Excel

## Estructura del Reporte

Cada reporte incluye:
- Información de rutas visitadas
- Volúmenes gestionados
- Diagnóstico:
  - Situación actual
  - Problemas detectados
  - Soluciones propuestas
  - Oportunidades
- Aprendizajes clave
- Notas adicionales

## Stack Técnico

- React + TypeScript + Vite
- Tailwind CSS
- Zustand (estado con persistencia localStorage)
- Web Speech API (transcripción de voz)
- Claude API (procesamiento IA)
- jsPDF + xlsx (exportación)
- Recharts (gráficos)

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
```
