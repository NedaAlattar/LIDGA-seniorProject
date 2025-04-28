from app import db
import json
from sqlalchemy.dialects.postgresql import JSON

class Card(db.Model):
    __tablename__ = 'cards' 
    
    id = db.Column(db.Integer,  primary_key=True)
    isCorrect = db.Column(db.String, default="False")
    diff = db.Column(db.Integer)
    json_column = db.Column(JSON)
    isBooked = db.Column(db.Boolean, default=False)

    @staticmethod
    def update_isCorrect(card_id, isCorrect):
        Card.query.get(card_id).isCorrect = isCorrect
        # card = Card.query.get(card_id)
        # if card:
        #     card.isCorrect = isCorrect
        db.session.commit()

    # @staticmethod
    # def update_bookmarks(bookmarks_to_update):
    #     Bookmark.query.filter(Card.id.in_(bookmarks_to_update)).update({Card.isBooked: True})
    #     db.session.commit()

def insert():
    db.session.query(Card).delete()
    db.session.commit()

    card1 = Card(id =1000, isCorrect="True", diff = 3 ,json_column = column1)
    card2 = Card(id =2000, diff = 1 ,json_column = column2)
    card3 = Card(id =3000, diff = 2 ,json_column = column3)
    card4 = Card(id =4000, diff = 3 ,json_column = column4)
    card5 = Card(id =1001, diff = 5 ,json_column = column5)
    card6 = Card(id =1002, diff = 5 ,json_column = column6)
    card7 = Card(id =1003, diff = 5 ,json_column = column7)
    card8 = Card(id =1004, diff = 5 ,json_column = column8)
    card9 = Card(id =1005, diff = 5 ,json_column = column9)
    card10 = Card(id =1006, diff = 5 ,json_column = column10)

    db.session.add(card1)
    db.session.add(card2)
    db.session.add(card3)
    db.session.add(card4)
    db.session.add(card5)
    db.session.add(card6)
    db.session.add(card7)
    db.session.add(card8)
    db.session.add(card9)
    db.session.add(card10)

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

column2 =  {
    "id": 2000,
    "name": "V2hhdCBwbGFuZXQgaXMgdGhpcyBwcmludCBvbg==",
    "type": "image",
    "chapter": 5,
    "content": [
      {
        "type": "header",
        "content": "V2hhdCBwbGFuZXQgaXMgdGhpcyBwcmludCBvbg=="
      },
      {
        "type": "image",
        "content": "earth.jpg"
      },
      {
        "type": "long-text",
        "content": "VGhpcyBpbWFnZSBzaG93cyB0aGUgUGxhbmV0IEVhcnRoLg=="
      }
    ]
  }

