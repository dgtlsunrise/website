(() => {
  const root = document.documentElement;
  root.classList.add("js");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  const reveal = () => {
    const nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
  };
  reveal();

  const bootDemo = (stage) => {
    const bits = [...stage.querySelectorAll("[data-demo-show]")];
    const counter = stage.querySelector("[data-demo-counter]");
    const replay = stage.querySelector("[data-demo-replay]");
    if (!bits.length) return;

    const max = bits.reduce((n, el) => Math.max(n, Number(el.getAttribute("data-demo-show")) || 0), 0);
    let timer = 0;
    let step = 0;

    const render = (n) => {
      bits.forEach((el) => {
        const s = Number(el.getAttribute("data-demo-show")) || 0;
        el.classList.toggle("is-in", reduce || s <= n);
      });
      if (counter) {
        const cur = String(Math.min(n + 1, max + 1)).padStart(2, "0");
        const tot = String(max + 1).padStart(2, "0");
        counter.textContent = `${cur} / ${tot}`;
      }
    };

    const play = () => {
      window.clearInterval(timer);
      step = 0;
      render(0);
      if (reduce) {
        render(max);
        return;
      }
      timer = window.setInterval(() => {
        step += 1;
        if (step > max) {
          window.clearInterval(timer);
          return;
        }
        render(step);
      }, 1350);
    };

    play();
    if (replay) {
      replay.addEventListener("click", play);
    }
  };

  document.querySelectorAll("[data-demo]").forEach(bootDemo);
})();
