// script.js

// DOM이 모두 로드되었을 때 스크립트 실행
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. Hero 슬라이더 ---
    const slides = document.querySelectorAll(".hero-slide");
    
    // 메인 페이지(index.html)에만 슬라이더가 있으므로, 요소가 있는지 확인
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 5000; // 이미지가 머무는 시간 (5000 = 5초)

        function nextSlide() {
            // 현재 슬라이드에서 active 클래스 제거
            slides[currentSlide].classList.remove("active");
            
            // 다음 슬라이드 인덱스 계산 (마지막이면 0으로)
            currentSlide = (currentSlide + 1) % slides.length;
            
            // 다음 슬라이드에 active 클래스 추가
            slides[currentSlide].classList.add("active");
        }

        // 정해진 시간(slideInterval)마다 nextSlide 함수 실행
        setInterval(nextSlide, slideInterval);
    }

    
    // --- 2. 고객지원 탭 ---
    const tabButtons = document.querySelectorAll(".tab-item");
    const tabContents = document.querySelectorAll(".tab-content");

    // 탭 요소가 페이지에 존재하는지 확인
    if (tabButtons.length > 0 && tabContents.length > 0) {
        
        tabButtons.forEach(button => {
            button.addEventListener("click", function(e) {
                e.preventDefault(); // a 태그의 기본 동작(링크 이동) 방지
                
                // 클릭한 탭의 data-tab 속성 값 가져오기 (예: "news", "inquiry")
                const targetTab = this.getAttribute("data-tab");

                // 1. 모든 탭 버튼에서 'active' 클래스 제거
                tabButtons.forEach(btn => btn.classList.remove("active"));
                
                // 2. 클릭된 탭 버튼에 'active' 클래스 추가
                this.classList.add("active");

                // 3. 모든 탭 콘텐츠에서 'active' 클래스 제거 (숨기기)
                tabContents.forEach(content => content.classList.remove("active"));
                
                // 4. 클릭한 탭에 해당하는 콘텐츠 찾아서 'active' 클래스 추가 (보여주기)
                const targetContent = document.querySelector(`.tab-content[data-tab="${targetTab}"]`);
                if (targetContent) {
                    targetContent.classList.add("active");
                }
            });
        });
    }

    // --- 3. FAQ 아코디언 (신규 추가) ---
    const faqItems = document.querySelectorAll(".faq-item");

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector(".faq-question");
            const answer = item.querySelector(".faq-answer");

            question.addEventListener("click", function() {
                // 현재 클릭한 아이템에 'active' 클래스 토글
                const isActive = item.classList.toggle("active");

                // 답변 영역 열기/닫기
                if (isActive) {
                    // max-height를 0에서 실제 콘텐츠 높이(scrollHeight)로 변경
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    // max-height를 0으로 변경
                    answer.style.maxHeight = "0";
                }

                // 다른 열려있는 아이템 닫기
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains("active")) {
                        otherItem.classList.remove("active");
                        otherItem.querySelector(".faq-answer").style.maxHeight = "0";
                    }
                });
            });
        });
    }

    // --- 4. 모바일 네비게이션 토글 (신규 추가) ---
    const toggleButton = document.querySelector(".mobile-nav-toggle");
    const body = document.body;

    // 토글 버튼이 존재하는지 확인
    if (toggleButton) {
        const barIcon = toggleButton.querySelector(".fa-bars");
        const closeIcon = toggleButton.querySelector(".fa-times");

        toggleButton.addEventListener("click", function() {
            // body에 'nav-open' 클래스를 추가/제거
            body.classList.toggle("nav-open");
            
            // 아이콘 교체
            if (body.classList.contains("nav-open")) {
                // 메뉴가 열렸을 때
                barIcon.style.display = "none";
                closeIcon.style.display = "inline";
                toggleButton.setAttribute("aria-label", "메뉴 닫기");
            } else {
                // 메뉴가 닫혔을 때
                barIcon.style.display = "inline";
                closeIcon.style.display = "none";
                toggleButton.setAttribute("aria-label", "메뉴 열기");
            }
        });
    }

});

