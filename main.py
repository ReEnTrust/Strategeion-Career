# -*- coding: utf-8 -*-


import flask
import requests
from flask_cors import CORS, cross_origin
import numpy as np
import io
import pandas as pd 
import pickle
import sklearn

app = flask.Flask(__name__)
CORS(app)

method_requests_mapping = {
    'GET': requests.get,
    'HEAD': requests.head,
    'POST': requests.post,
    'PUT': requests.put,
    'DELETE': requests.delete,
    'PATCH': requests.patch,
    'OPTIONS': requests.options,
}

### Loading web pages ###


@app.route("/")
def index():
    return flask.render_template("html/index.html")

@app.route("/job_offer")
def job_offer():
    return flask.render_template("html/job_offer.html")

@app.route("/application")
def application():
    return flask.render_template("html/application.html")

@app.route("/join_exp1")
def join_exp1():
    return flask.render_template("html/join_exp1.html")

@app.route("/join_exp2")
def join_exp2():
    return flask.render_template("html/join_exp2.html")
@app.route("/join_exp3")
def join_exp3():
    return flask.render_template("html/join_exp3.html")
@app.route("/end")
def end():
    return flask.render_template("html/end.html")
@app.route("/base")
def base():
    return flask.render_template("html/experiment1.html")
@app.route("/graph")
def graph():
    return flask.render_template("html/experiment2.html")
@app.route("/questions")
def questions():
    return flask.render_template("html/experiment3.html")
@app.route("/data_input_influence")
def data_input_influence():
    return flask.render_template("html/data_input_influence.html")

@app.route("/it_input_influence")
def it_input_influence():
    return flask.render_template("html/it_input_influence.html")

@app.route("/dev_input_influence")
def dev_input_influence():
    return flask.render_template("html/dev_input_influence.html")

@app.route("/management_input_influence")
def management_input_influence():
    return flask.render_template("html/management_input_influence.html")

@app.route("/interpersonal_input_influence")
def interpersonal_input_influence():
    return flask.render_template("html/interpersonal_input_influence.html")
    
@app.route("/sport_input_influence")
def sport_input_influence():
    return flask.render_template("html/sport_input_influence.html")
    
@app.route("/introduction")
def introduction():
    return flask.render_template("html/introduction.html")





@app.route('/<path:url>', methods=method_requests_mapping.keys())
def proxy(url):
    requests_function = method_requests_mapping[flask.request.method]
    request = requests_function(url, stream=True, params=flask.request.args)
    response = flask.Response(flask.stream_with_context(request.iter_content()),
                              content_type=request.headers['content-type'],
                              status=request.status_code)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

###########################################################################################################################################################

### Shortlisting the Candidate ###

@app.route('/result',methods=["POST"])
def result():

    ## Get the candidate's request ##
    req= flask.request.get_json()
    
    ## Load the good model & the candidate's profile ###
    if req['model']=='1':
        
        model = pickle.load(open('Models/model1.sav', 'rb'))
        columns = ['Development Skills','IT Project Management', 'Data Science','IT', 'Interpersonal Skills','Volunteering','Disability','Veteran']
        index = [0]
        df= pd.DataFrame(index=index, columns=columns)
        df = df.fillna(0.0)
        df['Veteran']= req['veteran']
        df['Development Skills']= req['development']
        df['IT Project Management']= req['management']
        df['Data Science']= req['data']
        df['IT']= req['it']
        df['Interpersonal Skills']= req['interpersonal']
        df['Volunteering']= req['volunteering']
        df['Disability']= req['disability']

    ## Load the irrational model & the candidate's profile ###
    elif req['model']=='2':
        
        model = pickle.load(open('Models/model2.sav', 'rb'))
        columns = ['Development Skills','IT Project Management', 'Data Science','IT', 'Interpersonal Skills','Volunteering','Disability','Veteran']
        index = [0]
        df= pd.DataFrame(index=index, columns=columns)
        df = df.fillna(0.0)
        df['Veteran']= req['veteran']
        df['Development Skills']= req['development']
        df['IT Project Management']= req['management']
        df['Data Science']= req['data']
        df['IT']= req['it']
        df['Interpersonal Skills']= req['interpersonal']
        df['Volunteering']= req['volunteering']
        df['Disability']= req['disability']

    ## Load the biased model & the candidate's profile ###
    else:
        
        model = pickle.load(open('Models/model3.sav', 'rb'))
        columns = ['Development Skills','IT Project Management', 'Data Science','IT', 'Interpersonal Skills','Volunteering','Disability','Veteran','Sport']
        index = [0]
        df= pd.DataFrame(index=index, columns=columns)
        df = df.fillna(0.0)
        df['Veteran']= req['veteran']
        df['Development Skills']= req['development']
        df['IT Project Management']= req['management']
        df['Data Science']= req['data']
        df['IT']= req['it']
        df['Interpersonal Skills']= req['interpersonal']
        df['Volunteering']= req['volunteering']
        df['Disability']= req['disability']
        df['Sport']= req['sport']

## Obtaining the Candidate Score and Predicting if the candidate is shortlisted given his profile ###   
    pred=model.predict_proba(df)[0][1]
    
## returning the shortlisting answer ##    
    return flask.jsonify({'data': round(pred,3)})

######################################################################################################################################################### 


