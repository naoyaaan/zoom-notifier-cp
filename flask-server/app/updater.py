from .parser import parse, parse_ical, to_tz
from .database import db, User, Class, Meeting, Recording, Notification, Task, Schedule

# ==== ==== ==== ====
# Class
def add_class(user, new_class_name):
    for c in user.classes:
        if c.name == new_class_name:
            return False
    db.session.add(Class(name=new_class_name, user=user))
    db.session.commit()
    return True

# ==== ==== ==== ====
# Meeting
def add_meeting(ofClass, created_at, queried_at, url, passcode, topic, starts_at):
    for m in ofClass.meetings:
        if m.url == url and m.starts_at == starts_at and m.created_at == created_at:
            return False
    db.session.add(Meeting(ofClass=ofClass,
    created_at=created_at,
    queried_at=queried_at,
    url=url,
    passcode=passcode,
    topic=topic,
    starts_at=starts_at
    ))
    db.session.commit()
    return True


# ==== ==== ==== ====
# Recording
def add_recording(ofClass, created_at, queried_at, url, passcode):
    for r in ofClass.recordings:
        if r.url == url:
            return False
    db.session.add(Recording(ofClass=ofClass,
    created_at=created_at,
    queried_at=queried_at,
    url=url,
    passcode=passcode
    ))
    db.session.commit()
    return True


# ==== ==== ==== ====
# Notification
def add_notification(ofClass, created_at, queried_at, message):
    for n in ofClass.notifications:
        if n.message == message:
            return False
    db.session.add(Notification(ofClass=ofClass,
    created_at=created_at,
    queried_at=queried_at,
    message=message
    ))
    db.session.commit()
    return True


# ==== ==== ==== ====
# Schedule
def add_schedule(ofClass, created_at, queried_at, location, starts_at, ends_at):
    for m in ofClass.schedules:
        if m.starts_at == starts_at:
            return False
    db.session.add(Schedule(ofClass=ofClass,
    created_at=created_at,
    queried_at=queried_at,
    location=location,
    starts_at=starts_at,
    ends_at=ends_at
    ))
    db.session.commit()
    return True


# ==== ==== ==== ====
# Task
def add_task(ofClass, title, description, created_at, deadline, status):
    for t in ofClass.tasks:
        if t.title == title and t.deadline == deadline:
            return False
    db.session.add(Task(ofClass=ofClass,
    title=title,
    description=description,
    created_at=created_at,
    deadline=deadline,
    status=status
    ))
    db.session.commit()
    return True

# 文字列を整形する．現状'<br />'の削除のみ．
def neatened(str):
    return str.replace('<br />', '')

def reload_and_update(user):
    if len(user.ical_url) > 0:
        schedules = parse_ical(user.ical_url)
        for s in schedules:
            add_class(user, s.summary)
            c = next( (c for c in user.classes if c.name == s.summary), None)
            if c is None: continue
            add_schedule(c, '', '', s.location, s.starts_at, s.ends_at)
    if len(user.rss_url) > 0:
        meetings, recordings, notifications, tasks = parse(user.rss_url)
        for m in meetings:
            c = next( (c for c in user.classes if c.name == m.classname), None)
            if c is None: continue
            add_meeting(c, to_tz(m.created_at), '', m.url, m.passcode, m.topic, to_tz(m.time))
        for r in recordings:
            c = next( (c for c in user.classes if c.name == r.classname), None)
            if c is None: continue
            add_recording(c, to_tz(r.created_at), '', r.url, r.passcode)
        for n in notifications:
            c = next( (c for c in user.classes if c.name == n.classname), None)
            if c is None: continue
            add_notification(c, n.created_at, '', neatened(n.message))
        for t in tasks:
            c = next( (c for c in user.classes if c.name == t.classname), None)
            if c is None: continue
            add_task(c, t.title, neatened(t.description), t.created_at, t.deadline, False)
