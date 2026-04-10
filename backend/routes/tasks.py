from flask import Blueprint, request, jsonify, session
from bson import ObjectId
from db import get_db
from models.task import make_task

tasks_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")


def _require_auth():
    """Return (user_id_str, None) or (None, error_response)."""
    user_id = session.get("user_id")
    if not user_id:
        return None, (jsonify({"error": "Not authenticated."}), 401)
    return user_id, None


def _serialize(task: dict) -> dict:
    return {
        "id": str(task["_id"]),
        "name": task["name"],
        "deadline": task["deadline"],
        "description": task["description"],
    }


@tasks_bp.get("")
def list_tasks():
    user_id, err = _require_auth()
    if err:
        return err

    db = get_db()
    tasks = list(
        db.tasks.find({"user_id": ObjectId(user_id)}).sort("deadline", 1)
    )
    return jsonify([_serialize(t) for t in tasks]), 200


@tasks_bp.post("")
def create_task():
    user_id, err = _require_auth()
    if err:
        return err

    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    deadline = (data.get("deadline") or "").strip()
    description = (data.get("description") or "").strip()

    if not name:
        return jsonify({"error": "Task name is required."}), 400
    if not deadline:
        return jsonify({"error": "Deadline is required."}), 400
    if not description:
        return jsonify({"error": "Description is required."}), 400

    db = get_db()
    result = db.tasks.insert_one(make_task(user_id, name, deadline, description))
    task = db.tasks.find_one({"_id": result.inserted_id})
    return jsonify(_serialize(task)), 201


@tasks_bp.delete("/<task_id>")
def delete_task(task_id: str):
    user_id, err = _require_auth()
    if err:
        return err

    try:
        oid = ObjectId(task_id)
    except Exception:
        return jsonify({"error": "Invalid task ID."}), 400

    db = get_db()
    result = db.tasks.delete_one({"_id": oid, "user_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Task not found."}), 404
    return jsonify({"message": "Deleted."}), 200
