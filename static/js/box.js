function openBox(element) {
    // Prevent opening more than one box
    if (document.querySelector('.opened')) return;

    fetch('/open-box', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            if (data.reward) {
                // Mark box as opened
                element.classList.add('opened');

                // Set reward text
                document.getElementById('rewardText').textContent = data.reward;

                // Store reward for WhatsApp redirect
                window.lastRewardText = data.reward;

                // Show modal
                document.getElementById('rewardModal').style.display = 'block';

                // Optional result display
                document.getElementById("result").innerHTML =
                    `<h3>You received: ${data.reward}</h3>`;
            } else if (data.error) {
                alert(data.error);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Something went wrong. Please try again.');
        });
}


function closeModal() {
    document.getElementById('rewardModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('rewardModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

function redirectToWhatsApp() {
    const rewardText = window.lastRewardText;
    if (!rewardText) return;

    const moduleName = selectedModule;
    const basePrice = getBasePrice(moduleName);

    let msg = "";

    // ✅ Match "5% Discount", "10% Discount", etc.
    const percentMatch = rewardText.match(/(\d+)\s*%\s*Discount/i);

    if (percentMatch) {
        const percent = parseInt(percentMatch[1], 10);
        const discountAmount = Math.round(basePrice * percent / 100);
        const finalPrice = basePrice - discountAmount;

        msg =
          `Hey Team, I got ${percent}% Discount for ${moduleName}. ` +
          `The price is ₹${finalPrice}.`;
    }
    else {
        // Non-discount rewards
        msg =
          `Hey Team, I got ${rewardText} for ${moduleName}. ` +
          `The base price is ₹${basePrice}.`;
    }

    const academyNumber = "917034942438"; // change if needed
    const url = `https://wa.me/${academyNumber}?text=${encodeURIComponent(msg)}`;

    window.open(url, "_blank");
}



function getBasePrice(module) {
    if (!module) return 1500;

    module = module.toLowerCase();
    if (module.includes("sprechen")) {
        return 2000;
    }
    return 1500;
}

