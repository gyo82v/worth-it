FEATURES:
- quick job evaluation
- advance job evaluation, includes all expenses, all hours(travel..), etc..
- database: the user can save each week/month/year job evaluation,
  the same job can have a different earning each month;
  evaluate if the current job is improving or not
- database: save past jobs evaluation results;
- job comparison


POSSIBLE APP FEATURES:
- lightmode/darkmode;
- multiple languages;
- compare the  hourly earning with the country average, or position average
- add user preferences, like for example a user put money  as most important or career growth;


EVALUATION:
1 hourly earnings: 
- total income from the job including bonuses, food free?, or other, after taxes;
- total expenses related to this job like travel, food, equipment etc..
- total time spent of this job, including actual work hours, travel time, time spent at home working etc...
result : (income - expenses) / time;
this should be per salary, that can be usually monthly or weekly

2 learning/useful for future jobs:
- learning new skills;
- need the job for credits;
- need the job for the curriculum;
- possibility to meet new people for a career growth

3 satisfaction:
- friendly colleagues;
- friendly management;
- work-life balance;
- work stress

4 extras(not sure here)
- paid holidays;
- maternity;
- have to move away from home
- any other bonus/malus;

final result: we can have a total result and each section result, for example
earnings: 80/100; 4 stars;
learning: 50/100; 2,5 stars;
satisfaction: 80/100, for starts;
result: the total of the three combined;


JOB COMPARISON :

Current Job
★★★★☆

Offer A
★★★★★

Offer B
★★☆☆☆

Recommendation

Offer A gives:

+18% higher real earnings
+40% career growth
−10% work-life balance

Overall:
Offer A is the best long-term choice.

ISSUES:
- how to handle the database if i reach the limit of free users ? 
  add advertisement or make the database part of the app paid and the job evaluator free ?
- how and where to get the data to compare the hourly earning ?
- add two different evaluations: one very quick for new user that want a fast result not inster every 
  expenses and time. one advanced thta will give more accurate results;

Monetization

Free
Unlimited calculations
Save the latest few evaluations
Quick mode
Advanced mode

Premium (future)
Unlimited history
Charts
Multiple job comparison
Export PDF
Cloud sync
AI insights


APP STRUCTURE:
- first tab: user can choose quick or advanced evaluation;
- Quick evaluation tab: user can do quick evaluation;
- Advanced evaluation tab: user can do advanced evaluation;
- result tab: the user see the result and can save it;maybe here a modal is 
  better than an entire tab;
- History tab: here the user can check all the saved past job results;
- create user/sign in user tab: here user can create a new account or log in.
  this is not mandatory for just the evaluation but only to access database feature;
- multiple job comparison tab: the user can compare  different jobs
- user preferences tabs: here the user can modify his preferences;


Navigation flow
Home
├── Quick Evaluation
│   └── Result
│       └── Save
│
└── Advanced Evaluation
    └── Result
        └── Save

History
├── Evaluation Details
└── Edit Evaluation

Compare
└── Comparison Result

Profile
├── Sign In
├── Register
├── Preferences
└── Settings
