#!/usr/bin/env bash
set -e
[ -f .env ] || cp .env.example .env
npm install
npm start
