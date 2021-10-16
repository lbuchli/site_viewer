from sqlalchemy import create_engine, Integer, String, ForeignKey, Column, Float, BLOB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os

username = os.environ['POSTGRES_USER']
password = os.environ['POSTGRES_PASSWORD']
db_name = os.environ['POSTGRES_DB']

SQLALCHEMY_DATABASE_URL = f"postgresql://{username}:{password}@db/{db_name}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Site(Base):
    __tablename__ = "site"

    id = Column(Integer, primary_key=True, index=True)
    qr_relative = Column(String)
    model = Column(String)
