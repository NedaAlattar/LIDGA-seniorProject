from app import db
import json
from sqlalchemy.dialects.postgresql import JSON

# def load_cards_from_file():
#     filepath = "C:\SeniorCapstone\instance"
#     with open(filepath, 'r') as file:
#         data = json.load(file)

class Card(db.Model):
    __tablename__ = 'cards' 
    
    id = db.Column(db.Integer,  primary_key=True)
    isCorrect = db.Column(db.String)
    diff = db.Column(db.Integer)
    json_column = db.Column(JSON)
    isBooked = db.Column(db.Boolean, default=False)

    @staticmethod
    def update_bookmarks(bookmarks_to_update):
        Bookmark.query.filter(Card.id.in_(bookmarks_to_update)).update({Card.isBooked: True})
        db.session.commit()

def insert():
    db.session.query(Card).delete()
    db.session.commit()

    card1 = Card(id =1000, isCorrect = "True" , diff = 3 ,json_column = column1)
    card2 = Card(id =2000, isCorrect = "True" , diff = 1 ,json_column = column2)
    card3 = Card(id =3000, isCorrect = "False" , diff = 2 ,json_column = column3)
    card4 = Card(id =4000, isCorrect = "True" , diff = 3 ,json_column = column4)
    
    db.session.add(card1)
    db.session.add(card2)
    db.session.add(card3)
    db.session.add(card4)

    db.session.commit()


column1 = {
    "id":1000,
    "name": "RXhhbXBsZSBRdWVzdGlvbiAx",
    "type": "image",
    "chapter": 0,
    "content": [
        {
            "type": "header",
            "content": "4pmrIExvb2sgYXQgdGhpcyBwaG90b2dyYXBoIOKZqw=="
        },              
        {
            "type": "image",
            "content": "greenhouse.jpg"
        },
        {
            "type": "long-text",
            "content": "4pmrIEV2ZXJ5IHRpbWUgSSBkbywgaXQgbWFrZXMgbWUgbGF1Z2gg4pmr"   
        } 
    ]
}

column2 = {
    "id":2000,
    "name": "RXhhbXBsZSBRdWVzdGlvbiAyIg==",
    "type": "text",
    "chapter": 0,
    "content": [
        {
            "type": "header",
            "content": "4pmrIExvb2sgYXQgdGhpcyBwaG90b2dyYXBoIOKZqw=="
        },

        {
            "type": "image",
            "content": "greenhouse.jpg"
        },
        {
            "type": "long-text",
            "content": [
                "4pmrIEV2ZXJ5IHRpbWUgSSBkbywgaXQgbWFrZXMgbWUgbGF1Z2gg4pmr"
            ]
        }
    ]
}

column3 = {
    "id":3000,
    "name": "RXhhbXBsZSBRdWVzdGlvbiAz",
    "type": "question",
    "chapter": 0,
    "content": [
        {
            "type": "header",
            "content": "QUhIISBBIFF1ZXN0aW9uISAoc2VsZWN0IG9uZSk="
        }, 
        {
            "type": "response_multiple_choice",
            "content": [
                "R3JlZW5ob3VzZQ==",
                "TGlicmFyeQ==",
                "RHVjayBwb25k",
                "SGlnaHNjaG9vbA=="
            ],
            "correct": 0,
            "shuffle": "true",
            "diffuclty": 5,
            "incorrect": "No Explanation is provided for this question!"
        }    
    ]
}

column4 ={
    "id":4000,
    "name": "RXhhbXBsZSBRdWVzdGlvbiA0",
    "type": "question",
    "chapter": 0,
    "content": [
        {
            "type": "header",
            "content": "QUhIISBBIFF1ZXN0aW9uISAoc2VsZWN0IGFsbCk="
        },
        {
            "type": "response_select_all_choice",
            "content": [
                "R3JlZW5ob3VzZQ==",
                "TGlicmFyeQ==",
                "RHVjayBwb25k",
                "SGlnaHNjaG9vbA=="
            ],
            "correct": [ 0,1,2 ],
            "shuffle": "true",
            "diffuclty": 1,
            "incorrect": "No Explanation is provided for this question!"
        }               
    ]
}

class Bookmark(db.Model):
    __tablename__ = 'bookmarks'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # user_id = db.Column(db.Integer)
    # card_id = db.Column(db.Integer, db.ForeignKey('cards.id'), nullable = False)
    card_id = db.Column(db.Integer, nullable = False)
    # card = db.relationship('Card', backref="bookmarks")
    card = db.Column(JSON) 
    
 
    def insert(self):
        db.session.add(self)
        db.session.commit()
    
    @staticmethod
    def get_all_bookmarks():
        #name, type icon, course name
        # all_bookmarks= db.session.query(Bookmark.card).all()
        return [card for (card,) in db.session.query(Bookmark.card).all()]
    
    @staticmethod
    def un_bookmark(id):
        db.session.query(Bookmark).filter(Bookmark.card_id == id).delete()
        db.session.commit()


def delete_bookmarks():
    db.session.query(Bookmark).delete()
    db.session.commit()







        

