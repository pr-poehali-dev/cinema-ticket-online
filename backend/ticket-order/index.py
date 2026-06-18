import json
import os


def handler(event: dict, context) -> dict:
    '''Принимает заявку на покупку билета и сохраняет её в базе данных'''
    import psycopg2
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
    seats = int(body.get('seats') or 1)
    comment = (body.get('comment') or '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Укажите имя и телефон'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO ticket_orders (name, phone, movie, session_time, seats, comment) VALUES (%s, %s, %s, %s, %s, %s)",
        (name, phone, movie or None, session_time or None, seats, comment or None)
    )
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({'success': True}),
    }