from flask import Blueprint, abort, request
from ..middleware import public_endpoint, private_endpoint
from ..database import db, User
from ..token import issue_token
from ..updater import reload_and_update
import hashlib

page = Blueprint('api/v1/credential', __name__, url_prefix='/api/v1/credential')

@page.route('', methods=['POST'])
@public_endpoint()
def login():
    if request.method == 'POST':
        body = request.get_json()
        if 'username' not in body or 'password' not in body:
            abort(400, "Bad Request")
        user = User.query.filter(User.username == body['username']).first()
        if user is None or user.password != hashlib.sha512(body['password'].encode('utf-8')).hexdigest():
            abort(400, "Wrong username or password")
        else:
            reload_and_update(user)
            return { "token":  issue_token(body)}
    else:
        abort(400, 'Unsupported method')
