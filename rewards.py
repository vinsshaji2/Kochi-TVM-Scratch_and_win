import random

REWARDS = [
    {"name": "10% Discount 🎉", "weight": 5},
    {"name": "5% Discount 🔥", "weight": 15},
    {"name": "15% Discount 🔥", "weight": 25},
    {"name": "13% Discount 🔥", "weight": 30},
    {"name": "8% Discount 🎉", "weight": 25},
    {"name": "9% Discount 🎉", "weight": 25},
    {"name": "12% Discount 🎉", "weight": 25},
]

def pick_reward():
    choices = [r["name"] for r in REWARDS]
    weights = [r["weight"] for r in REWARDS]
    return random.choices(choices, weights=weights, k=1)[0]
