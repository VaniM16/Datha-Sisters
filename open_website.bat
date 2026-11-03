@echo off
title Datha Sisters Website
echo Starting Datha Sisters website...
start http://localhost:8080
python -m http.server 8080
pause
