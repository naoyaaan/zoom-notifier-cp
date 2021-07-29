from flask import g, Blueprint, abort, request
from ..middleware import public_endpoint, private_endpoint
from ..database import db, User, Class
from ..updater import add_class, reload_and_update
import hashlib

page = Blueprint('api/v1/users', __name__, url_prefix='/api/v1/users')

@page.route('', methods=['POST'])
@public_endpoint()
def signup():
    if request.method == 'POST':
        body = request.get_json()
        if body is None:
            abort(400, "Bad Request no body")
        if 'username' not in body or 'password' not in body or len(body['username']) < 4 or len(body['password']) == 0:
            abort(400, "Bad Request")
        user = User.query.filter(User.username == body['username']).first()
        if user is not None:
            abort(400, "Username already taken")
        else:
            user = User(username=body['username'], password=hashlib.sha512(body['password'].encode('utf-8')).hexdigest())
            db.session.add(user)
            db.session.commit()
            return { "code": 200, "message": "OK" }
    else:
        abort(400, 'Unsupported method')

# デバッグ用API．ユーザ情報の一覧を取得．
@page.route('/all')
@public_endpoint()
def debug():
    users = User.query.limit(10).all()
    return [{
        "id":user.id,
        "username":user.username,
        "password":user.password,
        "rss_url":user.rss_url,
        "ical_url":user.ical_url
        } for user in users]

@page.route('/me', methods=['GET', 'PUT'])
@private_endpoint()
def me():
    user = User.query.filter(User.username == g.user['username']).first()
    if user is None:
        abort(404, "Not Found")
    if request.method == 'GET':
        return {
            "id": user.id,
            "username": user.username,
            "rss_url": user.rss_url,
            "ical_url": user.ical_url
        }
    elif request.method == 'PUT':
        body = request.get_json()
        if 'password_old' not in body or 'password_new' not in body or 'rss_url' not in body or 'ical_url' not in body or len(body['password_new']) == 0 or hashlib.sha512(body['password_old'].encode('utf-8')).hexdigest() != user.password:
            abort(400, "Wrong Password")
        user.password = hashlib.sha512(body['password_new'].encode('utf-8')).hexdigest()
        user.rss_url = body['rss_url']
        user.ical_url = body['ical_url']
        db.session.commit()
        reload_and_update(user)
        return "OK"

    else:
        abort(400, 'Unsupported method')


# パスワードの変更のみを行う．
@page.route('/me/password', methods=['PUT'])
@private_endpoint()
def update_password():
    user = User.query.filter(User.username == g.user['username']).first()
    body = request.get_json()
    if 'password_old' not in body or 'password_new' not in body or len(body['password_new']) == 0 or hashlib.sha512(body['password_old'].encode('utf-8')).hexdigest() != user.password:
        abort(400, "Wrong Password")
    user.password = hashlib.sha512(body['password_new'].encode('utf-8')).hexdigest()
    db.session.commit()
    return "OK"

# URLの変更のみを行う
@page.route('/me/url', methods=['PUT'])
@private_endpoint()
def update_url():
    user = User.query.filter(User.username == g.user['username']).first()
    body = request.get_json()
    if 'rss_url' not in body or 'ical_url' not in body:
        abort(400, "Bad Request")
    user.rss_url = body['rss_url']
    user.ical_url = body['ical_url']
    db.session.commit()
    reload_and_update(user)
    return "OK"
