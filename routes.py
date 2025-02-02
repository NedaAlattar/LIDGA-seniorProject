from flask import render_template, request, session
import json, base64
from models import Questions, User
from sqlalchemy import update, select



def load_json_data():
    with open('C:/SeniorCapstone/instance/data_base64.json', 'r') as file:
        data = json.load(file) #this would return an obj. 

        return data   

def decode_base64(value):
    """Helper function to decode base64 strings safely."""
    try:
        return base64.b64decode(value).decode("utf-8")
    except (base64.binascii.Error, UnicodeDecodeError):
        return value  
    
def decode_json_content(json_data):
    if isinstance(json_data, dict):
        return {key: decode_json_content(value) for key, value in json_data.items()}
    elif isinstance(json_data, list):
        return [decode_json_content(value) for value in json_data]
    elif isinstance(json_data, str):
        return decode_base64(json_data)
    
    return json_data

def generate_content():
    json_data = load_json_data() 
    decoded_content = decode_json_content(json_data)  
    return decoded_content 

def register_routes(app,db):
  
    @app.route('/display')
    def display():
        question = Questions.query.all()
        return str(question)
    
    @app.route('/')
    def index():
        return render_template("index.html")  
    
    @app.route('/quiz')
    def quiz():
        data = load_json_data()
        content = generate_content()

        name = content["name"]
        card_type = data["type"]
        chapter = str(data["chapter"])
        header = content["content"][0]["value"]
        image = content["content"][1]["content"][0]["value"]
        multiple_choice_options = content["content"][1]["content"][1]["content"]
        question_incorrect = content["content"][2]["value"]
        code = content["content"][3]["value"]
        long_text = content["content"][4]["content"]
        number_list = content["content"][5]["content"]
        print(number_list)
        bullet_list = content["content"][6]["content"]
        correct_value = str(content["content"][1]["content"][1]["correct"])
          
        return render_template('quiz.html',  
                               name=name, 
                               card_type = card_type, 
                               chapter = chapter,
                               header = header,
                               image = image,
                               multiple_choice_options = multiple_choice_options,
                               question_incorrect = question_incorrect,
                               code = code,
                               long_text = long_text,
                               number_list = number_list,
                               bullet_list = bullet_list,
                               correct_value = correct_value)
    
    @app.route('/answer', methods=['GET', 'POST'])
    def answer():
        user = Questions.get_by_id()  ##pass in the 
        if request.method == 'POST':
            std_ans = request.form.get('std_ans')  ### the name has to be taken from the form. 
            prompt = request.form.get('prompt') ### the name has to be taken from the form.

            # ans = (
            #     update(Questions)
            #     .where(Questions.question_text == prompt)
            #     .values(Questions.student_answer == std_ans)
            #         )
            # db.session.execute(ans)
            db.session.query(Questions).filter(Questions.question_text == prompt).update(Questions.student_answer == std_ans)
            db.session.commit()

            #check  whether the answers match
            score = 0
            if std_ans == Questions.question_answer:
                score +=1
                pass
                # db.session.query(Score).filter(Score.student_id == ).update(Score.score == score)
                # db.session.commit()
    
    #content card
    @app.route('/ask', methods=["GET", "POST"])
    def ask():
        if request.method == 'POST':
            ques_text = request.form.get('ques_text')  ### the name has to be taken from the form. 
            ques_ans = request.form.get('question_answer')  ### the name has to be taken from the form. 
            ques_lev = request.form.get('ques_level') ### the name has to be taken from the form. 
            
            #update questions table:
            ques = Questions(question_text=ques_text, question_answer=ques_ans, question_level = ques_lev)

            db.session.add(ques)
            db.session.commit()

        return render_template('ask.html')
    

    @app.route('/register', methods=["GET", "POST"])
    def register():
        return render_template('register.html')

    @app.route('/login', methods=["GET", "POST"])
    def login():
        return render_template('login.html')

    @app.route('/user_profile', methods=["GET", "POST"])
    def user_profile():
        return render_template('user_profile.html')