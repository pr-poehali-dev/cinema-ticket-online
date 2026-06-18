import json
import os


ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'kinodom2026')


def handler(event: dict, context) -> dict:
    '''Возвращает список заявок на билеты для админки. Требует пароль в заголовке X-Admin-Password'''
    import psycopg2
    import psycopg2.extras

    method = event.get('httpMethod', 'GET')

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    headers = event.get('headers') or {}
    password = headers.get('X-Admin-Password') or headers.get('x-admin-password') or ''
    if password != ADMIN_PASSWORD:
        return {
            'statusCode': 401,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Неверный пароль'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    if method == 'PATCH':
        body = json.loads(event.get('body') or '{}')
        order_id = body.get('id')
        status = body.get('status')
        if order_id and status in ('new', 'confirmed', 'cancelled'):
            cur.execute("UPDATE ticket_orders SET status = %s WHERE id = %s", (status, order_id))
            conn.commit()

    cur.execute("SELECT * FROM ticket_orders ORDER BY created_at DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    orders = []
    for row in rows:
        r = dict(row)
        if r.get('created_at'):
            r['created_at'] = r['created_at'].isoformat()
        orders.append(r)

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({'orders': orders}),
    }