import json
import os
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    '''Принимает заявку на покупку билета и отправляет её в Telegram менеджеру'''
    method = event.get('httpMethod', 'GET')

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    body = json.loads(event.get('body') or '{}')
    name = (body.get('name') or '').strip()
    phone = (body.get('phone') or '').strip()
    movie = (body.get('movie') or '').strip()
    session_time = (body.get('time') or '').strip()
    seats = body.get('seats') or ''
    comment = (body.get('comment') or '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Укажите имя и телефон'}),
        }

    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')

    if not token or not chat_id:
        return {
            'statusCode': 500,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Telegram не настроен'}),
        }

    text_lines = [
        '🎬 <b>Новая заявка на билет</b>',
        '',
        f'👤 Имя: {name}',
        f'📞 Телефон: {phone}',
    ]
    if movie:
        text_lines.append(f'🎞 Фильм: {movie}')
    if session_time:
        text_lines.append(f'🕐 Сеанс: {session_time}')
    if seats:
        text_lines.append(f'🎟 Билетов: {seats}')
    if comment:
        text_lines.append(f'💬 Комментарий: {comment}')

    message = '\n'.join(text_lines)

    url = f'https://api.telegram.org/bot{token}/sendMessage'
    data = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'HTML',
    }).encode()

    req = urllib.request.Request(url, data=data, method='POST')
    with urllib.request.urlopen(req) as resp:
        resp.read()

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({'success': True}),
    }
