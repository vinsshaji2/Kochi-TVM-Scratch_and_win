/****************************
 * GLOBAL STATE
 ****************************/

// Always read module from localStorage (Vercel-safe)
const selectedModule =
    localStorage.getItem("selectedModule") || "module not selected";

// Store reward globally for WhatsApp redirect
window.lastRewardText = null;


/****************************
 * OPEN BOX LOGIC
 ****************************/

function openBox(element) {
    // Prevent opening more than one box
    if (document.querySelector('.opened')) return;

    fetch('/open-box', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            if (data.reward) {
                // Mark box as opened
                element.classList.add('opened');

                // Store reward
                window.lastRewardText = data.reward;

                // Update modal text
                document.getElementById('rewardText').textContent = data.reward;

                // Show modal
                document.getElementById('rewardModal').style.display = 'block';

                // Optional display
                const result = document.getElementById("result");
                if (result) {
                    result.innerHTML = `<h3>You received: ${data.reward}</h3>`;
                }
            } else if (data.error) {
                alert(data.error);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Something went wrong. Please try again.');
        });
}


/****************************
 * MODAL HANDLING
 ****************************/

function closeModal() {
    document.getElementById('rewardModal').style.display = 'none';
}

// Close modal ONLY when clicking outside modal-content
window.onclick = function(event) {
    const modal = document.getElementById('rewardModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};


/****************************
 * PRICE LOGIC
 ****************************/

function getBasePrice(module) {
    if (!module) return 1500;

    module = module.toLowerCase();
    if (module.includes("sprechen")) {
        return 2000;
    }
    return 1500;
}


/****************************
 * WHATSAPP REDIRECT
 ****************************/

function redirectToWhatsApp() {
    const rewardText = window.lastRewardText;

    if (!rewardText) {
        alert("Reward not found. Please try again.");
        return;
    }

    const moduleName = selectedModule;
    const basePrice = getBasePrice(moduleName);
    let msg = "";

    // Match "5% Discount", "10% Discount", etc.
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

    const academyNumber = "917034942438"; // 🔴 replace if needed
    const url = `https://wa.me/${academyNumber}?text=${encodeURIComponent(msg)}`;

    window.open(url, "_blank");
}
