/* app.js - extracted site script */

const PAGES = ['home', 'process', 'dmat', 'visa', 'universities', 'finance', 'scholarships', 'jobs', 'blog'];
const LABELS = {
    'home': 'Overview',
    'process': 'Application Steps',
    'dmat': 'dMAT Guide',
    'visa': 'Visa Guide',
    'universities': 'Universities',
    'finance': 'Blocked Accounts',
    'scholarships': 'Scholarships',
    'jobs': 'Student Jobs',
    'blog': 'Blog'
};
let currentPage = 'home';

function goPage(id, label) {
    document.querySelectorAll('.pg').forEach(p => p.classList.remove('on'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('on'));
    const pg = document.getElementById('pg-' + id);
    if (pg) pg.classList.add('on');
    document.querySelectorAll('.nav-link').forEach(n => {
        if (n.getAttribute('onclick') && n.getAttribute('onclick').includes("'" + id + "'")) n.classList.add('on');
    });
    currentPage = id;
    const crumb = document.getElementById('breadcrumb');
    const lbl = label || LABELS[id] || id;
    crumb.innerHTML = 'Guide <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg> <span>' + escHtml(lbl) + '</span>';
    const idx = PAGES.indexOf(id);
    const pct = Math.round(((idx + 1) / PAGES.length) * 100);
    const progFill = document.getElementById('prog-fill');
    if (progFill) progFill.style.width = pct + '%';
    const pctLabel = document.getElementById('pct-label');
    if (pctLabel) pctLabel.textContent = pct + '%';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.innerWidth <= 900) document.getElementById('sidebar').classList.remove('open');
    return false;
}

function toggleTheme() {
    const html = document.documentElement;
    const isLight = html.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    try { localStorage.setItem('theme', newTheme); } catch (e) {}
    updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
    const isSun = document.getElementById('i-sun');
    const isMoon = document.getElementById('i-moon');
    if (!isSun || !isMoon) return;
    if (theme === 'light') {
        isSun.style.display = 'block';
        isMoon.style.display = 'none';
    } else {
        isSun.style.display = 'none';
        isMoon.style.display = 'block';
    }
}

function initTheme() {
    let saved = 'dark';
    try { saved = localStorage.getItem('theme') || 'dark'; } catch (e) {}
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcons(saved);
}

function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    if (sb) sb.classList.toggle('open');
}

function triggerUpload() {
    const fi = document.getElementById('file-input');
    if (fi) fi.click();
}

function fileChosen(input) {
    if (!input.files || !input.files[0]) return;
    const name = input.files[0].name;
    const ok = /\.(txt|md|docx)$/i.test(name);
    if (!ok) {
        alert('Please upload a .txt, .md, or .docx file.');
        return;
    }
    const msg = document.getElementById('upload-success');
    if (msg) msg.style.display = 'flex';
    const success = document.getElementById('success-msg');
    if (success) success.textContent = '"' + escHtml(name) + '" received — queued for editorial review. Published within 48 hours.';
    const cp = document.createElement('div');
    cp.className = 'cp';
    cp.innerHTML = '<span class="cp-dot" style="background:var(--cyan)"></span><div><div class="cp-name">' + escHtml(name.replace(/\.[^.]+$/, '')) + '</div><div class="cp-meta">Just uploaded · pending review</div></div><span class="cp-arr"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></span>';
    const community = document.getElementById('community');
    if (community) community.prepend(cp);
    input.value = '';
}

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

// Expose functions for onclick handlers still in markup
window.goPage = goPage;
window.toggleTheme = toggleTheme;
window.toggleSidebar = toggleSidebar;
window.triggerUpload = triggerUpload;
window.fileChosen = fileChosen;
window.initTheme = initTheme;