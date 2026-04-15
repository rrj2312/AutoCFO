from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, ingest, risks, dashboard, actions, explain

app = FastAPI(title="AutoCFO API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(ingest.router, tags=["Ingest"])
app.include_router(risks.router, tags=["Risks"])
app.include_router(dashboard.router, tags=["Dashboard"])
app.include_router(actions.router, tags=["Actions"])
app.include_router(explain.router, tags=["Explain"])

@app.get("/")
def root():
    return {"status": "AutoCFO API is running"}