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
const blogsList = document.getElementById('blogsList');
const blogPostsInitiallyVisible = 3;
const defaultExcerptLength = 320;
let blogsExpanded = false;

const updateBlogVisibility = () => {
    if (!blogsList) {
        return;
    }

    const blogPosts = Array.from(blogsList.querySelectorAll('.blog-post'));

    blogPosts.forEach((post, index) => {
        post.style.display = blogsExpanded || index < blogPostsInitiallyVisible ? 'block' : 'none';
    });

    if (loadMoreBlogsBtn) {
        const shouldShowToggle = blogPosts.length > blogPostsInitiallyVisible;
        loadMoreBlogsBtn.style.display = shouldShowToggle ? 'inline-block' : 'none';
        loadMoreBlogsBtn.textContent = blogsExpanded ? 'Load Less' : 'Load More';
    }
};

const stripHtml = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
};

const getExcerptLength = () => {
    if (!blogsList) {
        return defaultExcerptLength;
    }

    const fromDataset = parseInt(blogsList.dataset.excerptLength, 10);
    return Number.isFinite(fromDataset) && fromDataset > 0 ? fromDataset : defaultExcerptLength;
};

const buildExcerpt = (html) => {
    const text = stripHtml(html).replace(/\s+/g, ' ').trim();
    const maxLength = getExcerptLength();
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
};

const renderMediumPosts = (items) => {
    if (!blogsList) {
        return;
    }

    blogsList.innerHTML = '';

    items.forEach((item) => {
        const blogPost = document.createElement('div');
        blogPost.className = 'blog-post';

        const title = document.createElement('h3');
        title.textContent = item.title;

        const description = document.createElement('p');
        const excerpt = buildExcerpt(item.description);
        const anchor = document.createElement('a');
        anchor.href = item.link;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.style.color = '#007BFF';
        anchor.style.textDecoration = 'none';
        anchor.textContent = 'Read More';

        description.textContent = excerpt ? `${excerpt} ` : '';
        description.appendChild(anchor);

        blogPost.appendChild(title);
        blogPost.appendChild(description);

        blogsList.appendChild(blogPost);
    });

    updateBlogVisibility();
};

const showBlogError = (message) => {
    if (!blogsList) {
        return;
    }

    blogsList.innerHTML = `<p class="blog-placeholder">${message}</p>`;

    if (loadMoreBlogsBtn) {
        loadMoreBlogsBtn.style.display = 'none';
    }
};

const fetchMediumPosts = async () => {
    if (!blogsList) {
        return;
    }

    const handle = blogsList.dataset.mediumHandle || '';
    if (!handle) {
        showBlogError('Medium handle is not configured.');
        return;
    }

    const normalizedHandle = handle.startsWith('@') ? handle : `@${handle}`;
    const rssUrl = `https://medium.com/feed/${normalizedHandle}`;
    const requestUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(requestUrl);
        if (!response.ok) {
            throw new Error(`Medium feed request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 'ok' || !Array.isArray(data.items)) {
            throw new Error('Medium feed returned an unexpected response.');
        }

        const posts = data.items.slice(0, 9);

        if (!posts.length) {
            showBlogError('No Medium posts available right now.');
            return;
        }

        renderMediumPosts(posts);
    } catch (error) {
        console.error(error);
        showBlogError('Unable to load Medium posts at the moment.');
    }
};

if (loadMoreBlogsBtn) {
    loadMoreBlogsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        blogsExpanded = !blogsExpanded;
        updateBlogVisibility();
    });
}

updateBlogVisibility();
fetchMediumPosts();

// Load More/Less Functionality for Experiences
const loadMoreExperiencesBtn = document.getElementById('loadMoreExperiencesBtn');
const hiddenExperiences = document.querySelectorAll('.hidden-experience');
let experiencesVisible = false;

loadMoreExperiencesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    experiencesVisible = !experiencesVisible;
    hiddenExperiences.forEach(experience => {
        experience.style.display = experiencesVisible ? 'flex' : 'none';
    });
    loadMoreExperiencesBtn.textContent = experiencesVisible ? 'Load Less' : 'Load More';
});
