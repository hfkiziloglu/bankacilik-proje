from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Transaction
from auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/transactions", tags=["Transactions"])

# -------------------
# PARA TRANSFERİ
# -------------------
class FlexibleTransferRequest(BaseModel):
    amount: float
    receiver_email: str | None = None
    receiver_iban: str | None = None

@router.post("/transfer")
def transfer_money(
    data: FlexibleTransferRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Miktar pozitif olmalı.")

    if current_user.balance < data.amount:
        raise HTTPException(status_code=400, detail="Yetersiz bakiye.")

    # Alıcıyı e-posta ya da IBAN'a göre bul
    if data.receiver_email:
        receiver = db.query(User).filter(User.email == data.receiver_email).first()
    elif data.receiver_iban:
        receiver = db.query(User).filter(User.iban == data.receiver_iban).first()
    else:
        raise HTTPException(status_code=400, detail="Alıcı bilgisi eksik.")

    if not receiver:
        raise HTTPException(status_code=404, detail="Alıcı bulunamadı.")

    current_user.balance -= data.amount
    receiver.balance += data.amount

    transaction = Transaction(
        sender_id=current_user.id,
        receiver_id=receiver.id,
        amount=data.amount
    )
    db.add(transaction)
    db.commit()

    return {
        "message": "Transfer başarılı",
        "sender_balance": current_user.balance
    }

# -------------------
# PARA YATIRMA
# -------------------
class AmountRequest(BaseModel):
    amount: float

@router.post("/deposit")
def deposit_money(
    data: AmountRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Miktar pozitif olmalı.")

    current_user.balance += data.amount

    transaction = Transaction(
        sender_id=None,
        receiver_id=current_user.id,
        amount=data.amount
    )
    db.add(transaction)
    db.commit()

    return {"message": "Para yatırma başarılı", "balance": current_user.balance}

# -------------------
# PARA ÇEKME
# -------------------
@router.post("/withdraw")
def withdraw_money(
    data: AmountRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Miktar pozitif olmalı.")
    if current_user.balance < data.amount:
        raise HTTPException(status_code=400, detail="Yetersiz bakiye.")

    current_user.balance -= data.amount

    transaction = Transaction(
        sender_id=current_user.id,
        receiver_id=None,
        amount=data.amount
    )
    db.add(transaction)
    db.commit()

    return {"message": "Para çekme başarılı", "balance": current_user.balance}

# -------------------
# İŞLEM GEÇMİŞİ
# -------------------
@router.get("/history")
def transaction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transactions = db.query(Transaction).filter(
        (Transaction.sender_id == current_user.id) |
        (Transaction.receiver_id == current_user.id)
    ).order_by(Transaction.timestamp.desc()).all()

    history = []
    for tx in transactions:
        if tx.sender_id == current_user.id and tx.receiver_id:
            tx_type = "Gönderilen"
        elif tx.receiver_id == current_user.id and tx.sender_id:
            tx_type = "Alınan"
        elif tx.sender_id == current_user.id and tx.receiver_id is None:
            tx_type = "Çekilen"
        elif tx.receiver_id == current_user.id and tx.sender_id is None:
            tx_type = "Yatırılan"
        else:
            tx_type = "Bilinmeyen"

        history.append({
            "id": tx.id,
            "type": tx_type,
            "amount": tx.amount,
            "timestamp": tx.timestamp,
        })

    return history
