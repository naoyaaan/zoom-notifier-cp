from flask import g, Blueprint, abort, request
from ..middleware import public_endpoint, private_endpoint
from ..database import db, User, Class, Task
import uuid

page = Blueprint('api/v1/tasks', __name__, url_prefix='/api/v1/tasks')

@page.route('', methods=['GET'])
@private_endpoint()
def tasks():
    user = User.query.filter(User.username == g.user['username']).first()
    status = request.args.get('status', '')
    res = []
    for c in user.classes:
        for t in c.tasks:
            if status == '' or (t.status == (status == 'completed')):
                res.append({
                    "class": t.ofClass.name,
                    "class_id": t.ofClass.id,
                    "id": t.id,
                    "title": t.title,
                    "description": t.description,
                    "created_at": t.created_at,
                    "deadline": t.deadline,
                    "completed": t.status
                })
    return res;
