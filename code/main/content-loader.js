// [수정됨] 스크립트 전체를 감싸던 DOMContentLoaded 이벤트 리스너를 제거했습니다.
// HTML의 <script defer> 속성이 DOM 로딩을 보장합니다.

// --- 헬퍼 함수 ---
const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
};

const setHTML = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
};

// --- 동적 목록 생성 함수들 ---

// index.html: 뉴스 생성
const createNewsItem = (item) => {
    const a = document.createElement('a');
    a.href = '#'; 
    a.className = 'support-card';
    a.innerHTML = `
        <div class="card-left">
            <span class="tag ${item.type}">${item.typeText}</span>
            <span class="date">${item.date}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        </div>
        <div class="card-right">
            <i class="fas fa-chevron-right"></i>
        </div>
    `;
    return a;
};

// index.html: FAQ 생성
const createFaqItem = (item) => {
    const div = document.createElement('div');
    div.className = 'faq-item';
    div.innerHTML = `
        <button class="faq-question">
            <span>Q. ${item.q}</span>
            <i class="fas fa-chevron-down"></i>
        </button>
        <div class="faq-answer">
            <p>${item.a}</p>
        </div>
    `;
    return div;
};

// aboutCompany.html: 연혁 그룹 생성
const createHistoryGroup = (group) => {
    const li = document.createElement('li');
    li.className = 'history-year-group';
    
    const itemsHTML = group.items.map(item => `
        <li class="history-item ${item.special ? 'special-award' : ''}">
            <span class="month ${item.month ? '' : 'no-month'}">${item.month}</span>
            <p class="description">${item.desc}</p>
        </li>
    `).join('');

    li.innerHTML = `
        <div class="year-marker">
            <span class="year">- ${group.year}</span>
        </div>
        <ul class="history-items">
            ${itemsHTML}
        </ul>
    `;
    return li;
};

// experience.html: 사업분야 카드 리스트 아이템 생성
const createCardListItem = (text) => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="fa-solid fa-check"></i> ${text}`;
    return li;
};

// experience.html: 사업 실적 그룹 생성
const createProjectGroup = (group) => {
    const section = document.createElement('section');
    section.className = 'project-block';

    const itemsHTML = group.items.map(item => `
        <tr>
            <td class="date-col">${item.date}</td>
            <td class="desc-col">${item.desc}</td>
        </tr>
    `).join('');

    section.innerHTML = `
        <div class="project-header">
            <span class="year">${group.year}년도</span>
            <span class="title">${group.title}</span>
        </div>
        <table class="project-list">
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>
    `;
    return section;
};

// tech.html: 특허 테이블 행 생성
const createPatentRow = (item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.type}</td>
        <td>${item.status}</td>
        <td>${item.name}</td>
        <td>${item.number}</td>
        <td>${item.date_applied}</td>
        <td>${item.date_registered}</td>
        <td>${item.note}</td>
    `;
    return tr;
};

