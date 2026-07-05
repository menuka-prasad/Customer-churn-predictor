from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.dependencies import get_db
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.router import api_router
from app.core.config import settings


app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://churnly.ultmos.com", "https://customer-churn-predictor-ruby.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health/db")
async def health_db(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT 1"))
    return {"db connected": result.scalar() == 1}


app.include_router(api_router, prefix=settings.API_V1_STR)



