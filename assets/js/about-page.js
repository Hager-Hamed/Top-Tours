(function () {
  const section = document.querySelector('.about-numbers');
  if (!section) return;

  const counters = Array.from(section.querySelectorAll('[data-counter]'));
  if (!counters.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hasStarted = false;

  function setCounterText(element, value) {
    const formatted = Math.round(value).toLocaleString('en-US');
    const textNode = Array.from(element.childNodes).find(function (node) {
      return node.nodeType === Node.TEXT_NODE;
    });
    if (textNode) textNode.nodeValue = formatted;
  }

  function startCounters() {
    if (hasStarted) return;
    hasStarted = true;

    counters.forEach(function (counter) {
      const target = Number(counter.dataset.counter);
      if (reduceMotion) {
        setCounterText(counter, target);
        return;
      }

      const duration = target >= 1000 ? 1800 : 1400;
      const startTime = performance.now();
      setCounterText(counter, 0);

      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCounterText(counter, target * eased);
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  if (!('IntersectionObserver' in window)) {
    startCounters();
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    startCounters();
    observer.disconnect();
  }, { threshold: 0.35 });

  observer.observe(section);
})();