column3 = {
    "id":3000,
    "name": "V2hhdCB0aGUgYnVpbGRpbmcgaXMgcGljdHVyZWQ/",
    "type": "question",
    "chapter": 0,
    "content": [
        {
            "type": "header",
            "content": "V2hhdCB0aGUgYnVpbGRpbmcgaXMgcGljdHVyZWQ/"
        }, 
        {
            "type": "image",
            "content": "greenhouse.jpg"
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

column4 =  {
    "id": 4000,
    "name": "V2hhdCBpcyB0aGUgc2NpZW50aWZpYyBuYW1lIGZvciB3YXRlcg==",
    "type": "question",
    "chapter": 4,
    "content": [
      {
        "type": "header",
        "content": "V2hhdCBpcyB0aGUgc2NpZW50aWZpYyBuYW1lIGZvciB3YXRlcg=="
      },
      {
        "type": "response_multiple_choice",
        "content": [
          "SHlkb2dlbg==",
          "SGVsaXVt",
          "SFRP",
          "SGlzdG9u"
        ],
        "correct": 2,
        "shuffle": "true",
        "diffuclty": 3,
        "incorrect": "H to O is the chemical formula for water."
      }
    ]
  }

column5 =   {
    "id": 1001,
    "name": "V2hhdCBpcyB0aGUgY2FwaXRhbCBvZiBGcmFuY2U/",
    "type": "question",
    "chapter": 1,
    "content": [
      {
        "type": "header",
        "content": "V2hhdCBpcyB0aGUgY2FwaXRhbCBvZiBGcmFuY2U/"
      },
      {
        "type": "response_multiple_choice",
        "content": [
          "UGFyaXM=",
          "Um9tZQ==",
          "QmVybGlu",
          "TWFkcmlk"
        ],  
        "correct": 0,
        "shuffle": "true",
        "diffuclty": 2,
        "incorrect": "The capital of France is Paris."
      }
    ]
  }

column6 =   {
    "id": 1002,
    "name": "V2hhdCBjb2xvciBpcyBhc3NvY2lhdGVkIHdpdGggZ3Jhc3M/",
    "type": "text",
    "chapter": 1,
    "content": [
      {
        "type": "header",
        "content": "V2hhdCBjb2xvciBpcyBhc3NvY2lhdGVkIHdpdGggZ3Jhc3M/"
      },
      {
        "type": "long-text",
        "content": "VGhlIGNvbG9yIGdyZWVuIGlzIG9mdGVuIGFzc29jaWF0ZWQgd2l0aCBncmFzcyBhbmQgbmF0dXJlLg=="
      }
    ]
  }

column7 =   {
    "id": 1003,
    "name": "U2VsZWN0IGFsbCB0aGF0IGFyZSBwcmltZSBudW1iZXJz",
    "type": "question",
    "chapter": 1,
    "content": [
      {
        "type": "header",
        "content": "V2hpY2ggYXJlIHByaW1lIG51bWJlcnM/"
      },
      {
        "type": "response_select_all_choice",
        "content": [
          "MyA=",
          "NS4w",
          "MTAg",
          "UGkg"
        ],
        "correct": [0,1,2],
        "shuffle": "true",
        "diffuclty": 3,
        "incorrect": "Pi is not a prime number."
      }
    ]
  }

column8 =   {
    "id": 1004,
    "name": "RGVzY3JpYmUgdGhpcyBpbWFnZQ==",
    "type": "image",
    "chapter": 2,
    "content": [
      {
        "type": "header",
        "content": "V2hhdCBjYW4geW91IHNlZSBpbiB0aGlzIGltYWdlPw=="
      },
      {
        "type": "image",
        "content": "sunset.jpg"
      },
      {
        "type": "long-text",
        "content": "QSBzZXJlbmUgc3Vuc2V0IHNreSBvdmVyIGEgbW91bnRhaW4u"
      }
    ]
  }

column9 =   {
    "id": 1005,
    "name": "V2hhdCBwbGFuZXQgaXMgdGhpcyBwYXJ0IG9mPw==",
    "type": "image",
    "chapter": 2,
    "content": [
      {
        "type": "header",
        "content": "V2hhdCBwbGFuZXQgaXMgdGhpcyBwYXJ0IG9mPw=="
      },
      {
        "type": "image",
        "content": "mars.jpg"
      },
      {
        "type": "long-text",
        "content": "VGhpcyBpcyBhIHBob3RvIG9mIHRoZSBwbGFuZXQgTWFycy4="
      }
    ]
  }

column10 =     {
    "id": 1006,
    "name": "V2hhdCBpcyB0aGUgbGFyZ2VzdCBvY2VhbiBhbiBlYXJ0aA==",
    "type": "question",
    "chapter": 3,
    "content": [
      {
        "type": "header",
        "content": "V2hhdCBpcyB0aGUgbGFyZ2VzdCBvY2VhbiBhbiBlYXJ0aA=="
      },
      {
        "type": "response_multiple_choice",
        "content": [
          "UGFjaWZpYw==",
          "QXRsYW50aWM=",
          "SW5kaWFu",
          "QXJjdGlj"
        ],
        "correct": 0,
        "shuffle": "true",
        "diffuclty": 2,
        "incorrect": "The Pacific Ocean is the largest on Earth."
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
        return [card for (card,) in db.session.query(Bookmark.card).all()]
    
    @staticmethod
    def un_bookmark(id):
        db.session.query(Bookmark).filter(Bookmark.card_id == id).delete()
        db.session.commit()


def delete_bookmarks():
    db.session.query(Bookmark).delete()
    db.session.commit()







        

