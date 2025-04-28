from flask import render_template, request, session, redirect, url_for, jsonify
import json, base64, random
from models import  Card, Bookmark
from sqlalchemy import update, select  
     
def decode_base64(value):
    try:
        return base64.b64decode(value).decode("utf-8")
    except (base64.binascii.Error, UnicodeDecodeError):
        return value  

def isBase64(json_):
    try:
        if isinstance(json_, dict):
            return {key: isBase64(value) for key, value in json_.items()}
        elif isinstance(json_, list):
            return [isBase64(value) for value in json_]
        elif isinstance(json_, str):
            return decode_base64(json_)
        elif isinstance(json_, int):
            return json_

    except (json.JSONDecodeError, ValueError) as e:
        return {"error": f"Invalid JSON input: {str(e)}"}
    
def generate_content(json_file):
    decoded_content = isBase64(json_file)
    return decoded_content

def generate_cards_html_content(card={},isCorrect=None,isBooked=None):

    checkAnswer_action_url = url_for('checkAnswer')
    json_path_clickButton = url_for('static', filename='click-Button.js')
    img_description = " No description is provided"
    html_fragment = ""
    html_fragment_list = []
    content = generate_content(card)
    incorrect_txt =  get_incorrect_text(content)

    for item in content.get('content', []):
        match item.get("type"):
            case "header":
                headers = getHeaders(content)
                for header in headers:
                    html_fragment += f'''
                    <h3 class="content space-after-lg"> {header} </h3>'''

            case 'image':
                images = getImage(content)
                for img in images:
                    image_path = url_for('static', filename=img)
                    html_fragment += f''' 
                    <div class="content image">
                        <img src="{image_path}" alt="A glass room with a lot of flowers and plants." />
                        <div class="description" id="image0-description">{img_description}</div>
                    </div>
                    '''

            case 'response_multiple_choice':
                mulChoice = get_multipleChoice(content)
                html_fragment +=f''' 
                <div class="content">
                        <form id="question" method="POST" action="{checkAnswer_action_url}">
                          <fieldset>
                    <script src="{json_path_clickButton}" defer></script>'''    
                       
                for i, choices in enumerate(mulChoice):
                    for j, choice in enumerate(choices):
                        html_fragment += f'''
                            <div class="form-row">
                            <label for="multiple-option{j}" class="choice-input center-up-down" name="choice-input">
                                <input onchange="updateIcons()" type="radio" id="multiple-option{j}" name="choice" value="{j}" />
                                <span class="material-symbols-rounded icon" aria-hidden="true">radio_button_unchecked</span>
                                <span>{choice}</span>
                            </label>
                            </div>'''
                        
                html_fragment += f'''
                            <div class="submit-row">
                                <button type="reset">
                                <span class="can-hide-450">Clear</span>
                                    <span class="material-symbols-rounded" aria-hidden="true">close</span>
                                </button>
                                <button type="submit">Submit</button>
                            </div>                 
                            </fieldset>
                        </form>
                            <script>
                                window.onload = function() {{
                                    let isCorrect = "{ isCorrect }"; 

                                    if (isCorrect === "True") {{
                                        document.getElementById("correctMessage").style.display = "block";
                                        document.getElementById("incorrectMessage").style.display = "none";
                                    }} else if (isCorrect === "False") {{
                                        document.getElementById("correctMessage").style.display = "none";
                                        document.getElementById("incorrectMessage").style.display = "block";
                                    }} else {{
                                        document.getElementById("correctMessage").style.display = "none";
                                        document.getElementById("incorrectMessage").style.display = "none"; 
                                    }}
                                }};
                            </script>
                    </div>'''
                
                incorrect_txt = get_incorrect_text(content)
                for txt in incorrect_txt:
                    html_fragment += f''' 
                    <div class="content space-after-lg" style="display: none;" id="incorrectMessage">
                        <h3 class="content space-after-sm" style="color: red;"> Incorrect </h3> 
                        <div class="content">
                            <p>{ txt }</p>
                        </div>
                    </div>'''  
                
            case 'response_select_all_choice':
                select_all_choice = get_select_all_apply(content)
                html_fragment += f''' 
                        <div class="content">
                                <form id="question" method="POST" action="{checkAnswer_action_url}">
                                    <fieldset>
                                    <script src="{json_path_clickButton}" defer></script>'''    

                for i, choices in enumerate(select_all_choice):
                    for j, choice in enumerate(choices):
                        html_fragment += f'''  
                            <div class="form-row">
                            <label for="selectall-option{j}" class="choice-input center-up-down" name="choice-input">
                                <input onchange="updateIcons()" type="checkbox" id="selectall-option{j}" name="choice" value="{j}" />
                                <span class="material-symbols-rounded icon" aria-hidden="true">check_box_outline_blank</span>
                                <span>{choice}</span>
                            </label>
                            </div>'''
                        
                html_fragment += f'''
                    <div class="submit-row">
                        <button type="reset">
                            Clear
                            <span class="material-symbols-rounded" aria-hidden="true">close</span>
                        </button>
                        <button type="submit">Submit</button>
                    </div>
                    </fieldset>
                    </form>
                    <script>
                        window.onload = function() {{
                            let isCorrect = "{ isCorrect }"; 

                            if (isCorrect === "True") {{
                                document.getElementById("correctMessage").style.display = "block";
                                document.getElementById("incorrectMessage").style.display = "none";
                            }} else if (isCorrect === "False") {{
                                document.getElementById("correctMessage").style.display = "none";
                                document.getElementById("incorrectMessage").style.display = "block";
                            }} else {{
                                document.getElementById("correctMessage").style.display = "none";
                                document.getElementById("incorrectMessage").style.display = "none"; 
                            }}
                        }};
                    </script>
            </div>'''  
                
                incorrect_txt = get_incorrect_text(content)
                for txt in incorrect_txt:
                    html_fragment += f''' 
                    <div class="content space-after-lg" style="display: none;" id="incorrectMessage">
                        <h3 class="content space-after-sm" style="color: red;"> Incorrect </h3> 
                        <div class="content">
                            <p>{ txt }</p>
                        </div>
                    </div>'''  
                
            case "long-text":
                long_txt = get_long_text(content)
                for txts in long_txt:
                        html_fragment += f'''               
                        <div class="long-text">
                            <p id="longText">
                                { txts }
                            </p>              
                        </div>'''

    print(html_fragment)
    html_fragment_list.append(html_fragment)
    return html_fragment_list

