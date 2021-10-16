from typing import List, Optional, Union

from pydantic import BaseModel


class SiteBase(BaseModel):
    qr_relative: str
    model: bytes
    title: str
    class Config:
        orm_mode = True

class SiteRequest(SiteBase):
    id: int