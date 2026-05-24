- There is no null values in any column. but in `MonthlyCharges` column there is hidden empty values as empty strings. we have to address that
- only three numerical columns => SeniorCitizen, tenure, MonthlyCharges

### About Numerical Columns
- Most of the citizens are not Senior Citizens since mean is nearly zero. So most probably this column will not impact to Churn results.
- based on statistical data of `Monthly Charges` it seems like it heavily impacts to churn rate
- `tenure` also seems to be impactful