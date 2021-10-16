#!/usr/bin/env python3

from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

import site_viewer.src.api.site
app = FastAPI()

origins = [
    "http://localhost:5000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/", StaticFiles(directory="static"), name="static")

app.include_router(site_viewer.src.api.site.router)
