from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from schemas import UserCreate, UserOut, UserLogin
from auth import hash_password, verify_password, create_access_token, get_current_user
from random import randint

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")

    hashed_pw = hash_password(user.password)
    random_iban = "TR" + "".join([str(randint(0, 9)) for _ in range(24)])

    new_user = User(
        email=user.email,
        hashed_password=hashed_pw,
        full_name=user.full_name,
        iban=random_iban,
        balance=0.0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    token = create_access_token({"user_id": db_user.id})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/balance")
def get_balance(current_user: User = Depends(get_current_user)):
    return {"balance": current_user.balance}

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

# ✅ E-posta güncellenebilir, IBAN sabit
@router.put("/update", response_model=UserOut)
def update_profile(
    full_name: str,
    email: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user = db.merge(current_user)

    # Değişiklik yapılmamışsa durdur
    if (
        full_name == current_user.full_name and
        email == current_user.email
    ):
        raise HTTPException(status_code=400, detail="Değişiklik yapılmadı.")

    # E-posta başka kullanıcıya aitse hata ver
    existing = db.query(User).filter(User.email == email, User.id != current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kullanılıyor.")

    current_user.full_name = full_name
    current_user.email = email
    db.commit()
    db.refresh(current_user)
    return current_user

