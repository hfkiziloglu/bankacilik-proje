from fastapi import FastAPI
from database import Base, engine
from routes import users, transactions  # Yeni: transactions eklendi

app = FastAPI()
Base.metadata.create_all(bind=engine)

# Routerları dahil et
app.include_router(users.router)
app.include_router(transactions.router)
