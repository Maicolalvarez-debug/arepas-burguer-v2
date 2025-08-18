# Paquete de Auditoría – Arepas Burguer v2

Este paquete añade una auditoría rápida de tu proyecto para generar **reporte_proyecto.md** con errores y validaciones.

## Cómo usar
1. Copia la carpeta `scripts/` a la **raíz** de tu proyecto.
2. Abre **PowerShell** en la raíz del proyecto.
3. (Si te bloquea) habilita scripts solo para esta sesión:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```
4. Ejecuta:
   ```powershell
   .\scripts\auditar.ps1
   ```
5. Se genera `reporte_proyecto.md`. Compártelo conmigo para revisar y corregir.

Incluye también `NOTA_ERRORES.md` por si prefieres llenar manualmente.