def get_id(content_list):
    data = generate_content(content_list)
    id = data.get('id')

    return id if id else None

def get_incorrect_text(content_list):
    incorrect_texts = []
    try:
        for item in content_list.get('content', []):
            # if item.get('type') == 'incorrect':
            if 'incorrect' in item:
                # incorrect_texts.append(item.get('content'))
                incorrect_texts.append(item['incorrect'])

    except Exception as e:
        print(e)
    for i in incorrect_texts:
        print(i)
    return incorrect_texts
        
def get_long_text(content_list):
    long_texts = []
    try:
        content = content_list.get('content', [])
        if isinstance(content, str):
            long_texts.append(content)
        elif isinstance(content, list):
            for item in content:
                if item.get('type') == 'long-text':
                    long_texts.append(item.get("content"))
            
    except Exception as e:
        print(e)
    
    return long_texts

def get_select_all_apply(content_list):
    select_all_choice = []
    try:
        for item in content_list.get('content', []):
            if item.get('type') == 'response_select_all_choice':
                select_all_choice.append(item.get("content"))
            
    except Exception as e:
        print(e)

    return select_all_choice

def get_multipleChoice(content_list):
    mulChoice = []
    try:
        for item in content_list.get('content', []):
            if item.get('type') == 'response_multiple_choice':
                mulChoice.append(item.get("content"))
            
    except Exception as e:
        print(e)

    return mulChoice

def getImage(content_list):
    images = []
    try:
        for item in content_list.get('content', []):
            if item.get('type') == 'image':
                images.append(item.get("content"))
            
    except Exception as e:
        print(e)
    
    return images

def getHeaders(content_list):
    headers = []
    try:
        for item in content_list.get('content', []):
            if item.get('type') == 'header':
                headers.append(item.get("content"))
            
    except Exception as e:
        print(e)

    return headers
 
def getShuffle(content_list):
    try:
        for item in content_list.get("content", []):
                if "shuffle" in item:
                    return str(item['shuffle'])
    
    except Exception as e:
        print("This card doesn't have a shuffle value:", e)
    return None  

def getCorrectValue(content_list):
    print(content_list.get('content'))
    try:
        for item in content_list.get('content',[]):
            if 'correct' in item:
                return item['correct']
    
    except Exception as e:
        print(e)

    return None

def getDiffuclty(content_list):
    try:
        for item in content_list.get('content'):
            if 'diffuclty' in item:
                    return item['diffuclty'] 
    
    except Exception as e:
        print("This card doesn't have a diff value:", e)

    return None

def generateDeck(cards =[], prob=0.4):
    deck=[]
    for card in cards:
        dice = random.random()
        if(dice <= prob):
            deck.append(card)

    return deck

def get_current_card():
    if 'card' not in session:
        return None
    
    card = session['card']
    card_id = card.get('id') ## we have to have an id in every json file. 
    # print(f"card title is {card_id}")
    card_cur = Card.query.filter_by(id=card_id).first() ##this is an object of type Card.
    return card_cur

def get_current_user():
    if 'user' not in session:
        return None
    ## do sth if found (like return the id)

