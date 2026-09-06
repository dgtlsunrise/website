(() => {
  const copyViaExec = (text) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  };

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const original = btn.textContent;
    const done = (label) => {
      btn.textContent = label;
      window.setTimeout(() => {
        btn.textContent = original;
      }, 1600);
    };

    btn.addEventListener("click", () => {
      const node = document.querySelector(btn.getAttribute("data-copy"));
      if (!node) return;
      const text = node.textContent.replace(/\s+$/, "");

      if (navigator.clipboard && navigator.clipboard.writeText) {
        let settled = false;
        const fallback = () => {
          if (settled) return;
          settled = true;
          done(copyViaExec(text) ? "Copied" : "Selected");
        };
        const timer = window.setTimeout(fallback, 250);
        navigator.clipboard.writeText(text).then(
          () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timer);
            done("Copied");
          },
          fallback
        );
        return;
      }

      done(copyViaExec(text) ? "Copied" : "Selected");
    });
  });
})();
