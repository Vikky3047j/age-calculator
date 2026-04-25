document.addEventListener("DOMContentLoaded", () => {
    const dobInput = document.getElementById("dob");
    const calculateBtn = document.getElementById("calculateBtn");
    const yearsDisplay = document.getElementById("years");
    const monthsDisplay = document.getElementById("months");
    const daysDisplay = document.getElementById("days");
    const errorMsg = document.getElementById("error-message");
    const extraInfo = document.getElementById("extra-info");
    const resultBoxes = document.querySelectorAll(".result-box");

    // Prevent selecting a future date by setting max properly
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dobInput.max = `${yyyy}-${mm}-${dd}`;

    calculateBtn.addEventListener("click", () => {
        const dobValue = dobInput.value;
        
        if (!dobValue) {
            showError("Please select your date of birth.");
            return;
        }

        const dob = new Date(dobValue);
        const todayAtMidnight = new Date();
        todayAtMidnight.setHours(0,0,0,0);
        
        if (dob > todayAtMidnight) {
            showError("Date of birth cannot be in the future!");
            return;
        }

        clearError();
        calculateAge(dob);
    });

    function calculateAge(dob) {
        let birthYear = dob.getFullYear();
        let birthMonth = dob.getMonth();
        let birthDate = dob.getDate();

        let currentYear = today.getFullYear();
        let currentMonth = today.getMonth();
        let currentDate = today.getDate();

        let ageYears = currentYear - birthYear;
        let ageMonths, ageDays;

        // Calculate months
        if (currentMonth >= birthMonth) {
            ageMonths = currentMonth - birthMonth;
        } else {
            ageYears--;
            ageMonths = 12 + currentMonth - birthMonth;
        }

        // Calculate days
        if (currentDate >= birthDate) {
            ageDays = currentDate - birthDate;
        } else {
            ageMonths--;
            let previousMonthDays = getDaysInMonth(currentYear, currentMonth);
            ageDays = previousMonthDays + currentDate - birthDate;

            // Handle condition if traversing backwards reduces months below 0
            if (ageMonths < 0) {
                ageMonths = 11;
                ageYears--;
            }
        }

        animateNumber(yearsDisplay, ageYears);
        animateNumber(monthsDisplay, ageMonths);
        animateNumber(daysDisplay, ageDays);

        animateBoxes();
        
        // Calculate total days alive
        const diffTime = Math.abs(today - dob);
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Calculate days until next birthday
        let nextBirthday = new Date(currentYear, birthMonth, birthDate);
        if(today > nextBirthday && (today.getMonth() !== birthMonth || today.getDate() !== birthDate)) {
            nextBirthday.setFullYear(currentYear + 1);
        }
        
        const isBirthdayToday = today.getMonth() === birthMonth && today.getDate() === birthDate;

        setTimeout(() => {
            if(isBirthdayToday) {
                extraInfo.innerHTML = `You have been alive for approx <b>${totalDays.toLocaleString()}</b> days.<br> 🎉 HAPPY BIRTHDAY! 🎉`;
            } else {
                const diffDaysNextBirthday = Math.ceil(Math.abs(nextBirthday - today) / (1000 * 60 * 60 * 24));
                extraInfo.innerHTML = `You have been alive for approx <b>${totalDays.toLocaleString()}</b> days.<br> Your next birthday is in <b>${diffDaysNextBirthday}</b> days! 🎉`;
            }
            extraInfo.classList.add("show");
        }, 800); // Trigger after numbers are mostly animated
    }

    function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.add("show");
        // Reset display
        yearsDisplay.textContent = "-";
        monthsDisplay.textContent = "-";
        daysDisplay.textContent = "-";
        extraInfo.classList.remove("show");
    }

    function clearError() {
        errorMsg.classList.remove("show");
        extraInfo.classList.remove("show");
    }

    // Number counting animation
    function animateNumber(element, finalNum) {
        let currentNum = 0;
        const duration = 800; // ms
        const stepTime = 16;  // ~60fps
        const steps = duration / stepTime;
        const increment = finalNum / steps;

        element.textContent = "0";
        if (finalNum === 0) return;

        const timer = setInterval(() => {
            currentNum += increment;
            if (currentNum >= finalNum) {
                element.textContent = finalNum;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentNum);
            }
        }, stepTime);
    }

    // Box popping animation
    function animateBoxes() {
        resultBoxes.forEach((box, index) => {
            setTimeout(() => {
                box.classList.add("pop");
                setTimeout(() => {
                    box.classList.remove("pop");
                }, 300); // Pop duration matched in CSS
            }, index * 150 + 700); // Stagger animations
        });
    }
});
