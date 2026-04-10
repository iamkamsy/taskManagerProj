from pymongo import MongoClient
from flask import g
import os


def get_db():
    if "db" not in g:
        is_dev = os.environ.get("FLASK_ENV") == "development"
        client = MongoClient(
            os.environ["MONGO_URI"],
            tlsInsecure=is_dev,   # bypass TLS cert check in local dev only
        )
        g.db = client[os.environ.get("DB_NAME", "taskmanager")]
    return g.db
