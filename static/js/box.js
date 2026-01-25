/*********************************
 * GLOBAL STATE (VERCEL SAFE)
 *********************************/

// Always read module from localStorage
//const selectedModule =
//    localStorage.getItem("selectedModule") || "module not selected";

// Global reward state
window.lastRewardText = localStorage.getItem("lastRewardText") || null;


/*********************************
 * HELPER: SAVE REWARD SAFELY
 *********************************/
function setReward(reward) {
    window.lastRewardText = reward;
    localStorage.setItem("lastRewardText", reward);
}


/*********************************
 * OPEN BOX LOGIC
 *********************************/
function openBox(element) {
    const moduleName = localStorage.getItem("selectedModule");
        if (!moduleName) {
            alert("Please select a module before scratching.");
            return;
        }

    // If already opened visually, just show popup
    if (document.querySelector('.opened')) {
        showAlreadyScratchedPopup();
        return;
    }

    fetch('/open-box', { method: 'POST' })
        .then(res => res.json())
        .then(data => {

            /* ✅ FIRST TIME SCRATCH */
            if (data.reward) {
                element.classList.add('opened');

                setReward(data.reward);

                document.getElementById('rewardText').textContent = data.reward;
                document.getElementById('rewardModal').style.display = 'block';

                const result = document.getElementById("result");
                if (result) {
                    result.innerHTML = `<h3>You received: ${data.reward}</h3>`;
                }
            }

            /* 🔁 ALREADY SCRATCHED */
            else if (data.error === "Already scratched") {
                showAlreadyScratchedPopup();
            }

            else if (data.error) {
                alert(data.error);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Something went wrong. Please try again.');
        });
}


/*********************************
 * SHOW POPUP IF ALREADY SCRATCHED
 *********************************/
function showAlreadyScratchedPopup() {
    const savedReward = localStorage.getItem("lastRewardText");

    if (savedReward) {
        setReward(savedReward);
        document.getElementById('rewardText').textContent = savedReward;
    } else {
        document.getElementById('rewardText').textContent =
            "You have already claimed your reward.";
    }

    document.getElementById('rewardModal').style.display = 'block';
}


/*********************************
 * MODAL HANDLING
 *********************************/
function closeModal() {
    document.getElementById('rewardModal').style.display = 'none';
}

// Close modal only when clicking outside modal-content
window.onclick = function (event) {
    const modal = document.getElementById('rewardModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};


/*********************************
 * PRICE LOGIC
 *********************************/
function getBasePrice(module) {
    if (!module) return 1500;

    module = module.toLowerCase();
    if (module.includes("sprechen")) {
        return 2000;
    }
    return 1500;
}


/*********************************
 * WHATSAPP REDIRECT
 *********************************/
function redirectToWhatsApp() {

    const rewardText =
        window.lastRewardText ||
        localStorage.getItem("lastRewardText");

    if (!rewardText) {
        alert("Reward already claimed. Please contact support.");
        return;
    }

    // ✅ ALWAYS read module fresh
    const moduleName = localStorage.getItem("selectedModule");

    if (!moduleName) {
        alert("Module is not selected. Please go back and select a module.");
        return;
    }

    const basePrice = getBasePrice(moduleName);
    let msg = "";

    const percentMatch = rewardText.match(/(\d+)\s*%\s*Discount/i);

    if (percentMatch) {
        const percent = parseInt(percentMatch[1], 10);
        const discountAmount = Math.round(basePrice * percent / 100);
        const finalPrice = basePrice - discountAmount;

        msg =
            `Hey Team, I got ${percent}% Discount for ${moduleName}. ` +
            `The price is ₹${finalPrice}.`;
    } else {
        msg =
            `Hey Team, I got ${rewardText} for ${moduleName}. ` +
            `The base price is ₹${basePrice}.`;
    }

    const academyNumber = "917034942438";
    const url = `https://wa.me/${academyNumber}?text=${encodeURIComponent(msg)}`;

    window.open(url, "_blank");
}

