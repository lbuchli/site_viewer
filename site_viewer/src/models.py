from typing import List, Optional, Union

from pydantic import BaseModel

class ModelBase(BaseModel):
    qr_relative: str
    model: bytes

class SiteBase(BaseModel):
    model: ModelBase
    title: str
    class Config:
        orm_mode = True

class SiteRequest(SiteBase):
    id: int

