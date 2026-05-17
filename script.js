// Hamburger Menu Functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
    hamburger.setAttribute('aria-expanded', !expanded);
    navLinks.classList.toggle('nav-active');
    hamburger.classList.toggle('toggle');
});

/**
 * Generic Toggle Function for "Load More" sections
 * @param {string} btnId - ID of the button
 * @param {string} hiddenClass - Class of elements to toggle
 * @param {string} displayStyle - CSS display type (block/flex)
 */
const setupLoadMore = (btnId, hiddenClass, displayStyle = 'block') => {
    const btn = document.getElementById(btnId);
    const hiddenItems = document.querySelectorAll(hiddenClass);
    let isVisible = false;

    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        isVisible = !isVisible;
        hiddenItems.forEach(item => item.style.display = isVisible ? displayStyle : 'none');
        btn.textContent = isVisible ? 'Load Less' : 'Load More';
    });
};

setupLoadMore('loadMoreProjectsBtn', '.hidden-project', 'block');
setupLoadMore('loadMoreExperiencesBtn', '.hidden-experience', 'flex');

// Load More/Less Functionality for Blogs
const loadMoreBlogsBtn = document.getElementById('loadMoreBlogsBtn');
const blogsList = document.getElementById('blogsList');
const blogPostsInitiallyVisible = 3;
const defaultExcerptLength = 320;
let blogsExpanded = false;
const normalizeLink = (link = '') => link.split('?')[0];
const staticPostLinks = blogsList
    ? new Set(
        Array.from(blogsList.querySelectorAll('[data-post-url]'))
            .map((post) => normalizeLink(post.dataset.postUrl || ''))
            .filter(Boolean)
    )
    : new Set();
let dynamicBlogsContainer = blogsList ? blogsList.querySelector('[data-dynamic-container="true"]') : null;

if (blogsList && !dynamicBlogsContainer) {
    dynamicBlogsContainer = document.createElement('div');
    dynamicBlogsContainer.setAttribute('data-dynamic-container', 'true');
    blogsList.appendChild(dynamicBlogsContainer);
}

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
    return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
};

const renderMediumPosts = (items) => {
    if (!blogsList || !dynamicBlogsContainer) {
        return;
    }

    dynamicBlogsContainer.innerHTML = '';

    const filteredItems = items.filter((item) => !staticPostLinks.has(normalizeLink(item.link)));

    if (!filteredItems.length) {
        dynamicBlogsContainer.innerHTML = '<p class="blog-placeholder">No newer Medium posts right now.</p>';
        updateBlogVisibility();
        return;
    }

    filteredItems.forEach((item) => {
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
        anchor.className = 'accent-link';
        anchor.textContent = 'Read More';

        description.textContent = excerpt ? `${excerpt} ` : '';
        description.appendChild(anchor);

        blogPost.appendChild(title);
        blogPost.appendChild(description);

        dynamicBlogsContainer.appendChild(blogPost);
    });

    updateBlogVisibility();
};

const showBlogError = (message) => {
    const targetContainer = dynamicBlogsContainer || blogsList;
    if (!targetContainer) {
        return;
    }

    targetContainer.innerHTML = `<p class="blog-placeholder">${message}</p>`;

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
