import os
import jwt

__secret = os.environ.get('ZOOM_NOTIFIER_SECRET', 'Ex7reme1y5ecre7')
__algorithm = 'HS256'


def issue_token(payload):
    return jwt.encode(payload, __secret, __algorithm)


def validate_token(token):
    try:
        return jwt.decode(token, __secret, algorithms=[__algorithm])
    except:
        return None
