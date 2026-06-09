now we are going to build API pipeline.

first we need to create prediction service. so here we created `app/services/prediction_service.py`. here we created it as resuable class. so when we call it in `main.py` it loads model once(since it inside `init` and uses model whenever needs to do a prediction)

So next our goal is getting data from user to do a prediction.. so lets dive into it

## Create Schema to get data from user

here we create file `app/schemas/customer_data.py` and here we define what shape of data we are expecting...

**Key points to consider**
- here columns like *Partner* stores **Yes** and **No** as values. but we cant give it type *bool* because our model expects string values and that values will be encoded later...
- Also for now we need exactly all the columns that original dataset had since we dont use generalized model
- We cant ask from user to **engineered features** by us. so they not included in schema.

so using that knowledge we can create schema. but one major point to consider.

Here `SeniorCitizen` col stores values of 1 and 0. so best way for us is get boolean values from user and convert them inside our `main.py`. because when we get bool value from user it stored in pydentic model as `true` or `false`..

1. Frontend sends "SeniorCitizen": true
2. Pydantic stores it as True (Python bool)
3. We convert to DataFrame — value is True
4. our preprocessor sees True

So that is wrong. what we need is 1 and 0 for that column. so we have to convert that bool value to 1 and 0 


```python
input_data["SeniorCitizen"] = input_data["SeniorCitizen"].astype(int)
```

