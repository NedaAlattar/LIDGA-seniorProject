from app import db

class Questions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_text = db.Column(db.String(100), nullable=False, unique=True)
    student_id = db.Column(db.Integer)

    def __init__(self, id, question_text, student_id):
        self.id = id
        self.question_text = question_text
        self.student_id = student_id 

    def __repr__(self):
        return f'Questin with ID {self.id} with answer: {self.question_answer}'
    
    @classmethod
    def get_by_id(cls, user_id):
        return cls.query.filter_by(id=user_id).first_or_404()
         
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)


class Answers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable = False)
    student_id = db.Column(db.Integer)

    scale = {"basic":10, "intermediate":15, "hard":20}

