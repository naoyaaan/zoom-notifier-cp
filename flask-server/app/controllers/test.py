from flask import Blueprint, abort, request
from ..middleware import public_endpoint, private_endpoint
from ..database import db, Counter

page = Blueprint('test', __name__, url_prefix='/test')


@page.route('/<page>')
@public_endpoint()
def index(page):
    return {'a': 1, 'b': ['x', 'y', 'z'], 'page': page}


@page.route('/error')
@public_endpoint()
def error():
    abort(403, 'Abort function helps you throw an error!')
    print("This code cannot be reached")


@page.route('/counter/<id>')
@public_endpoint()
def counter(id):
    try:
        id = int(id)
    except:
        abort(400, 'ID must be integer')
    counter = Counter.query.filter(Counter.id == id).first()
    if counter is None:
        counter = Counter(id)
        db.session.add(counter)
        db.session.commit()
        return {'count': 0}
    counter.count += 1
    db.session.commit()
    return {'count': counter.count}


@page.route('/secret')
@private_endpoint()
def secret():
    return "You are logged in!"


@page.route('/echo', methods=['GET', 'POST'])
@public_endpoint()
def echo():
    if request.method == 'GET':
        return {'query': request.args.get('q', '')}
    elif request.method == 'POST':
        return {'query': request.get_json()}
    else:
        abort(400, 'Unsupported method')
