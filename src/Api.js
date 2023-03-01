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
    if (this.token === null || this.token === undefined) return false;

    let tokenData = this.getTokenData();
    let exp = tokenData.exp;
    if (exp === null || exp === undefined) return false;
    if (exp - Date.now() / 1000 <= 0) return false;

    return true;
  }

  logout() {
    localStorage.removeItem("TOKEN");
    this.token = null;
  }

  async login(username, password) {
    let response = await fetch(`api/login`, {
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
    let response = await fetch(`api/login/register`, {
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

  async createMedication(name, description) {
    if (!this.isLoggedIn()) throw new Error("not logged in");

    let response = await fetch(`api/medication`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    });

    let json = await response.json();
    if (response.ok) {
      return json.data;
    } else {
      throw new Error(json.data.message);
    }
  }

  async getMedication() {
    if (!this.isLoggedIn()) throw new Error("not logged in");

    let response = await fetch(`api/medication`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });

    let json = await response.json();
    if (response.ok) {
      return json.data;
    } else {
      throw new Error(json.data.message);
    }
  }

  async updateMedication(medicationId, options) {
    if (!this.isLoggedIn()) throw new Error("not logged in");

    let response = await fetch(`api/medication/${medicationId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    let json = await response.json();
    if (response.ok) {
      return json.data;
    } else {
      throw new Error(json.data.message);
    }
  }

  async deleteMedication(id) {
    if (!this.isLoggedIn()) throw new Error("not logged in");

    let response = await fetch(`api/medication/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });

    let json = await response.json();
    if (response.ok) {
      return json.data;
    } else {
      throw new Error(json.data.message);
    }
  }

  async createMedicationSchedule(medicationId, hourOfDay, dayOfWeek) {
    if (!this.isLoggedIn()) throw new Error("not logged in");
    let response = await fetch(`api/medication/schedule`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ medicationId, hourOfDay, dayOfWeek }),
    });

    let json = await response.json();
    if (response.ok) {
      return json.data;
    } else {
      throw new Error(json.data.message);
    }
  }

  async getMedicationSchedules(medicationId) {
    if (!this.isLoggedIn()) throw new Error("not logged in");
    let response = await fetch(`api/medication/${medicationId}/schedule`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });

    let json = await response.json();
    if (response.ok) {
      return json.data;
    } else {
      throw new Error(json.data.message);
    }
  }

  async deleteMedicationSchedule(medicationId, scheduleId) {
    if (!this.isLoggedIn()) throw new Error("not logged in");
    let response = await fetch(
      `api/medication/${medicationId}/schedule/${scheduleId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    let json = await response.json();
    if (response.ok) {
      return json.data;
    } else {
      throw new Error(json.data.message);
    }
  }

  async updateMedicationSchedule(medicationId, scheduleId, options) {
    if (!this.isLoggedIn()) throw new Error("not logged in");
    let response = await fetch(
      `api/medication/${medicationId}/schedule/${scheduleId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      }
    );

    let json = await response.json();
    if (response.ok) {
      return json.data;
    } else {
      throw new Error(json.data.message);
    }
  }

  async createMedicationAdministration(medicationId, timestamp, status) {
    if (!this.isLoggedIn()) throw new Error("not logged in");
    let response = await fetch(
      `api/medication/${medicationId}/administration`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timestamp, status }),
      }
    );

    let json = await response.json();
    if (response.ok) {
      return json.data;
    } else {
      throw new Error(json.data.message);
    }
  }

  async getMedicationAdministrations() {
    if (!this.isLoggedIn()) throw new Error("not logged in");
    let response = await fetch(`api/medication/administration`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });

    let json = await response.json();
    if (response.ok) {
      return json.data;
    } else {
      throw new Error(json.data.message);
    }
  }
}

const api = new Api();
window.api = api;
export default api;
