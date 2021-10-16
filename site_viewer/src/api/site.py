from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, HTTPException, APIRouter
from site_viewer.src.models import SiteBase, SiteRequest

import site_viewer.src.database as database

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


@router.get('{siteId}', responses=SiteRequest)
def get_site(siteId: int, db: Session = Depends(get_db)):
    return db.query(database.Site).filter(database.Site.id == siteId).first()

@router.post('', responses=SiteRequest)
def post_site(site: SiteBase, db: Session = Depends(get_db())):
    db_model = database.Model(qr_relative=site.model.qr_relative, model=site.model.model)
    db_site = database.Site(title=site.title, model=db_model)
    db.add(db_site)
    db.commit()
    db.refresh(db_site)
    return get_site(db_site.id, db)

@router.delete('{siteId}', status_code=204)
def delete_site(siteId: int, db: Session = Depends(get_db())):
    db.delete(get_site(siteId, db))





