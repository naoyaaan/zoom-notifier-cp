
import os
from flask import Flask
from flask_json import FlaskJSON
from flask_cors import CORS
app = Flask(__name__)
FlaskJSON(app)
CORS(app)

app.secret_key = os.environ.get('ZOOM_NOTIFIER_SECRET', 'Ex7reme1y5ecre7')
app.config['JSON_ADD_STATUS'] = True
app.config['JSON_STATUS_FIELD_NAME'] = 'code'
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(os.getcwd(), 'database.sqlite')}"

# DO NOT MOVE THESE IMPORTS TO THE TOP
from .controllers.users import page as __users  # nopep8
from .controllers.test import page as __test  # nopep8
from .controllers.tasks import page as __tasks  # nopep8
from .controllers.credential import page as __credential  # nopep8
from .controllers.classes import page as __classes  # nopep8

app.register_blueprint(__classes)
app.register_blueprint(__credential)
app.register_blueprint(__tasks)
app.register_blueprint(__test)
app.register_blueprint(__users)
