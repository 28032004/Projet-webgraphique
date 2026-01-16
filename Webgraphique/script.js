const track = document.getElementById('horizontal-track');
const bgMap = document.querySelector('.fixed-background-map');
const originalScreens = document.querySelectorAll('.screen'); 
const navLinks = document.querySelectorAll('.fixed-nav a');
const tableZone = document.querySelector('.table-side');

const totalSteps = originalScreens.length; 
let currentStep = 0; 
let isScrolling = false;
let isHoveringTable = false;
const firstSlideClone = originalScreens[0].cloneNode(true);
track.appendChild(firstSlideClone);

if (tableZone) {
    tableZone.addEventListener('mouseenter', () => isHoveringTable = true);
    tableZone.addEventListener('mouseleave', () => isHoveringTable = false);
}

navLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); 
        track.style.transition = 'transform 1.2s ease-in-out';
        if (index === 0) currentStep = 0;
        else if (index === 1) currentStep = 8;
        else if (index === 2) currentStep = totalSteps - 1;
        updateView();
    });
});

function updateView() {
    const translateValue = currentStep * -100;
    track.style.transform = `translateX(${translateValue}vw)`;
    bgMap.classList.remove('home-mode');

    if (currentStep === 0) {
        bgMap.classList.add('home-mode');
        bgMap.style.opacity = ''; 
    } 

    else if (currentStep < 8) {
        bgMap.style.opacity = '0.2';
    } 
  
    else if (currentStep === totalSteps - 1) {
        bgMap.style.opacity = '0.2';
    }
   
    else {
        bgMap.style.opacity = '0';
    }

    navLinks.forEach(link => link.classList.remove('active-link'));
    if (currentStep < 8) {
        navLinks[0].classList.add('active-link'); /* Contexte */
    } else if (currentStep < totalSteps - 1) {
        navLinks[1].classList.add('active-link'); /* Graphiques */
    } else {
        navLinks[2].classList.add('active-link'); /* Sources */
    }

    originalScreens.forEach((screen, index) => {
        if (index === currentStep) {
            screen.classList.add('active-screen');
        } else {
            screen.classList.remove('active-screen');
        }
    });
}

window.addEventListener('wheel', (event) => {
    if (isScrolling) return;
    if (isHoveringTable) return; 
    if (Math.abs(event.deltaY) < 15) return;
    const direction = event.deltaY > 0 ? 1 : -1;
    
    if (currentStep === totalSteps - 1 && direction === 1) {
        isScrolling = true;
        track.style.transition = 'transform 1.2s ease-in-out';
        track.style.transform = `translateX(-${totalSteps * 100}vw)`;
        navLinks.forEach(link => link.classList.remove('active-link'));
        navLinks[0].classList.add('active-link'); 
        bgMap.classList.add('home-mode');
        bgMap.style.opacity = '';

        setTimeout(() => {
            track.style.transition = 'none';
            currentStep = 0;
            track.style.transform = `translateX(0vw)`;
            setTimeout(() => {
                track.style.transition = 'transform 1.2s ease-in-out';
                isScrolling = false;
                updateView(); 
            }, 50);
        }, 1200); 
        return; 
    }

    let nextStep = currentStep + direction;
    if (nextStep < 0) nextStep = 0;
    if (nextStep >= totalSteps) nextStep = totalSteps - 1;
    if (nextStep !== currentStep) {
        isScrolling = true; 
        currentStep = nextStep;
        updateView();

        setTimeout(() => {
            isScrolling = false;
        }, 1200);
    }
}, { passive: true });

const scrollBtn = document.querySelector('.scroll-trigger');

if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
        let nextStep = currentStep + 1;
        if (nextStep < totalSteps) {
            currentStep = nextStep;
            updateView();
        }
    });
}

updateView();