### Answering to a what-if question asked by the candidate ###
@app.route('/what_if',methods=["POST"])
def what_if():

    ## Get the candidate's request ##
    req= flask.request.get_json()

    ## Load the right model ##

    model_num=req['model']
    model=pickle.load(open('Models/model'+model_num+'.sav', 'rb'))

    ## Get the candidate's question ##
    ## changed_feature is the feature the candidate wants to change ##
    ## side indicates whether the candidate asks to increase of decrease the value of this feature ##
    ## range corresponds to the maximal score a candidate can have for the feature ###

    changed_feature=req['question_feature']
    side=req['question_side']
    range=req['feature_range']

    ## Loading the initial candidate's profile ##
    ## "x" will be the candidate's profile ##

    columns = ['Development Skills','IT Project Management', 'Data Science','IT', 'Interpersonal Skills','Volunteering','Disability','Veteran']
    index = [0]
    x= pd.DataFrame(index=index, columns=columns)
    x = x.fillna(0.0)
    x['Veteran']= req['veteran']
    x['Development Skills']= req['development']
    x['IT Project Management']= req['management']
    x['Data Science']= req['data']
    x['IT']= req['it']
    x['Interpersonal Skills']= req['interpersonal']
    x['Volunteering']= req['volunteering']
    x['Disability']= req['disability']

    if model_num=='3':
            x['Sport']= req['sport']

    ## Prediction of the candidate's result with the initial candidate's profile ##
    y=model.predict(x)

    ##Initialisation of the answers##
    answer=None

    new_feature_1=None
    new_feature_2=None
    new_feature_3=None
    new_feature_4=None
    new_feature_5=None
    new_feature_6=None
    new_feature_7=None

    new_feature_1_score=None
    new_feature_2_score=None
    new_feature_3_score=None
    new_feature_4_score=None
    new_feature_5_score=None
    new_feature_6_score=None
    new_feature_7_score=None

    answer1_feature_1=None
    answer1_feature_2=None
    answer1_feature_3=None
    answer1_feature_4=None
    answer1_feature_5=None 
    answer1_feature_6=None
    answer1_feature_7=None
    answer2=None

    current_value=None
    new_value=None


    ## Computing the answers to the What-If question ##


    # In case the considered feature is non-boolean #
    if (changed_feature=='IT' or changed_feature=='Data Science' or changed_feature=='Development Skills' or changed_feature=='IT Project Management' or changed_feature=="Interpersonal Skills" or(changed_feature=="Sport" and model_num=='3')):
        # "counter" gives the limit value for the feature. That is the closest value to the initial candidate's profile so that the shortlisting answer is different #
        counter=dico(side, x, y, model, changed_feature,range)

        # if counter==None, it means that the candidate cannot change the shortlisting outcome of the system by increasing/decreasing the value of this feature #
        if counter==None:

            # Computes the Score the candidate would have if his value for this feature was extreme (expert/novice)#
            # This new score is not enough to change the shorlisting outcome of the system #
            new_candidate_score=getNewScore(side,model,x,changed_feature,float(range[2]))

            # If the candidate was initially shortlisted #
            if y==1.0:

                # If the candidate asked to increase the value of the feature #
                if side=='more':

                    # "answer" is the main answer provided to the candidate #
                    # Compared to the other features, Sport has its own answer because it is not technically a skill#
                    if changed_feature=='Sport':
                        answer='Practicing all the sports would give you the following Candidate Score: <b>'+ '%.1f' % new_candidate_score+'/100 </b>. <br/> You would still be granted an interview.' 
                    else:
                        answer='Being an Expert in all "'+changed_feature+ '" skills would give you the following Candidate Score: <b>'+ '%.1f' % new_candidate_score+'/100 </b>. <br/> You would still be granted an interview.' 
                
                # If the candidate asked to decrease the value of the feature #
                if side=='less':
                    if changed_feature=='Sport':
                        answer='Not practicing sport would give you the following Candidate Score: <b>'+ '%.1f' % new_candidate_score+'/100 </b>. <br/> You would still be granted an interview.' 
                    else:
                        answer='Being an Novice in all "'+changed_feature+ '" skills would give you the following Candidate Score: <b>'+ '%.1f' % new_candidate_score+'/100 </b>. <br/> You would still be granted an interview.' 
                        

            # If the candidate was initially rejected #
            if y==0.0:
                # If the candidate asked to increase the value of the feature #
                if side=='more':
                    if changed_feature=='Sport':
                        answer='Practicing all the sports would give you the following Candidate Score: <b>'+ '%.1f' % new_candidate_score+'/100 </b>. <br/> You would still not be granted an interview.' 
                    else:
                        answer='Being an Expert in all "'+changed_feature+ '" skills would give you the following Candidate Score: <b>'+ '%.1f' % new_candidate_score+'/100 </b>. <br/> You would still not be granted an interview.' 
                
                # If the candidate asked to decrease the value of the feature #
                if side=='less':
                    if changed_feature=='Sport':
                        answer='Not practicing sport would give you the following Candidate Score: <b>'+ '%.1f' % new_candidate_score+'/100 </b>. <br/> You would still not be granted an interview.' 
                    else:
                        answer='Being an Novice in all "'+changed_feature+ '" skills would give you the following Candidate Score: <b>'+ '%.1f' % new_candidate_score+'/100 </b>. <br/> You would still not be granted an interview.' 
            
            # These 7 answers are the answers provided for each sub-skill of the feature, if the candidate asks to see more detail #
            answer1_feature_1, answer1_feature_2, answer1_feature_3, answer1_feature_4, answer1_feature_5, answer1_feature_6, answer1_feature_7=get_more_detail_unchange(side,x,model,changed_feature,req)
        


        # if counter!=None, it means that the candidate can change the shortlisting outcome of the system by increasing/decreasing the value of this feature #
        if counter!=None:
            # current_value is the Score the candidate has for the feature of interest #
            current_value=round(float(x[changed_feature].item())*100/(float(range[2])-float(range[0])),1)
            # new_value is the limit Score necessary for the feature of interest in order to change the shortlisting outcome #
            new_value=round(counter*100/(float(range[2])-float(range[0])),1)

            # These 7 answers are the answers provided for each sub-skill of the feature, if the candidate asks to see more detail #
            new_feature_1,new_feature_1_score,new_feature_2,new_feature_2_score,new_feature_3,new_feature_3_score,new_feature_4,new_feature_4_score,new_feature_5,new_feature_5_score,new_feature_6,new_feature_6_score,new_feature_7,new_feature_7_score,answer1_feature_1,answer1_feature_2,answer1_feature_3, answer1_feature_4, answer1_feature_5, answer1_feature_6, answer1_feature_7, answer2=get_more_detail_change(abs(counter-float(x[changed_feature].item())), side, float(range[2]), changed_feature,req)
            
    
    # For the good and irrational model, Sport is not taken into account, therefore it cannot change the outcome of the model#       
    elif (changed_feature=="Sport" and model_num!='3'):
        if y==0.0:
            if side=='less':
                answer='With less skills in sport, your Candidate Score would not change, and you would still not be considered for an interview.'
            if side=='more':
                answer='With more skills in sport, your Candidate Score would not change, and you would still not be considered for an interview.'
        if y==1.0:
            if side=='less':
                answer='With less skills in sport, your Candidate Score would not change, and you would still be considered for an interview.'
            if side=='more':
                answer='With more skills in sport, your Candidate Score would not change, and you would still be considered for an interview.'
       
     # In case the considered feature is boolean #
    else:
        # "counter" is a boolean feature indicating whether changing the feature can change the outcome of the system #
        counter=change_feature(x, y,side, model, changed_feature)

        # "new_candidate_score" tells the Score the candidate would have by changing the feature #
        new_candidate_score=getNewScore(side,model,x,changed_feature,float(range[2]))

        # If changing the feature could change the outcome #
        if counter==True:
            # If the candidate was initially rejected #
            if y==0.0:
                # If the candidate asked to increase the feature #
                if side=="more":
                    if changed_feature=='Veteran':
                        answer='If you had been a veteran, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would have been granted an interview.'
                    if changed_feature=='Disability':
                        answer='If you had a disability, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would have been granted an interview.'
                    if changed_feature=='Volunteering':
                        answer='If you had been doing volunteering, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would have been granted an interview.'
                
                # If the candidate asked to decrease the feature #
                if side=='less':
                    if changed_feature=='Veteran':
                        answer='If you had  not been a veteran, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would have been granted an interview.'
                    if changed_feature=='Disability':
                        answer='If you did not have a disability, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would have been granted an interview.'
                    if changed_feature=='Volunteering':
                        answer='If you had not been doing volunteering, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would have been granted an interview.'
           
            # If the candidate was initially shortlisted #
            if y==1.0:
                # If the candidate asked to increase the feature #
                if side=="more":
                    if changed_feature=='Veteran':
                        answer='If you had been a veteran, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would not have been granted an interview.'
                    if changed_feature=='Disability':
                        answer='If you had a disability, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would not have been granted an interview.'
                    if changed_feature=='Volunteering':
                        answer='If you had been doing volunteering, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b>  and you would not have been granted an interview.'
                
                # If the candidate asked to decrease the feature #
                if side=='less':
                    if changed_feature=='Veteran':
                        answer='If you had not been a veteran, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b>  and you would not have been granted an interview.'
                    if changed_feature=='Disability':
                        answer='If you did not have a disability, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b>  and you would not have been granted an interview.'
                    if changed_feature=='Volunteering':
                        answer='If you had not been doing volunteering, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b>  and you would not have been granted an interview.'
        
        # If changing the feature could not change the outcome #        
        elif counter==False:

            # If the candidate was initially rejected #
            if y==0.0:
                if side=="more":
                    # If the candidate asked to increase the feature #
                    if changed_feature=='Veteran':
                        answer='If you had been a veteran, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b>  and  you would still not have been granted an interview.'
                    if changed_feature=='Disability':
                        answer='If you had a disability, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would still not have been granted an interview.'
                    if changed_feature=='Volunteering':
                        answer='If you had been doing volunteering, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would still not have been granted an interview.'                    
                
                # If the candidate asked to decrease the feature #
                if side=='less':
                    if changed_feature=='Veteran':
                        answer='If you had not been a veteran, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would still not have been granted an interview.'
                    if changed_feature=='Disability':
                        answer='If you did not have a disability, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would still not have been granted an interview.'
                    if changed_feature=='Volunteering':
                        answer='If you had not been doing volunteering, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would still not have been granted an interview.'
            
            # If the candidate was initially shortlisted #
            if y==1.0:

                # If the candidate asked to increase the feature #
                if side=="more":
                    if changed_feature=='Veteran':
                        answer='If you had been a veteran, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would still have been granted an interview.'
                    if changed_feature=='Disability':
                        answer='If you had a disability, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would still have been granted an interview.'
                    if changed_feature=='Volunteering':
                        answer='If you had been doing volunteering, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would still have been granted an interview.'
                
                # If the candidate asked to decrease the feature #
                if side=='less':
                    if changed_feature=='Veteran':
                        answer='If you had not been a veteran, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would still have been granted an interview.'
                    if changed_feature=='Disability':
                        answer='If you did not have a disability, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would still have been granted an interview.'
                    if changed_feature=='Volunteering':
                        answer='If you had not been doing volunteering, your Candidate Score would have been: <b>'+ '%.1f' % new_candidate_score+'/100 </b> and you would still have been granted an interview.'
        else:
            answer='error'

    return flask.jsonify({'data': answer, 'new_feature_1': new_feature_1, 'new_feature_2': new_feature_2, 'new_feature_3': new_feature_3, 'new_feature_4': new_feature_4, 
    'new_feature_5': new_feature_5, 'new_feature_6': new_feature_6 ,'new_feature_7': new_feature_7,'new_feature_1_score': new_feature_1_score,'new_feature_2_score': new_feature_2_score,
    'new_feature_3_score': new_feature_3_score,'new_feature_4_score': new_feature_4_score,'new_feature_5_score': new_feature_5_score,'new_feature_6_score': new_feature_6_score,
    'new_feature_7_score': new_feature_7_score, 'answer1_feature_1':answer1_feature_1,'answer1_feature_2':answer1_feature_2,
    'answer1_feature_3':answer1_feature_3, 'answer1_feature_4':answer1_feature_4, 'answer1_feature_5':answer1_feature_5, 'answer1_feature_6':answer1_feature_6, 
    'answer1_feature_7':answer1_feature_7, 'answer2':answer2, 'current_value':current_value,'new_value':new_value, 'limit_score':y[0]})
               

### For non-boolean features this function finds the limit value of the feature of interest in order to change the outcome of the system ###
def dico(sign,x, y,model, feature,range,epsilon=0.01):
    x_p=x.copy()
    ##The feature is set to an extreme value##
    if sign=='less':
        x_p[feature]=float(range[0])
    if sign=='more':
        x_p[feature]=float(range[2]) 
        
    base=float(x[feature].item())
    limit=float(x_p[feature].item())

    ## If the extreme value cannot change the outcome, then it stops here, otherwise, a dichotomy is carried out to see which smallest modification would change the outcome##
    if model.predict(x_p)==y:
        return(None)
    
    while (abs(limit-base)> epsilon):
        m=(limit+base)/2
        x_p[feature]=m
        outcome=model.predict(x_p)
        
        if outcome==y:
            base=m
        else:
            limit=m
    return limit

### For Boolean features, this function checks whether changing the value of the feature would change the outcome of the system ###
def change_feature(x, y,sign, model,feature):
    x_p=x.copy()
    if sign=='less':
        x_p[feature]=0.0
    if sign=='more':
        x_p[feature]=1.0
        
    y_p=model.predict(x_p)


    if (y_p==y):
        return(False)
    elif (y_p==1-y):
        return(True)
    else:
        return('error')

### For Boolean features, this function computes the Score the candidate would have by changing the feature ###
def getNewScore(sign,model,x,feature,range):
    x_p=x.copy()
    if sign=='less':
        x_p[feature]=0.0
    if sign=='more':
        x_p[feature]=range
        
    y_p=round(model.predict_proba(x_p)[0][1]*100,1)
    return y_p

   
