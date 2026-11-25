/*
 * APEX main.js — 인트로 이후 일반 사이트 기능 담당.
 * 프로젝트/활동 내용은 데이터 배열로 관리해 HTML을 새로 만들지 않고도
 * 항목을 추가할 수 있도록 한다 (인수인계 문서 25절).
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------
  // 데이터: 새 프로젝트/활동이 생기면 이 배열에만 추가하면 된다.
  // ---------------------------------------------------------------
  const PROJECTS = [
    {
      id: 2,
      title: "Project Title",
      status: "PLANNING",
      meta: "2026 / AI",
      description: "프로젝트 설명을 이곳에 추가하세요.",
      tags: ["PYTHON", "AI"]
    },
    {
      id: 3,
      title: "Project Title",
      status: "PLANNING",
      meta: "2026 / GAME",
      description: "프로젝트 설명을 이곳에 추가하세요.",
      tags: ["C#", "UNITY"]
    }
  ];

  const ACTIVITIES = [
    {
      date: "2026.09",
      category: "CLUB",
      title: "APEX 공식 웹사이트",
      description: "동아리 공식 웹사이트 제작 및 공개"
    },
    {
      date: "2026.08",
      category: "PROJECT",
      title: "Project Exhibition",
      description: "동아리 프로젝트 발표 및 결과 공유"
    },
    {
      date: "2026.07",
      category: "SEMINAR",
      title: "Development Workshop",
      description: "웹 개발 및 Git/GitHub 세미나"
    }
  ];

  function renderProjects() {
    const container = document.getElementById("project-cards");
    if (!container) return;
    container.innerHTML = PROJECTS.map(function (p) {
      return (
        '<article class="project-card">' +
        '<div class="project-image">PROJECT<br>' + String(p.id).padStart(2, "0") + "</div>" +
        '<div class="card-body">' +
        '<span class="meta">' + p.meta + " / " + p.status + "</span>" +
        "<h3>" + p.title + "</h3>" +
        "<p>" + p.description + "</p>" +
        '<div class="tags">' + p.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("") + "</div>" +
        "</div>" +
        "</article>"
      );
    }).join("");
  }

  function renderActivities() {
    const container = document.getElementById("activity-list");
    if (!container) return;
    container.innerHTML = ACTIVITIES.map(function (a) {
      return (
        "<article>" +
        "<time>" + a.date + "</time>" +
        "<div><span class=\"meta\">" + a.category + "</span><h3>" + a.title + "</h3><p>" + a.description + "</p></div>" +
        '<span class="arrow">\u2197</span>' +
        "</article>"
      );
    }).join("");
  }

  function setupMobileMenu() {
    const menu = document.querySelector(".menu");
    const nav = document.querySelector(".nav");
    if (!menu || !nav) return;
    menu.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      menu.textContent = open ? "CLOSE" : "MENU";
      menu.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        menu.textContent = "MENU";
        menu.setAttribute("aria-expanded", "false");
      }
    });
  }

  function setupCurrentProjectToggle() {
    const toggle = document.querySelector(".expand-toggle");
    const details = document.getElementById("current-details");
    if (!toggle || !details) return;
    toggle.addEventListener("click", function () {
      const isOpen = !details.hidden;
      details.hidden = isOpen;
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.textContent = isOpen ? "PROJECT DETAILS \u2192" : "HIDE DETAILS \u2191";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderProjects();
    renderActivities();
    setupMobileMenu();
    setupCurrentProjectToggle();
  });
})();
