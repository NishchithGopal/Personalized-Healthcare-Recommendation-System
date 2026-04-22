from pymongo import MongoClient
from flask import g
from werkzeug.local import LocalProxy

def get_db():
    if 'db' not in g:
        from flask import current_app
        client = MongoClient(current_app.config['MONGO_URI'])
        g.db = client.get_default_database()
        if g.db is None:
            # If no default database specified in URI, fallback to healthcare_db
            g.db = client['healthcare_db']
    return g.db

db = LocalProxy(get_db)
