@echo off
REM Sync template branch with main
REM Usage: run from main branch

echo === [1/7] Check branch ===
for /f %%i in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%i
if not "%BRANCH%"=="main" (
    echo ERROR: run from main branch
    exit /b 1
)

echo === [2/7] Push main ===
git push origin main
if %errorlevel% neq 0 exit /b %errorlevel%

echo === [3/7] Switch to template and merge main ===
git checkout template
if %errorlevel% neq 0 exit /b %errorlevel%
git merge main --no-edit
if %errorlevel% neq 0 (
    echo Merge conflict - resolve manually
    exit /b %errorlevel%
)

echo === [4/7] Restore template-specific config ===
git checkout ORIG_HEAD -- src/config/site.ts src/content/pages/about.md README.md

echo === [5/7] Clean personal content, keep samples ===
del /q src\content\blog\*.md 2>nul
git checkout ORIG_HEAD -- src/content/blog/hello-maroon.md
del /q src\content\docs\*.md 2>nul
git checkout ORIG_HEAD -- src/content/docs/getting-started.md

echo === [6/7] Commit and push template ===
git add -A
git commit -m "sync: template" --allow-empty
git push origin template

echo === [7/7] Back to main ===
git checkout main

echo === DONE ===
