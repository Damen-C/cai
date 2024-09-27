// Hamburger Menu Functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
    hamburger.setAttribute('aria-expanded', !expanded);
    navLinks.classList.toggle('nav-active');
    hamburger.classList.toggle('toggle');
});

// Load More/Less Functionality for Projects
const loadMoreProjectsBtn = document.getElementById('loadMoreProjectsBtn');
const hiddenProjects = document.querySelectorAll('.hidden-project');
let projectsVisible = false;

loadMoreProjectsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    projectsVisible = !projectsVisible;
    hiddenProjects.forEach(project => {
        project.style.display = projectsVisible ? 'block' : 'none';
    });
    loadMoreProjectsBtn.textContent = projectsVisible ? 'Load Less' : 'Load More';
});

// Load More/Less Functionality for Blogs
const loadMoreBlogsBtn = document.getElementById('loadMoreBlogsBtn');
const hiddenBlogs = document.querySelectorAll('.hidden-blog');
let blogsVisible = false;

loadMoreBlogsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    blogsVisible = !blogsVisible;
    hiddenBlogs.forEach(blog => {
        blog.style.display = blogsVisible ? 'block' : 'none';
    });
    loadMoreBlogsBtn.textContent = blogsVisible ? 'Load Less' : 'Load More';
});


// Load More/Less Functionality for Experiences
const loadMoreExperiencesBtn = document.getElementById('loadMoreExperiencesBtn');
const hiddenExperiences = document.querySelectorAll('.hidden-experience');
let experiencesVisible = false;

loadMoreExperiencesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    experiencesVisible = !experiencesVisible;
    hiddenExperiences.forEach(experience => {
        experience.style.display = experiencesVisible ? 'block' : 'none';
    });
    loadMoreExperiencesBtn.textContent = experiencesVisible ? 'Load Less' : 'Load More';
});
