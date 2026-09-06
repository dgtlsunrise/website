(() => {
  const buttons = document.querySelectorAll("[data-copy]");
  buttons.forEach((btn) => {
    const original = btn.textContent;
    btn.addEventListener("click", async () => {
      const node = document.querySelector(btn.getAttribute("data-copy"));
      if (!node) return;
      const text = node.textContent.replace(/\s+$/, "");
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
      } catch {
        const range = document.createRange();
        range.selectNodeContents(node);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        btn.textContent = "Selected";
      }
      window.setTimeout(() => {
        btn.textContent = original;
      }, 1600);
    });
  });
})();
