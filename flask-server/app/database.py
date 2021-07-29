from flask_sqlalchemy import SQLAlchemy
from . import app

db = SQLAlchemy(app)


class Counter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    count = db.Column(db.Integer, nullable=False)

    def __init__(self, id, count=0):
        self.id = id
        self.count = count

    def __repr__(self):
        return f"<Counter {self.id}>"


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(64), unique=True)
    password = db.Column(db.String(128), nullable=False)
    rss_url = db.Column(db.String(128), default='')
    ical_url = db.Column(db.String(128), default='')

    classes = db.relationship('Class', backref='user')


class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(64), default='')
    zoom_url = db.Column(db.String(128), default='')
    passcode = db.Column(db.String(128), default='')

    meetings = db.relationship('Meeting', backref='ofClass')
    recordings = db.relationship('Recording', backref='ofClass')
    notifications = db.relationship('Notification', backref='ofClass')
    schedules = db.relationship('Schedule', backref='ofClass')
    tasks = db.relationship('Task', backref='ofClass')


class Meeting(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'))
    created_at = db.Column(db.String(128), default='')
    queried_at = db.Column(db.String(128), default='')
    url = db.Column(db.String(128), default='')
    passcode = db.Column(db.String(128), default='')
    topic = db.Column(db.String(128), default='')
    starts_at = db.Column(db.String(128), default='')


class Recording(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'))
    created_at = db.Column(db.String(128), default='')
    queried_at = db.Column(db.String(128), default='')
    url = db.Column(db.String(128), default='')
    passcode = db.Column(db.String(128), default='')


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'))
    created_at = db.Column(db.String(128), default='')
    queried_at = db.Column(db.String(128), default='')
    message = db.Column(db.String(1024), default='')


class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'))
    created_at = db.Column(db.String(128), default='')
    queried_at = db.Column(db.String(128), default='')
    location = db.Column(db.String(128), default='')
    starts_at = db.Column(db.String(128), default='')
    ends_at = db.Column(db.String(128), default='')


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'))
    title = db.Column(db.String(64), nullable=False)
    description = db.Column(db.String(128), default='')
    created_at = db.Column(db.String(128), default='')
    deadline = db.Column(db.String(128), default='')
    status = db.Column(db.Boolean, default=False)

# Do NOT define models below this line
db.create_all()
