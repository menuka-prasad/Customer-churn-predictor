- There is no null values in any column. but in `TotalCharges` column there is hidden empty values as empty strings. we have to address that
- only four numerical columns => SeniorCitizen, tenure, MonthlyCharges, TotalCharges

### Univariate Analysis -  Numerical Columns
- based on statistical data of `Monthly Charges` it seems like it heavily impacts to churn rate
- `tenure` also seems to be impactful, because new customers likely to churn mostly. but older customers are mostly loyal and rarely churns
- 


### Univariate Analysis - categorical columns
- from `Contacts` feature we can clearly see that customers with month-to-month contact are more likely to churn. customers that have long term contacts are very rarely churns.
- In `InternetService` feature Also people use **FiberOptic** is more likely to churn
- customers use **Electronic Check** `PaymentMethod` are more likely to churn. nearly 1:1 ratio.
- People that use internet service, if not gets `onlineSecurity`, then they are also more likely to churn.


### Bivariate Analysis


## Most important relationships found
- Month-toMonth customers churn heavily. (based on `Contacts` feature)
- if customer uses `internetService` it is better they get `onlineSecurity` since if they not get it they are more likely to churn.
- it is same for `TechSupport`. so simply if customer use `InternetService` then they expect `onlineSecurity`, `onlineBackup` and `TechSupport`. if not they most probably not satisfy and likely to churn...
- New Customers tend to churn frequently. So there is problem with onboarding or how to treat new customers.
- Long tenure customers rarely churns
- customers that use **Fiber Optic** churns more
- customers use **Electronic Check** `PaymentMethod` are more likely to churn. nearly 1:1 ratio.




### Most important features 
- tenure
- monthlyCharges
- Contract
- internetService
- onlineSecurity, techSupport, onlinebackup, DeviceProtection (if they get internetService they expect these features, else they likely to churn)
- payment Method
- PaperlessBilling

### least important features(as for inspection, but maybe useful for model. so further validation required)
- gender (even distribution)
- partner
- StreamingTV
- StreamingMovies