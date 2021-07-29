from functools import wraps
from flask import g, request, abort
from flask_json import as_json
from werkzeug.exceptions import HTTPException
from .token import validate_token

def public_endpoint():
    def decorator(f):
        @as_json
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                return f(*args, **kwargs)
            except HTTPException as e:
                return {'message': e.description}, e.code
        return decorated_function
    return decorator


def private_endpoint():
    def decorator(f):
        @public_endpoint()
        @wraps(f)
        def decorated_function(*args, **kwargs):
            header = request.headers.get('Authorization', '')
            payload = None
            if header.startswith('Bearer '):
                payload = validate_token(header[7:])
            if payload:
                g.user = payload
                return f(*args, **kwargs)
            else:
                abort(401, 'You need to login to perform this operation.')
        return decorated_function
    return decorator
