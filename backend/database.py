from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite veritabanı dosyası: bank.db
SQLALCHEMY_DATABASE_URL = "sqlite:///./bank.db"

# SQLite için özel parametre
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Oturum yönetimi
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Tüm modellerin ortak temeli
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
