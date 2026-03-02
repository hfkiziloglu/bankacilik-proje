from pydantic import BaseModel, Field, EmailStr

# Kullanıcı kayıt için istenen veri
class UserCreate(BaseModel):
    email: EmailStr = Field(..., min_length=1)
    password: str = Field(..., min_length=1)
    full_name: str = Field(..., min_length=1)

# Kullanıcı login için istenen veri
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Kullanıcıya API cevabı olarak gönderilecek veri
class UserOut(BaseModel):
    id: int
    email: str
    balance: float
    full_name: str
    iban: str

    class Config:
        from_attributes = True  # Pydantic v2 (önceki: orm_mode = True)

# Para transferi işlemi için şema (eğer bu hâlâ kullanılıyorsa)
class Transfer(BaseModel):
    sender_id: int
    receiver_id: int
    amount: float
