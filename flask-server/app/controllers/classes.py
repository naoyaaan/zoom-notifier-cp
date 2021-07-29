from flask import g, Blueprint, abort, request
from ..middleware import public_endpoint, private_endpoint
from ..database import db, User, Class, Task, Meeting, Schedule
from ..updater import add_task
import datetime

page = Blueprint('api/v1/classes', __name__, url_prefix='/api/v1/classes')

# デフォルト値があれば返す．なければ
# 引数クラスの，引数時間以降最も早いmeetingのurlとpasscodeを返す．．
def get_suitable_url(c, target = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z")):
    if len(c.zoom_url) > 0:
        return c.zoom_url, c.passcode
    url, passcode, time = '', '', ''
    for m in c.meetings:
        if m.starts_at != '' and m.starts_at >= target and (time == '' or m.starts_at <= time):
            url = m.url
            passcode = m.passcode
            time = m.starts_at
    if url != '': return url, passcode
    # url がまだ見つからなければ created_at が引数時間以前で最も新しいものを返す．
    for m in c.meetings:
        if m.created_at != '' and m.created_at <= target and (time == '' or m.created_at >= time):
            url = m.url
            passcode = m.passcode
            time = m.created_at
    return url, passcode

def make_nextclass(c):
    location, starts_at, ends_at = '', '', ''
    target = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z")
    for s in c.schedules:
        if s.ends_at >= target and (ends_at == '' or s.ends_at <= ends_at):
            location = s.location
            starts_at = s.starts_at
            ends_at = s.ends_at
    url, passcode = get_suitable_url(c)
    return {
        "location": location,
        "starts_at": starts_at,
        "ends_at": ends_at,
        "url": url,
        "passcode": passcode
    }

# ==== ==== ==== ====
# classes
# クラス一覧
@page.route('', methods=['GET'])
@private_endpoint()
def classes():
    user = User.query.filter(User.username == g.user['username']).first()
    return [{
        "name": c.name,
        "id":c.id,
        "next_class": make_nextclass(c)
    } for c in user.classes]


# クラス詳細
@page.route('/<int:class_id>', methods=['GET'])
@private_endpoint()
def class_details(class_id):
    user = User.query.filter(User.username == g.user['username']).first()
    c = next( (c for c in user.classes if c.id == class_id), None)
    if c is None:
        abort(404, f"Not Found class_id={class_id}")
    return {
        "name": c.name,
        "id":c.id,
        "next_class": make_nextclass(c),
        "meetings": sorted([
            {
                "id": m.id,
                "created_at": m.created_at,
                "queried_at": m.queried_at,
                "url": m.url,
                "passcode": m.passcode,
                "topic": m.topic,
                "starts_at": m.starts_at
            } for m in c.meetings
        ], key=lambda x: x['starts_at']),
        "recordings": sorted([
          {
            "id": r.id,
            "queried_at": r.queried_at,
            "created_at": r.created_at,
            "url": r.url,
            "passcode": r.passcode
          } for r in c.recordings
        ], key=lambda x: x['created_at']),
        "notifications": sorted([
          {
            "id": 0,
            "queried_at": n.queried_at,
            "created_at": n.created_at,
            "message": n.message
          } for n in c.notifications
        ], key=lambda x: x['created_at']),
        "tasks": sorted([
            {
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "created_at": t.created_at,
                "deadline": t.deadline,
                "completed": t.status
            } for t in c.tasks
        ], key=lambda x: x['deadline']),
        "schedules": sorted([
            {
                "location": s.location,
                "starts_at": s.starts_at,
                "ends_at": s.ends_at
            } for s in c.schedules
        ], key=lambda x: x['starts_at'])
    }

# クラスのmeetingデフォルト値を設定する．
@page.route('/<int:class_id>', methods=['PUT'])
@private_endpoint()
def class_url(class_id):
    user = User.query.filter(User.username == g.user['username']).first()
    c = next( (c for c in user.classes if c.id == class_id), None)
    if c is None:
        abort(404, f"Not Found class_id={class_id}")
    body = request.get_json()
    if 'url' in body:
        c.zoom_url = body['url']
    if 'passcode' in body:
        c.passcode = body['passcode']
    db.session.commit()
    return "OK";

# 全クラスのスケジュールを取得．クラスごとのはクラス詳細で．
@page.route('/schedules', methods=['GET'])
@private_endpoint()
def all_schedules():
    user = User.query.filter(User.username == g.user['username']).first()
    res = []
    for c in user.classes:
        for s in c.schedules:
            url, passcode = get_suitable_url(c, s.starts_at)
            res.append({
                "class_id": s.class_id,
                "classname": c.name,
                "location": s.location,
                "starts_at": s.starts_at,
                "ends_at": s.ends_at,
                "url": url,
                "passcode": passcode
            })
    res.sort(key=lambda x: x['starts_at'])
    return res

# 当日のスケジュールを取得．
@page.route('/schedules/today', methods=['GET'])
@private_endpoint()
def today_schedules():
    user = User.query.filter(User.username == g.user['username']).first()
    res = []
    time = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z")
    for c in user.classes:
        for s in c.schedules:
            if s.starts_at[:10] != time[:10] : continue
            url, passcode = get_suitable_url(c, s.starts_at)
            res.append({
                "class_id": s.class_id,
                "classname": c.name,
                "location": s.location,
                "starts_at": s.starts_at,
                "ends_at": s.ends_at,
                "url": url,
                "passcode": passcode
            })
    res.sort(key=lambda x: x['starts_at'])
    return res

# 今週のスケジュールを取得．
@page.route('/schedules/thisweek', methods=['GET'])
@private_endpoint()
def thisweek_schedules():
    user = User.query.filter(User.username == g.user['username']).first()
    res = []
    today = datetime.date.today()
    weekbegin = today.toordinal() - today.weekday()
    if today.weekday() >= 5: weekbegin += 7
    for c in user.classes:
        for s in c.schedules:
            day = datetime.datetime.strptime(s.starts_at[:10], "%Y-%m-%d").date().toordinal()
            if day < weekbegin or day >= weekbegin + 7: continue
            url, passcode = get_suitable_url(c, s.starts_at)
            res.append({
                "class_id": s.class_id,
                "classname": c.name,
                "location": s.location,
                "starts_at": s.starts_at,
                "ends_at": s.ends_at,
                "url": url,
                "passcode": passcode
            })
    res.sort(key=lambda x: x['starts_at'])
    return res

# 今日+deltaの日のスケジュールを取得．
@page.route('/schedules/after/<int:delta>', methods=['GET'])
@private_endpoint()
def day_schedules_after(delta):
    user = User.query.filter(User.username == g.user['username']).first()
    target = datetime.date.today().toordinal() + delta
    return get_schedules_day(user, target)

# 今日-deltaの日のスケジュールを取得．
@page.route('/schedules/before/<int:delta>', methods=['GET'])
@private_endpoint()
def day_schedules_before(delta):
    user = User.query.filter(User.username == g.user['username']).first()
    target = datetime.date.today().toordinal() - delta
    return get_schedules_day(user, target)

def get_schedules_day(user, target):
    res = []
    for c in user.classes:
        for s in c.schedules:
            day = datetime.datetime.strptime(s.starts_at[:10], "%Y-%m-%d").date().toordinal()
            if day != target: continue
            url, passcode = get_suitable_url(c, s.starts_at)
            res.append({
                "class_id": s.class_id,
                "classname": c.name,
                "location": s.location,
                "starts_at": s.starts_at,
                "ends_at": s.ends_at,
                "url": url,
                "passcode": passcode
            })
    res.sort(key=lambda x: x['starts_at'])
    return res

# ==== ==== ==== ====
# tasks
# タスク一覧の取得（GET），タスクの追加（POST）
@page.route('/<int:class_id>/tasks', methods=['GET', 'POST'])
@private_endpoint()
def addtask(class_id):
    user = User.query.filter(User.username == g.user['username']).first()
    if user is None:
        abort(404, "Not Found")
    c = next( (c for c in user.classes if c.id == class_id), None)
    if c is None:
        abort(404, f"Not Found class_id={class_id}")

    if request.method == 'GET':
        return [ {
            "class":t.ofClass.name,
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "created_at": t.created_at,
            "deadline": t.deadline,
            "completed": t.status
        } for t in c.tasks]
    elif request.method == 'POST':
        body = request.get_json()
        if 'title' not in body or 'description' not in body or 'created_at' not in body or 'deadline' not in body or 'completed' not in body:
            return abort(400, "Bad Request")
        add_task(ofClass=c,
        title=body['title'],
        description=body['description'],
        created_at=body['created_at'],
        deadline=body['deadline'],
        status=body['completed']
        )
        return "OK"
    else:
        abort(400, 'Unsupported method')


# タスクの更新
@page.route('/<int:class_id>/tasks/<int:task_id>', methods=['PUT'])
@private_endpoint()
def updatetask(class_id, task_id):
    user = User.query.filter(User.username == g.user['username']).first()
    if user is None:
        abort(404, "Not Found")
    c = next( (c for c in user.classes if c.id == class_id), None)
    if c is None:
        abort(404, f"Not Found class_id={class_id}")
    t = next( (t for t in c.tasks if t.id == task_id), None)
    if t is None:
        abort(404, f"Not Found task_id={task_id}")

    body = request.get_json()
    if 'title' not in body or 'description' not in body or 'deadline' not in body or 'completed' not in body:
        return abort(400, "Bad Request")
    t.title=body['title']
    t.description=body['description']
    t.deadline=body['deadline']
    t.status=body['completed']
    db.session.commit()
    return "OK"
