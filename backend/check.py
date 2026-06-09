import joblib
pipe = joblib.load('app/models/artifacts/churn_pipeline.pkl')
print(pipe.named_steps.keys())
