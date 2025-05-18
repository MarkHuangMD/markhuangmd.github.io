
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
});

async function loadBlog() {
  const response = await fetch('blog/');
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const links = Array.from(doc.querySelectorAll('a')).filter(a => a.href.endsWith('.md'));

  const posts = await Promise.all(links.map(async (link) => {
    const res = await fetch('blog/' + link.textContent);
    const md = await res.text();
    const match = md.match(/tags:\s*\[(.*?)\]/i);
    const tags = match ? match[1].split(',').map(t => t.trim().replace(/['"]+/g, '')) : [];
    return {
      title: link.textContent.replace('.md', ''),
      file: link.textContent,
      tags
    };
  }));

  const allTags = [...new Set(posts.flatMap(post => post.tags))];
  const tagFilter = document.getElementById('tag-filter');
  tagFilter.innerHTML = '<strong>分類：</strong>' + allTags.map(tag => 
    `<button onclick="filterPosts('${tag}')">${tag}</button>`).join(' ') +
    `<button onclick="filterPosts('all')">全部</button>`;

  window.allPosts = posts;
  filterPosts('all');
}

function filterPosts(tag) {
  const list = document.getElementById('blog-list');
  const filtered = tag === 'all' ? window.allPosts : window.allPosts.filter(p => p.tags.includes(tag));
  list.innerHTML = filtered.map(p => `<li><a href="blog/${p.file}">${p.title}</a> (${p.tags.join(', ')})</li>`).join('');
}

loadBlog();
