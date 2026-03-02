# Bankacılık Uygulaması

Veri Yapıları (YMH218) dersi kapsamında geliştirilen mobil bankacılık uygulaması.

## Teknolojiler

**Backend**
- Python, FastAPI
- SQLAlchemy (ORM), SQLite
- JWT kimlik doğrulama

**Frontend**
- React Native, Expo
- React Native Paper

## Veri Yapısı Kullanımı

İşlem geçmişi ekranında **Stack (Yığın)** veri yapısı kullanılmıştır. API'den gelen işlemler Stack'e push edilip LIFO sırasıyla listelenmektedir.

## Özellikler

- Kayıt ve giriş (JWT token ile)
- Para yatırma / çekme
- IBAN ile para transferi
- İşlem geçmişi
- Profil bilgileri

## Proje Yapısı

```
bankacilik-proje/
├── backend/          # FastAPI sunucusu
│   ├── main.py
│   ├── models.py     # User, Transaction modelleri
│   ├── auth.py       # JWT işlemleri
│   ├── database.py
│   ├── schemas.py
│   └── routes/
│       ├── users.py
│       └── transactions.py
└── bankacilik-app/   # React Native uygulaması
    └── app/
        └── (auth)/   # Uygulama ekranları
```

## Katkıda Bulunanlar

- [Furkan Kızıloğlu](https://github.com/furkankzlu)
- [Yusuf Eker](https://github.com/yusufekerl)
- [Muhammed Özdemir](https://github.com/muhammedozd)

## Kurulum

### Backend

```bash
cd backend
pip install -r requirements.txt
```

`.env` dosyası oluştur:
```
SECRET_KEY=guclu-bir-sifre
```

Sunucuyu başlat:
```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd bankacilik-app
npm install
npx expo start
```
