const stage = document.querySelector('.stage');
const frames = [...stage.querySelectorAll('.frame')];
const steps = [...document.querySelectorAll('.step')];
let activeIndex = 0;
let pending = false;

function updateScene() {
  const target = document.querySelector('.site-header').offsetHeight
    + (window.innerHeight - document.querySelector('.site-header').offsetHeight) / 2;
  const matchingIndex = steps.findIndex((step) => step.getBoundingClientRect().bottom > target);
  const nextIndex = matchingIndex === -1 ? steps.length - 1 : matchingIndex;
  if (nextIndex !== activeIndex) {
    frames[activeIndex].classList.remove('is-current');
    frames[nextIndex].classList.add('is-current');
    activeIndex = nextIndex;
  }
  pending = false;
}

function queueUpdate() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(updateScene);
}

window.addEventListener('scroll', queueUpdate, { passive: true });
window.addEventListener('resize', queueUpdate);
window.addEventListener('pageshow', queueUpdate);
queueUpdate();
