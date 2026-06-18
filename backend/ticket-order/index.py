import json
import os
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    '''Принимает заявку на покупку билета и отправляет её письмом через EmailJS'''
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
    seats = str(body.get('seats') or '1')
    comment = (body.get('comment') or '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Укажите имя и телефон'}),
        }

    service_id = os.environ.get('EMAILJS_SERVICE_ID')
    template_id = os.environ.get('EMAILJS_TEMPLATE_ID')
    public_key = os.environ.get('EMAILJS_PUBLIC_KEY')

    if not service_id or not template_id or not public_key:
        return {
            'statusCode': 500,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Email-сервис не настроен'}),
        }

    payload = json.dumps({
        'service_id': service_id,
        'template_id': template_id,
        'user_id': public_key,
        'template_params': {
            'from_name': name,
            'phone': phone,
            'movie': movie or 'не указан',
            'session_time': session_time or 'не указан',
            'seats': seats,
            'comment': comment or 'нет',
            'to_email': 'v69607972@gmail.com',
        },
    }).encode('utf-8')

    try:
        req = urllib.request.Request(
            'https://api.emailjs.com/api/v1.0/email/send',
            data=payload,
            headers={'Content-Type': 'application/json', 'origin': 'https://poehali.dev'},
            method='POST',
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        detail = e.read().decode('utf-8', errors='ignore')
        return {
            'statusCode': 502,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Ошибка отправки письма ({e.code})', 'detail': detail}),
        }
    except Exception as e:
        return {
            'statusCode': 502,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Ошибка отправки письма', 'detail': str(e)}),
        }

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({'success': True}),
    }
