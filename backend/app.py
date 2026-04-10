import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.auth import auth_bp
from routes.tasks import tasks_bp

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ["SECRET_KEY"]
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False,  # set True in production (HTTPS)
)

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

app.register_blueprint(auth_bp)
app.register_blueprint(tasks_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
