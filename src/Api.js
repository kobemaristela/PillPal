class Api {
  constructor() {
    this.token = localStorage.getItem("TOKEN") || null;
  }

  getTokenData() {
    if (this.token === null) throw new Error("missing token");

    const encodedTokenData = this.token.split(".")[1];
    const tokenData = JSON.parse(atob(encodedTokenData));

    return tokenData;
  }

  isLoggedIn() {
    if (this.token === null) return false;
    if (Date.now() / 1000 - this.token <= 0) return false;

    return true;
  }

  async login(username, password) {
    let response = await fetch(`/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    let json = await response.json();
    if (response.ok) {
      this.token = json.data.token;
      localStorage.setItem("TOKEN", this.token);

      return json.data;
    } else {
      throw new Error(json.data.message);
    }
  }

  async register(username, password) {
    let response = await fetch(`/api/login/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    let json = await response.json();
    if (response.ok) {
      this.token = json.data.token;
      localStorage.setItem("TOKEN", this.token);

      return json.data;
    } else {
      throw new Error(json.data.message);
    }
  }
}

const api = new Api();
window.api = api;
export default api;
