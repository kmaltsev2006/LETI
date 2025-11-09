import pandas as pd
from sklearn.impute import KNNImputer

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.model_selection import RandomizedSearchCV


from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from lightgbm import LGBMClassifier
from xgboost import XGBClassifier

import numpy as np



SEED = 42

df_train_base = pd.read_csv('./spaceship-titanic/train.csv')
df_test_base = pd.read_csv('./spaceship-titanic/test.csv')
df_test_base['Transported'] = False

df = pd.concat([df_train_base, df_test_base])
df = df.drop(columns=['PassengerId', 'Name'])

df[['Deck', 'Num', 'Side']] = df['Cabin'].str.split('/', expand=True)
df['Num'] = pd.to_numeric(df['Num'])
df = df.drop(columns=['Cabin'])

imp = KNNImputer()
impute_list = ['Age', 'VIP', 'Num', 'CryoSleep', 'RoomService', 'FoodCourt', 'ShoppingMall', 'Spa', 'VRDeck']
rest_list = list(set(df.columns) - set(impute_list))
df_imputed = pd.DataFrame(imp.fit_transform(df[impute_list]), columns=impute_list)
df_rest = df[rest_list]
df = pd.concat([df_rest.reset_index(drop=True), df_imputed.reset_index(drop=True)], axis=1)

df['Destination'] = df['Destination'].fillna('unknown')
df['Deck'] = df['Deck'].fillna('unknown')
df['Side'] = df['Side'].fillna('unknown')
df['HomePlanet'] = df['HomePlanet'].fillna('unknown')

df = pd.get_dummies(df, columns=['HomePlanet', 'Destination', 'Deck', 'Side'])

def test_model(train, test, model_type, **kwargs):
    x_train, x_test, y_train, y_test = train_test_split(train, test, random_state=SEED, test_size=0.2)    
    model = model_type(**kwargs)
    model.fit(x_train, y_train)
    y_pred = model.predict(x_test)
    return accuracy_score(y_pred, y_test)

df_train, df_test = df[:df_train_base.shape[0]], df[df_train_base.shape[0]:].drop(columns=['Transported'])
x_train = df_train.drop(columns=['Transported'])
y_train = df_train['Transported']


print(f'LogisticRegression: {test_model(x_train, y_train, LogisticRegression, verbose=0)}')
print(f'DecisionTreeClassifier: {test_model(x_train, y_train, DecisionTreeClassifier)}')
print(f'RandomForestClassifier: {test_model(x_train, y_train, RandomForestClassifier, verbose=0)}')
print(f'LGBMClassifier: {test_model(x_train, y_train, LGBMClassifier, verbose=-1)}')
print(f'XGBClassifier: {test_model(x_train, y_train, XGBClassifier)}')


print(test_model(x_train, y_train, LGBMClassifier, num_leaves=20, n_estimators=100, max_depth=3))

p = LGBMClassifier(num_leaves=20, n_estimators=100, max_depth=3)
p.fit(x_train, y_train)
y_pred = p.predict(df_test)
submission = pd.DataFrame({'PassengerId': df_test_base.PassengerId, 'Transported': y_pred})
submission.to_csv('submission.csv', index=False)


model = LGBMClassifier(
    n_jobs=1,
    verbose=0,
    force_row_wise=True
)

param_dist = {
    'n_estimators': np.arange(50, 500, 50),
    'max_depth': np.arange(3, 15),
    'num_leaves': np.arange(20, 150, 10),
}

random_search = RandomizedSearchCV(
    estimator=model,
    param_distributions=param_dist,
    n_iter=1000,
    cv=5,
    n_jobs=-1,
    scoring='accuracy',
    random_state=SEED
)

random_search.fit(x_train, y_train)

print(random_search.best_params_)
print(random_search.best_score_)