// --- [수정됨] 즉시 실행 함수(IIFE)로 메인 로직을 감싸서 실행 ---
(async () => {
    let content = null;
    try {
        // [수정됨] 현재 페이지 경로에 따라 content.json 경로를 동적으로 결정
        const path = window.location.pathname;
        let fetchPath;

        if (path.includes('/aboutCompany/') || path.includes('/experience/') || path.includes('/tech/')) {
            fetchPath = '../main/content.json';
        } else {
            // /main/index.html 또는 /main/ 경우
            fetchPath = 'main/content.json'; 
        }

        const response = await fetch(fetchPath);
        if (!response.ok) {
            throw new Error(`${fetchPath}를 불러올 수 없습니다: ${response.statusText}`);
        }
        content = await response.json();

    } catch (error) {
        console.error('콘텐츠 로딩 중 오류 발생:', error);
        return; // 콘텐츠 로딩 실패 시 스크립트 중단
    }

    // --- DOM 조작 로직 (content가 성공적으로 로드된 경우에만 실행) ---

    // --- 1. 공통 콘텐츠 ---
    const c = content.common;
    if (c) {
        setText('nav-company-name', c.companyName);
        setText('nav-company-name-en', c.companyNameEn);
        setText('nav-link-about', c.nav.about);
        setText('nav-link-experience', c.nav.experience);
        setText('nav-link-tech', c.nav.tech);
        
        setText('footer-company-name', c.companyName);
        setHTML('footer-address', c.footer.address); 
        setText('footer-phone', c.footer.phone);
        setText('footer-email', c.footer.email);
        setText('footer-hours-1', c.footer.bizHours);
        setText('footer-hours-2', c.footer.bizHoursSat);
        setHTML('footer-copyright', c.footer.copyright);
        setHTML('footer-legal', c.footer.legal);
    }

    // 공통 푸터 링크 (동적 생성)
    const footerBizLinks = document.getElementById('footer-biz-links');
    const footerSupportLinks = document.getElementById('footer-support-links');
    
    if (footerBizLinks && content.footerLinks && content.footerLinks.biz) {
        setText('footer-biz-title', content.footerLinks.biz.title);
        content.footerLinks.biz.links.forEach(link => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${link.url}">${link.text}</a>`;
            footerBizLinks.appendChild(li); 
        });
    }
    
    if (footerSupportLinks && content.footerLinks && content.footerLinks.support) {
        setText('footer-support-title', content.footerLinks.support.title);
        content.footerLinks.support.links.forEach(link => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${link.url}">${link.text}</a>`;
            footerSupportLinks.appendChild(li);
        });
    }

    // --- 2. 페이지별 콘텐츠 ---
    const pageId = document.body.id;

    if (pageId === 'page-index' && content.index) {
        const p = content.index;
        if (p.hero) {
            setText('hero-line1', p.hero.line1);
            setHTML('hero-title', p.hero.title);
            setText('hero-line2', p.hero.line2);
        }
        
        if (p.contact) {
            setText('contact-title', p.contact.title);
            setText('contact-subtitle', p.contact.subtitle);
            setText('contact-info-title', p.contact.infoTitle);
            setText('contact-hq', p.contact.hq);
            setText('contact-address-text', p.contact.address);
            setText('contact-phone', p.contact.phone);
            setText('contact-phone-val', p.contact.phoneVal);
            setText('contact-fax', p.contact.fax);
            setText('contact-fax-val', p.contact.faxVal);
            setText('contact-email', p.contact.email);
            setText('contact-email-val', p.contact.emailVal);
            setText('contact-hours', p.contact.hours);
            setHTML('contact-hours-val', p.contact.hoursVal);
            setText('contact-dept-title', p.contact.deptTitle);
            setText('contact-sales-dept', p.contact.salesDept);
            setHTML('contact-sales-val', p.contact.deptVal);
            setText('contact-tech-dept', p.contact.techDept);
            setHTML('contact-tech-val', p.contact.deptVal);
            setText('contact-rnd-dept', p.contact.rndDept);
            setHTML('contact-rnd-val', p.contact.deptVal);
            setText('contact-directions-title', p.contact.directionsTitle);
            setText('contact-public', p.contact.publicTransport);
            setText('contact-car', p.contact.car);
        
            const publicList = document.getElementById('contact-public-list');
            const carList = document.getElementById('contact-car-list');
            if (publicList && p.contact.publicList) p.contact.publicList.forEach(text => publicList.innerHTML += `<li>${text}</li>`);
            if (carList && p.contact.carList) p.contact.carList.forEach(text => carList.innerHTML += `<li>${text}</li>`);
        }

        if (p.support) {
            setText('tab-news', p.support.tabNews);
            setText('tab-inquiry', p.support.tabInquiry);
            setText('tab-faq', p.support.tabFaq);
            setText('inquiry-title', p.support.inquiryTitle);
            setText('inquiry-subtitle', p.support.inquirySubtitle);
            setText('label-name', p.support.labelName);
            setText('label-company', p.support.labelCompany);
            setText('label-email', p.support.labelEmail);
            setText('label-phone', p.support.labelPhone);
            setText('label-subject', p.support.labelSubject);
            setText('label-message', p.support.labelMessage);
            setText('btn-cancel', p.support.btnCancel);
            setText('btn-submit', p.support.btnSubmit);
            setText('faq-title', p.support.faqTitle);
            setText('faq-subtitle', p.support.faqSubtitle);
        }

        const newsContainer = document.getElementById('news-list-container');
        const faqContainer = document.getElementById('faq-list-container');
        if (newsContainer && content.index.news) content.index.news.forEach(item => newsContainer.appendChild(createNewsItem(item)));
        if (faqContainer && content.index.faq) content.index.faq.forEach(item => faqContainer.appendChild(createFaqItem(item)));
    } 
    else if (pageId === 'page-about' && content.about) {
        const p = content.about;
        if (p.ceo) {
            setText('ceo-badge', p.ceo.badge);
            setText('ceo-title', p.ceo.title);
            setText('ceo-subtitle', p.ceo.subtitle);
            setText('ceo-title-position', p.ceo.titlePosition);
            setText('ceo-name', p.ceo.name);
            setHTML('ceo-quote', p.ceo.quote);
            setText('ceo-description', p.ceo.description);
            setHTML('ceo-career', p.ceo.career);
        }
        if (p.history) {
            setText('history-title', p.history.title);
            setText('history-subtitle', p.history.subtitle);
        }
        if (p.org) {
            setText('org-title', p.org.title);
            setText('org-subtitle', p.org.subtitle);
            setText('org-ceo-name', p.org.ceoName);
        }
        if (p.certs) {
            setText('certs-badge', p.certs.badge);
            setText('certs-title', p.certs.title);
            setText('certs-subtitle', p.certs.subtitle);
            setHTML('certs-summary', p.certs.summary);
        }

        const historyContainer = document.getElementById('history-list-container');
        if (historyContainer && content.about.historyList) content.about.historyList.forEach(group => historyContainer.appendChild(createHistoryGroup(group)));
    } 
    else if (pageId === 'page-experience' && content.experience) {
        const p = content.experience;
        if (p.main) {
            setText('exp-main-badge', p.main.badge);
            setText('exp-main-title', p.main.title);
            setText('exp-main-subtitle', p.main.subtitle);
        }
        if (p.cards) {
            setText('card-its-title', p.cards.itsTitle);
            setText('card-safety-title', p.cards.safetyTitle);
            setText('card-telecom-title', p.cards.telecomTitle);
        }
        if (p.projects) {
            setText('project-title', p.projects.title);
            setText('project-subtitle', p.projects.subtitle);
            setText('gallery-title', p.projects.galleryTitle);
            setText('gallery-subtitle', p.projects.gallerySubtitle);
        }

        const itsList = document.getElementById('its-list-container');
        const safetyList = document.getElementById('safety-list-container');
        const telecomList = document.getElementById('telecom-list-container');
        if (itsList && p.cards && p.cards.itsList) p.cards.itsList.forEach(text => itsList.appendChild(createCardListItem(text)));
        if (safetyList && p.cards && p.cards.safetyList) p.cards.safetyList.forEach(text => safetyList.appendChild(createCardListItem(text)));
        if (telecomList && p.cards && p.cards.telecomList) p.cards.telecomList.forEach(text => telecomList.appendChild(createCardListItem(text)));
        
        const projectContainer = document.getElementById('project-list-container-wrapper'); 
        if (projectContainer && content.experience.projectList) content.experience.projectList.forEach(group => projectContainer.appendChild(createProjectGroup(group)));
    }
    else if (pageId === 'page-tech' && content.tech) {
        const p = content.tech;
        if (p.main) {
            setText('tech-main-badge', p.main.badge);
            setText('tech-main-title', p.main.title);
            setText('tech-main-subtitle', p.main.subtitle);
        }
        if (p.patents) {
            setText('patents-title', p.patents.title);
            setText('patents-subtitle', p.patents.subtitle);
        }
        if (p.ip) {
            setText('ip-title', p.ip.title);
            setText('ip-placeholder', p.ip.placeholder);
        }
        if (p.research) {
            setText('research-title', p.research.title);
            setText('research-placeholder', p.research.placeholder);
        }
        if (p.datasheet) {
            setText('datasheet-title', p.datasheet.title);
            setText('datasheet-subtitle', p.datasheet.subtitle);
            
            document.querySelectorAll('.btn-download').forEach(btn => {
                if (p.datasheet.btnDownload) btn.textContent = p.datasheet.btnDownload;
            });
            document.querySelectorAll('.btn-view').forEach(btn => {
                if (p.datasheet.btnView) btn.textContent = p.datasheet.btnView;
            });
        }

        const patentContainer = document.getElementById('patent-list-container');
        if (patentContainer && content.tech.patentList) content.tech.patentList.forEach(item => patentContainer.appendChild(createPatentRow(item)));
    }
})(); // 즉시 실행