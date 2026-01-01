// for login, register and assignment
*/
(function () {
  "use strict";

  const KEYS = {
    USERS: "sat_users_v1",
    CURRENT_USER: "sat_current_user_v1",
    ASSIGNMENTS: "assignments" 
  };

  function safeJsonParse(str, fallback) {
    try {
      const v = JSON.parse(str);
      return (v === null || v === undefined) ? fallback : v;
    } catch {
      return fallback;
    }
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

 // user
  function getUsers() {
    return safeJsonParse(localStorage.getItem(KEYS.USERS), []);
  }

  function saveUsers(users) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }

  function getCurrentUser() {
    return localStorage.getItem(KEYS.CURRENT_USER);
  }

  function setCurrentUser(username) {
    localStorage.setItem(KEYS.CURRENT_USER, username);
  }

  function clearCurrentUser() {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }

  function validateLogin(username, password) {
    const u = String(username || "").trim();
    const p = String(password || "");

    // check registered users
    const users = getUsers();
    const found = users.find(x => x.username === u && x.password === p);
    if (found) return { ok: true, username: found.username, name: found.name || found.username };

    return { ok: false };
  }

  function login(username, password) {
    const result = validateLogin(username, password);
    if (!result.ok) return { ok: false };
    setCurrentUser(result.username);
    return { ok: true, username: result.username, name: result.name };
  }

  function logout() {
    clearCurrentUser();
    // keep assignments, users in browser storage
    window.location.href = "index.html";
  }

  function requireAuth() {
    if (!getCurrentUser()) {
      window.location.href = "index.html";
    }
  }

  function setGreeting() {
    const el = document.getElementById("greeting");
    if (!el) return;
    const u = getCurrentUser();
    el.textContent = u ? `Hello, ${u} 👋` : "Hello 👋";
  }

  function setYear() {
    document.querySelectorAll(".js-year").forEach(el => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  // assignment
  function getAssignments() {
    return safeJsonParse(localStorage.getItem(KEYS.ASSIGNMENTS), []);
  }

  function saveAssignments(items) {
    localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(items));
  }

  function getStatusCounts(items) {
    const counts = { notStarted: 0, inProgress: 0, done: 0 };
    for (const it of items) {
      const s = (it.status || "").toLowerCase();
      if (s === "done") counts.done++;
      else if (s === "in progress" || s === "in-progress") counts.inProgress++;
      else counts.notStarted++;
    }
    return counts;
  }

  function wireCommonUi() {
    // greeting and year
    setGreeting();
    setYear();

    // logout button 
    const btn = document.getElementById("logoutBtn");
    if (btn) btn.addEventListener("click", logout);
  }

  document.addEventListener("DOMContentLoaded", wireCommonUi);

  window.SAT = {
    KEYS,
    uid,
    escapeHtml,
    // users
    getUsers,
    saveUsers,
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    validateLogin,
    login,
    logout,
    requireAuth,
    setGreeting,
    // assignments
    getAssignments,
    saveAssignments,
    getStatusCounts
  };
})();
