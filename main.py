# coding=utf-8
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai.error import RateLimitError, InvalidRequestError
from pydantic import BaseModel
from slowapi.errors import RateLimitExceeded

import logging

from slowapi import Limiter, _rate_limit_exceeded_handler
from starlette.staticfiles import StaticFiles

from starlette_context import middleware, plugins, context

from various.openai_request import Berganza

logging_path = "berganza.log"
logging.basicConfig(filename=logging_path,
                    filemode='a',
                    format='%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
                    datefmt='%H:%M:%S',
                    level=logging.DEBUG)

print(f"logging to {Path(logging_path).resolve()}.")
logger = logging.getLogger("Berganza")

limiter = Limiter(key_func=lambda: context.data["X-Forwarded-For"])

app = FastAPI(redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["post"],
    allow_headers=["*"],
)

app.add_middleware(
    middleware.ContextMiddleware,
    plugins=(plugins.ForwardedForPlugin(),),
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

berganza = Berganza("resources/config.json")


class AskPayload(BaseModel):
    message: str


@app.post("/test/")
async def test_endpoint():
    return {"message": "Test successful"}


@app.post("/ask/")
@limiter.limit("25/day")
async def ask_berganza(request: Request, body_json: AskPayload) -> dict[str, str]:
    try:
        print("received request")

        question = body_json.message
        ip = context.data["X-Forwarded-For"] or "localhost"
        print(f"{ip:s}: {question:s}")

        info = "all fine"

        if question is None:
            answer = "Hast Du Deine Zunge verschluckt?"
            info = "too short"

        else:
            try:
                answer = berganza.ask(question.strip()[-1000:], ip.replace(".", "-"))

            except RateLimitError as e:
                logger.error(str(e))
                print(str(e))
                answer = "Ich bin ein wenig überfordert und kann kaum einen klaren Gedanken fassen. Bitte gib mir einen Tag Ruhe."
                info = f"RateLimitError: {str(e):s}"

            except InvalidRequestError as e:
                logger.error(str(e))
                print(str(e))
                answer = "Deine Worte ergeben für mich keinen Sinn."
                info = f"InvalidRequestError: {str(e):s}"

        print(answer)
        return {
            "reply":    answer,
            "info":     info,
        }

    except Exception as e:
        error_message = str(e)
        logger.error(error_message)
        return {
            "reply":    "Mir ist es gar nicht gut. Ich muss wohl einen Arzt aufsuchen.",
            "info":     error_message,
        }


app.mount("/", StaticFiles(directory="website", html=True), name="website")
