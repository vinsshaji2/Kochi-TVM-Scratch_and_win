from flask import Flask, render_template, jsonify, session, request, redirect, url_for
from rewards import pick_reward
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)


# =========================
# MODULE PAGE (FIRST PAGE)
# =========================
@app.route("/", methods=["GET", "POST"])
def module_page():
    if request.method == "POST":
        module = request.form.get("module", "").strip().lower()

        if not module:
            return render_template("module.html", error="Please select a module")

        session["module"] = module
        session.pop("reward", None)   # reset reward on new module
        return redirect(url_for("scratch_page"))

    return render_template("module.html")


# =========================
# SCRATCH PAGE (SECOND PAGE)
# =========================
@app.route("/scratch", methods=["GET"])
def scratch_page():
    if "module" not in session:
        # User directly accessed scratch page → redirect back
        return redirect(url_for("module_page"))

    return render_template("index.html", module=session["module"])


# =========================
# OPEN BOX API (SCRATCH ACTION)
# =========================
@app.route("/open-box", methods=["POST"])
def open_box():
    if "module" not in session:
        return jsonify({"error": "Module not selected"}), 403

    if session.get("reward"):
        return jsonify({"error": "Already scratched"}), 400

    reward = pick_reward()
    session["reward"] = reward

    return jsonify({"reward": reward})


# =========================
# LOGOUT / RESET (OPTIONAL)
# =========================
@app.route("/reset")
def reset():
    session.clear()
    return redirect(url_for("module_page"))


# =========================
# RUN APP
# =========================
if __name__ == "__main__":
    app.run(debug=True)