### In case the candidate cannot change the outcome of the system by modifying the feature, for each sub-skill of that feature, the Score he would get by having an extreme value (Novice/Expert) for that sub-skill is computed ###
def get_more_detail_unchange(sign,x,model,feature,req):

    answer1_feature_1=None
    answer1_feature_2=None
    answer1_feature_3=None
    answer1_feature_4=None
    answer1_feature_5=None 
    answer1_feature_6=None
    answer1_feature_7=None

    x_1=x.copy()
    x_2=x.copy()
    x_3=x.copy()
    x_4=x.copy()
    x_5=x.copy()
    x_6=x.copy()
    x_7=x.copy()

    if feature=='Data Science':

        ## The current value for each sub-skill are loaded##
        current_python=float(req['feature_1'])
        current_sql=float(req['feature_2'])
        current_nosql=float(req['feature_3'])
        current_matlab=float(req['feature_4'])
        current_excel=float(req['feature_5'])
        current_database=float(req['feature_6'])
        current_visualisation=float(req['feature_7'])

        ## The candidate wants to decrease his skills ##
        if sign=='less':
            ## Being a novice for each sub-skill ##
            new_python=0
            new_sql=0
            new_nosql=0
            new_matlab=0
            new_excel=0
            new_database=0
            new_visualisation=0

            answer1_feature_1='Being a Novice in Python would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_2='Being a Novice in SQL would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_3='Being a Novice in No SQL would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_4='Being a Novice in Matlab would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_5='Being a Novice in Microsoft Excel would give you a Candidate Score of: <br/><br/> <b>' 
            answer1_feature_6='Being a Novice in Database would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_7='Being a Novice in Data Visualisation would give you a Candidate Score of: <br/><br/> <b>'

        ## The candidate wants to increase his skills ##    
        if sign=='more':

            ## Being an expert for each sub-skill ##
            new_python=1
            new_sql=1
            new_nosql=1
            new_matlab=1
            new_excel=1
            new_database=1
            new_visualisation=1
            
            answer1_feature_1='Being an Expert in Python would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_2='Being an Expert in SQL would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_3='Being an Expert in No SQL would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_4='Being an Expert in Matlab would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_5='Being an Expert in Microsoft Excel would give you a Candidate Score of: <br/><br/> <b>' 
            answer1_feature_6='Being an Expert in Database would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_7='Being an Expert in Data Visualisation would give you a Candidate Score of: <br/><br/> <b>'

        # New candidate profiles are computed by changing each sub-skills to their new value #
        new_python_score=(new_python*0.5+current_visualisation*0.4+current_database*0.4+current_excel*0.4+current_matlab*0.5+current_nosql*0.4+current_sql*0.4)
        new_sql_score=(current_python*0.5+current_visualisation*0.4+current_database*0.4+current_excel*0.4+current_matlab*0.5+current_nosql*0.4+new_sql*0.4)
        new_nosql_score=(current_python*0.5+current_visualisation*0.4+current_database*0.4+current_excel*0.4+current_matlab*0.5+current_sql*0.4+new_nosql*0.4)
        new_matlab_score=(new_matlab*0.5+current_python*0.5+current_visualisation*0.4+current_database*0.4+current_excel*0.4+current_nosql*0.4+current_sql*0.4)
        new_excel_score=(new_excel*0.4+current_python*0.5+current_visualisation*0.4+current_database*0.4+current_matlab*0.5+current_nosql*0.4+current_sql*0.4)
        new_database_score=(new_database*0.4+current_python*0.5+current_visualisation*0.4+current_excel*0.4+current_matlab*0.5+current_nosql*0.4+current_sql*0.4)
        new_visualisation_score=(new_visualisation*0.4+current_python*0.5+current_database*0.4+current_excel*0.4+current_matlab*0.5+current_nosql*0.4+current_sql*0.4)
          
        x_1[feature]=new_python_score
        x_2[feature]=new_sql_score
        x_3[feature]=new_nosql_score
        x_4[feature]=new_matlab_score
        x_5[feature]=new_excel_score
        x_6[feature]=new_database_score
        x_7[feature]=new_visualisation_score

        ## For each sub-skill, a new Candidate Score is computed ##
        y_1=round(model.predict_proba(x_1)[0][1]*100,1)
        y_2=round(model.predict_proba(x_2)[0][1]*100,1)
        y_3=round(model.predict_proba(x_3)[0][1]*100,1)
        y_4=round(model.predict_proba(x_4)[0][1]*100,1)
        y_5=round(model.predict_proba(x_5)[0][1]*100,1)
        y_6=round(model.predict_proba(x_6)[0][1]*100,1)
        y_7=round(model.predict_proba(x_7)[0][1]*100,1)


        answer1_feature_1=answer1_feature_1 + '%.1f' % y_1 +'/100 </b>'
        answer1_feature_2=answer1_feature_2 + '%.1f' % y_2 +'/100 </b>'
        answer1_feature_3=answer1_feature_3 + '%.1f' % y_3 +'/100 </b>'
        answer1_feature_4=answer1_feature_4 + '%.1f' % y_4 +'/100 </b>'
        answer1_feature_5=answer1_feature_5 + '%.1f' % y_5 +'/100 </b>'
        answer1_feature_6=answer1_feature_6 + '%.1f' % y_6 +'/100 </b>'
        answer1_feature_7=answer1_feature_7 + '%.1f' % y_7 +'/100 </b>'

    elif feature=='IT':

        ## The current value for each sub-skill are loaded##
        current_linux=float(req['feature_1'])
        current_windows=float(req['feature_2'])
        current_mac=float(req['feature_3'])
        current_cloud=float(req['feature_4'])
        current_modems=float(req['feature_5'])
        current_cybersecurity=float(req['feature_6'])
        current_ip=float(req['feature_7'])

        ## The candidate wants to decrease his skills ##
        if sign=='less':
            ## Being a novice for each sub-skill ##
            new_linux=0
            new_windows=0
            new_mac=0
            new_cloud=0
            new_modems=0
            new_cybersecurity=0
            new_ip=0

            answer1_feature_1='Being a Novice in Linux Environment would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_2='Being a Novice in Windows Environment would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_3='Being a Novice in Mac OS Environment would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_4='Being a Novice in Cloud Systems would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_5='Being a Novice in Wireless Modems/Routers would give you a Candidate Score of: <br/><br/> <b>' 
            answer1_feature_6='Being a Novice in Cybersecurity would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_7='Being a Novice in IP Setup would give you a Candidate Score of: <br/><br/> <b>'

        ## The candidate wants to increase his skills ##  
        if sign=='more':
             ## Being an expert for each sub-skill ##
            new_linux=1
            new_windows=1
            new_mac=1
            new_cloud=1
            new_modems=1
            new_cybersecurity=1
            new_ip=1
            
            answer1_feature_1='Being an Expert in Linux Environment would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_2='Being an Expert in Windows Environment would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_3='Being an Expert in Mac OS Environment would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_4='Being an Expert in Cloud Systems would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_5='Being an Expert in Wireless Modems/Routers would give you a Candidate Score of: <br/><br/> <b>' 
            answer1_feature_6='Being an Expert in Cybersecurity would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_7='Being an Expert in IP Setup would give you a Candidate Score of: <br/><br/> <b>'

        # New candidate profiles are computed by changing each sub-skills to their new value #
        new_linux_score=(new_linux*0.5+current_ip*0.4+current_cybersecurity*0.6+current_modems*0.5+current_cloud*0.5+current_mac*0.1+current_windows*0.4)
        new_windows_score=(current_linux*0.5+current_ip*0.4+current_cybersecurity*0.6+current_modems*0.5+current_cloud*0.5+current_mac*0.1+new_windows*0.4)
        new_mac_score=(current_linux*0.5+current_ip*0.4+current_cybersecurity*0.6+current_modems*0.5+current_cloud*0.5+current_windows*0.4+new_mac*0.1)
        new_cloud_score=(new_cloud*0.5+current_linux*0.5+current_ip*0.4+current_cybersecurity*0.6+current_modems*0.5+current_mac*0.1+current_windows*0.4)
        new_modems_score=(new_modems*0.5+current_linux*0.5+current_ip*0.4+current_cybersecurity*0.6+current_cloud*0.5+current_mac*0.1+current_windows*0.4)
        new_cybersecurity_score=(new_cybersecurity*0.6+current_linux*0.5+current_ip*0.4+current_modems*0.5+current_cloud*0.5+current_mac*0.1+current_windows*0.4)
        new_ip_score=(new_ip*0.4+current_linux*0.5+current_cybersecurity*0.6+current_modems*0.5+current_cloud*0.5+current_mac*0.1+current_windows*0.4)
        
        x_1[feature]=new_linux_score
        x_2[feature]=new_windows_score
        x_3[feature]=new_mac_score
        x_4[feature]=new_cloud_score
        x_5[feature]=new_modems_score
        x_6[feature]=new_cybersecurity_score
        x_7[feature]=new_ip_score

        ## For each sub-skill, a new Candidate Score is computed ##
        y_1=round(model.predict_proba(x_1)[0][1]*100,1)
        y_2=round(model.predict_proba(x_2)[0][1]*100,1)
        y_3=round(model.predict_proba(x_3)[0][1]*100,1)
        y_4=round(model.predict_proba(x_4)[0][1]*100,1)
        y_5=round(model.predict_proba(x_5)[0][1]*100,1)
        y_6=round(model.predict_proba(x_6)[0][1]*100,1)
        y_7=round(model.predict_proba(x_7)[0][1]*100,1)


        answer1_feature_1=answer1_feature_1 + '%.1f' % y_1 +'/100 </b>'
        answer1_feature_2=answer1_feature_2 + '%.1f' % y_2 +'/100 </b>'
        answer1_feature_3=answer1_feature_3 + '%.1f' % y_3 +'/100 </b>'
        answer1_feature_4=answer1_feature_4 + '%.1f' % y_4 +'/100 </b>'
        answer1_feature_5=answer1_feature_5 + '%.1f' % y_5 +'/100 </b>'
        answer1_feature_6=answer1_feature_6 + '%.1f' % y_6 +'/100 </b>'
        answer1_feature_7=answer1_feature_7 + '%.1f' % y_7 +'/100 </b>'

    elif feature=='IT Project Management':

        ## The current value for each sub-skill are loaded##
        current_agile=float(req['feature_1'])
        current_schedule=float(req['feature_2'])
        current_planning=float(req['feature_3'])
        current_quality=float(req['feature_4'])
        current_troubleshooting=float(req['feature_5'])
        current_cost=float(req['feature_6'])

        ## The candidate wants to decrease his skills ##
        if sign=='less':
            ## Being a novice for each sub-skill ##
            new_agile=0
            new_schedule=0
            new_planning=0
            new_quality=0
            new_troubleshooting=0
            new_cost=0

            answer1_feature_1='Being a Novice in Agile Methodologies would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_2='Being a Novice in Schedules would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_3='Being a Novice in Project Planning would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_4='Being a Novice in Quality Management would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_5='Being a Novice in Troubleshooting would give you a Candidate Score of: <br/><br/> <b>' 
            answer1_feature_6='Being a Novice in Cost Management would give you a Candidate Score of: <br/><br/> <b>'

        ## The candidate wants to increase his skills ##  
        if sign=='more':
             ## Being an expert for each sub-skill ##
            new_agile=1
            new_schedule=1
            new_planning=1
            new_quality=1
            new_troubleshooting=1
            new_cost=1
            
            answer1_feature_1='Being an Expert in Agile Methodologies would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_2='Being an Expert in Schedules would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_3='Being an Expert in Project Planning would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_4='Being an Expert in Quality Management would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_5='Being an Expert in Troubleshooting would give you a Candidate Score of: <br/><br/> <b>' 
            answer1_feature_6='Being an Expert in Cost Management would give you a Candidate Score of:<br/><br/> <b>'

        # New candidate profiles are computed by changing each sub-skills to their new value #
        new_agile_score=(new_agile*0.3+current_cost*0.3+current_troubleshooting*0.3+current_quality*0.3+current_planning*0.4+current_schedule*0.4)
        new_schedule_score=(current_agile*0.3+current_cost*0.3+current_troubleshooting*0.3+current_quality*0.3+current_planning*0.4+new_schedule*0.4)
        new_planning_score=(current_agile*0.3+current_cost*0.3+current_troubleshooting*0.3+current_quality*0.3+current_schedule*0.4+new_planning*0.4)
        new_quality_score=(new_quality*0.3+current_agile*0.3+current_cost*0.3+current_troubleshooting*0.3+current_planning*0.4+current_schedule*0.4)
        new_troubleshooting_score=(new_troubleshooting*0.3+current_agile*0.3+current_cost*0.3+current_quality*0.3+current_planning*0.4+current_schedule*0.4)
        new_cost_score=(new_cost*0.3+current_agile*0.3+current_troubleshooting*0.3+current_quality*0.3+current_planning*0.4+current_schedule*0.4)
        
        x_1[feature]=new_agile_score
        x_2[feature]=new_schedule_score
        x_3[feature]=new_planning_score
        x_4[feature]=new_quality_score
        x_5[feature]=new_troubleshooting_score
        x_6[feature]=new_cost_score
        
        ## For each sub-skill, a new Candidate Score is computed ##
        y_1=round(model.predict_proba(x_1)[0][1]*100,1)
        y_2=round(model.predict_proba(x_2)[0][1]*100,1)
        y_3=round(model.predict_proba(x_3)[0][1]*100,1)
        y_4=round(model.predict_proba(x_4)[0][1]*100,1)
        y_5=round(model.predict_proba(x_5)[0][1]*100,1)
        y_6=round(model.predict_proba(x_6)[0][1]*100,1)

        answer1_feature_1=answer1_feature_1 + '%.1f' % y_1 +'/100 </b>'
        answer1_feature_2=answer1_feature_2 + '%.1f' % y_2 +'/100 </b>'
        answer1_feature_3=answer1_feature_3 + '%.1f' % y_3 +'/100 </b>'
        answer1_feature_4=answer1_feature_4 + '%.1f' % y_4 +'/100 </b>'
        answer1_feature_5=answer1_feature_5 + '%.1f' % y_5 +'/100 </b>'
        answer1_feature_6=answer1_feature_6 + '%.1f' % y_6 +'/100 </b>'

    elif feature=='Development Skills':

        ## The current value for each sub-skill are loaded##
        current_java=float(req['feature_1'])
        current_javascript=float(req['feature_2'])
        current_css=float(req['feature_3'])
        current_html=float(req['feature_4'])
        current_software=float(req['feature_5'])
        current_cpp=float(req['feature_6'])
        current_web=float(req['feature_7'])

        ## The candidate wants to decrease his skills ##
        if sign=='less':
            ## Being a novice for each sub-skill ##
            new_java=0
            new_javascript=0
            new_css=0
            new_html=0
            new_software=0
            new_cpp=0
            new_web=0

            answer1_feature_1='Being a Novice in Java would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_2='Being a Novice in Javascript would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_3='Being a Novice in CSS would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_4='Being a Novice in HTML would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_5='Being a Novice in Software Development would give you a Candidate Score of: <br/><br/> <b>' 
            answer1_feature_6='Being a Novice in C++ would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_7='Being a Novice in Web Development would give you a Candidate Score of: <br/><br/> <b>'

        ## The candidate wants to increase his skills ##  
        if sign=='more':
             ## Being an expert for each sub-skill ##
            new_java=1
            new_javascript=1
            new_css=1
            new_html=1
            new_software=1
            new_cpp=1
            new_web=1
            
            answer1_feature_1='Being an Expert in Java would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_2='Being an Expert in Javascript would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_3='Being an Expert in CSS would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_4='Being an Expert in HTML would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_5='Being an Expert in Software Development would give you a Candidate Score of: <br/><br/> <b>' 
            answer1_feature_6='Being an Expert in C++ would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_7='Being an Expert in Web Development would give you a Candidate Score of: <br/><br/> <b>'

        # New candidate profiles are computed by changing each sub-skills to their new value #
        new_java_score=(new_java*0.2+current_web*0.3+current_cpp*0.3+current_software*0.3+current_html*0.3+current_css*0.3+current_javascript*0.3)
        new_javascript_score=(current_java*0.2+current_web*0.3+current_cpp*0.3+current_software*0.3+current_html*0.3+current_css*0.1+new_javascript*0.3)
        new_css_score=(current_java*0.2+current_web*0.3+current_cpp*0.3+current_software*0.3+current_html*0.3+current_javascript*0.3+new_css*0.3)
        new_html_score=(new_html*0.3+current_java*0.2+current_web*0.3+current_cpp*0.3+current_software*0.3+current_css*0.3+current_javascript*0.3)
        new_software_score=(new_software*0.3+current_java*0.2+current_web*0.3+current_cpp*0.3+current_html*0.3+current_css*0.3+current_javascript*0.3)
        new_cpp_score=(new_cpp*0.3+current_java*0.2+current_web*0.3+current_software*0.3+current_html*0.3+current_css*0.3+current_javascript*0.3)
        new_web_score=(new_web*0.3+current_java*0.2+current_cpp*0.3+current_software*0.3+current_html*0.3+current_css*0.3+current_javascript*0.3)
        
        x_1[feature]=new_java_score
        x_2[feature]=new_javascript_score
        x_3[feature]=new_css_score
        x_4[feature]=new_html_score
        x_5[feature]=new_software_score
        x_6[feature]=new_cpp_score
        x_7[feature]=new_web_score

        ## For each sub-skill, a new Candidate Score is computed ##
        y_1=round(model.predict_proba(x_1)[0][1]*100,1)
        y_2=round(model.predict_proba(x_2)[0][1]*100,1)
        y_3=round(model.predict_proba(x_3)[0][1]*100,1)
        y_4=round(model.predict_proba(x_4)[0][1]*100,1)
        y_5=round(model.predict_proba(x_5)[0][1]*100,1)
        y_6=round(model.predict_proba(x_6)[0][1]*100,1)
        y_7=round(model.predict_proba(x_7)[0][1]*100,1)


        answer1_feature_1=answer1_feature_1 + '%.1f' % y_1 +'/100 </b>'
        answer1_feature_2=answer1_feature_2 + '%.1f' % y_2 +'/100 </b>'
        answer1_feature_3=answer1_feature_3 + '%.1f' % y_3 +'/100 </b>'
        answer1_feature_4=answer1_feature_4 + '%.1f' % y_4 +'/100 </b>'
        answer1_feature_5=answer1_feature_5 + '%.1f' % y_5 +'/100 </b>'
        answer1_feature_6=answer1_feature_6 + '%.1f' % y_6 +'/100 </b>'
        answer1_feature_7=answer1_feature_7 + '%.1f' % y_7 +'/100 </b>'


    elif feature=='Interpersonal Skills':

        ## The current value for each sub-skill are loaded##
        current_teamwork=float(req['feature_1'])
        current_leadership=float(req['feature_2'])
        current_team_building=float(req['feature_3'])
        current_public_speaking=float(req['feature_4'])
        current_writing=float(req['feature_5'])
        current_presentations=float(req['feature_6'])

        ## The candidate wants to decrease his skills ##
        if sign=='less':
            ## Being a novice for each sub-skill ##
            new_teamwork=0
            new_leadership=0
            new_team_building=0
            new_public_speaking=0
            new_writing=0
            new_presentations=0

            answer1_feature_1='Being a Novice in Teamwork would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_2='Being a Novice in Leadership would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_3='Being a Novice in Team Building would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_4='Being a Novice in Public Speaking would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_5='Being a Novice in Writing would give you a Candidate Score of: <br/><br/> <b>' 
            answer1_feature_6='Being a Novice in Presentations would give you a Candidate Score of: <br/><br/> <b>'

        ## The candidate wants to increase his skills ##  
        if sign=='more':
             ## Being an expert for each sub-skill ##
            new_teamwork=1
            new_leadership=1
            new_team_building=1
            new_public_speaking=1
            new_writing=1
            new_presentations=1

            answer1_feature_1='Being an Expert in Teamwork would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_2='Being an Expert in Leadership would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_3='Being an Expert in Team Building would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_4='Being an Expert in Public Speaking would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_5='Being an Expert in Writing would give you a Candidate Score of: <br/><br/> <b>' 
            answer1_feature_6='Being an Expert in Presentations would give you a Candidate Score of: <br/><br/> <b>'

        # New candidate profiles are computed by changing each sub-skills to their new value #
        new_teamwork_score=(new_teamwork*0.5+current_presentations*0.5+current_writing*0.5+current_public_speaking*0.5+current_team_building*0.5+current_leadership*0.5)
        new_leadership_score=(current_teamwork*0.5+current_presentations*0.5+current_writing*0.5+current_public_speaking*0.5+current_team_building*0.5+new_leadership*0.5)
        new_team_building_score=(current_teamwork*0.5+current_presentations*0.5+current_writing*0.5+current_public_speaking*0.5+current_leadership*0.5+new_team_building*0.5)
        new_public_speaking_score=(new_public_speaking*0.5+current_teamwork*0.5+current_presentations*0.5+current_writing*0.5+current_team_building*0.5+current_leadership*0.5)
        new_writing_score=(new_writing*0.5+current_teamwork*0.5+current_presentations*0.5+current_public_speaking*0.5+current_team_building*0.5+current_leadership*0.5)
        new_presentations_score=(new_presentations*0.5+current_teamwork*0.5+current_writing*0.5+current_public_speaking*0.5+current_team_building*0.5+current_leadership*0.5)
       
        x_1[feature]=new_teamwork_score
        x_2[feature]=new_leadership_score
        x_3[feature]=new_team_building_score
        x_4[feature]=new_public_speaking_score
        x_5[feature]=new_writing_score
        x_6[feature]=new_presentations_score

        ## For each sub-skill, a new Candidate Score is computed ##
        y_1=round(model.predict_proba(x_1)[0][1]*100,1)
        y_2=round(model.predict_proba(x_2)[0][1]*100,1)
        y_3=round(model.predict_proba(x_3)[0][1]*100,1)
        y_4=round(model.predict_proba(x_4)[0][1]*100,1)
        y_5=round(model.predict_proba(x_5)[0][1]*100,1)
        y_6=round(model.predict_proba(x_6)[0][1]*100,1)

        answer1_feature_1=answer1_feature_1 + '%.1f' % y_1 +'/100 </b>'
        answer1_feature_2=answer1_feature_2 + '%.1f' % y_2 +'/100 </b>'
        answer1_feature_3=answer1_feature_3 + '%.1f' % y_3 +'/100 </b>'
        answer1_feature_4=answer1_feature_4 + '%.1f' % y_4 +'/100 </b>'
        answer1_feature_5=answer1_feature_5 + '%.1f' % y_5 +'/100 </b>'
        answer1_feature_6=answer1_feature_6 + '%.1f' % y_6 +'/100 </b>'

    elif feature=='Sport':

        ## The current value for each sub-skill are loaded##
        current_rugby=float(req['feature_1'])
        current_football=float(req['feature_2'])
        current_boxing=float(req['feature_3'])
        current_basketball=float(req['feature_4'])
        current_athletism=float(req['feature_5'])
        current_gymnastic=float(req['feature_6'])
        current_other=float(req['feature_7'])

        ## The candidate wants to decrease his skills ##
        if sign=='less':
            ## not practicing any sport##
            new_rugby=0
            new_football=0
            new_boxing=0
            new_basketball=0
            new_athletism=0
            new_gymnastic=0
            new_other=0

            answer1_feature_1='Not practicing Rugby would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_2='Not practicing Football would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_3='Not practicing Boxing would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_4='Not practicing Basketball would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_5='Not practicing Athletism would give you a Candidate Score of: <br/><br/> <b>' 
            answer1_feature_6='Not practicing Gymnastic would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_7='Not practicing another sport would give you a Candidate Score of: <br/><br/> <b>'

        ## The candidate wants to increase his skills ##  
        if sign=='more':
             ## Being an expert for each sub-skill ##
            new_rugby=1
            new_football=1
            new_boxing=1
            new_basketball=1
            new_athletism=1
            new_gymnastic=1
            new_other=1

            answer1_feature_1='Practicing Rugby would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_2='Practicing Football would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_3='Practicing Boxing would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_4='Practicing Basketball would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_5='Practicing Athletism would give you a Candidate Score of: <br/><br/> <b>' 
            answer1_feature_6='Practicing Gymnastic would give you a Candidate Score of: <br/><br/> <b>'
            answer1_feature_7='Practicing another sport would give you a Candidate Score of: <br/><br/> <b>'

        # New candidate profiles are computed by changing each sport to their new value #
        new_rugby_score=(new_rugby*0.4+current_football*0.4+current_boxing*0.4+current_basketball*0.3+current_athletism*0.2+current_gymnastic*0.1+current_other*0.2)
        new_football_score=(current_rugby*0.4+new_football*0.4+current_boxing*0.4+current_basketball*0.3+current_athletism*0.2+current_gymnastic*0.1+current_other*0.2)
        new_boxing_score=(current_rugby*0.4+current_football*0.4+new_boxing*0.4+current_basketball*0.3+current_athletism*0.2+current_gymnastic*0.1+current_other*0.2)
        new_basketball_score=(current_rugby*0.4+current_football*0.4+current_boxing*0.4+new_basketball*0.3+current_athletism*0.2+current_gymnastic*0.1+current_other*0.2)
        new_athletism_score=(current_rugby*0.4+current_football*0.4+current_boxing*0.4+current_basketball*0.3+new_athletism*0.2+current_gymnastic*0.1+current_other*0.2)
        new_gymnastic_score=(current_rugby*0.4+current_football*0.4+current_boxing*0.4+current_basketball*0.3+current_athletism*0.2+new_gymnastic*0.1+current_other*0.2)
        new_other_score=(current_rugby*0.4+current_football*0.4+current_boxing*0.4+current_basketball*0.3+current_athletism*0.2+current_gymnastic*0.1+new_other*0.2)
 
        x_1[feature]=new_rugby_score
        x_2[feature]=new_football_score
        x_3[feature]=new_boxing_score
        x_4[feature]=new_basketball_score
        x_5[feature]=new_athletism_score
        x_6[feature]=new_gymnastic_score
        x_7[feature]=new_other_score

        ## For each sport, a new Candidate Score is computed ##
        y_1=round(model.predict_proba(x_1)[0][1]*100,1)
        y_2=round(model.predict_proba(x_2)[0][1]*100,1)
        y_3=round(model.predict_proba(x_3)[0][1]*100,1)
        y_4=round(model.predict_proba(x_4)[0][1]*100,1)
        y_5=round(model.predict_proba(x_5)[0][1]*100,1)
        y_6=round(model.predict_proba(x_6)[0][1]*100,1)
        y_7=round(model.predict_proba(x_7)[0][1]*100,1)


        answer1_feature_1=answer1_feature_1 + '%.1f' % y_1 +'/100 </b>'
        answer1_feature_2=answer1_feature_2 + '%.1f' % y_2 +'/100 </b>'
        answer1_feature_3=answer1_feature_3 + '%.1f' % y_3 +'/100 </b>'
        answer1_feature_4=answer1_feature_4 + '%.1f' % y_4 +'/100 </b>'
        answer1_feature_5=answer1_feature_5 + '%.1f' % y_5 +'/100 </b>'
        answer1_feature_6=answer1_feature_6 + '%.1f' % y_6 +'/100 </b>'
        answer1_feature_7=answer1_feature_7 + '%.1f' % y_7 +'/100 </b>'

    return answer1_feature_1, answer1_feature_2, answer1_feature_3, answer1_feature_4, answer1_feature_5, answer1_feature_6, answer1_feature_7


        
