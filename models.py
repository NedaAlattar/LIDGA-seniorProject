from app import db
from sqlalchemy.dialects.postgresql import JSON

# class Questions(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     question_text = db.Column(db.String(100), nullable=False, unique=True)
#     student_id = db.Column(db.Integer)

#     def __init__(self, id, question_text, student_id):
#         self.id = id
#         self.question_text = question_text
#         self.student_id = student_id 

#     def __repr__(self):
#         return f'Questin with ID {self.id} with answer: {self.question_answer}'
    
#     @classmethod
#     def get_by_id(cls, user_id):
#         return cls.query.filter_by(id=user_id).first_or_404()
         
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(20), nullable=False, unique=True)
#     password = db.Column(db.String(80), nullable=False)


# class Answers(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     score = db.Column(db.Integer, nullable = False)
#     student_id = db.Column(db.Integer)

#     scale = {"basic":10, "intermediate":15, "hard":20}

# class Question():
#     def __init__(self,header, prompt, img, correct, diffeculty, description):
#         self.header = header
#         self.prompt = prompt
#         self.img = img
#         self.corrct = correct
#         self. diffeculty = diffeculty
#         self.description = description


class Card(db.Model):
    id = db.Column(db.Integer,  primary_key=True)
    isCorrect = db.Column(db.String)
    diff = db.Column(db.Integer)
    json_column = db.Column(JSON)

column1 = {
    "name": "RXhhbXBsZSBRdWVzdGlvbiAx",
    "type": "image",
    "chapter": 0,
    "content": [
        {
            "type": "header",
            "value": "4pmrIExvb2sgYXQgdGhpcyBwaG90b2dyYXBoIOKZqw=="
        },
        {
            "type":"stackable",
            "content":[

                {
                    "type": "image",
                    "value": "greenhouse.jpg"
                },
                {
                    "type": "long-text",
                    "value": "4pmrIEV2ZXJ5IHRpbWUgSSBkbywgaXQgbWFrZXMgbWUgbGF1Z2gg4pmr"
                    
                }
            ]

        }

    ]
}

column2 = {
    "name": "RXhhbXBsZSBRdWVzdGlvbiAyIg==",
    "type": "text",
    "chapter": 0,
    "content": [
        {
            "type": "header",
            "value": "4pmrIExvb2sgYXQgdGhpcyBwaG90b2dyYXBoIOKZqw=="
        },
        {
            "type": "stackable",
            "content":[
                {
                    "type": "image",
                    "value": "greenhouse.jpg"
                },
                {
                    "type": "long-text",
                    "content": [
                        "4pmrIEV2ZXJ5IHRpbWUgSSBkbywgaXQgbWFrZXMgbWUgbGF1Z2gg4pmr"
                    ]
                }
        ]
        }
    ]
}

column3 = {
    "name": "RXhhbXBsZSBRdWVzdGlvbiAz",
    "type": "question",
    "chapter": 0,
    "content": [
        {
            "type": "header",
            "content": "QUhIISBBIFF1ZXN0aW9uISAoc2VsZWN0IG9uZSk="
        },
        {
            "type":"stackable",
            "content": [
                {
                    "type": "response_multiple_choice",
                    "content": [
                        "R3JlZW5ob3VzZQ==",
                        "TGlicmFyeQ==",
                        "RHVjayBwb25k",
                        "SGlnaHNjaG9vbA=="
                    ],
                    "correct": 0,
                    "shuffle": True,
                    "diffuclty": 5
                }

            ]
      
        }
    ]
}

column4 = {
    "name": "RXhhbXBsZSBRdWVzdGlvbiA0",
    "type": "question",
    "chapter": 0,
    "content": [
        {
            "type": "header",
            "value": "QUhIISBBIFF1ZXN0aW9uISAoc2VsZWN0IGFsbCk="
        },
        {
            "type": "stackable",
            "content": [
                {
                    "type": "response_select_all_choice",
                    "content": [
                        "R3JlZW5ob3VzZQ==",
                        "TGlicmFyeQ==",
                        "RHVjayBwb25k",
                        "SGlnaHNjaG9vbA=="
                    ],
                    "correct": [ 0,1,2 ],
                    "shuffle": True,
                    "diffuclty": 1
                }
            
            ]
    
        }
    ]
}



def insert_data(): 


    card1 = Card(isCorrect = "True" , diff = 3 ,json_column = column1)
    card2 = Card(isCorrect = "True" , diff = 1 ,json_column = column2)
    card3 = Card(isCorrect = "False" , diff = 2 ,json_column = column3)
    card4 = Card(isCorrect = "True" , diff = 3 ,json_column = column4)

    db.session.add(card1)
    db.session.add(card2)
    db.session.add(card3)
    db.session.add(card4)
    db.session.commit()




        

