from flask import Flask, render_template, request, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from threading import Thread
from flask_login import LoginManager, current_user
from flask_migrate import Migrate

db = SQLAlchemy() #create object db

def create_app():
    app = Flask(__name__, template_folder='templates')
    app.config['SQLALCHEMY_DATABASE_URI'] =  "postgresql://@localhost:5432/json_database_example"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = ''
    app.config['SESSION_TYPE'] = 'filesystem'

    db.init_app(app)  #initialize the application
    from routes import register_routes
    register_routes(app,db)

    migrate = Migrate(app, db) #Migrating the application and database through db (database object)

    from models import Card,insert, delete_bookmarks

    # with app.app_context():
    # #     # db.create_all()
    # #     # db.session.query(Card).delete()
    # #     # db.session.commit()
    #     # db.drop_all()
    #     # db.create_all()
        # insert()
        # delete_bookmarks()
    
    return app





