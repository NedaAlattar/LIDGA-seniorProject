from flask import render_template, request, session, redirect, url_for
import json, base64, random
from models import  Card
from sqlalchemy import update, select


# def load_json_data():
#     with open('C:/SeniorCapstone/instance/data_base64.json', 'r') as file:
#         data = json.load(file) #this returns an obj. 

#         return data   

def decode_base64(value):
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
    
def generate_content(json_data):
    # json_data = json.load(card)
    decoded_content = decode_json_content(json_data)
    print(f"decoded content: {decoded_content}")
    print(f"type of decoded content {type(decoded_content)}")
    # return decoded_content.get('content', [])
    return decoded_content


def generate_Cards(card_data={}):
    data = generate_content(card_data)  # Extract 'content' dict
    print(f"type of decoded data: {type(data)}")
    name = data.get("name", "")
    type_ = data.get("type", "")
    chapter = str(data.get("chapter", ""))

    img = None
    mulChoice = None
    header = None
    difficulty = getDiffuclty(data)  
    print(f"difficulty is  {difficulty}")
    shuffle = None
    incorrect_text = "Wrong Answer! but no explanation is provided"
    long_text = ""
    select_all_choice = None

    for item in data["content"]:
        match item.get("type"):
            case "header":
                header = item.get("value")

            case "stackable":
                for sub_item in item.get("content", []):
                    match sub_item.get("type"):
                        case "image":
                            img = sub_item.get("value")
                        case "response_multiple_choice":
                            mulChoice = sub_item.get("content")
                        case "long-text":
                            long_text = sub_item.get("content", sub_item.get("value"))
                            if isinstance(long_text, list) and long_text:
                                long_text = " ".join(long_text)
                        case "response_select_all_choice":
                            select_all_choice = sub_item.get("content")

            case "question_incorrect":
                incorrect_text = item.get("value")

    print(f"Card Name: {name}, Type: {type_}, Chapter: {chapter}, "
      f"Header: {header}, Image: {img}, Multiple Choice: {mulChoice}, "
      f"Difficulty: {difficulty}, Shuffle: {shuffle}, "
      f"Question Incorrect: {incorrect_text}, Long Text: {long_text}, "
      f"Response Select All Choice: {select_all_choice}")
    
    return {
        "name": name,
        "type": type_,
        "chapter": chapter,
        "header": header,
        "image": img,
        "multiple_choice": mulChoice,
        "difficulty": difficulty,
        "shuffle": shuffle,
        "question_incorrect": incorrect_text,
        "long-text": long_text,
        "response_select_all_choice": select_all_choice
    } 

def getShuffle():
    content_list = generate_content()
    for item in content_list:
        if item.get('type') == "stackable":
            for sub_item in item.get('content', []):
                isShuffle = str(sub_item.get('shuffle')) 

    return isShuffle  
  
def getCorrectValue(content_list):
    # content_list = generate_content()
    for item in content_list:
        if item.get('type') == "stackable":
            for sub_item in item.get('content', []):
                correctValue = sub_item.get('correct')

    return correctValue  

def getDiffuclty(content_list):
    # content_list = generate_content()
    print(f"content list: {content_list}")
    print(f"type of content list is {type(content_list)}")
    for item in content_list["content"]:
        if item.get('type') == "stackable":
            for sub_item in item.get('content', []):
                diffuclty = str(sub_item.get('diffuclty')) 
    return diffuclty

def generateDeck(cards =[], prob=0.4):
    deck=[]
    for card in cards:
        dice = random.random()
        if(dice <= prob):
            deck.append(card)

    return deck

def register_routes(app,db):
    
    @app.route('/')
    def index():
        return render_template('index.html')  
    
    @app.route('/checkAnswer', methods=['GET', 'POST'])
    def checkAnswer(): 
        isCorrect = "False"
        data = generate_content()
        correctValue = getCorrectValue(data) #returns a list of intergers 

        if request.method == 'POST':
            selected_choice = [int(choice) for choice in request.form.getlist("choice") ] 

            if isinstance(correctValue, int):
                if correctValue in selected_choice:
                    isCorrect = "True"

            if selected_choice is not None and correctValue == selected_choice:
                isCorrect = "True"

        return redirect(url_for("course", isCorrect=isCorrect))   


        # create the lists with different catagories like correct with difficluty level of 3 or 2 or.....
        # call that method as needed and pass in the created lists to it.
        # merge all lists taken from the method into one final list.

        # all incorrect cards will be in the final list
        # 40% of correct cards will be in the final list
        #   if correct and diff of 3, chance is 80%
        #   if correct and diff of 2, chance is 60%
        #   if correct and diff of 1, chance is 50%
        #   if correct and diff of 5, chance is 40%
        #   if correct and diff of 4, chance is 70%

    @app.route('/course_next') 
    def course_next():

        correct_cards = db.session.query(Card).filter(Card.isCorrect == "True").all()
        print(correct_cards)
        incorrect_cards =  db.session.query(Card).filter(Card.isCorrect == "False").all()
        print(incorrect_cards)

        deck1, deck2, deck3, deck4, deck5 = [], [], [], [], []

        for card in correct_cards:
            match card.diff:
                case 1:
                    deck1.append(card)
                case 2:
                    deck2.append(card)
                case 3:
                    deck3.append(card)
                case 4:
                    deck4.append(card)
                case 5:
                    deck5.append(card)

        deck11 = generateDeck(deck1, prob=0.5)
        deck22 = generateDeck(deck2, prob=0.6)
        deck33 = generateDeck(deck3, prob=0.8)
        deck44 = generateDeck(deck4, prob=0.7)
        deck55 = generateDeck(deck5, prob=0.4)

        final_deck = deck11 + deck22 + deck33 + deck44 + deck55 + incorrect_cards
        random.shuffle(final_deck)

        selectedCard = random.choice(final_deck) if final_deck else None
        next_card = generate_Cards(selectedCard.json_column)
        print(f"type of selectedCard_json_column: {type(next_card)}")
        print(f"Next card from the final deck: {next_card}")
        print(f"Next_card[header] = {next_card.get('name')}")
    
        return render_template('course_next.html', next_card=next_card)

    @app.route('/course')
    def course():
        # data = generate_()
        card = db.session.query(Card).first().json_column
        print(card)
        data=generate_Cards(card)
        isCorrect = request.args.get("isCorrect")  
        print(isCorrect)
           
        return render_template('course.html', 
                               data = data,
                               isCorrect = isCorrect)
    
    @app.route('/courseEdit')
    def courseEdit():
        return render_template('courseEdit.html')
    
    # @app.route('/answer', methods=['GET', 'POST'])
    # def answer():
    #     user = Questions.get_by_id()  ##pass in the 
    #     if request.method == 'POST':
    #         std_ans = request.form.get('std_ans')  ### the name has to be taken from the form. 
    #         prompt = request.form.get('prompt') ### the name has to be taken from the form.

    #         # ans = (
    #         #     update(Questions)
    #         #     .where(Questions.question_text == prompt)
    #         #     .values(Questions.student_answer == std_ans)
    #         #         )
    #         # db.session.execute(ans)
    #         db.session.query(Questions).filter(Questions.question_text == prompt).update(Questions.student_answer == std_ans)
    #         db.session.commit()

    #         #check  whether the answers match
    #         score = 0
    #         if std_ans == Questions.question_answer:
    #             score +=1
    #             pass
    #             # db.session.query(Score).filter(Score.student_id == ).update(Score.score == score)
    #             # db.session.commit()
    
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