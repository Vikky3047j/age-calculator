from flask import Flask, render_template, request
from datetime import date

app = Flask(__name__)

def calculate_age(birth_date):
    today = date.today()
    age_years = today.year - birth_date.year
    age_months = today.month - birth_date.month
    age_days = today.day - birth_date.day

    if age_days < 0:
        age_months -= 1
        # Get days in previous month
        prev_month = today.month - 1 if today.month > 1 else 12
        prev_year = today.year if today.month > 1 else today.year - 1
        days_in_prev_month = (date(today.year, today.month, 1) - date(prev_year, prev_month, 1)).days
        age_days += days_in_prev_month

    if age_months < 0:
        age_years -= 1
        age_months += 12

    return age_years, age_months, age_days

@app.route("/", methods=["GET", "POST"])
def index():
    age = None
    if request.method == "POST":
        birth_date_str = request.form.get("birth_date")
        if birth_date_str:
            birth_date = date.fromisoformat(birth_date_str)
            age = calculate_age(birth_date)
    
    return render_template("index.html", age=age)

if __name__ == "__main__":
    app.run(debug=True)
