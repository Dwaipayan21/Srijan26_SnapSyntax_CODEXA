// content.js
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                // Remove class to replay animations on scroll
                entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px"
    });

    const elements = document.querySelectorAll('.animate-elem');
    elements.forEach(el => observer.observe(el));
});
