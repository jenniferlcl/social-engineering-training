(function () {
  const deck = window.TRAINING_DECK;
  const slides = deck.slides;
  let current = readIndexFromHash();

  const shell = document.getElementById("slideShell");
  const toc = document.getElementById("toc");
  const counter = document.getElementById("counter");
  const progressBar = document.getElementById("progressBar");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const speakerMode = document.getElementById("speakerMode");
  const notesLayoutToggle = document.getElementById("notesLayoutToggle");
  const notesPanel = document.getElementById("notesPanel");
  const menuButton = document.getElementById("menuButton");
  const overviewButton = document.getElementById("overviewButton");
  const printButton = document.getElementById("printButton");
  const overviewDialog = document.getElementById("overviewDialog");
  const overviewGrid = document.getElementById("overviewGrid");
  const closeOverview = document.getElementById("closeOverview");
  let notesLayout = "side";

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function readIndexFromHash() {
    const raw = window.location.hash.replace("#", "");
    const match = raw.match(/^slide-(\d+)$/);
    if (!match) return 0;
    const index = Number(match[1]) - 1;
    return Math.max(0, Math.min(slides.length - 1, index));
  }

  function setHash(index) {
    const nextHash = `#slide-${String(index + 1).padStart(2, "0")}`;
    if (window.location.hash !== nextHash) {
      history.replaceState(null, "", nextHash);
    }
  }

  function slideHeader(slide) {
    return `
      <header class="slide-header">
        <div class="slide-section">SOCIAL ENGINEERING READINESS</div>
        <h2 class="slide-title">${escapeHtml(slide.title)}</h2>
      </header>
    `;
  }

  function bullets(items) {
    return `<ul class="bullets">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function notes(slide) {
    return "";
  }

  function renderNotesPanel(slide) {
    const noteLines = slide.notes || [];
    notesPanel.innerHTML = `
      <div class="notes-panel-header">
        <span>講者備忘錄</span>
        <strong>${escapeHtml(slide.title)}</strong>
      </div>
      <div class="notes-panel-body">
        ${noteLines.length
          ? noteLines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")
          : "<p>本頁沒有備忘錄。</p>"}
      </div>
    `;
  }

  function footer(index) {
    return `<div class="slide-footer">${String(index + 1).padStart(2, "0")} / ${slides.length}</div>`;
  }

  function renderCover(slide, index) {
    return `
      <article class="slide k-cover">
        <section class="cover-main">
          <div class="slide-section">${escapeHtml(slide.kicker)}</div>
          <h2 class="slide-title">${escapeHtml(slide.title)}</h2>
          <p>${escapeHtml(slide.subtitle)}</p>
        </section>
        <aside class="cover-panel">
          <div>
            <strong>STOP<br>VERIFY<br>REPORT</strong>
            <span>停・查・報</span>
          </div>
        </aside>
        <div class="cover-footer">${escapeHtml(slide.footer)}</div>
        ${notes(slide)}
      </article>
    `;
  }

  function renderAgenda(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body cards-3">
          ${slide.items.map(([title, body], i) => `
            <div class="card">
              <div class="card-number">0${i + 1}</div>
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(body)}</p>
            </div>
          `).join("")}
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  function renderStatement(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body statement">
          <div class="statement-copy">${escapeHtml(slide.body)}</div>
          <div class="stack">${slide.side.map((item) => `<div class="tag">${escapeHtml(item)}</div>`).join("")}</div>
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  function renderMetrics(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body metrics-layout">
          <div class="cards-3">
            ${slide.metrics.map(([big, title, body]) => `
              <div class="metric">
                <strong>${escapeHtml(big)}</strong>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(body)}</p>
              </div>
            `).join("")}
          </div>
          <div class="threat-dashboard" aria-label="威脅趨勢示意圖">
            <div class="dashboard-title">攻擊壓力集中在人的決策瞬間</div>
            <div class="dashboard-flow">
              <span>訊息</span>
              <span>信任</span>
              <span>行動</span>
              <strong>風險</strong>
            </div>
            <div class="dashboard-bars">
              <i style="height: 42%"></i>
              <i style="height: 66%"></i>
              <i style="height: 82%"></i>
              <i style="height: 58%"></i>
              <i style="height: 76%"></i>
            </div>
          </div>
        </section>
        <p class="slide-footer">${escapeHtml(slide.foot)}</p>
        ${notes(slide)}
      </article>
    `;
  }

  function renderReportStats(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body report-grid">
          ${slide.stats.map((stat) => `
            <div class="report-stat">
              <div class="stat-source">${escapeHtml(stat.source)}</div>
              <strong>${escapeHtml(stat.value)}</strong>
              <h3>${escapeHtml(stat.label)}</h3>
              <p>${escapeHtml(stat.detail)}</p>
              <div class="stat-bar"><span style="width: ${Number(stat.level) || 0}%"></span></div>
            </div>
          `).join("")}
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  function renderProcess(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body timeline">
          ${slide.steps.map(([num, title, body]) => `
            <div class="step">
              <div class="step-num">${escapeHtml(num)}</div>
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(body)}</p>
            </div>
          `).join("")}
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  function renderTwoCol(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body columns">
          <div class="column soft">
            <h3>${escapeHtml(slide.leftTitle)}</h3>
            ${bullets(slide.left)}
          </div>
          <div class="column">
            <h3>${escapeHtml(slide.rightTitle)}</h3>
            ${bullets(slide.right)}
          </div>
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  function renderTaxonomy(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body cards-3">
          ${slide.cards.map(([title, body], i) => `
            <div class="card ${i === 0 ? "dark" : ""}">
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(body)}</p>
            </div>
          `).join("")}
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  function renderScenarioArt(slide) {
    if (slide.image) {
      return `
        <figure class="scenario-illustration scenario-art">
          <img src="${escapeHtml(slide.image)}" alt="${escapeHtml(slide.title)}情境插圖">
        </figure>
      `;
    }
    const type = slide.visual;
    const art = {
      invoice: `
        <div class="scenario-art mail-art" aria-label="供應商改帳郵件示意">
          <div class="mail-top"><span></span><span></span><span></span></div>
          <div class="mail-subject">Bank account update</div>
          <div class="mail-line wide"></div>
          <div class="mail-line"></div>
          <div class="fake-button">匯款資料</div>
          <div class="warning-strip">改帳 + 限時 + 新電話</div>
        </div>
      `,
      login: `
        <div class="scenario-art login-art" aria-label="假登入頁示意">
          <div class="login-logo">365</div>
          <div class="login-input"></div>
          <div class="login-input short"></div>
          <div class="login-button">Sign in</div>
          <div class="fake-url">microsoft-login.example</div>
        </div>
      `,
      phone: `
        <div class="scenario-art phone-art" aria-label="電話要求 MFA code 示意">
          <div class="phone-body">
            <div class="phone-speaker"></div>
            <div class="phone-bubble">請唸出驗證碼</div>
            <div class="mfa-code">482 901</div>
            <div class="phone-actions"><span></span><span></span></div>
          </div>
        </div>
      `,
      qr: `
        <div class="scenario-art qr-art" aria-label="QR code 釣魚示意">
          <div class="qr-grid">
            ${Array.from({ length: 49 }, (_, i) => `<span class="${i % 3 === 0 || i === 8 || i === 40 ? "dark" : ""}"></span>`).join("")}
          </div>
          <div class="fake-url">login.company-secure.example</div>
          <div class="warning-strip">掃碼後先看網址</div>
        </div>
      `,
    };
    return art[type] || "";
  }

  function renderScenario(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body scenario scenario-visual">
          ${renderScenarioArt(slide)}
          <div class="scenario-content">
            <div class="scenario-box">
            <div class="label">情境</div>
            <div class="scenario-text">${escapeHtml(slide.setup)}</div>
            <div class="action">建議動作：${escapeHtml(slide.action)}</div>
            </div>
            <div class="scenario-side">
            <h3>紅旗訊號</h3>
            ${bullets(slide.redFlags)}
            </div>
          </div>
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  function renderChecklist(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body">
          ${bullets(slide.items)}
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  function renderDosDonts(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body columns">
          <div class="column">
            <h3 style="color: var(--green)">要做</h3>
            ${bullets(slide.dos)}
          </div>
          <div class="column soft">
            <h3 style="color: var(--accent)">不要做</h3>
            ${bullets(slide.donts)}
          </div>
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  function renderRoleTable(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body">
          <table class="table">
            <thead><tr><th>角色</th><th>常見攻擊</th><th>防護重點</th></tr></thead>
            <tbody>
              ${slide.rows.map((row) => `
                <tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>
              `).join("")}
            </tbody>
          </table>
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  function renderPolicySummary(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body cards-${slide.items.length === 3 ? "3" : "4"}">
          ${slide.items.map(([title, body], i) => `
            <div class="card ${i === 0 ? "dark" : ""}">
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(body)}</p>
            </div>
          `).join("")}
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  function renderExercise(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body scenario">
          <div>
            <div class="label">題目</div>
            <p class="exercise-question">${escapeHtml(slide.question)}</p>
            <div class="options">${slide.options.map((option) => `<div class="option">${escapeHtml(option)}</div>`).join("")}</div>
          </div>
          <div class="answer-box">${escapeHtml(slide.answer)}</div>
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  function renderMeasure(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body">
          <div class="stack">
            ${slide.bars.map(([label, value]) => `
              <div class="bar-row">
                <div class="bar-label">${escapeHtml(label)}</div>
                <div class="bar-track"><div class="bar-fill" style="width: ${value}%"></div></div>
                <div class="bar-value">${value}</div>
              </div>
            `).join("")}
          </div>
          <p class="card p">建議追蹤正向行為：通報越快，事件可控性越高。</p>
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  function renderSources(slide, index) {
    return `
      <article class="slide">
        ${slideHeader(slide)}
        <section class="slide-body columns">
          <div>
            <h3>外部參考</h3>
            ${bullets(slide.sources)}
          </div>
          <div>
            <h3 style="color: var(--teal)">建議後續補強</h3>
            ${bullets(slide.next)}
          </div>
        </section>
        ${notes(slide)}
        ${footer(index)}
      </article>
    `;
  }

  const renderers = {
    cover: renderCover,
    agenda: renderAgenda,
    statement: renderStatement,
    metrics: renderMetrics,
    reportStats: renderReportStats,
    process: renderProcess,
    twoCol: renderTwoCol,
    taxonomy: renderTaxonomy,
    scenario: renderScenario,
    checklist: renderChecklist,
    dosdonts: renderDosDonts,
    roleTable: renderRoleTable,
    policy: renderPolicySummary,
    summary: renderPolicySummary,
    exercise: renderExercise,
    measure: renderMeasure,
    sources: renderSources,
  };

  function render() {
    const slide = slides[current];
    const renderer = renderers[slide.type] || renderChecklist;
    shell.innerHTML = renderer(slide, current);
    renderNotesPanel(slide);
    document.body.classList.toggle("speaker-enabled", speakerMode.checked);
    document.body.dataset.notesLayout = notesLayout;
    counter.textContent = `${current + 1} / ${slides.length}`;
    progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
    prevButton.disabled = current === 0;
    nextButton.disabled = current === slides.length - 1;
    setHash(current);
    syncToc();
  }

  function syncToc() {
    for (const button of toc.querySelectorAll("button")) {
      button.classList.toggle("active", Number(button.dataset.index) === current);
    }
  }

  function go(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    render();
  }

  function buildToc() {
    toc.innerHTML = slides.map((slide, index) => `
      <button type="button" data-index="${index}">
        <span class="toc-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="toc-title">${escapeHtml(slide.title)}</span>
      </button>
    `).join("");
    toc.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-index]");
      if (!button) return;
      go(Number(button.dataset.index));
      document.body.classList.remove("sidebar-open");
    });
  }

  function buildOverview() {
    overviewGrid.innerHTML = slides.map((slide, index) => `
      <button type="button" class="overview-card" data-index="${index}">
        <strong>${String(index + 1).padStart(2, "0")}</strong>
        <span>${escapeHtml(slide.title)}</span>
      </button>
    `).join("");
    overviewGrid.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-index]");
      if (!button) return;
      overviewDialog.close();
      go(Number(button.dataset.index));
    });
  }

  prevButton.addEventListener("click", () => go(current - 1));
  nextButton.addEventListener("click", () => go(current + 1));
  speakerMode.addEventListener("change", render);
  notesLayoutToggle.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-notes-layout]");
    if (!button) return;
    notesLayout = button.dataset.notesLayout;
    for (const item of notesLayoutToggle.querySelectorAll("button")) {
      item.classList.toggle("active", item === button);
    }
    render();
  });
  menuButton.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 980px)").matches) {
      document.body.classList.toggle("sidebar-open");
    } else {
      document.body.classList.toggle("sidebar-collapsed");
    }
  });
  overviewButton.addEventListener("click", () => overviewDialog.showModal());
  closeOverview.addEventListener("click", () => overviewDialog.close());
  printButton.addEventListener("click", () => window.print());
  window.addEventListener("hashchange", () => go(readIndexFromHash()));
  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      go(current + 1);
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      go(current - 1);
    }
    if (event.key.toLowerCase() === "s") {
      speakerMode.checked = !speakerMode.checked;
      render();
    }
    if (event.key.toLowerCase() === "o") {
      overviewDialog.showModal();
    }
  });

  buildToc();
  buildOverview();
  render();
})();
