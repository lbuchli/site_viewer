#!/usr/bin/env python3

from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# TODO add rest api endpoints

app.mount("/", StaticFiles(directory="static"), name="static")