def register_routes(app,db):

    @app.route('/bookmark', defaults={'card_id': None}, methods=['GET', 'POST'])
    @app.route('/bookmark/<int:card_id>', methods=["POST", 'GET']) 
    def save_bookmark(card_id):
        card = session.get('card')
        card_id = card.get('id')
        exists = db.session.query(Bookmark.query.filter(Bookmark.card_id == card_id).exists()).scalar()
        if exists:
            isBooked = True
        else:
            isBooked = False

        if card_id:
            if isBooked == False:
                bookmark = Bookmark(card_id=card_id, card=card)
                bookmark.insert()

            elif isBooked == True:
                Bookmark.un_bookmark(card_id)

        session['isBooked'] = isBooked
        return redirect(url_for('course_next', card_id=card_id))
    
    @app.route('/show_bookmarks', methods=['GET','POST'])
    def show_bookmarks():
        all_bookmarks = Bookmark.get_all_bookmarks()
        return render_template('bookmarks.html', data=all_bookmarks)

    @app.route('/')
    def index():
        return render_template('index.html')  
    
    @app.route('/card-edit')
    def card_edit():
        return render_template('card-edit.html')  

    @app.route('/checkAnswer', methods=['GET', 'POST'])
    def checkAnswer(): 
        isCorrect = "False"
        card = session.get('card')
        card_id = card.get('id')
        correctValue = getCorrectValue(card)

        if request.method == 'POST':
            selected_choice = [int(choice) for choice in request.form.getlist("choice") ] 
            print(f"selected choice = {selected_choice}")

            if isinstance(correctValue, int):
                if correctValue in selected_choice:
                    isCorrect = "True" 

            if selected_choice is not None and correctValue == selected_choice:
                isCorrect = "True"
        

        print(f"isCorrect value: {isCorrect}")
        Card.update_isCorrect(card_id=card_id, isCorrect=isCorrect)
        return redirect(url_for("same_course_next",isCorrect=isCorrect))

        # all incorrect cards will be in the final list
        # 40% of correct cards will be in the final list
        #   if correct and diff of 3, chance is 80%
        #   if correct and diff of 2, chance is 60%
        #   if correct and diff of 1, chance is 50%
        #   if correct and diff of 5, chance is 40%
        #   if correct and diff of 4, chance is 70%

    @app.route('/same_course_next', methods=['POST', 'GET'])
    def same_course_next():
        isCorrect = request.args.get('isCorrect')
        card = session.get('card')
        isBooked = session.get("isBooked")
        next_card_id = card.get('id')
        next_card = generate_cards_html_content(card=card,isCorrect=isCorrect,isBooked=isBooked)

        return render_template('course_next.html', next_card=next_card, card_id=next_card_id)
 
    @app.route('/course_next', defaults={'card_id': None}, methods=['GET', 'POST'])
    @app.route('/course_next/<int:card_id>', methods=["POST", 'GET'])  
    def course_next(card_id):

        isCorrect = None
        isBooked = False

        if card_id is not None:
            selectedCard = db.session.query(Card).filter(Card.id == card_id).first()

        else:
            correct_cards = db.session.query(Card).filter(Card.isCorrect == "True").all()
            incorrect_cards =  db.session.query(Card).filter(Card.isCorrect == "False").all()

            deck1, deck2, deck3, deck4, deck5 = [], [], [], [], []

            print(f'correct_cards: {correct_cards}')
            print(f'Incorrect_cards: {incorrect_cards}')
            for next_card in correct_cards:
                match next_card.diff:
                    case 1:
                        deck1.append(next_card)
                    case 2:
                        deck2.append(next_card)
                    case 3:
                        deck3.append(next_card)
                    case 4:
                        deck4.append(next_card)
                    case 5:
                        deck5.append(next_card)

            deck11 = generateDeck(deck1, prob=0.5)
            deck22 = generateDeck(deck2, prob=0.6)
            deck33 = generateDeck(deck3, prob=0.8)
            deck44 = generateDeck(deck4, prob=0.7)
            deck55 = generateDeck(deck5, prob=0.4)

            final_deck = deck11 + deck22 + deck33 + deck44 + deck55 + incorrect_cards
            random.shuffle(final_deck)
            selectedCard = random.choice(final_deck) if final_deck else None
   
        next_card = generate_content(selectedCard.json_column)

        next_card_html = generate_cards_html_content(selectedCard.json_column, isCorrect=isCorrect)

        next_card_id = get_id(next_card)
        exists = db.session.query(db.session.query(Bookmark).filter_by(card_id=next_card_id).exists()).scalar()
        if exists:
            isBooked=True

        session['card'] = next_card

        return render_template('course_next.html', next_card=next_card_html, card_id=next_card_id, isBooked=isBooked)

    @app.route('/discover')
    def discover(): 
        return render_template('discover.html')
    
    @app.route('/course')
    def course(): 
        return render_template('course.html')
    
    @app.route('/courseEdit')
    def courseEdit():
        return render_template('courseEdit.html')
    
    @app.route('/card_edit')
    def cardEdit():
        return render_template('card-edit.html')
    
    @app.route('/register', methods=["GET", "POST"])
    def register():
        return render_template('register.html')

    @app.route('/login', methods=["GET", "POST"])
    def login():
        return render_template('login.html')
    
    @app.route('/myCourses', methods=["GET", "POST"])
    def myCourses():
        return render_template('my_courses.html')

    @app.route('/profile', methods=["GET", "POST"])
    def profile():
        return render_template('profile.html')