from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, HTTPException, APIRouter
from src.models import SiteBase, SiteRequest

import src.database as database

router = APIRouter(
    prefix='/api/site'
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get('/{siteId}', response_model=SiteRequest)
def get_site(siteId: int, db: Session = Depends(get_db)):
    return db.query(database.Site).filter(database.Site.id == siteId).first()

@router.post('/', response_model=SiteRequest)
def post_site(site: SiteBase, db: Session = Depends(get_db)):
    db_site = database.Site(model=site.model, qr_relative=site.qr_relative)
    db.add(db_site)
    db.commit()
    db.refresh(db_site)
    return get_site(db_site.id, db)

@router.delete('/{siteId}', status_code=204)
def delete_site(siteId: int, db: Session = Depends(get_db)):
    db.delete(get_site(siteId, db))