### If changing the feature can modify the outcome of the shortlisting system ###
## "add" is the value by which the candidate must increase/decrease his current profile for the feature of interest, in order to change the outcome of the system ##
def get_more_detail_change(add, side, range, feature, req):
    new_feature_1=None
    new_feature_2=None
    new_feature_3=None
    new_feature_4=None
    new_feature_5=None
    new_feature_6=None
    new_feature_7=None

    new_feature_1_score=None
    new_feature_2_score=None
    new_feature_3_score=None
    new_feature_4_score=None
    new_feature_5_score=None
    new_feature_6_score=None
    new_feature_7_score=None

    answer1_feature_1=None
    answer1_feature_2=None
    answer1_feature_3=None
    answer1_feature_4=None
    answer1_feature_5=None 
    answer1_feature_6=None
    answer1_feature_7=None
    answer2=None

    
    if feature=='Data Science':

        ## The current value for each sub-skill is loaded##
        current_python=float(req['feature_1'])
        current_sql=float(req['feature_2'])
        current_nosql=float(req['feature_3'])
        current_matlab=float(req['feature_4'])
        current_excel=float(req['feature_5'])
        current_database=float(req['feature_6'])
        current_visualisation=float(req['feature_7'])

        ## If the candidate asked to increase his skills ##
        ## For each sub-skill, the value by which the sub-skill must be increased to change the outcome of the system is computed ##
        ## If the sub-skill by itself cannot be increased enough, it gets the maximal value  possible ##
        ## With this new sub-skill value, the new value of the feature of interest is computed ##

        if side=='more':

            # python

            # "add_python" is the value python skills can be increased by#
            # However, python skills have a range of [0,1]#
            # Either adding add/python_weight is inferior to 1 and python skills can be increased by add/python_weight#
            # Either adding add/python_weight would be superior to 1 in which case the python skills can only be increased to a maximum by (1-current_python)#
            #The same is carried out for each sub-skill#

            add_python=min(add/0.5,1-current_python)
            #The new python skills are computed#
            new_python=current_python+add_python
            new_feature_1=round(new_python*100,1)
            #sql
            add_sql=min(add/0.4,1-current_sql)
            new_sql=current_sql+add_sql
            new_feature_2=round(new_sql*100,1)
            #nosql
            add_nosql=min(add/0.4,1-current_nosql)
            new_nosql=current_nosql+add_nosql
            new_feature_3=round(new_nosql*100,1)
            #matlab
            add_matlab=min(add/0.5,1-current_matlab)
            new_matlab=current_matlab+add_matlab
            new_feature_4=round(new_matlab*100,1)  
            #excel
            add_excel=min(add/0.4,1-current_excel)
            new_excel=current_excel+add_excel
            new_feature_5=round(new_excel*100,1)     
            #database
            add_database=min(add/0.4,1-current_database)
            new_database=current_database+add_database
            new_feature_6=round(new_database*100,1)            
            #visualisation
            add_visualisation=min(add/0.4,1-current_visualisation)
            new_visualisation=current_visualisation+add_visualisation
            new_feature_7=round(new_visualisation*100,1)
            
        ## If the candidate asked to decrease his skills ##
        ## For each sub-skill, the value by which the sub-skill must be decreased to change the outcome of the system is computed ##
        ## If the sub-skill by itself cannot be decreased enough, it gets the minimal value possible ##
        ## With this new sub-skill value, the new score of the feature of interest is computed ##    
        if side=='less':

            #python

            # "add_python" is the value python skills can be decreased by#
            # However, python skills have a range of [0,1]#
            # Either adding add/weight_python is superior to 0 and python skills can be decreased by add/weight_python#
            # Either adding add/weight_python would be inferior to 0 in which case the python skills can only be decreased to a maximum by current_python#
            #The same is carried out for each sub-skill#

            add_python=min(add/0.5,current_python)
            #The new python skills are computed#
            new_python=current_python-add_python
            new_feature_1=round(new_python*100,1)
            #sql
            add_sql=min(add/0.4,current_sql)
            new_sql=current_sql-add_sql
            new_feature_2=round(new_sql*100,1)
            #nosql
            add_nosql=min(add/0.4,current_nosql)
            new_nosql=current_nosql-add_nosql
            new_feature_3=round(new_nosql*100,1)               
            #matlab
            add_matlab=min(add/0.5,current_matlab)
            new_matlab=current_matlab-add_matlab
            new_feature_4=round(new_matlab*100,1)
            #excel
            add_excel=min(add/0.4,current_excel)
            new_excel=current_excel-add_excel
            new_feature_5=round(new_excel*100,1)
            
            #database
            add_database=min(add/0.4,current_database)
            new_database=current_database-add_database
            new_feature_6=round(new_database*100,1)
               
            #visualisation
            add_visualisation=min(add/0.4,current_visualisation)
            new_visualisation=current_visualisation-add_visualisation
            new_feature_7=round(new_visualisation*100,1)

        ## The new score for the feature of interest is computed, for each sub-skill ##
        new_feature_1_score=round((new_python*0.5+current_visualisation*0.4+current_database*0.4+current_excel*0.4+current_matlab*0.5+current_nosql*0.4+current_sql*0.4)*100/range,1)
        new_feature_2_score=round((current_python*0.5+current_visualisation*0.4+current_database*0.4+current_excel*0.4+current_matlab*0.5+current_nosql*0.4+new_sql*0.4)*100/range,1)
        new_feature_3_score=round((current_python*0.5+current_visualisation*0.4+current_database*0.4+current_excel*0.4+current_matlab*0.5+current_sql*0.4+new_nosql*0.4)*100/range,1)
        new_feature_4_score=round((new_matlab*0.5+current_python*0.5+current_visualisation*0.4+current_database*0.4+current_excel*0.4+current_nosql*0.4+current_sql*0.4)*100/range,1)
        new_feature_5_score=round((new_excel*0.4+current_python*0.5+current_visualisation*0.4+current_database*0.4+current_matlab*0.5+current_nosql*0.4+current_sql*0.4)*100/range,1)
        new_feature_6_score=round((new_database*0.4+current_python*0.5+current_visualisation*0.4+current_excel*0.4+current_matlab*0.5+current_nosql*0.4+current_sql*0.4)*100/range,1)
        new_feature_7_score=round((new_visualisation*0.4+current_python*0.5+current_database*0.4+current_excel*0.4+current_matlab*0.5+current_nosql*0.4+current_sql*0.4)*100/range,1)
        
        ## Answers are set up##
        answer1_feature_1='Having the following Python skills:'
        answer1_feature_2='Having the following SQL skills:'
        answer1_feature_3='Having the following No SQL skills:'
        answer1_feature_4='Having the following Matlab skills:' 
        answer1_feature_5='Having the following Microsoft Excel skills:' 
        answer1_feature_6='Having the following Database skills:'
        answer1_feature_7='Having the following Data Visualisation skills:'
        answer2='Would give you the following Data Science profile:'

    elif feature=='IT':

        ## The current value for each sub-skill is loaded##
        current_linux=float(req['feature_1'])
        current_windows=float(req['feature_2'])
        current_mac=float(req['feature_3'])
        current_cloud=float(req['feature_4'])
        current_modems=float(req['feature_5'])
        current_cybersecurity=float(req['feature_6'])
        current_ip=float(req['feature_7'])

        ## If the candidate asked to increase his skills ##
        ## For each sub-skill, the value by which the sub-skill must be increased to change the outcome of the system is computed ##
        ## If the sub-skill by itself cannot be increased enough, it gets the maximal value possible ##
        ## With this new sub-skill value, the new score of the feature of interest is computed ##
        if side=='more':
            #linux
            add_linux=min(add/0.5,1-current_linux)
            new_linux=current_linux+add_linux
            new_feature_1=round(new_linux*100,1)
            #windows
            add_windows=min(add/0.4,1-current_windows)
            new_windows=current_windows+add_windows
            new_feature_2=round(new_windows*100,1)
            #mac
            add_mac=min(add/0.1,1-current_mac)
            new_mac=current_mac+add_mac
            new_feature_3=round(new_mac*100,1)
            #cloud
            add_cloud=min(add/0.5,1-current_cloud)
            new_cloud=current_cloud+add_cloud
            new_feature_4=round(new_cloud*100,1)  
            #modems
            add_modems=min(add/0.5,1-current_modems)
            new_modems=current_modems+add_modems
            new_feature_5=round(new_modems*100,1)
            #cybersecurity
            add_cybersecurity=min(add/0.6,1-current_cybersecurity)
            new_cybersecurity=current_cybersecurity+add_cybersecurity
            new_feature_6=round(new_cybersecurity*100,1)            
            #ip
            add_ip=min(add/0.4,1-current_ip)
            new_ip=current_ip+add_ip
            new_feature_7=round(new_ip*100,1)
            
        ## If the candidate asked to decrease his skills ##
        ## For each sub-skill, the value by which the sub-skill must be decreased to change the outcome of the system is computed ##
        ## If the sub-skill by itself cannot be decreased enough, it gets the minimal value possible ##
        ## With this new sub-skill value, the new score of the feature of interest is computed ##   
        if side=='less':
            #linux
            add_linux=min(add/0.5,current_linux)
            new_linux=current_linux-add_linux
            new_feature_1=round(new_linux*100,1)
            #windows
            add_windows=min(add/0.4,current_windows)
            new_windows=current_windows-add_windows
            new_feature_2=round(new_windows*100,1)
            #mac
            add_mac=min(add/0.1,current_mac)
            new_mac=current_mac-add_mac
            new_feature_3=round(new_mac*100,1)               
            #cloud
            add_cloud=min(add/0.5,current_cloud)
            new_cloud=current_cloud-add_cloud
            new_feature_4=round(new_cloud*100,1)
            #modems
            add_modems=min(add/0.5,current_modems)
            new_modems=current_modems-add_modems
            new_feature_5=round(new_modems*100,1)
            #cybersecurity
            add_cybersecurity=min(add/0.6,current_cybersecurity)
            new_cybersecurity=current_cybersecurity-add_cybersecurity
            new_feature_6=round(new_cybersecurity*100,1)  
            #ip
            add_ip=min(add/0.4,current_ip)
            new_ip=current_ip-add_ip
            new_feature_7=round(new_ip*100,1)

        ## The new score for the feature of interest is computed, for each sub-skill ##
        new_feature_1_score=round((new_linux*0.5+current_ip*0.4+current_cybersecurity*0.6+current_modems*0.5+current_cloud*0.5+current_mac*0.1+current_windows*0.4)*100/range,1)
        new_feature_2_score=round((current_linux*0.5+current_ip*0.4+current_cybersecurity*0.6+current_modems*0.5+current_cloud*0.5+current_mac*0.1+new_windows*0.4)*100/range,1)
        new_feature_3_score=round((current_linux*0.5+current_ip*0.4+current_cybersecurity*0.6+current_modems*0.5+current_cloud*0.5+current_windows*0.4+new_mac*0.1)*100/range,1)
        new_feature_4_score=round((new_cloud*0.5+current_linux*0.5+current_ip*0.4+current_cybersecurity*0.6+current_modems*0.5+current_mac*0.1+current_windows*0.4)*100/range,1)
        new_feature_5_score=round((new_modems*0.5+current_linux*0.5+current_ip*0.4+current_cybersecurity*0.6+current_cloud*0.5+current_mac*0.1+current_windows*0.4)*100/range,1)
        new_feature_6_score=round((new_cybersecurity*0.6+current_linux*0.5+current_ip*0.4+current_modems*0.5+current_cloud*0.5+current_mac*0.1+current_windows*0.4)*100/range,1)
        new_feature_7_score=round((new_ip*0.4+current_linux*0.5+current_cybersecurity*0.6+current_modems*0.5+current_cloud*0.5+current_mac*0.1+current_windows*0.4)*100/range,1)
        
        ## Answers are set up##
        answer1_feature_1='Having the following Linux skills:'
        answer1_feature_2='Having the following Windows skills:'
        answer1_feature_3='Having the following Mac OS skills:'
        answer1_feature_4='Having the following Cloud System Administration skills:' 
        answer1_feature_5='Having the following Wireless Modems/Routers skills:' 
        answer1_feature_6='Having the following Cybersecurity skills:'
        answer1_feature_7='Having the following IP Setup skills:'
        answer2='Would give you the following IT profile:'




    elif feature=='IT Project Management':

        ## The current value for each sub-skill is loaded##
        current_agile=float(req['feature_1'])
        current_schedule=float(req['feature_2'])
        current_planning=float(req['feature_3'])
        current_quality=float(req['feature_4'])
        current_troubleshooting=float(req['feature_5'])
        current_cost=float(req['feature_6'])

        ## If the candidate asked to increase his skills ##
        ## For each sub-skill, the value by which the sub-skill must be increased to change the outcome of the system is computed ##
        ## If the sub-skill by itself cannot be increased enough, it gets the maximal value possible ##
        ## With this new sub-skill value, the new score of the feature of interest is computed ##
        if side=='more':
            #agile
            add_agile=min(add/0.3,1-current_agile)
            new_agile=current_agile+add_agile
            new_feature_1=round(new_agile*100,1)
            #schedule
            add_schedule=min(add/0.4,1-current_schedule)
            new_schedule=current_schedule+add_schedule
            new_feature_2=round(new_schedule*100,1)
            #planning
            add_planning=min(add/0.4,1-current_planning)
            new_planning=current_planning+add_planning
            new_feature_3=round(new_planning*100,1)
            #quality
            add_quality=min(add/0.3,1-current_quality)
            new_quality=current_quality+add_quality
            new_feature_4=round(new_quality*100,1)  
            #troubleshooting
            add_troubleshooting=min(add/0.3,1-current_troubleshooting)
            new_troubleshooting=current_troubleshooting+add_troubleshooting
            new_feature_5=round(new_troubleshooting*100,1)
            #cost
            add_cost=min(add/0.3,1-current_cost)
            new_cost=current_cost+add_cost
            new_feature_6=round(new_cost*100,1)            
            
        ## If the candidate asked to decrease his skills ##
        ## For each sub-skill, the value by which the sub-skill must be decreased to change the outcome of the system is computed ##
        ## If the sub-skill by itself cannot be decreased enough, it gets the minimal value possible ##
        ## With this new sub-skill value, the new score of the feature of interest is computed ##             
        if side=='less':
            #agile
            add_agile=min(add/0.3,current_agile)
            new_agile=current_agile-add_agile
            new_feature_1=round(new_agile*100,1)
            #schedule
            add_schedule=min(add/0.4,current_schedule)
            new_schedule=current_schedule-add_schedule
            new_feature_2=round(new_schedule*100,1)
            #planning
            add_planning=min(add/0.4,current_planning)
            new_planning=current_planning-add_planning
            new_feature_3=round(new_planning*100,1)               
            #quality
            add_quality=min(add/0.3,current_quality)
            new_quality=current_quality-add_quality
            new_feature_4=round(new_quality*100,1)
            #troubleshooting
            add_troubleshooting=min(add/0.3,current_troubleshooting)
            new_troubleshooting=current_troubleshooting-add_troubleshooting
            new_feature_5=round(new_troubleshooting*100,1)
            #cost
            add_cost=min(add/0.3,current_cost)
            new_cost=current_cost-add_cost
            new_feature_6=round(new_cost*100,1)  
            
        ## The new score for the feature of interest is computed, for each sub-skill ##
        new_feature_1_score=round((new_agile*0.3+current_cost*0.3+current_troubleshooting*0.3+current_quality*0.3+current_planning*0.4+current_schedule*0.4)*100/range,1)
        new_feature_2_score=round((current_agile*0.3+current_cost*0.3+current_troubleshooting*0.3+current_quality*0.3+current_planning*0.4+new_schedule*0.4)*100/range,1)
        new_feature_3_score=round((current_agile*0.3+current_cost*0.3+current_troubleshooting*0.3+current_quality*0.3+current_schedule*0.4+new_planning*0.4)*100/range,1)
        new_feature_4_score=round((new_quality*0.3+current_agile*0.3+current_cost*0.3+current_troubleshooting*0.3+current_planning*0.4+current_schedule*0.4)*100/range,1)
        new_feature_5_score=round((new_troubleshooting*0.3+current_agile*0.3+current_cost*0.3+current_quality*0.3+current_planning*0.4+current_schedule*0.4)*100/range,1)
        new_feature_6_score=round((new_cost*0.3+current_agile*0.3+current_troubleshooting*0.3+current_quality*0.3+current_planning*0.4+current_schedule*0.4)*100/range,1)
        
        ## Answers are set up##
        answer1_feature_1='Having the following Agile Methodologies skills:'
        answer1_feature_2='Having the following Schedules skills:'
        answer1_feature_3='Having the following Project Planning skills:'
        answer1_feature_4='Having the following Quality Management skills:' 
        answer1_feature_5='Having the following Troubleshooting skills:' 
        answer1_feature_6='Having the following Cost Management skills:'
        answer2='Would give you the following IT Project Management profile:'
    

    elif feature=='Development Skills':

        ## The current value for each sub-skill is loaded##
        current_java=float(req['feature_1'])
        current_javascript=float(req['feature_2'])
        current_css=float(req['feature_3'])
        current_html=float(req['feature_4'])
        current_software=float(req['feature_5'])
        current_cpp=float(req['feature_6'])
        current_web=float(req['feature_7'])

        ## If the candidate asked to increase his skills ##
        ## For each sub-skill, the value by which the sub-skill must be increased to change the outcome of the system is computed ##
        ## If the sub-skill by itself cannot be increased enough, it gets the maximal value possible ##
        ## With this new sub-skill value, the new score of the feature of interest is computed ##
        if side=='more':
            #java
            add_java=min(add/0.2,1-current_java)
            new_java=current_java+add_java
            new_feature_1=round(new_java*100,1)
            #javascript
            add_javascript=min(add/0.3,1-current_javascript)
            new_javascript=current_javascript+add_javascript
            new_feature_2=round(new_javascript*100,1)
            #css
            add_css=min(add/0.3,1-current_css)
            new_css=current_css+add_css
            new_feature_3=round(new_css*100,1)
            #html
            add_html=min(add/0.3,1-current_html)
            new_html=current_html+add_html
            new_feature_4=round(new_html*100,1)  
            #software
            add_software=min(add/0.3,1-current_software)
            new_software=current_software+add_software
            new_feature_5=round(new_software*100,1)
            #cpp
            add_cpp=min(add/0.3,1-current_cpp)
            new_cpp=current_cpp+add_cpp
            new_feature_6=round(new_cpp*100,1)            
            #web
            add_web=min(add/0.3,1-current_web)
            new_web=current_web+add_web
            new_feature_7=round(new_web*100,1)
            
        ## If the candidate asked to decrease his skills ##
        ## For each sub-skill, the value by which the sub-skill must be decreased to change the outcome of the system is computed ##
        ## If the sub-skill by itself cannot be decreased enough, it gets the minimal value possible ##
        ## With this new sub-skill value, the new score of the feature of interest is computed ##       
        if side=='less':
            #java
            add_java=min(add/0.2,current_java)
            new_java=current_java-add_java
            new_feature_1=round(new_java*100,1)
            #javascript
            add_javascript=min(add/0.3,current_javascript)
            new_javascript=current_javascript-add_javascript
            new_feature_2=round(new_javascript*100,1)
            #css
            add_css=min(add/0.3,current_css)
            new_css=current_css-add_css
            new_feature_3=round(new_css*100,1)               
            #html
            add_html=min(add/0.3,current_html)
            new_html=current_html-add_html
            new_feature_4=round(new_html*100,1)
            #software
            add_software=min(add/0.3,current_software)
            new_software=current_software-add_software
            new_feature_5=round(new_software*100,1)
            #cpp
            add_cpp=min(add/0.3,current_cpp)
            new_cpp=current_cpp-add_cpp
            new_feature_6=round(new_cpp*100,1)  
            #web
            add_web=min(add/0.3,current_web)
            new_web=current_web-add_web
            new_feature_7=round(new_web*100,1)
        
        ## The new score for the feature of interest is computed, for each sub-skill ##
        new_feature_1_score=round((new_java*0.2+current_web*0.3+current_cpp*0.3+current_software*0.3+current_html*0.3+current_css*0.3+current_javascript*0.3)*100/range,1)
        new_feature_2_score=round((current_java*0.2+current_web*0.3+current_cpp*0.3+current_software*0.3+current_html*0.3+current_css*0.1+new_javascript*0.3)*100/range,1)
        new_feature_3_score=round((current_java*0.2+current_web*0.3+current_cpp*0.3+current_software*0.3+current_html*0.3+current_javascript*0.3+new_css*0.3)*100/range,1)
        new_feature_4_score=round((new_html*0.3+current_java*0.2+current_web*0.3+current_cpp*0.3+current_software*0.3+current_css*0.3+current_javascript*0.3)*100/range,1)
        new_feature_5_score=round((new_software*0.3+current_java*0.2+current_web*0.3+current_cpp*0.3+current_html*0.3+current_css*0.3+current_javascript*0.3)*100/range,1)
        new_feature_6_score=round((new_cpp*0.3+current_java*0.2+current_web*0.3+current_software*0.3+current_html*0.3+current_css*0.3+current_javascript*0.3)*100/range,1)
        new_feature_7_score=round((new_web*0.3+current_java*0.2+current_cpp*0.3+current_software*0.3+current_html*0.3+current_css*0.3+current_javascript*0.3)*100/range,1)
        
        ## Answers are set up##
        answer1_feature_1='Having the following Java skills:'
        answer1_feature_2='Having the following Javascript skills:'
        answer1_feature_3='Having the following CSS skills:'
        answer1_feature_4='Having the following HTML skills:' 
        answer1_feature_5='Having the following Software Development skills:' 
        answer1_feature_6='Having the following C++ skills:'
        answer1_feature_7='Having the following Web Development skills:'
        answer2='Would give you the following Development profile:'


    elif feature=='Interpersonal Skills':

        ## The current value for each sub-skill is loaded##
        current_teamwork=float(req['feature_1'])
        current_leadership=float(req['feature_2'])
        current_team_building=float(req['feature_3'])
        current_public_speaking=float(req['feature_4'])
        current_writing=float(req['feature_5'])
        current_presentations=float(req['feature_6'])

        ## If the candidate asked to increase his skills ##
        ## For each sub-skill, the value by which the sub-skill must be increased to change the outcome of the system is computed ##
        ## If the sub-skill by itself cannot be increased enough, it gets the maximal value possible ##
        ## With this new sub-skill value, the new score of the feature of interest is computed ##
        if side=='more':
            #teamwork
            add_teamwork=min(add/0.5,1-current_teamwork)
            new_teamwork=current_teamwork+add_teamwork
            new_feature_1=round(new_teamwork*100,1)
            #leadership
            add_leadership=min(add/0.5,1-current_leadership)
            new_leadership=current_leadership+add_leadership
            new_feature_2=round(new_leadership*100,1)
            #team_building
            add_team_building=min(add/0.5,1-current_team_building)
            new_team_building=current_team_building+add_team_building
            new_feature_3=round(new_team_building*100,1)
            #public_speaking
            add_public_speaking=min(add/0.5,1-current_public_speaking)
            new_public_speaking=current_public_speaking+add_public_speaking
            new_feature_4=round(new_public_speaking*100)  
            #writing
            add_writing=min(add/0.5,1-current_writing)
            new_writing=current_writing+add_writing
            new_feature_5=round(new_writing*100,1)
            #presentations
            add_presentations=min(add/0.5,1-current_presentations)
            new_presentations=current_presentations+add_presentations
            new_feature_6=round(new_presentations*100,1)            
            
        ## If the candidate asked to decrease his skills ##
        ## For each sub-skill, the value by which the sub-skill must be decreased to change the outcome of the system is computed ##
        ## If the sub-skill by itself cannot be decreased enough, it gets the minimal value possible ##
        ## With this new sub-skill value, the new score of the feature of interest is computed ##      
        if side=='less':
            #teamwork
            add_teamwork=min(add/0.5,current_teamwork)
            new_teamwork=current_teamwork-add_teamwork
            new_feature_1=round(new_teamwork*100,1)
            #leadership
            add_leadership=min(add/0.5,current_leadership)
            new_leadership=current_leadership-add_leadership
            new_feature_2=round(new_leadership*100,1)
            #team_building
            add_team_building=min(add/0.5,current_team_building)
            new_team_building=current_team_building-add_team_building
            new_feature_3=round(new_team_building*100,1)               
            #public_speaking
            add_public_speaking=min(add/0.5,current_public_speaking)
            new_public_speaking=current_public_speaking-add_public_speaking
            new_feature_4=round(new_public_speaking*100,1)
            #writing
            add_writing=min(add/0.5,current_writing)
            new_writing=current_writing-add_writing
            new_feature_5=round(new_writing*100,1)
            #presentations
            add_presentations=min(add/0.5,current_presentations)
            new_presentations=current_presentations-add_presentations
            new_feature_6=round(new_presentations*100,1)  
            
        ## The new score for the feature of interest is computed, for each sub-skill ##
        new_feature_1_score=round((new_teamwork*0.5+current_presentations*0.5+current_writing*0.5+current_public_speaking*0.5+current_team_building*0.5+current_leadership*0.5)*100/range,1)
        new_feature_2_score=round((current_teamwork*0.5+current_presentations*0.5+current_writing*0.5+current_public_speaking*0.5+current_team_building*0.5+new_leadership*0.5)*100/range,1)
        new_feature_3_score=round((current_teamwork*0.5+current_presentations*0.5+current_writing*0.5+current_public_speaking*0.5+current_leadership*0.5+new_team_building*0.5)*100/range,1)
        new_feature_4_score=round((new_public_speaking*0.5+current_teamwork*0.5+current_presentations*0.5+current_writing*0.5+current_team_building*0.5+current_leadership*0.5)*100/range,1)
        new_feature_5_score=round((new_writing*0.5+current_teamwork*0.5+current_presentations*0.5+current_public_speaking*0.5+current_team_building*0.5+current_leadership*0.5)*100/range,1)
        new_feature_6_score=round((new_presentations*0.5+current_teamwork*0.5+current_writing*0.5+current_public_speaking*0.5+current_team_building*0.5+current_leadership*0.5)*100/range,1)
        
        ## Answers are set up##
        answer1_feature_1='Having the following Teamwork skills:'
        answer1_feature_2='Having the following Leadership skills:'
        answer1_feature_3='Having the following Team Building skills:'
        answer1_feature_4='Having the following Public Speaking skills:' 
        answer1_feature_5='Having the following Writing skills:' 
        answer1_feature_6='Having the following Presentations skills:'
        answer2='Would give you the following Interpersonal Skills profile:'


    elif feature=='Sport':

        ## The current value for each sport is loaded##
        current_rugby=float(req['feature_1'])
        current_football=float(req['feature_2'])
        current_boxing=float(req['feature_3'])
        current_basketball=float(req['feature_4'])
        current_athletism=float(req['feature_5'])
        current_gymnastic=float(req['feature_6'])
        current_other=float(req['feature_7'])

        ## If the candidate asked to increase his sport skills ##
        ## Each sport are set to 1 ##
        if side=='more':
            #rugby
            new_rugby=1
            #football 
            new_football=1
            #boxing
            new_boxing=1
            #basketball
            new_basketball=1
            #athletism
            new_athletism=1
            #gymnastic
            new_gymnastic=1
            #other
            new_other=1

            answer1_feature_1='Practicing Rugby,'
            answer1_feature_2='Practicing Football,'
            answer1_feature_3='Practicing Boxing,'
            answer1_feature_4='Practicing Basketball,' 
            answer1_feature_5='Practicing Athletism,' 
            answer1_feature_6='Practicing Gymnastic,'
            answer1_feature_7='Practicing another sport,'  

        ## If the candidate asked to decrease his sport skills ##
        ## Each sport are set to 0##     
        if side=='less':
            #rugby
            new_rugby=0
            #football 
            new_football=0
            #boxing
            new_boxing=0
            #basketball
            new_basketball=0
            #athletism
            new_athletism=0
            #gymnastic
            new_gymnastic=0
            #other
            new_other=0

            answer1_feature_1='Not practicing Rugby,'
            answer1_feature_2='Not practicing Football,'
            answer1_feature_3='Not practicing Boxing,'
            answer1_feature_4='Not practicing Basketball,' 
            answer1_feature_5='Not practicing Athletism,' 
            answer1_feature_6='Not practicing Gymnastic,'
            answer1_feature_7='Not practicing another sport,' 

        ## The new score for the feature of interest is computed, for each sport ## 
        new_feature_1_score=round((new_rugby*0.4+current_football*0.4+current_boxing*0.4+current_basketball*0.3+current_athletism*0.2+current_gymnastic*0.1+current_other*0.2)*100/range,1)
        new_feature_2_score=round((current_rugby*0.4+new_football*0.4+current_boxing*0.4+current_basketball*0.3+current_athletism*0.2+current_gymnastic*0.1+current_other*0.2)*100/range,1)
        new_feature_3_score=round((current_rugby*0.4+current_football*0.4+new_boxing*0.4+current_basketball*0.3+current_athletism*0.2+current_gymnastic*0.1+current_other*0.2)*100/range,1)
        new_feature_4_score=round((current_rugby*0.4+current_football*0.4+current_boxing*0.4+new_basketball*0.3+current_athletism*0.2+current_gymnastic*0.1+current_other*0.2)*100/range,1)
        new_feature_5_score=round((current_rugby*0.4+current_football*0.4+current_boxing*0.4+current_basketball*0.3+new_athletism*0.2+current_gymnastic*0.1+current_other*0.2)*100/range,1)
        new_feature_6_score=round((current_rugby*0.4+current_football*0.4+current_boxing*0.4+current_basketball*0.3+current_athletism*0.2+new_gymnastic*0.1+current_other*0.2)*100/range,1)
        new_feature_7_score=round((current_rugby*0.4+current_football*0.4+current_boxing*0.4+current_basketball*0.3+current_athletism*0.2+current_gymnastic*0.1+new_other*0.2)*100/range,1)

        ## Answer is set up## 
        answer2='would give the following Sports profile:'


    else:
        new_feature_1='error'
        new_feature_2='error'
        new_feature_3='error'
        new_feature_4='error'
        new_feature_5='error'
        new_feature_6='error'
        new_feature_7='error'
    return new_feature_1,new_feature_1_score,new_feature_2,new_feature_2_score,new_feature_3,new_feature_3_score,new_feature_4,new_feature_4_score,new_feature_5,new_feature_5_score,new_feature_6,new_feature_6_score,new_feature_7,new_feature_7_score,answer1_feature_1,answer1_feature_2,answer1_feature_3, answer1_feature_4, answer1_feature_5, answer1_feature_6, answer1_feature_7, answer2
        




############################################################################################################################################################################



if __name__ == '__main__':
    app.run(host='0.0.0.0')