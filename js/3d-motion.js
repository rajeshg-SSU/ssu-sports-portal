/* ==========================================
   SRI SRI UNIVERSITY - HERO RUNNER CONTROLLER
   Interactive Mouse Hover Parallax for User's Torch Runner
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const runnerWrapper = document.querySelector('.hero-runner-wrapper');
  const runnerImg = document.getElementById('user-torch-runner-img');

  if (!runnerWrapper || !runnerImg) return;

  // Smooth Mouse Hover Parallax Tilt
  window.addEventListener('mousemove', (e) => {
    const rect = runnerWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = (y / (rect.height / 2)) * -5;
    const tiltY = (x / (rect.width / 2)) * 5;

    runnerImg.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.12)`;
  });

  runnerWrapper.addEventListener('mouseleave', () => {
    runnerImg.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.12)';
  });
});
