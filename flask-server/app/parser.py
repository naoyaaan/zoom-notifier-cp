import feedparser
import re
import ssl
import requests
import datetime
from collections import namedtuple

TITLE_PATTERN = r"^TOKYO TECH OCW-i 【.+】(.+)$"
ZOOM_URL_PATTERN = r"(https://(?:.+\.)?zoom.us/j/[0-9]{11}\?pwd=.{32})"
ZOOM_PASSCODE_PATTERN = r"(?:パスコード|Passcode).{,10}: ([^\s<]+)"
ZOOM_TOPIC_PATTERN = r"(?:トピック|Topic).{,10}: ([^\s<]+)"
ZOOM_TIME_PATTERN = r"(?:日付|時間|Time).{,10}: ([^<]+)"
ZOOM_RECORDING_URL_PATTERN = r"(https://(?:.+\.)?zoom.us/rec/share/.{64}\..{16})"

ZoomMeeting = namedtuple('ZoomMeeting', ('classname', 'created_at', 'url', 'passcode', 'topic', 'time'))
ZoomRecording = namedtuple('ZoomRecording', ('classname', 'created_at', 'url', 'passcode'))
OCWiNotification = namedtuple('OCWiNotification', ('classname', 'created_at', 'message'))
OCWiTask = namedtuple('OCWiTask', ('classname', 'created_at', 'deadline', 'title', 'description'))

# おまじない．セキュリティ的に安全でないらしい．
if hasattr(ssl, '_create_unverified_context'):
    ssl._create_default_https_context = ssl._create_unverified_context

# 時間情報をtzへ変換する
def to_tz(time):
    if time is None: return ''
    x = re.search(' [0-9] ', time)
    if x is not None:
        time = time[:x.start()+1] + '0' + time[x.start()+1:]
    OCWiFormat1 = "%a, %d %b %Y %H:%M:%S"
    OCWiFormat2 = "%Y/%m/%d %H:%M"
    tzFormat = "%Y-%m-%dT%H:%M:%S.000Z"
    try:
        if len(time) == 16:
            return datetime.datetime.strptime(time, OCWiFormat2).strftime(tzFormat)
        return '' if len(time) < 25 else datetime.datetime.strptime(time[:25], OCWiFormat1).strftime(tzFormat)
    except Exception as e:
        # print("error: ", time)
        return ''

def parse(uri):
    feed = feedparser.parse(uri)
    all_meetings = []
    all_recordings = []
    all_notifications = []
    all_tasks = []
    for entry in feed['entries']:
        # Overall Information
        summary = entry['summary_detail']
        title = re.search(TITLE_PATTERN, entry['title_detail']['value']).group(1)
        published = entry['published']

        # Parse urls
        value = summary['value']
        urls = [[title, published, url, None, None, None] for url in re.findall(ZOOM_URL_PATTERN, value)]
        recordings = [[title, published, url, None] for url in re.findall(ZOOM_RECORDING_URL_PATTERN, value)]

        # Parse passcode info: ミーティング情報と録画情報のどちら由来なのか判定する必要がある．
        passcodes = re.findall(ZOOM_PASSCODE_PATTERN, value)
        if not recordings and len(urls) == len(passcodes):
            for i, passcode in enumerate(passcodes):
                urls[i][3] = passcode
        if not urls and len(recordings) == len(passcodes):
            for i, passcode in enumerate(passcodes):
                recordings[i][3] = passcode

        # Parse topic info
        topics = re.findall(ZOOM_TOPIC_PATTERN, value)
        if len(urls) == len(topics):
            for i, topic in enumerate(topics):
                urls[i][4] = topic

        # Parse time info
        times = re.findall(ZOOM_TIME_PATTERN, value)
        if len(urls) == len(topics):
            for i, time in enumerate(times):
                urls[i][5] = time

        all_meetings += [ZoomMeeting._make(url) for url in urls]
        all_recordings += [ZoomRecording._make(recording) for recording in recordings]

    # OCWiNotification ('classname', 'created_at', 'message')
    all_notifications = [OCWiNotification(
        classname=re.search(TITLE_PATTERN, entry.title).group(1),
        created_at=to_tz(entry.published[:25]),
        message=entry.summary
    ) for entry in feed.entries]

    # OCWiTask ('classname', 'created_at', 'deadline', 'title', 'description')
    def getdeadline(text):
        x = re.search(r"課題締切日.<br />.(.*?)<br />", text, flags=re.DOTALL)
        return 'no title' if x is None else x.group(1)
    def gettitle(text):
        x = re.search(r"課題名.<br />.(.*?)<br />", text, flags=re.DOTALL)
        return 'no title' if x is None else x.group(1)
    all_tasks = [OCWiTask(
        classname=re.search(TITLE_PATTERN, entry.title).group(1),
        created_at=to_tz(entry.published[:25]),
        deadline=to_tz(getdeadline(entry.summary)),
        title=gettitle(entry.summary),
        description=entry.summary
    ) for entry in feed.entries if re.search('課題', entry.title) is not None]

    return all_meetings, all_recordings, all_notifications, all_tasks


iCalSchedule = namedtuple('iCalSchedule', ('summary', 'location', 'starts_at', 'ends_at'))
# iCal URLからスケジュールを取得する．
def parse_ical(url):
    def to_tz(time):
        return '' if len(time) != 15 else datetime.datetime.strptime(time, "%Y%m%dT%H%M%S").strftime("%Y-%m-%dT%H:%M:%S.000Z")
    rawtext = requests.get(url).text
    vevents = re.findall('BEGIN:VEVENT(.*?)END:VEVENT', rawtext, flags=re.DOTALL)
    all_schedules = []
    for ev in vevents:
        lines = re.split('\n', ev)
        summary, location, starts_at, ends_at = '', '', '', ''
        for line in lines:
            if line[:8] == "SUMMARY:": summary = line[8:].split('【')[0]
            elif line[:9] == "LOCATION:": location = line[9:]
            elif line[:8] == "DTSTART;": starts_at = to_tz(line[-15:])
            elif line[:6] == "DTEND;": ends_at = to_tz(line[-15:])
        if len(summary) > 0 and len(starts_at) > 0:
            all_schedules.append(iCalSchedule(summary=summary, location=location, starts_at=starts_at, ends_at=ends_at))
    return all_schedules
