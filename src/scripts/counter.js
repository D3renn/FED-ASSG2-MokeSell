// Counter Animation Script
document.addEventListener("DOMContentLoaded", () => {
    const counters = [
      { element: document.getElementById("active-users"), target: 3000 },
      { element: document.getElementById("transactions"), target: 1200 },
      { element: document.getElementById("countries"), target: 5 }
    ];

    const duration = 15000; // 15s
    const interval = 50;
    const steps = duration / interval;

    counters.forEach(counter => {
      let current = 0;
      const increment = counter.target / steps;

      const timer = setInterval(() => {
        current += increment;
        counter.element.textContent = Math.floor(current);

        if (current >= counter.target) {
          counter.element.textContent = counter.target;
          clearInterval(timer);
        }
      }, interval);
    });
  });